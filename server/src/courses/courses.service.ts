import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CourseRepository } from './courses.repository';
import { Course } from './course.entity';
import { MembersService } from 'src/members/members.service';
import { Role } from 'src/members/role.enum';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private memberService: MembersService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async getCourse(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    const isMember = await this.memberService.isMember({ courseId, userId });
    if (!course || !isMember) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
  ): Promise<Course> {
    const isAllowed = await this.memberService.isInstructorOrTA({
      courseId: id,
      userId,
    });
    if (!isAllowed) {
      throw new ForbiddenException('Not authorized to update coursebook');
    }
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

  async deleteCourse(courseId: string, userId: string): Promise<void> {
    const isAllowed = await this.memberService.isInstructor({
      courseId,
      userId,
    });

    if (!isAllowed) {
      throw new ForbiddenException('Not authorized to update coursebook');
    }

    const result = await this.courseRepository.delete(courseId);

    if (result.affected === 0) {
      throw new NotFoundException('Course not found');
    }
  }

  async getUsersByCourseId(courseId: string, userId: string): Promise<User[]> {
    const isMember = await this.memberService.isMember({
      courseId,
      userId,
    });
    if (!isMember) {
      throw new NotFoundException('Course not found');
    }

    return this.usersService.getUsersByCourseId(courseId);
  }

  getCoursesByUserId(userId: string): Promise<Course[]> {
    return this.courseRepository.getCoursesByUserId(userId);
  }
}
