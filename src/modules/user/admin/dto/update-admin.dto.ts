import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  logo: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @Expose()
  @IsString()
  @IsEmail()
  email: string;
}
