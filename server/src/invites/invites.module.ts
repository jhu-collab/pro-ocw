import { Module } from '@nestjs/common';
import { Invite } from './invite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteRepository } from './invites.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Invite])],
  controllers: [],
  providers: [InviteRepository],
  exports: [],
})
export class InvitesModule {}
