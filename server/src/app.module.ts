import { Module } from '@nestjs/common';
import { MembersModule } from './members/members.module';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [MembersModule, UsersModule, InvitesModule, CoursesModule],
})
export class AppModule {}
