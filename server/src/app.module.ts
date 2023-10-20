import { Module } from '@nestjs/common';
import { MembersModule } from './members/members.module';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { CoursesModule } from './courses/courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'pro-ocw',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MembersModule,
    UsersModule,
    InvitesModule,
    CoursesModule,
    AuthModule,
  ],
})
export class AppModule {}
