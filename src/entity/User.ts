
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm'
import { ObjectType, Field, ID, Root, Authorized } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field(()=>ID)
    @PrimaryGeneratedColumn()
    id:number;

    @Field()
    @Column()
    firstName:string;

    @Field()
    @Column()
    lastName:string;

    @Field()
    @Column("text",{unique:true})
    email:string;

    @Column()
    password:string

    @Field()
    name:string;

    @Authorized("ADMIN")
    @Field({nullable:true})
    fullName(@Root() parent:User):string{
        return `${parent.firstName} ${parent.lastName}`
    }

    @Column("boolean", {default:false})
    confirmed:boolean;
}