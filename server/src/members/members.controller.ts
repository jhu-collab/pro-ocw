import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.entity';
import { MemberByCourseAndUserDto, UpdateMemberDto } from './member.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/users/get-user-decorator';
import { CurrentUserInfo } from 'src/users/user.dto';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get('/users/:userId/courses/:courseId')
  getMemberByCourseAndUser(
    @Param() memberByCourseAndUserDto: MemberByCourseAndUserDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Member> {
    return this.membersService.getMemberByCourseAndUser(
      memberByCourseAndUserDto,
      currentUser.userId,
    );
  }

  @Delete('/users/:userId/courses/:courseId')
  removeUserFromCourse(
    @Param() memberByCourseAndUserDto: MemberByCourseAndUserDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<void> {
    return this.membersService.removeUserFromCourse(
      memberByCourseAndUserDto,
      currentUser.userId,
    );
  }

  @Put('/:id')
  updateUserMembership(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<void> {
    return this.membersService.updateUserMembership(
      id,
      currentUser.userId,
      updateMemberDto,
    );
  }
}
