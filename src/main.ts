import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet  from 'helmet'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4200', // URL de frontend de Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Proyecto Integrador - Gestor de Proyectos')
    .setDescription(
      'Documentacion de la API para el TP de Desarrollo de Aplicaciones Web',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'production'){
    SwaggerModule.setup('docs', app, document); // Definir la ruta de la documentacion
    console.log(`Documentacion disponible en  http://localhost:3000/docs`);
  }
  

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor corriendo en: http://localhost:3000`);
  console.log(`📄 Documentacion disponible en: http://localhost:3000/docs`);
}
bootstrap();
