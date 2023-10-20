import { Controller, Delete, Get, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.entity';
import { MemberByCourseAndUserDto } from './member.dto';

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
  ): Promise<void> {
    return this.membersService.removeUserFromCourse(memberByCourseAndUserDto);
  }
}
