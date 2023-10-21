import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRepository } from './members.repository';
import { CreateMemberDto, MemberByCourseAndUserDto } from './member.dto';
import { Member } from './member.entity';
import { Role } from './role.enum';

@Injectable()
export class MembersService {
  constructor(private memberRepository: MemberRepository) {}

  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    return await this.memberRepository.createMember(createMemberDto);
  }

  async getMembersByCourse(
    courseId: string,
    userId: string,
  ): Promise<Member[]> {
    const isMember = await this.isMember({ courseId, userId });
    if (!isMember) {
      throw new NotFoundException('Members not found');
    }
    return await this.memberRepository.findBy({ courseId });
  }

  async getMemberByCourseAndUser(
    memberByCourseAndUserDto: MemberByCourseAndUserDto,
  ): Promise<Member> {
    const res = await this.memberRepository.findOneBy(memberByCourseAndUserDto);
    if (!res) {
      throw new NotFoundException('Member not found');
    }
    return res;
  }

  async removeUserFromCourse(
    memberByCourseAndUserDto: MemberByCourseAndUserDto,
    userId: string,
  ): Promise<void> {
    const authorized = await this.isInstructorOrTA({
      courseId: memberByCourseAndUserDto.courseId,
      userId,
    });
    if (!authorized && userId !== memberByCourseAndUserDto.userId) {
      throw new ForbiddenException('Only instructors or TAs can remove users');
    }
    const res = await this.memberRepository.delete(memberByCourseAndUserDto);
    if (res.affected) {
      throw new NotFoundException('Member not found');
    }
  }

  async isMember(
    memberByCourseAndUserDto: MemberByCourseAndUserDto,
  ): Promise<boolean> {
    const res = await this.memberRepository.findOneBy(memberByCourseAndUserDto);
    return !!res;
  }

  async isInstructorOrTA(
    memberByCourseAndUserDto: MemberByCourseAndUserDto,
  ): Promise<boolean> {
    const res = await this.memberRepository.findOneBy(memberByCourseAndUserDto);
    return res && (res.role === Role.TA || res.role === Role.INSTRUCTOR);
  }
}
