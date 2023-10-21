import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from 'src/auth/auth-credentials.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }
}
