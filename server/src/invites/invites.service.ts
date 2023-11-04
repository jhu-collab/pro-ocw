import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InviteRepository } from './invites.repository';
import { Invite } from './invite.entity';
import { CreateInviteDto, InviteByCourseAndUserDto } from './invite.dto';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';
import { CurrentUserInfo } from 'src/users/user.dto';
import { CreateMemberDto } from 'src/members/member.dto';

@Injectable()
export class InvitesService {
  constructor(
    private inviteRepository: InviteRepository,
    private membersService: MembersService,
  ) {}

  async getInviteById(id: string, email: string): Promise<Invite> {
    const invite = await this.inviteRepository.findOne({
      where: { id, email },
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
      throw new BadRequestException('All invites must be for the same course');
    }
    if (!(await this.membersService.isInstructorOrTA({ courseId, userId }))) {
      throw new ForbiddenException('Only instructors or TAs can invite users');
    }
    return await this.inviteRepository.batchCreateInvite(batchCreateInviteDto);
  }

  async acceptInvite(
    inviteId: string,
    currentUser: CurrentUserInfo,
  ): Promise<Member> {
    const invite = await this.getInviteById(inviteId, currentUser.email);
    const memberToCreate: CreateMemberDto = {
      courseId: invite.courseId,
      userId: currentUser.userId,
      role: invite.role,
    };
    const member = await this.membersService.createMember(memberToCreate);
    await this.deleteInviteById(inviteId);
    return member;
  }

  async getInvitesByCourse(
    courseId: string,
    userId: string,
  ): Promise<Invite[]> {
    if (!(await this.membersService.isInstructorOrTA({ courseId, userId }))) {
      throw new NotFoundException('Invites not found');
    }
    return this.inviteRepository.findBy({ courseId });
  }

  async getInviteByCourseAndUser(
    inviteByCourseAndUserDto: InviteByCourseAndUserDto,
    userId: string,
  ) {
    const isInstructorOrTA = await this.membersService.isInstructorOrTA({
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

  async getInvitesByUser(
    userId: string,
    currentUser: CurrentUserInfo,
  ): Promise<Invite[]> {
    if (userId !== currentUser.userId) {
      throw new NotFoundException('Invites not found');
    }
    return await this.inviteRepository.findBy({ email: currentUser.email });
  }

  async deleteInvite(inviteId: string, userId: string): Promise<void> {
    const invite = await this.getInviteById(inviteId, userId);
    const isInstructorOrTA = await this.membersService.isInstructorOrTA({
      courseId: invite.courseId,
      userId,
    });

    if (!isInstructorOrTA) {
      throw new ForbiddenException('Not authorized to delete invite');
    }
    await this.deleteInviteById(inviteId);
  }
}
