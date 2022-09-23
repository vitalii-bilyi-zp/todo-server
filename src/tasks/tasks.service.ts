import { Injectable } from '@nestjs/common';
import { Task, TaskDocument } from './schemas/task.schema';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private readonly tasksRepository: TasksRepository) {}

    async getTasks(parentId: string): Promise<Task[]> {
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
        await this.deleteTasksRecursively(id);
        return this.tasksRepository.findByIdAndDelete(id);
    }

    async deleteTasksRecursively(parentId: string): Promise<Task[]> {
        const tasks = await this.tasksRepository.find({ parentId });
        const deleteQuery = { _id: { $in: tasks.map((task) => task._id) } };

        await this.tasksRepository.deleteMany(deleteQuery);

        const taskPromises = tasks.map(async (task) => {
            const subtasks = await this.deleteTasksRecursively(task._id);
            return {
                ...(task.toObject() as TaskDocument),
                subtasks: subtasks,
            };
        });
        return Promise.all(taskPromises);
    }

    async saveTasksRecursively(parentId: string, tasks: Task[]): Promise<Task[]> {
        if (!tasks.length) {
            return [];
        }

        const taskPromises = tasks.map(async (task) => {
            const taskData: CreateTaskDto = {
                parentId,
                name: task.name,
                index: task.index,
            };
            const newTask = await this.tasksRepository.save(taskData);
            const subtasks = await this.saveTasksRecursively(newTask._id, task.subtasks || []);

            return {
                ...(newTask.toObject() as TaskDocument),
                subtasks: subtasks,
            };
        });
        return Promise.all(taskPromises);
    }
}
