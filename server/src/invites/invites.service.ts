import { Injectable, NotFoundException } from '@nestjs/common';
import { InviteRepository } from './invites.repository';
import { Invite } from './invite.entity';
import { CreateInviteDto } from './invite.dto';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class InvitesService {
  constructor(
    private inviteRepository: InviteRepository,
    private memberService: MembersService,
  ) {}

  async getInviteById(id: string): Promise<Invite> {
    const invite = await this.inviteRepository.findOneBy({ id });
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
  ): Promise<Invite[]> {
    return this.inviteRepository.batchCreateInvite(batchCreateInviteDto);
  }

  async acceptInvite(id: string): Promise<Member> {
    // TODO: ensure current user is the invitee
    const invite = await this.getInviteById(id);
    const member = await this.memberService.createMember(invite);
    await this.deleteInviteById(id);
    return member;
  }
}
