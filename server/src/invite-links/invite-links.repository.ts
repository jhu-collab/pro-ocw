import { Injectable } from '@nestjs/common';
import { InviteLink } from './invite-link.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateInviteLinkDto } from './invite-link.dto';

@Injectable()
export class InviteLinkRepository extends Repository<InviteLink> {
  constructor(private dataSource: DataSource) {
    super(InviteLink, dataSource.createEntityManager());
  }

  async createInviteLinks(
    createInviteLinkDto: CreateInviteLinkDto[],
  ): Promise<InviteLink[]> {
    const query = this.createQueryBuilder('inviteLink');
    const inviteLinks = await query
      .insert()
      .values(createInviteLinkDto)
      .orIgnore() // ignore duplicate inviteLinks
      .execute();
    return inviteLinks.generatedMaps as InviteLink[];
  }
}
