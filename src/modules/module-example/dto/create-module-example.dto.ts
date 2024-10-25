import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModuleExampleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Starbulka', description: 'Company name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://company-logo', description: 'Company logo' })
  logo: string;
}
