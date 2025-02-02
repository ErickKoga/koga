import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { registerAs } from '@nestjs/config';

export class WebConfig {
  @IsNotEmpty()
  @IsString()
  VITE_URL: string;
}

export default registerAs('web', () => {
  const envConfig = {
    VITE_URL: process.env.VITE_URL,
  };
  const config = plainToInstance(WebConfig, envConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
  }

  return {
    url: config.VITE_URL,
  };
});
