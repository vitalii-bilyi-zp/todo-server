import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
    @Prop({ required: true })
    parentId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    index: number;

    @Prop()
    isDone?: boolean;

    @Prop({ type: Array })
    subtasks?: Task[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
