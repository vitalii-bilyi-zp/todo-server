import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsRepository {
    constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

    async save(project: Project): Promise<ProjectDocument> {
        const newProject = new this.projectModel(project);
        return newProject.save();
    }

    async findById(id: string): Promise<ProjectDocument> {
        return this.projectModel.findById(id);
    }

    async findByIdAndUpdate(id: string, project: Partial<Project>): Promise<ProjectDocument> {
        return this.projectModel.findByIdAndUpdate(id, project, {
            new: true,
        });
    }

    async findByIdAndDelete(id: string): Promise<ProjectDocument> {
        return this.projectModel.findByIdAndDelete(id);
    }
}
