import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateProjectDto {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    dragItemId?: string;

    @IsOptional()
    @IsArray()
    searchHistory?: string[];
}
