import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { CreateInviteDto } from './invite.dto';

@Injectable()
export class InviteRepository extends Repository<Invite> {
  constructor(private dataSource: DataSource) {
    super(Invite, dataSource.createEntityManager());
  }

  async batchCreateInvite(
    batchCreateInviteDto: CreateInviteDto[],
  ): Promise<Invite[]> {
    const query = this.createQueryBuilder('invite');
    const invites = await query.insert().values(batchCreateInviteDto).execute();
    return invites.generatedMaps as Invite[];
  }
}
