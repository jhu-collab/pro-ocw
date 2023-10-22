import { Role } from 'src/members/role.enum';
import {
  IsUUID,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInviteDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  userId: string;

  @IsEnum(Role)
  role: Role;

  @IsEmail()
  email: string;
}

export class BatchCreateInviteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInviteDto)
  data: CreateInviteDto[];
}

export class InviteByCourseAndUserDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;
}
