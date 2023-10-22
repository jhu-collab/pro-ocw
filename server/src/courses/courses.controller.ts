import { Member } from 'src/members/member.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/users/get-user-decorator';
import { CurrentUserInfo } from 'src/users/user.dto';
import { InvitesService } from 'src/invites/invites.service';
import { MembersService } from 'src/members/members.service';
import { InviteByCourseAndUserDto } from 'src/invites/invite.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private coursesService: CoursesService,
    private invitesService: InvitesService,
    private membersService: MembersService,
    private usersService: UsersService,
  ) {}

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
    return this.membersService.getMembersByCourse(id, currentUser.userId);
  }

  @Get('/:id/invites')
  getInvites(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Member[]> {
    return this.invitesService.getInvitesByCourse(id, currentUser.userId);
  }

  @Put('/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ) {
    return this.coursesService.updateCourse(
      id,
      updateCourseDto,
      currentUser.userId,
    );
  }

  @Delete('/:id')
  deleteCourse(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ) {
    return this.coursesService.deleteCourse(id, currentUser.userId);
  }

  @Get('/:courseId/invites/users/:userId')
  getInviteByCourseAndUser(
    @Param() inviteByCourseAndUserDto: InviteByCourseAndUserDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Member> {
    return this.invitesService.getInviteByCourseAndUser(
      inviteByCourseAndUserDto,
      currentUser.userId,
    );
  }

  @Get('/:id/users')
  getUsersByCourseId(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ) {
    return this.coursesService.getUsersByCourseId(id, currentUser.userId);
  }
}
