import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InvitesModule } from 'src/invites/invites.module';
import { CoursesModule } from 'src/courses/courses.module';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    InvitesModule,
    MembersModule,
    forwardRef(() => CoursesModule),
  ],
  controllers: [UsersController],
  providers: [UserRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
