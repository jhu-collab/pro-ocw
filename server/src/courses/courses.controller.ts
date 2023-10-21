import { Member } from 'src/members/member.entity';
import { CreateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/users/get-user-decorator';
import { CurrentUserInfo } from 'src/users/user.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('/:id')
  getCourse(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Course> {
    return this.coursesService.getCourse(id, currentUser.userId);
  }

  @Post()
  createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Course> {
    return this.coursesService.createCourse(
      createCourseDto,
      currentUser.userId,
    );
  }

  @Get('/:id/members')
  getMembers(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Member[]> {
    return this.coursesService.getMembers(id, currentUser.userId);
  }

  @Get('/:id/invites')
  getInvites(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Member[]> {
    return this.coursesService.getInvites(id, currentUser.userId);
  }
}
