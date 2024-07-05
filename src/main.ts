import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { Config } from '@libs/config';
import { PORT } from '@libs/constants';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Config.initialize(app);
  app.use(cookieParser());
  await app.listen(process.env.PORT || PORT);
}
bootstrap();
