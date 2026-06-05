import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Proyecto Integrador - Gestor de Proyectos')
    .setDescription(
      'Documentacion de la API para el TP de Desarrollo de Aplicaciones Web',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Definir la ruta de la documentacion

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor corriendo en: http://localhost:3000`);
  console.log(`📄 Documentacion disponible en: http://localhost:3000/docs`);
}
bootstrap();
