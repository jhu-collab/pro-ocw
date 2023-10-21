import { Member } from 'src/members/member.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('/:id')
  getCourse(@Param('id') id: string): Promise<Course> {
    return this.coursesService.getCourse(id);
  }

  @Get('/:id/members')
  getMembers(@Param('id') id: string): Promise<Member[]> {
    return this.coursesService.getMembers(id);
  }

  @Get('/:id/invites')
  getInvites(@Param('id') id: string): Promise<Member[]> {
    return this.coursesService.getInvites(id);
  }

  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Put('/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }
}
