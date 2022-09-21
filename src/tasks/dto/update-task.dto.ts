import { IsNotEmpty, IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsOptional()
    @IsString()
    parentId?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index?: number;

    @IsOptional()
    @IsBoolean()
    isDone?: boolean;
}
