import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CourseRepository } from './courses.repository';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), MembersModule],
  controllers: [CoursesController],
  providers: [CourseRepository, CoursesService],
  exports: [],
})
export class CoursesModule {}
