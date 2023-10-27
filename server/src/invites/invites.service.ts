import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InviteRepository } from './invites.repository';
import { Invite } from './invite.entity';
import { CreateInviteDto, InviteByCourseAndUserDto } from './invite.dto';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class InvitesService {
  constructor(
    private inviteRepository: InviteRepository,
    private memberService: MembersService,
  ) {}

  async getInviteById(id: string, userId: string): Promise<Invite> {
    const invite = await this.inviteRepository.findOne({
      where: { id, userId },
      relations: { course: true },
    });
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }
    return invite;
  }

  async deleteInviteById(id: string): Promise<void> {
    const res = await this.inviteRepository.delete({ id });
    if (res.affected === 0) {
      throw new NotFoundException('Invite not found');
    }
  }

  async batchCreateInvite(
    batchCreateInviteDto: CreateInviteDto[],
    userId: string,
  ): Promise<Invite[]> {
    if (!batchCreateInviteDto.length) {
      return [];
    }
    const courseId = batchCreateInviteDto[0].courseId;
    const sameCourse = batchCreateInviteDto.every(
      (invite) => invite.courseId === courseId,
    );
    if (!sameCourse) {
      throw new ForbiddenException('All invites must be for the same course');
    }
    if (!(await this.memberService.isInstructorOrTA({ courseId, userId }))) {
      throw new ForbiddenException('Only instructors or TAs can invite users');
    }
    return await this.inviteRepository.batchCreateInvite(batchCreateInviteDto);
  }

  async acceptInvite(inviteId: string, userId: string): Promise<Member> {
    const invite = await this.getInviteById(inviteId, userId);
    const member = await this.memberService.createMember(invite);
    await this.deleteInviteById(inviteId);
    return member;
  }

  async getInvitesByCourse(
    courseId: string,
    userId: string,
  ): Promise<Invite[]> {
    if (!(await this.memberService.isInstructorOrTA({ courseId, userId }))) {
      throw new NotFoundException('Invites not found');
    }
    return this.inviteRepository.findBy({ courseId });
  }

  async getInviteByCourseAndUser(
    inviteByCourseAndUserDto: InviteByCourseAndUserDto,
    userId: string,
  ) {
    const isInstructorOrTA = await this.memberService.isInstructorOrTA({
      courseId: inviteByCourseAndUserDto.courseId,
      userId,
    });
    if (!isInstructorOrTA && userId !== inviteByCourseAndUserDto.userId) {
      throw new ForbiddenException('Not authorized to view invite');
    }
    const invite = await this.inviteRepository.findOneBy(
      inviteByCourseAndUserDto,
    );
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }
    return invite;
  }

  async getInvitesByUserId(
    userId: string,
    currentUserId: string,
  ): Promise<Invite[]> {
    if (userId !== currentUserId) {
      throw new NotFoundException('Invites not found');
    }
    return await this.inviteRepository.findBy({ userId });
  }

  async deleteInvite(inviteId: string, userId: string): Promise<void> {
    const invite = await this.getInviteById(inviteId, userId);
    const isInstructorOrTA = await this.memberService.isInstructorOrTA({
      courseId: invite.courseId,
      userId,
    });

    if (!isInstructorOrTA) {
      throw new ForbiddenException('Not authorized to delete invite');
    }
    await this.deleteInviteById(inviteId);
  }
}
