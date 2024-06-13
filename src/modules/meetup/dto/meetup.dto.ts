import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class MeetupDto {
  @ApiProperty({
    example: 'There is ur meetup id',
    required: true,
  })
  @IsOptional()
  id: number;

  @ApiProperty({
    example: 'There is ur best title',
    required: true,
  })
  @MinLength(6)
  title: string;

  @ApiProperty({
    example: 'There is ur best description',
    required: true,
  })
  @IsOptional()
  @MinLength(6)
  description: string;

  @ApiProperty({
    example: 'There is ur best tags',
    required: true,
  })
  @IsOptional()
  @MinLength(6)
  tags: string;

  @ApiProperty({
    example: 'There is ur date',
    required: true,
  })
  @IsOptional()
  date: Date;

  @ApiProperty({
    example: 'There is ur best place',
    required: true,
  })
  @IsOptional()
  @MinLength(6)
  place: string;

  @ApiProperty({
    example: 'There is ur id',
    required: true,
  })
  @IsOptional()
  authorId: number;
}
