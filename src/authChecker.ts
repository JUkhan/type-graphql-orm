import { AuthChecker } from "type-graphql";
import { MyContext } from "./types/MyContext";

// create auth checker function
export const  customAuthChecker: AuthChecker<MyContext> = ({ context: { req } }, roles) => {
    if (roles.length === 0) {
      // if `@Authorized()`, check only is user exist
      return req.session!.userId !== undefined;
    }
    // there are some roles defined now
  
    if (!req.session!.userId) {
      // and if no user, restrict access
      return false;
    }
    if (req.session!.roles.some((role:string) => roles.includes(role))) {
      // grant access if the roles overlap
      return true;
    }
  
    // no roles matched, restrict access
    return false;
  };

