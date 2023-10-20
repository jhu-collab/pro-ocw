import { Module } from '@nestjs/common';
import { Invite } from './invite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteRepository } from './invites.repository';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invite]), MembersModule],
  controllers: [InvitesController],
  providers: [InviteRepository, InvitesService],
  exports: [],
})
export class InvitesModule {}
