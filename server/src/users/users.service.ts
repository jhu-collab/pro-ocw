import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from 'src/auth/auth-credentials.dto';
import { UpdateUserDto } from './user.dto';
import { Course } from 'src/courses/course.entity';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    @Inject(forwardRef(() => CoursesService))
    private coursesService: CoursesService,
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

  async getCoursesByUserId(
    userId: string,
    currentUserId: string,
  ): Promise<Course[]> {
    if (userId !== currentUserId) {
      throw new Error('Not authorized to get courses for user');
    }

    return this.coursesService.getCoursesByUserId(userId);
  }

  getUsersByCourseId(courseId: string): Promise<User[]> {
    return this.userRepository.getUsersByCourseId(courseId);
  }
}
