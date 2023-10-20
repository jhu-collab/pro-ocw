import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberRepository } from './members.repository';
import { MembersService } from './members.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [],
  providers: [MemberRepository, MembersService],
  exports: [MembersService],
})
export class MembersModule {}
