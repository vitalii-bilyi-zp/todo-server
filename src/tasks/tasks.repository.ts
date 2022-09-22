import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksRepository {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

    async save(task: Task): Promise<TaskDocument> {
        const newTask = new this.taskModel(task);
        return newTask.save();
    }

    async find(tasksFilterQuery: FilterQuery<Task>): Promise<TaskDocument[]> {
        return this.taskModel.find(tasksFilterQuery);
    }

    async findByIdAndUpdate(id: string, task: Partial<Task>): Promise<TaskDocument> {
        return this.taskModel.findByIdAndUpdate(id, task, {
            new: true,
        });
    }

    async findByIdAndDelete(id: string): Promise<TaskDocument> {
        return this.taskModel.findByIdAndDelete(id);
    }

    async deleteMany(tasksFilterQuery: FilterQuery<Task>): Promise<DeleteResult> {
        return this.taskModel.deleteMany(tasksFilterQuery);
    }
}
