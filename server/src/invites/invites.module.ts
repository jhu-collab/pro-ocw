import { Module } from '@nestjs/common';
import { Invite } from './invite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteRepository } from './invites.repository';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invite])],
  controllers: [InvitesController],
  providers: [InviteRepository, InvitesService],
  exports: [],
})
export class InvitesModule {}
