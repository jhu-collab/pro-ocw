import { IsUUID, IsEnum } from 'class-validator';
import { Role } from '../commons/role.enum';
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

export class UpdateMemberDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsEnum(Role)
  role: string;
}
