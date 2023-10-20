import { Injectable, NotFoundException } from '@nestjs/common';
import { InviteRepository } from './invites.repository';
import { Invite } from './invite.entity';
import { CreateInviteDto } from './invite.dto';

@Injectable()
export class InvitesService {
  constructor(private inviteRepository: InviteRepository) {}

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
}
