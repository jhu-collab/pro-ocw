import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './course.dto';
import { CourseRepository } from './courses.repository';
import { Course } from './course.entity';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private memberService: MembersService,
  ) {}

  createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseRepository.createCourse(createCourseDto);
  }

  getMembers(id: string): Promise<Member[]> {
    return this.memberService.getMembers(id);
  }
}
