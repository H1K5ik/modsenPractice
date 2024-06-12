import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class MeetupDto {
  @IsNotEmpty()
  @MinLength(6)
  title: string;

  @IsOptional()
  @MinLength(6)
  description: string;

  @IsOptional()
  @MinLength(6)
  tags: string;

  @IsOptional()
  @MinLength(6)
  place: string;
}
