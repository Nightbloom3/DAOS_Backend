import {MinLength } from "class-validator";

export class InstrumentDTO {
    
    @MinLength(1)
    readonly instrumentName: string;
    
    @MinLength(1)
    readonly skillLevel: string;
    
    readonly genre: string[];

    constructor(instrumentName: string, skillLevel: string, genre: string[]) {
        this.instrumentName = instrumentName;
        this.skillLevel = skillLevel;
        this.genre = genre;
    }
    
}