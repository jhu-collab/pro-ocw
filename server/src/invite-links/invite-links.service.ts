import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/commons/role.enum';
import { InviteLinkRepository } from './invite-links.repository';
import { CreateInviteLinkDto } from './invite-link.dto';
import { Member } from 'src/members/member.entity';
import { CreateMemberDto } from 'src/members/member.dto';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class InviteLinksService {
  constructor(
    private inviteLinkRepository: InviteLinkRepository,
    private membersService: MembersService,
  ) {}

  async getInviteLinkById(id: string) {
    const inviteLink = await this.inviteLinkRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!inviteLink) {
      throw new NotFoundException('Invite link not found');
    }
    return inviteLink;
  }

  async acceptInviteLink(id: string, currentUser: any): Promise<Member> {
    const inviteLink = await this.getInviteLinkById(id);
    const { courseId, role } = inviteLink;
    const member: CreateMemberDto = {
      courseId,
      userId: currentUser.userId,
      role,
    };
    return this.membersService.createMember(member);
  }

  async createInviteLinks(courseId: string) {
    const studentLink: CreateInviteLinkDto = {
      courseId: courseId,
      role: Role.STUDENT,
    };

    const TALink: CreateInviteLinkDto = {
      courseId: courseId,
      role: Role.TA,
    };

    return this.inviteLinkRepository.createInviteLinks([studentLink, TALink]);
  }
}
