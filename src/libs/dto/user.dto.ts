import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'There is ur id',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  id: number;

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
  roles: string;
}
