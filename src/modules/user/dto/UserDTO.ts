import { IsDate, IsString } from 'class-validator';

export class UserDTO {
  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date | null;

  @IsDate()
  lastLoginAt!: Date | null;

  @IsString()
  role!: string;

  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @IsString()
  password!: string;
}
