import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('API Documentation').setDescription('Documentation description').build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/logistic-app/api-documentation', app, document);

  await app.listen(process.env['PORT'] ?? 4000);
}
bootstrap().catch((error: unknown) => {
  return error;
});
