import { Controller, Get, Param } from '@nestjs/common';
import { InviteLinksService } from './invite-links.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/users/get-user-decorator';
import { CurrentUserInfo } from 'src/users/user.dto';

@ApiTags('invite-links')
@Controller('invite-links')
export class InviteLinksController {
  constructor(private inviteLinksService: InviteLinksService) {}

  @Get('/:id')
  async getInviteLinkById(@Param('id') id: string) {
    return this.inviteLinksService.getInviteLinkById(id);
  }

  @Get('/:id/accept')
  async acceptInviteLink(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ) {
    return this.inviteLinksService.acceptInviteLink(id, currentUser);
  }
}
