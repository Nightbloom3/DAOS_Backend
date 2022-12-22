import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddEnsembleDTO } from './dtos/add-ensemble.dto';
import { EditEnsembleDTO } from './dtos/edit-ensemble.dto';
import { PostEnsembleDTO } from './dtos/post-ensemble.dto';
import { Ensemble, EnsembleDocument } from './schemas/ensemble.schema';

@Injectable()
export class EnsemblesService {
    // Dependency injection = imports data for use
    // Dependency injection - ensemble model 
    constructor(@InjectModel(Ensemble.name) private readonly ensembleModel: Model<EnsembleDocument>) {}

    async findAllByStatus(): Promise<Ensemble[]> {
        return await this.ensembleModel.find({ posts: {$exists : true, $ne : []} }).populate('admin');
    }

    async findSpecific(id: string): Promise<Ensemble> {
        return await this.ensembleModel.findOne({ _id: id }).populate('admin');
    }
    
    async create(ensemble: AddEnsembleDTO): Promise<Ensemble> {
        const newEnsemble = new this.ensembleModel(ensemble);
        return await newEnsemble.save();
    }

    async update(id: string, ensemble: EditEnsembleDTO): Promise<Ensemble> {
        return await this.ensembleModel.findByIdAndUpdate(id, ensemble);
    }

    async delete(id: string): Promise<Ensemble> {
        return await this.ensembleModel.findByIdAndDelete(id);
    }

    async findAllByAdmin(id: string): Promise<Ensemble[]> {
        return await this.ensembleModel.find({ admin: id }).populate('admin');
    }

    async addPost(id: string, post: PostEnsembleDTO): Promise<Ensemble> {
        // Finds the specific ensemble's post array
        const ensemble = await this.ensembleModel.findById(id);
        const postArray = ensemble.posts;

        // Adds the post to post array
        postArray.push(post);
        return await ensemble.save();
    }

    async editPost(id: string, postId: string, post: PostEnsembleDTO): Promise<Ensemble> {
        // Finds the specific ensemble's post array
        const ensemble = await this.ensembleModel.findById(id);
        const postArray = ensemble.posts;

        // Iterating through postArray to find the index
        // where it matches with the postId given.
        const index = postArray.findIndex((post:any) => {
            return post._id == postId;
        });

        // Replaces old post values with new post values
        postArray[index] = post;
        return await ensemble.save();
    }

    async removePost(id: string, postId: string): Promise<Ensemble> {
        // Finds the specific ensemble's post array
        const ensemble = await this.ensembleModel.findById(id);
        const postArray = ensemble.posts;

        // Deleting the post
        // Filter creates a new array with everything except
        // the post that is to be deleted
        const newPostArray = postArray.filter((post:any) => {
            return post._id != postId;
        });
        ensemble.posts = newPostArray;

        // Saves the new postArray
        return await ensemble.save();
    }

    async deleteAllByAdmin ( adminId: string): Promise<any> {
        // Find all ensembles that matches the AdminId
        const ensemble = await this.ensembleModel.find({ admin: adminId });
        // Creates an empty Array - To hold all found ensembles
        const deletionArray = []
        // "Pushes" all found ensembles with the AdminId to the Array
        ensemble.forEach((item) => {
            deletionArray.push(item.id)
        })
        // Deletes all ensembles within the "deletionArray"
        return await this.ensembleModel.deleteMany({_id: {$in: deletionArray} })
    }
}