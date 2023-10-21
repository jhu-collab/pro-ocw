import { IsUUID, IsEnum } from 'class-validator';
import { Role } from './role.enum';
export class CreateMemberDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsEnum(Role)
  role: string;
}

export class MemberByCourseAndUserDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;
}