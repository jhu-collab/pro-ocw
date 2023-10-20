import { IsUUID } from 'class-validator';
export class CreateMemberDto {
  userId: string;
  courseId: string;
  role: string;
}

export class GetMemberByCourseAndUserDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;
}
