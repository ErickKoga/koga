import { plainToInstance } from 'class-transformer';
import { IsString, IsPort, validateSync, IsNotEmpty } from 'class-validator';
import { registerAs } from '@nestjs/config';

export class DatabaseConfig {
  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_USER: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;

  @IsPort()
  DATABASE_PORT: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;
}

export default registerAs('database', () => {
  const envConfig = {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  const config = plainToInstance(DatabaseConfig, envConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
  }

  return {
    host: config.DATABASE_HOST,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    name: config.DATABASE_NAME,
    port: config.DATABASE_PORT,
    url: config.DATABASE_URL,
  };
});
