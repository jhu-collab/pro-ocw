import { Controller, Delete, Get, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.entity';
import { MemberByCourseAndUserDto } from './member.dto';
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
  ): Promise<Member> {
    return this.membersService.getMemberByCourseAndUser(
      memberByCourseAndUserDto,
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
}
