import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    parentId: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index: number;
}
