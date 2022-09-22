import { TasksService } from './../tasks/tasks.service';
import { Injectable } from '@nestjs/common';
import { Project } from './schemas/project.schema';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly projectsRepository: ProjectsRepository, private readonly tasksService: TasksService) {}

    async createProject(projectData: CreateProjectDto): Promise<Project> {
        return this.projectsRepository.save(projectData);
    }

    async getProjectById(id: string): Promise<Project> {
        const project = await this.projectsRepository.findById(id);
        const tasks = await this.tasksService.getTasks(project._id);

        return {
            ...(project.toObject() as Project),
            tasks,
        };
    }

    async updateProject(id: string, projectData: UpdateProjectDto): Promise<Project> {
        return this.projectsRepository.findByIdAndUpdate(id, projectData);
    }

    async deleteProject(id: string): Promise<Project> {
        await this.tasksService.deleteTasks(id);
        return this.projectsRepository.findByIdAndDelete(id);
    }
}
