import { Module } from '@nestjs/common';

import { OrdersClientsService } from './orders-clients.service';

@Module({
  providers: [OrdersClientsService],
})
export class OrdersClientsModule {}
