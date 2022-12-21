import { IsAlpha, IsEmail, MinLength } from "class-validator";


export class CreateProfileDTO {
    
    @IsAlpha()
    readonly firstName: string;
    
    @IsAlpha()
    readonly lastName: string;

    @IsEmail()
    readonly email: string;
    
    @MinLength(8)
    readonly password: string;
    
    readonly conditions: boolean;
  
    readonly newsletter: boolean;

    readonly status: boolean;

    constructor(firstName: string, lastName: string, email: string, password: string, conditions: boolean, newsletter: boolean, status: boolean) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.conditions = conditions;
        this.newsletter = newsletter;
        this.status = status;
    }
    
}