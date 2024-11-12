import { ApiProperty } from '@nestjs/swagger';
import { ORDERS } from 'common/constants/mockData';
import { Order } from 'common/database/entities/order.entity';

export class OrdersResponse {
  @ApiProperty({
    type: [Order],
    description: 'List of orders for the current page',
    example: ORDERS,
  })
  orders: Order[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages based on the results and page size',
    example: 5,
  })
  pagesCount: number;
}
