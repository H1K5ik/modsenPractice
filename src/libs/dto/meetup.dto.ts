import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, MinLength } from 'class-validator';

export class MeetupDto {
  @ApiPropertyOptional({
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

  @ApiPropertyOptional({
    example: 'There is ur best description',
    required: true,
  })
  @IsOptional()
  @MinLength(6)
  description: string;

  @ApiPropertyOptional({
    example: 'There is ur best tags',
    required: true,
  })
  @IsOptional()
  @MinLength(6)
  tags: string;

  @ApiPropertyOptional({
    example: 'December 17',
    required: true,
  })
  @IsOptional()
  @IsDate()
  date: Date;

  @ApiPropertyOptional({
    example: 'There is ur best place',
    required: true,
  })
  @IsOptional()
  @MinLength(6)
  place: string;

  @ApiPropertyOptional({
    example: 'There is ur id',
    required: true,
  })
  @IsOptional()
  authorId: number;
}
