import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './course.dto';
import { CourseRepository } from './courses.repository';
import { Course } from './course.entity';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';
import { Invite } from 'src/invites/invite.entity';
import { InvitesService } from 'src/invites/invites.service';
import { Role } from 'src/members/role.enum';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private memberService: MembersService,
    private inviteService: InvitesService,
  ) {}

  async getCourse(courseId: string, userId: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    const isMember = await this.memberService.isMember({ courseId, userId });
    if (!course || !isMember) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async createCourse(
    createCourseDto: CreateCourseDto,
    ownerId: string,
  ): Promise<Course> {
    const course = await this.courseRepository.createCourse(createCourseDto);
    // Add the owner as an instructor
    await this.memberService.createMember({
      role: Role.INSTRUCTOR,
      userId: ownerId,
      courseId: course.id,
    });
    return course;
  }

  async getMembers(courseId: string, userId: string): Promise<Member[]> {
    if (!(await this.memberService.isMember({ courseId, userId }))) {
      throw new NotFoundException('Members not found');
    }
    return this.memberService.getMembersByCourse(courseId);
  }

  async getInvites(courseId: string, userId: string): Promise<Invite[]> {
    if (!(await this.memberService.isMember({ courseId, userId }))) {
      throw new NotFoundException('Invites not found');
    }
    return this.inviteService.getInvitesByCourse(courseId);
  }
}
