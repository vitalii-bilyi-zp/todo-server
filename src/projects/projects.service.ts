import { Injectable } from '@nestjs/common';
import { Project, ProjectWithTasks } from './schemas/project.schema';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TasksService } from './../tasks/tasks.service';
import { Task } from './../tasks/schemas/task.schema';

@Injectable()
export class ProjectsService {
    constructor(private readonly projectsRepository: ProjectsRepository, private readonly tasksService: TasksService) {}

    async createProject(projectData: CreateProjectDto): Promise<Project> {
        return this.projectsRepository.save(projectData);
    }

    async getProjectWithTasks(id: string): Promise<ProjectWithTasks> {
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
        await this.tasksService.deleteTasksRecursively(id);
        return this.projectsRepository.findByIdAndDelete(id);
    }

    async updateProjectWithTasks(id: string, projectData: ProjectWithTasks): Promise<ProjectWithTasks> {
        const newProject: UpdateProjectDto = {
            _id: id,
            name: projectData.name,
        };
        await this.projectsRepository.findByIdAndUpdate(id, newProject);

        const newTasks: Task[] = projectData.tasks || [];
        await this.tasksService.deleteTasksRecursively(id);
        await this.tasksService.saveTasksRecursively(id, newTasks);

        return this.getProjectWithTasks(id);
    }
}
