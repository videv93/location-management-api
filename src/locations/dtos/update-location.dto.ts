import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

/**
 * DTO for updating an existing location
 */
export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  locationNumber?: string;

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
