import { MinLength } from "class-validator";

export class UpdatePasswordProfileDTO {
    
    @MinLength(8)
    readonly password: string;

    constructor(password: string) {
        this.password = password;
    }
    
}