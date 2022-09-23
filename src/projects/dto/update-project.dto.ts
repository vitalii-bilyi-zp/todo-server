import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsOptional()
    @IsString()
    name?: string;
}
