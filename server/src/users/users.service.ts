import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from 'src/auth/auth-credentials.dto';
import { UpdateUserDto } from './user.dto';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private memberService: MembersService,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<User> {
    if (userId !== currentUserId) {
      throw new Error('Not authorized to update user');
    }

    return this.userRepository.updateUser(userId, updateUserDto);
  }

  async getUsersByCourseId(courseId: string, userId: string): Promise<User[]> {
    const isMember = await this.memberService.isMember({
      courseId,
      userId,
    });
    if (!isMember) {
      throw new NotFoundException('Course not found');
    }
    return this.userRepository.getUsersByCourseId(courseId);
  }
}
