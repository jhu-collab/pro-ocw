import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CurrentUserInfo, UpdateUserDto } from './user.dto';
import { CurrentUser } from './get-user-decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserInfo,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, currentUser.userId);
  }
}
