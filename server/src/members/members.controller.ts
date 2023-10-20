import { Controller, Get, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.entity';
import { GetMemberByCourseAndUserDto } from './member.dto';

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get('/users/:userId/courses/:courseId')
  getMemberByCourseAndUser(
    @Param() getMemberByCourseAndUserDto: GetMemberByCourseAndUserDto,
  ): Promise<Member> {
    return this.membersService.getMemberByCourseAndUser(
      getMemberByCourseAndUserDto,
    );
  }
}
