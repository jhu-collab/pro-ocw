import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { Invite } from './invite.entity';
import { BatchCreateInviteDto } from './invite.dto';
import { Member } from 'src/members/member.entity';

@Controller('invites')
export class InvitesController {
  constructor(private inviteService: InvitesService) {}

  @Get('/:id')
  async getInviteById(@Param('id') id: string): Promise<Invite> {
    return this.inviteService.getInviteById(id);
  }

  @Get('/:id')
  async deleteInviteById(@Param('id') id: string): Promise<void> {
    return this.inviteService.deleteInviteById(id);
  }

  @Post()
  async batchCreateInvite(
    @Body() batchCreateInviteDto: BatchCreateInviteDto,
  ): Promise<Invite[]> {
    return this.inviteService.batchCreateInvite(batchCreateInviteDto.data);
  }

  @Get('/:id/accept')
  async acceptInvite(@Param('id') id: string): Promise<Member> {
    return this.inviteService.acceptInvite(id);
  }
}
