import { Injectable } from '@nestjs/common';
import { Task, TaskDocument } from './schemas/task.schema';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private readonly tasksRepository: TasksRepository) {}

    async getTasks(parentId?: string): Promise<Task[]> {
        if (!parentId) {
            return this.tasksRepository.find({});
        }

        const tasks = await this.tasksRepository.find({ parentId });
        tasks.sort((a, b) => a.index - b.index);

        const taskPromises = tasks.map(async (task) => {
            const subtasks = await this.getTasks(task._id);
            return {
                ...(task.toObject() as TaskDocument),
                subtasks: subtasks.sort((a, b) => a.index - b.index),
            };
        });
        return Promise.all(taskPromises);
    }

    async createTask(taskData: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.save(taskData);
    }

    async updateTasks(tasks: UpdateTaskDto[]): Promise<Task[]> {
        const taskPromises = tasks.map((task) => this.tasksRepository.findByIdAndUpdate(task._id, task));
        return Promise.all(taskPromises);
    }

    async deleteTask(id: string): Promise<Task> {
        return this.tasksRepository.findByIdAndDelete(id);
    }
}
