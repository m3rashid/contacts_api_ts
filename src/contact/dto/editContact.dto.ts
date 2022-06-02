import { IsOptional, IsString } from 'class-validator';

export class EditContactDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  info?: string;
}
