import { Injectable } from '@nestjs/common';
import { Project } from './schemas/project.schema';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly projectsRepository: ProjectsRepository) {}

    async createProject(projectData: CreateProjectDto): Promise<Project> {
        return this.projectsRepository.save(projectData);
    }

    async getProjectById(id: string): Promise<Project> {
        return this.projectsRepository.findById(id);
    }

    async updateProject(id: string, projectData: UpdateProjectDto): Promise<Project> {
        return this.projectsRepository.findByIdAndUpdate(id, projectData);
    }

    async deleteProject(id: string): Promise<Project> {
        return this.projectsRepository.findByIdAndDelete(id);
    }
}
