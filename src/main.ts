import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { Config } from '@config/config';
import { PORT } from '@constants';
import { AppModule } from '@modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Config.initialize(app);
  app.use(cookieParser());
  await app.listen(process.env.PORT || PORT);
}
bootstrap();
