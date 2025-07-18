import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  name!: string;
}
