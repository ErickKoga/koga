import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import apiConfig from './modules/config/api.config';
import databaseConfig from './modules/config/database.config';
import webConfig from './modules/config/web.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      load: [apiConfig, databaseConfig, webConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
