import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './get-user-decorator';
import { CurrentUserInfo, UpdateUserDto } from './user.dto';
import { Invite } from 'src/invites/invite.entity';
import { InvitesService } from 'src/invites/invites.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private inviteService: InvitesService,
    private usersService: UsersService,
  ) {}

  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, currentUser.userId);
  }

  @Get('/:userId/invites')
  getUserInvites(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<Invite[]> {
    return this.inviteService.getInvitesByUserId(userId, currentUser.userId);
  }
}
