import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './get-user-decorator';
import { CurrentUserInfo } from './user.dto';
import { Invite } from 'src/invites/invite.entity';
import { InvitesService } from 'src/invites/invites.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private inviteService: InvitesService) {}

  @Get('/:userId/invites')
  getUserInvites(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Invite[]> {
    return this.inviteService.getInvitesByUserId(userId, currentUser.userId);
  }
}
