import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from 'src/auth/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ email, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw error;
      }
    }
  }

  async getUsersByCourseId(courseId: string): Promise<User[]> {
    const query = this.createQueryBuilder('member')
      .leftJoinAndSelect('member.courseId', 'course.id')
      // .leftJoinAndSelect('members.user', 'user')
      .where('course.id = :courseId', { courseId });
    console.log(query.getSql());
    const users = await query.getMany();
    return users;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.save({
      id: userId,
      ...updateUserDto,
    });
    return user;
  }
}
