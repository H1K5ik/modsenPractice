import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    example: 'There is ur title',
    required: true,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'There is ur page number',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    example: 'There is ur page pageSize',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number;
}
