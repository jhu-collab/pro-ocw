import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/users/get-user-decorator';
import { CurrentUserInfo } from 'src/users/user.dto';
import { Public } from './public-decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: AuthCredentialsDto })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('signin')
  async signIn(@Request() req): Promise<{ access_token: string }> {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Get('current-user')
  getCurrentUser(@CurrentUser() user: CurrentUserInfo) {
    return this.authService.getCurrentUser(user);
  }
}
