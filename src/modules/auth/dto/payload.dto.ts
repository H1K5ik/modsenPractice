import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  sub: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  roles: string;
}
