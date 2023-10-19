import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Invite } from './invite.entity';

@Injectable()
export class InviteRepository extends Repository<Invite> {
  constructor(private dataSource: DataSource) {
    super(Invite, dataSource.createEntityManager());
  }
}
