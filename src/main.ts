import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
      stopAtFirstError: true,
      validationError: {
        value: true,
      },
    }),
  );
  await app.listen(3000);
})();
