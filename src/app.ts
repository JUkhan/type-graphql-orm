
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import { RegisterResolver } from "./modules/user/Register/RegisterResolver";
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login/LoginResolver";
import { MeResolver } from "./modules/user/login/MeResolver";
import { customAuthChecker } from "./authChecker";
import { ConfirmUserResolver } from "./modules/user/confirmUser";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [ConfirmUserResolver,MeResolver, RegisterResolver, LoginResolver],
    authChecker:customAuthChecker,
    authMode:"null"
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,

    context: ({ req }: any) => ({ req })
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main().catch(console.log);