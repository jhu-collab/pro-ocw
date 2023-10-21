import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './course.dto';
import { CourseRepository } from './courses.repository';
import { Course } from './course.entity';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';
import { Invite } from 'src/invites/invite.entity';
import { InvitesService } from 'src/invites/invites.service';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private memberService: MembersService,
    private inviteService: InvitesService,
  ) {}

  async getCourse(id: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseRepository.createCourse(createCourseDto);
  }

  getMembers(id: string): Promise<Member[]> {
    return this.memberService.getMembersByCourse(id);
  }

  getInvites(id: string): Promise<Invite[]> {
    return this.inviteService.getInvitesByCourse(id);
  }
}
