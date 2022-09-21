import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsRepository {
    constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

    async save(project: Project): Promise<Project> {
        const newProject = new this.projectModel(project);
        return newProject.save();
    }

    async findOne(projectFilterQuery: FilterQuery<Project>): Promise<Project> {
        return this.projectModel.findOne(projectFilterQuery);
    }

    async findOneAndUpdate(projectFilterQuery: FilterQuery<Project>, project: Partial<Project>): Promise<Project> {
        return this.projectModel.findOneAndUpdate(projectFilterQuery, project, {
            new: true,
        });
    }

    async findOneAndDelete(projectFilterQuery: FilterQuery<Project>): Promise<Project> {
        return this.projectModel.findOneAndDelete(projectFilterQuery);
    }
}
