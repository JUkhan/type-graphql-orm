
import {
    ValidatorConstraint,
    ValidationOptions,
    registerDecorator
} from 'class-validator'
import {User} from '../../../entity/User'

@ValidatorConstraint({async:true})
export class IsEmailAlreadyExistConstraint{
    validate(email:string){
        return User.findOne({where:{email}}).then(user=>{
            return user?false:true
        })
    }
}

export function IsEmailAlreadyExist(validationOptions?:ValidationOptions){
    return function(object:Object, propertyName:string){
        registerDecorator({
            target:object.constructor,
            propertyName,
            options:validationOptions,
            constraints:[],
            validator:IsEmailAlreadyExistConstraint
        })
    }
}