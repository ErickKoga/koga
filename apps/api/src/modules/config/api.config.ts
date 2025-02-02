import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsPort,
  IsString,
  validateSync,
} from 'class-validator';
import { registerAs } from '@nestjs/config';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class ApiConfig {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty()
  @IsString()
  API_URL: string;

  @IsPort()
  API_PORT: string;

  @IsNotEmpty()
  @IsString()
  API_AUTH_SECRET: string;
}

export default registerAs('api', () => {
  const envConfig = {
    NODE_ENV: process.env.NODE_ENV as Environment,
    API_URL: process.env.API_URL,
    API_PORT: process.env.API_PORT,
    API_AUTH_SECRET: process.env.API_AUTH_SECRET,
  };

  const config = plainToInstance(ApiConfig, envConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
  }

  return {
    url: config.API_URL,
    port: config.API_PORT,
    authSecret: config.API_AUTH_SECRET,
  };
});
