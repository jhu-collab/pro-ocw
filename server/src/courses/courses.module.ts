import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CourseRepository } from './courses.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [],
  providers: [CourseRepository],
  exports: [],
})
export class CoursesModule {}
