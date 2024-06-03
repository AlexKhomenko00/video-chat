import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketAdapter } from './api/websocket.adapter';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
  });

  app.useWebSocketAdapter(
    new WebSocketAdapter(app, {
      origin: configService.get('FRONTEND_URL'),
    }),
  );
  await app.listen(3000);
}
bootstrap();
