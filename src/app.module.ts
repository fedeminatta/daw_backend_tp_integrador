import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { TareasModule } from './tareas/tareas.module';
import { DashboradModule } from './dashboard/dashborad.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<number>('DB_PORT');
        const username = configService.get<string>('DB_USER');
        const password = configService.get<string>('DB_PASSWORD');
        const database = configService.get<string>('DB_NAME');

        if (!host || !port || !username || !password || !database) {
          throw new Error(
            'Faltan variables de entorono para la configuracion de la base de datos postgresql.',
          );
        }
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),
    UsuariosModule,
    ClientesModule,
    ProyectosModule,
    TareasModule,
    DashboradModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
