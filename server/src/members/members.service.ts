import { Injectable } from '@nestjs/common';
import { MemberRepository } from './members.repository';
import { CreateMemberDto } from './member.dto';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
  constructor(private memberRepository: MemberRepository) {}

  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberRepository.createMember(createMemberDto);
  }

  async getMembers(courseId: string): Promise<Member[]> {
    return this.memberRepository.findBy({ courseId });
  }
}
