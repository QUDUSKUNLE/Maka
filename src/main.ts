import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MakaModule } from './maka.module';

(async () => {
  const maka = await NestFactory.create(MakaModule);
  maka.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
      stopAtFirstError: true,
      validationError: {
        value: true,
      },
    }),
  );
  await maka.listen(3000);
})();
