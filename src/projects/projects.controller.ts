import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';
import { TasksService } from './../tasks/tasks.service';
import { Task } from './../tasks/schemas/task.schema';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService, private readonly tasksService: TasksService) {}

    @Post()
    async createProject(@Body() body: CreateProjectDto): Promise<Project> {
        return this.projectsService.createProject(body);
    }

    @Get(':id')
    async getProject(@Param('id') id: string): Promise<Project> {
        return this.projectsService.getProjectById(id);
    }

    @Patch(':id')
    async updateProject(@Param('id') id: string, @Body() body: UpdateProjectDto): Promise<Project> {
        return this.projectsService.updateProject(id, body);
    }

    @Delete(':id')
    async deleteProject(@Param('id') id: string): Promise<Project> {
        await this.tasksService.deleteTasks(id);
        return this.projectsService.deleteProject(id);
    }

    @Get(':id/tasks')
    async getTasks(@Param('id') id: string): Promise<Task[]> {
        return this.tasksService.getTasks(id);
    }
}
