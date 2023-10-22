import { IsString } from 'class-validator';

export class CurrentUserInfo {
  userId: string;
  email: string;
}

export class UpdateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  metadata: string;
}
