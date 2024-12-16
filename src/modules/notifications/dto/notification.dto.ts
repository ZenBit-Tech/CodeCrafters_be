import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { NotificationTypes } from 'common/enums/enums';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Type of the notification', example: 'ORDER_FAILURE_REASON' })
  type: NotificationTypes;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Link text for the notification', example: 'Order Fail Details' })
  link_text: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Link href for the notification', example: '/orders/123' })
  link_href: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Message for the notification', example: 'Your order was not fulfilled due to an unforeseen situation.' })
  message: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'ID of the user associated with the notification', example: 1 })
  userId: number;
}
