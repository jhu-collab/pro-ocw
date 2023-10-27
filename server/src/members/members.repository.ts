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
    try {
      return await this.save(member);
    } catch (err) {
      if (err.code === '23505') {
        // ignore duplicate member
        return member;
      }
      throw err;
    }
  }
}
