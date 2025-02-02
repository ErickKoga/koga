import apiConfig, { ApiConfig } from './api.config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

describe('ApiConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Validation', () => {
    it('should load and validate configuration', () => {
      const envConfig = {
        NODE_ENV: 'development',
        API_URL: 'http://localhost:3000',
        API_PORT: '3000',
        API_AUTH_SECRET: 'secret',
      };

      const config = plainToInstance(ApiConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', () => {
      const envConfig = {
        NODE_ENV: 'development',
        API_URL: 'http://localhost:3000',
        // API_PORT is missing
        API_AUTH_SECRET: 'secret',
      };

      const config = plainToInstance(ApiConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('API_PORT');
    });

    it('should fail validation if fields have invalid types', () => {
      const envConfig = {
        NODE_ENV: 'development',
        API_URL: 'http://localhost:3000',
        API_PORT: 'invalid_port', // Invalid port
        API_AUTH_SECRET: 'secret',
      };

      const config = plainToInstance(ApiConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('API_PORT');
    });

    it('should fail validation if fields are empty', () => {
      const envConfig = {
        NODE_ENV: '',
        API_URL: '',
        API_PORT: '',
        API_AUTH_SECRET: '',
      };

      const config = plainToInstance(ApiConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.map((error) => error.property)).toEqual(
        expect.arrayContaining([
          'NODE_ENV',
          'API_URL',
          'API_PORT',
          'API_AUTH_SECRET',
        ]),
      );
    });
  });

  describe('Configuration Loading', () => {
    it('should load configuration using registerAs', () => {
      process.env.NODE_ENV = 'development';
      process.env.API_URL = 'http://localhost:3000';
      process.env.API_PORT = '3000';
      process.env.API_AUTH_SECRET = 'secret';
      const config = apiConfig();
      expect(config.url).toBe('http://localhost:3000');
      expect(config.port).toBe('3000');
      expect(config.authSecret).toBe('secret');
    });

    it('should throw an error if configuration is invalid', () => {
      process.env.NODE_ENV = '';
      process.env.API_URL = '';
      process.env.API_PORT = '';
      process.env.API_AUTH_SECRET = '';
      expect(() => apiConfig()).toThrow();
    });
  });
});
