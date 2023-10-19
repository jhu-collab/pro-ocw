import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberRepository } from './members.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [],
  providers: [MemberRepository],
  exports: [],
})
export class MembersModule {}
