import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateProjectDto {
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
