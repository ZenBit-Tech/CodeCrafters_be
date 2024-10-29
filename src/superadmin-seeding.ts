import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { SeedingService } from 'common/database/seeds/superadmin-seeding/seeding.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seederService = app.get(SeedingService);

    await seederService.seed();
  } catch (error) {
    new Logger().error(error);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  new Logger().error(error);
  process.exit(1);
});
