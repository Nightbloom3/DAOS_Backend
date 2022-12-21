import { IsAlpha, IsNumberString, MinLength } from "class-validator";

export class AddEnsembleDTO {
    
    @MinLength(1)
    readonly name: string;

    readonly description: string;

    readonly website: string;
    
    @IsNumberString()
    readonly zipCode: string;

    @IsAlpha()
    readonly city: string;

    @MinLength(1)
    readonly activeMusicians: string;

    readonly practiceFrequency: string;

    readonly continuously: boolean;

    readonly projectBased: boolean;

    readonly genre: [];

    readonly admin: string;

    constructor(name: string, description: string, website: string, zipCode: string, city: string, activeMusicians: string, practiceFrequency: string, continuously: boolean, projectBased: boolean, genre: [], admin: string) {
        this.name = name;
        this.description = description;
        this.website = website;
        this.zipCode = zipCode;
        this.city = city;
        this.activeMusicians = activeMusicians;
        this.practiceFrequency = practiceFrequency;
        this.continuously = continuously;
        this.projectBased = projectBased;
        this.genre = genre;
        this.admin = admin;
    }
    
}