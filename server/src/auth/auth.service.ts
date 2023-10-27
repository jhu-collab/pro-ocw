import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserInfo } from 'src/users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    return this.usersService.createUser(signUpDto);
  }

  async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getCurrentUser(user: CurrentUserInfo) {
    const found = await this.usersService.findOne(user.email);
    if (!found) {
      throw new NotFoundException('User not found');
    }
    return found;
  }
}
