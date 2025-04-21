import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for creating a new location
 */
export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  locationNumber: string;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  building?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
