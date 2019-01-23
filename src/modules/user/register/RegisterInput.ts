
import { Length, IsEmail } from "class-validator";
import { InputType ,Field} from "type-graphql";
import {IsEmailAlreadyExist} from './IsEmailAlreadyExist'

@InputType()
export class RegisterInput {
  @Field() 
  @Length(3,10)
  firstName:string;

  @Field() 
  @Length(3, 10)
  lastName:string;

  @Field() 
  @IsEmail()
  @IsEmailAlreadyExist({message:"email already exist - from custom validator"})
  email:string;

  @Field()
  @Length(3, 50)
   password:string;
}