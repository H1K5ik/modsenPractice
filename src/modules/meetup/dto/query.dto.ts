import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number;
}
