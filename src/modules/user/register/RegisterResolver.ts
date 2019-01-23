import {Resolver, Query, Mutation, Arg, FieldResolver, Root, Authorized, UseMiddleware} from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../../entity/User';
import {RegisterInput} from './RegisterInput'
import { ResolveTime } from '../../../middleware/middleware';
import { sendEmail } from '../../../utils/sendEmail';
import { createConfirmationUrl } from '../../../utils/createConfirmationUrl';


//here 'User' for FieldResolver
@Resolver(User)
export class RegisterResolver{

    @Query(()=>String)
    @Authorized('ADMIN')
    @UseMiddleware(ResolveTime)
    async hello(){
        return 'Hello World!'
    }
    @Query(()=>[User])
    users(){
        return User.find()
    }

    @FieldResolver()
    async name(@Root() parent:User){
        return `${parent.firstName} ${parent.lastName}`
    }
    @Mutation(()=>User)
    async register(
        @Arg('data') {firstName, lastName, email, password}:RegisterInput
    ):Promise<User>{
        const hashedPassword=await bcrypt.hash(password, 12);
        const user=await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        }).save()
        console.log('userid:',user.id)
        await sendEmail(email, await createConfirmationUrl(user.id))
        return user
    }
}