import { Role } from 'src/commons/role.enum';
import { IsUUID, IsEnum } from 'class-validator';

export class CreateInviteLinkDto {
  @IsUUID()
  courseId: string;

  @IsEnum(Role)
  role: Role;
}
