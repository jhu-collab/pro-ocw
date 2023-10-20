import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './course.dto';

@Injectable()
export class CourseRepository extends Repository<Course> {
  constructor(private dataSource: DataSource) {
    super(Course, dataSource.createEntityManager());
  }

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const { name, semester, year, courseCode, coursebookId } = createCourseDto;
    const course = this.create({
      name,
      semester,
      year,
      courseCode,
      coursebookId,
      stripeCustomerId: '',
      subscribed: false,
      createdAt: new Date(),
    });
    return await this.save(course);
  }
}
