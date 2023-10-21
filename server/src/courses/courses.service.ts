import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './courses.repository';
import { Course } from './course.entity';
import { MembersService } from 'src/members/members.service';
import { Role } from 'src/members/role.enum';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private memberService: MembersService,
  ) {}

  async getCourse(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    const isMember = await this.memberService.isMember({ courseId, userId });
    if (!course || !isMember) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.courseRepository.updateCourse(id, updateCourseDto);
  }

  async createCourse(
    createCourseDto: CreateCourseDto,
    ownerId: string,
  ): Promise<Course> {
    const course = await this.courseRepository.createCourse(createCourseDto);
    // Add the owner as an instructor by default
    await this.memberService.createMember({
      role: Role.INSTRUCTOR,
      userId: ownerId,
      courseId: course.id,
    });
    return course;
  }
}
