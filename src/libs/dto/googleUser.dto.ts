import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleUserDto {
  @ApiProperty({
    example: 'test@mail.ru',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'User || Admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
