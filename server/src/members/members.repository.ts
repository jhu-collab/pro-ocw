import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Member } from './member.entity';
import { CreateMemberDto } from './member.dto';

@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(private dataSource: DataSource) {
    super(Member, dataSource.createEntityManager());
  }

  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    const { courseId, userId, role } = createMemberDto;
    const member = this.create({
      courseId,
      userId,
      role,
    });
    return await this.save(member);
  }

  async getMembers(courseId: string): Promise<Member[]> {
    return await this.findBy({ courseId });
  }
}
