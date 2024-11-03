import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';

import { OrdersClientsService } from './orders-clients/orders-clients.service';

async function bootstrap() {
  let app;
  try {
    app = await NestFactory.createApplicationContext(AppModule);
    const seederService = app.get(OrdersClientsService);

    await seederService.seed();
  } catch (error) {
    new Logger().error(error);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

bootstrap().catch((error: unknown) => {
  new Logger().error(error);
  process.exit(1);
});
