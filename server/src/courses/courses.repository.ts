import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CourseRepository extends Repository<Course> {
  constructor(private dataSource: DataSource) {
    super(Course, dataSource.createEntityManager());
  }
}
