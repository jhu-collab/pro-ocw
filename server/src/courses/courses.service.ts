import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseRepository } from './courses.repository';
import { Course } from './course.entity';
import { MembersService } from 'src/members/members.service';
import { Role } from 'src/commons/role.enum';
import { CurrentUserInfo } from 'src/users/user.dto';
import { InviteLinksService } from 'src/invite-links/invite-links.service';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private memberService: MembersService,
    private inviteLinksService: InviteLinksService,
  ) {}

  async getCourse(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    const isMember = await this.memberService.isMember({ courseId, userId });
    if (!course || !isMember) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async getInvitedCoursesByUserId(
    userId: string,
    currentUser: CurrentUserInfo,
  ): Promise<Course[]> {
    if (userId !== currentUser.userId) {
      throw new Error('Not authorized to get invited courses for user');
    }

    return this.courseRepository.getInvitedCoursesByUserEmail(
      currentUser.email,
    );
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
    await this.inviteLinksService.createInviteLinks(course.id);

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

  async getCoursesByUserId(
    userId: string,
    currentUserId: string,
  ): Promise<Course[]> {
    if (userId !== currentUserId) {
      throw new Error('Not authorized to get courses for user');
    }

    return this.courseRepository.getCoursesByUserId(userId);
  }

  async getCourseByCoursebookId(
    coursebookId: string,
    userId: string,
  ): Promise<Course> {
    if (!coursebookId) {
      throw new NotFoundException('Please provide a coursebook id');
    }
    const res = await this.courseRepository.findOne({
      where: { coursebookId },
      relations: ['inviteLinks'],
    });
    if (!res) {
      throw new NotFoundException('Course not found');
    }
    const isMember = await this.memberService.isMember({
      courseId: res.id,
      userId,
    });
    if (!isMember) {
      throw new NotFoundException('Course not found');
    }
    return res;
  }
}
