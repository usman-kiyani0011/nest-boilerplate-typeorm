import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PROTOCOL: string = config.get<string>('BACKEND_PROTOCOL');
  const HOST: string = config.get<string>('BACKEND_HOST');
  const PORT: number = config.get<number>('BACKEND_PORT');
  const NODE_ENV: string = config.get<string>('NODE_ENV');
  const VERSION: string = config.get<string>('VERSION');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (NODE_ENV !== 'production') {
    app.use(
      ['/api/docs*'],
      basicAuth({
        challenge: true,
        users: {
          [config.get<string>('SWAGGER_USER_NAME')]:
            config.get<string>('SWAGGER_PASSWORD'),
        },
      }),
    );
    const options = new DocumentBuilder()
      .setTitle('API')
      .setVersion(VERSION)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        docExpansion: 'none',
      },
    });
  }

  await app.listen(PORT);

  Logger.log(`🚀 Application is running on: ${PROTOCOL}://${HOST}:${PORT}`);
}
bootstrap();
