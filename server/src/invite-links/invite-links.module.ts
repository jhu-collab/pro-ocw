import { Module } from '@nestjs/common';
import { InviteLinksController } from './invite-links.controller';
import { InviteLinksService } from './invite-links.service';
import { InviteLink } from './invite-link.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteLinkRepository } from './invite-links.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InviteLink])],
  controllers: [InviteLinksController],
  providers: [InviteLinksService, InviteLinkRepository],
  exports: [InviteLinksService],
})
export class InviteLinksModule {}
