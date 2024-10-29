import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Address } from 'nodemailer/lib/mailer';

export class CreateMailDto {
  @ApiProperty({
    example: { name: 'John Doe', address: 'John@mail.com' },
    description: 'From address',
  })
  from?: Address;

  @IsNotEmpty()
  @ApiProperty({
    example: [{ name: 'John Doe', address: 'John@mail.com' }],
    description: 'Recipients addresses',
  })
  recipients: Address[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Mail Subject',
    description: 'Mail Subject',
  })
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'HTML for email',
    description: 'containes mail body',
  })
  html: string;

  @IsString()
  @ApiProperty({
    example: 'Text',
    description: 'Text',
  })
  text?: string;

  @ApiProperty({
    example: { key: 'value' },
    description: 'Text',
  })
  placeholderReplacements: Record<string, string>;
}
