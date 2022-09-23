import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Task } from '../../tasks/schemas/task.schema';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
    @Prop({ required: true })
    name: string;
}

export class ProjectWithTasks extends Project {
    @Prop({ type: Array })
    tasks?: Task[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
