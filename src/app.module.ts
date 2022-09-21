import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './projects/projects.module';

@Module({
    imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'), ProjectsModule],
})
export class AppModule {}
