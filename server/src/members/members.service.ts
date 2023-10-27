import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRepository } from './members.repository';
import {
  CreateMemberDto,
  MemberByCourseAndUserDto,
  UpdateMemberDto,
} from './member.dto';
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
    return await this.memberRepository.find({
      where: { courseId },
      relations: ['user'],
    });
  }

  async getMemberByCourseAndUser(
    memberByCourseAndUserDto: MemberByCourseAndUserDto,
    userId: string,
  ): Promise<Member> {
    const isInstructorOrTA = await this.isInstructorOrTA({
      courseId: memberByCourseAndUserDto.courseId,
      userId,
    });
    if (!isInstructorOrTA && userId !== memberByCourseAndUserDto.userId) {
      throw new ForbiddenException('Only instructors or TAs can get member');
    }
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
    const isMemberToRemoveInstructor = await this.isInstructor({
      courseId: memberByCourseAndUserDto.courseId,
      userId: memberByCourseAndUserDto.userId,
    });

    if (isMemberToRemoveInstructor) {
      const isCurrentUserInstructor = await this.isInstructor({
        courseId: memberByCourseAndUserDto.courseId,
        userId,
      });
      if (!isCurrentUserInstructor) {
        throw new ForbiddenException('Only instructors can remove instructors');
      }
    }

    const authorized = await this.isInstructorOrTA({
      courseId: memberByCourseAndUserDto.courseId,
      userId,
    });
    if (!authorized && userId !== memberByCourseAndUserDto.userId) {
      throw new ForbiddenException('Only instructors or TAs can remove users');
    }
    const res = await this.memberRepository.delete(memberByCourseAndUserDto);
    if (res.affected === 0) {
      throw new NotFoundException('Member not found');
    }
  }

  async updateUserMembership(
    id: string,
    userId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<void> {
    const authorized = await this.isInstructorOrTA({
      courseId: updateMemberDto.courseId,
      userId,
    });
    if (!authorized) {
      throw new ForbiddenException('Only instructors can update membership');
    }
    const res = await this.memberRepository.save({
      id,
      ...updateMemberDto,
    });
    if (!res) {
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

  async isInstructor(
    memberByCourseAndUserDto: MemberByCourseAndUserDto,
  ): Promise<boolean> {
    const res = await this.memberRepository.findOneBy(memberByCourseAndUserDto);
    return res && res.role === Role.INSTRUCTOR;
  }
}
