import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';

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

    try {
      return await this.save(course);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate coursebookId
        throw new ConflictException('Coursebook Id must be unique');
      } else {
        throw error;
      }
    }
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    try {
      const course = await this.save({
        id,
        ...updateCourseDto,
      });
      return course;
    } catch (error) {
      if (error.code === '23505') {
        // duplicate coursebookId
        throw new ConflictException('Coursebook Id must be unique');
      } else {
        throw error;
      }
    }
  }

  async getCoursesByUserId(userId: string): Promise<Course[]> {
    const query = this.createQueryBuilder('course');
    query.leftJoin('course.members', 'member');
    query.leftJoin('member.user', 'user');
    query.where('user.id = :userId', { userId });
    return await query.getMany();
  }

  async getInvitedCoursesByUserId(userId: string): Promise<Course[]> {
    const query = this.createQueryBuilder('course');
    query.leftJoin('course.invites', 'invite');
    query.leftJoin('invite.user', 'user');
    query.where('user.id = :userId', { userId });
    return await query.getMany();
  }
}
