import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PayloadDto {
  @ApiProperty({
    example: 'id',
    required: true,
  })
  @IsNotEmpty()
  sub: number;

  @ApiProperty({
    example: 'test@mail.ru',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin or user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  roles: string;
}
