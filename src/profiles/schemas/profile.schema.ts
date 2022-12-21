import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Instrument {

    @Prop({required: true})
    instrumentName: string;
    
    @Prop({required: true})
    skillLevel: string;
    
    @Prop()
    genre: string[];

}

@Schema()
export class Profile {
    
    @Prop({required: true})
    firstName: string;
    
    @Prop({required: true})
    lastName: string;
    
    @Prop({required: true, unique: true})
    email: string;
    
    @Prop()
    password: string;
    
    @Prop()
    description: string;
    
    @Prop()
    zipCode: string;
    
    @Prop()
    city: string;
    
    @Prop()
    phone: string;
    
    @Prop()
    status: boolean;
    
    @Prop()
    conditions: boolean;

    @Prop()
    newsletter: boolean;
    
    @Prop([Instrument])
    instruments: Instrument[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);