import { Member } from 'src/members/member.entity';
import { CreateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get('/:id/members')
  getMembers(@Param('id') id: string): Promise<Member[]> {
    return this.coursesService.getMembers(id);
  }

  @Get('/:id/invites')
  getInvites(@Param('id') id: string): Promise<Member[]> {
    return this.coursesService.getInvites(id);
  }
}
