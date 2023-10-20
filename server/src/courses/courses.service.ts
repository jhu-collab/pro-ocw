import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './course.dto';
import { CourseRepository } from './courses.repository';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(private courseRepository: CourseRepository) {}

  createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseRepository.createCourse(createCourseDto);
  }
}
