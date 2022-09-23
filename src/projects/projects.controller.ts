import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    StreamableFile,
    Res,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { Project, ProjectWithTasks } from './schemas/project.schema';
import { join } from 'path';
import * as fs from 'fs';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    async createProject(@Body() body: CreateProjectDto): Promise<Project> {
        return this.projectsService.createProject(body);
    }

    @Get(':id')
    async getProject(@Param('id') id: string): Promise<Project> {
        return this.projectsService.getProjectWithTasks(id);
    }

    @Patch(':id')
    async updateProject(@Param('id') id: string, @Body() body: UpdateProjectDto): Promise<Project> {
        return this.projectsService.updateProject(id, body);
    }

    @Delete(':id')
    async deleteProject(@Param('id') id: string): Promise<Project> {
        return this.projectsService.deleteProject(id);
    }

    @Get(':id/export')
    async exportProject(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        const tempFolder = join(process.cwd(), 'storage', 'tmp');
        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder, { recursive: true });
        }
        const tempFileName = join(tempFolder, `${Date.now()}.json`);
        const exportData = await this.projectsService.getProjectWithTasks(id);

        fs.writeFileSync(tempFileName, JSON.stringify(exportData), 'utf8');

        const fileStream = fs.createReadStream(tempFileName);
        fileStream.on('end', () => {
            fs.unlink(tempFileName, (err) => {
                if (err) {
                    throw err;
                }
            });
        });

        res.set({
            'Content-type': 'application/json',
            'Content-Disposition': `attachment; filename="${exportData.name}"`,
            'Access-Control-Expose-Headers': 'Content-Disposition',
            Pragma: 'no-cache',
            'Cache-Control': 'must-revalidate, post-check=0, pre-check=0',
            Expires: '0',
        });

        return new StreamableFile(fileStream);
    }

    @Post(':id/import')
    @UseInterceptors(FileInterceptor('file'))
    async importProject(
        @Param('id') id: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: 'json' })],
            }),
        )
        file: Express.Multer.File,
    ): Promise<ProjectWithTasks> {
        const importData: ProjectWithTasks = JSON.parse(file.buffer.toString('utf8'));
        return this.projectsService.updateProjectWithTasks(id, importData);
    }
}
