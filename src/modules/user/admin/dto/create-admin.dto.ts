import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roles } from 'common/enums/enums';

export class CreateAdminDto {
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

  @Expose()
  @IsString()
  role: Roles;

  @Expose()
  @IsNumber()
  company_id: number;
}
