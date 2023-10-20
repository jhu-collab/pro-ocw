import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from './members.repository';
import { CreateMemberDto, GetMemberByCourseAndUserDto } from './member.dto';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
  constructor(private memberRepository: MemberRepository) {}

  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberRepository.createMember(createMemberDto);
  }

  async getMembers(courseId: string): Promise<Member[]> {
    return await this.memberRepository.findBy({ courseId });
  }

  async getMemberByCourseAndUser(
    getMemberByCourseAndUserDto: GetMemberByCourseAndUserDto,
  ): Promise<Member> {
    const res = await this.memberRepository.findOneBy(
      getMemberByCourseAndUserDto,
    );
    if (!res) {
      throw new NotFoundException('Member not found');
    }
    return res;
  }
}
