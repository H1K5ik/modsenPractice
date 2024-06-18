import {  ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({
    example: 'There is ur title',
    required: true,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'There is ur page number',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiPropertyOptional({
    example: 'There is ur page pageSize',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number;
}
