import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app.module';
import * as cookieParser from 'cookie-parser';
import { Config } from '@config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Config.initialize(app);
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
