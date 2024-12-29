import { ApiProperty } from '@nestjs/swagger';
import { OrderStatuses } from 'common/enums/enums';

import { UserDto } from './user.dto';

export class OrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  collection_date: Date;

  @ApiProperty()
  collection_time_start: Date;

  @ApiProperty()
  collection_time_end: Date;

  @ApiProperty()
  collection_address: string;

  @ApiProperty()
  status: OrderStatuses;

  @ApiProperty()
  failed_reason: string | null;

  @ApiProperty({ type: () => UserDto })
  user: UserDto | null;
}
