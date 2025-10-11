import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CRUD App')
    .setDescription(
      'Une application de CRUD simple pour apprendre NestJs/Prisma',
    )
    .setContact(
      '#CISSE',
      'https://github.com/cisse410',
      'quoifaireavec@gmail.com',
    )
    .setLicense(
      'MIT',
      'https://github.com/cisse410/nestjs-prisma/blob/master/LICENSE.md',
    )
    .setVersion('1.0')
    .build();
  const swaggerCustomOptions: SwaggerCustomOptions = {
    jsonDocumentUrl: 'api/docs/json',
    yamlDocumentUrl: 'api/docs/yaml',
    raw: ['json', 'yaml'],
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory, swaggerCustomOptions);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
