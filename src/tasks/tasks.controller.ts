import { Body, Controller, Delete, Get, Param, Post, ParseArrayPipe, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    async getTasks(@Query('parentId') parentId: string): Promise<Task[]> {
        return this.tasksService.getTasks(parentId);
    }

    @Post()
    async createTask(@Body() body: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(body);
    }

    @Post('update')
    async updateTasks(@Body(new ParseArrayPipe({ items: UpdateTaskDto })) body: UpdateTaskDto[]): Promise<Task[]> {
        return this.tasksService.updateTasks(body);
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string): Promise<Task> {
        return this.tasksService.deleteTask(id);
    }
}
