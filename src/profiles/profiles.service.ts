import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { InstrumentDTO } from './dtos/instrument-profile.dto';
import { UpdateNewsletterProfileDTO } from './dtos/update-newsletter-profile.dto';
import { UpdatePasswordProfileDTO } from './dtos/update-password-profile.dto';
import { UpdateProfileDTO } from './dtos/update-profile.dto';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfilesService {
    // Dependency injection = imports data for use
    // Dependency injection - profile model
    constructor(@InjectModel(Profile.name) private readonly profileModel: Model<ProfileDocument>) {}

    async findOneByEmail(email: string): Promise<Profile> {
        return await this.profileModel.findOne({ email: email });
    }

    async findAll(): Promise<Profile[]> {
        return await this.profileModel.find({ status: true });
    }
    
    async findSpecific(id: string): Promise<Profile> {
        return await this.profileModel.findOne({ _id: id });
    }

    async create(profile: CreateProfileDTO): Promise<Profile> {
        const newProfile = new this.profileModel(profile);
        //Encrypting the incoming password from the user
        const hash = await bcrypt.hash(newProfile.password, 10);
        newProfile.password = hash;
        return await newProfile.save();
    }

    async update(id: string, profile: UpdateProfileDTO): Promise<Profile> {
        return await this.profileModel.findByIdAndUpdate(id, profile);
    }

    async updatePassword(id: string, profile: UpdatePasswordProfileDTO): Promise<Profile> {
        
        let oldProfile = await this.profileModel.findById(id);

        const newProfile = new this.profileModel(profile); 

        const hash = await bcrypt.hash(newProfile.password, 10);
        newProfile.password = hash;

        oldProfile.password = newProfile.password;

        return await oldProfile.save();
    }
    
    async updateNewsletter(id: string, profile: UpdateNewsletterProfileDTO): Promise<Profile> {
        return await this.profileModel.findByIdAndUpdate(id, profile);
    }

    async delete(id: string): Promise<Profile> {
        return await this.profileModel.findByIdAndDelete(id);
    }

    async removeInstrument(id: string, instrumentId: string): Promise<Profile> {
        // Finds the specific profile's instrument array
        const profile = await this.profileModel.findById(id);
        const instrumentArray = profile.instruments;

        // Deleting the instrument
        // Filter creates a new array with everything except
        // the instrument that is to be deleted
        const newInstrumentArray = instrumentArray.filter((instrument:any) => {
            return instrument._id != instrumentId;
        });
        profile.instruments = newInstrumentArray

        // Saves the new instrumentArray
        return await profile.save();
    }

    async addInstrument(id: string, instrument: InstrumentDTO): Promise<Profile> {
        // Finds the specific profile's instrument array
        const profile = await this.profileModel.findById(id);
        let instrumentArray = profile.instruments;
        // An empty array is setup for validation further down in the code
        let validationArray = [];

        // Loops through the instrument array of the profile and checks if the name of the
        // Instrument you are trying to add matches with any of the already existing item.
        // If there is a match a string is pushed to the Validation array
        instrumentArray.forEach((item) => {
            if (item.instrumentName == instrument.instrumentName) {
                validationArray.push("Instrument already in use")
            }
        })

        // Adds the instrument to instrument array if the validation array is empty
        if (validationArray.length == 0) {
            instrumentArray.push(instrument);
        }

        // Profile is saved regardless
        return await profile.save();
    }

    async editInstrument(id: string, instrumentId: string, instrument: InstrumentDTO): Promise<Profile> {
        // Finds the specific profile's instrument array
        const profile = await this.profileModel.findById(id);
        let instrumentArray = profile.instruments;
        let validationArray = [];

        // Iterating through instrumentArray to find the index
        // where it matches with the instrumentId given.
        const index = instrumentArray.findIndex((instrument:any) => {
            return instrument._id == instrumentId;
        });

        instrumentArray.forEach((item) => {
            if (item.skillLevel == instrument.skillLevel && item.instrumentName == instrument.instrumentName) {
                validationArray.push("Instrument already in use")
            } 
        })

        // Replaces old instrument values with new instrument values
        if (validationArray.length == 0) {
        instrumentArray[index] = instrument;
        }
        return await profile.save();
    }

    deleteMany(deleteCriteria: any) {
        return this.profileModel.deleteMany(deleteCriteria);
    }
}