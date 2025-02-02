import databaseConfig, { DatabaseConfig } from './database.config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

describe('DatabaseConfig', () => {
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
        DATABASE_HOST: 'localhost',
        DATABASE_USER: 'user',
        DATABASE_PASSWORD: 'password',
        DATABASE_NAME: 'dbname',
        DATABASE_PORT: '5432',
        DATABASE_URL: 'postgres://user:password@localhost:5432/dbname',
      };

      const config = plainToInstance(DatabaseConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', () => {
      const envConfig = {
        DATABASE_HOST: 'localhost',
        DATABASE_USER: 'user',
        DATABASE_PASSWORD: 'password',
        // DATABASE_NAME is missing
        DATABASE_PORT: '5432',
        DATABASE_URL: 'postgres://user:password@localhost:5432/dbname',
      };

      const config = plainToInstance(DatabaseConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('DATABASE_NAME');
    });

    it('should fail validation if fields have invalid types', () => {
      const envConfig = {
        DATABASE_HOST: 'localhost',
        DATABASE_USER: 'user',
        DATABASE_PASSWORD: 'password',
        DATABASE_NAME: 'dbname',
        DATABASE_PORT: 'invalid_port', // Invalid port
        DATABASE_URL: 'postgres://user:password@localhost:5432/dbname',
      };

      const config = plainToInstance(DatabaseConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('DATABASE_PORT');
    });

    it('should fail validation if fields are empty', () => {
      const envConfig = {
        DATABASE_HOST: '',
        DATABASE_USER: '',
        DATABASE_PASSWORD: '',
        DATABASE_NAME: '',
        DATABASE_PORT: '',
        DATABASE_URL: '',
      };

      const config = plainToInstance(DatabaseConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.map((error) => error.property)).toEqual(
        expect.arrayContaining([
          'DATABASE_HOST',
          'DATABASE_USER',
          'DATABASE_PASSWORD',
          'DATABASE_NAME',
          'DATABASE_PORT',
          'DATABASE_URL',
        ]),
      );
    });
  });

  describe('Configuration Loading', () => {
    it('should load configuration using registerAs', () => {
      process.env.DATABASE_HOST = 'localhost';
      process.env.DATABASE_USER = 'user';
      process.env.DATABASE_PASSWORD = 'password';
      process.env.DATABASE_NAME = 'dbname';
      process.env.DATABASE_PORT = '5432';
      process.env.DATABASE_URL =
        'postgres://user:password@localhost:5432/dbname';
      const config = databaseConfig();
      expect(config.host).toBe('localhost');
      expect(config.user).toBe('user');
      expect(config.password).toBe('password');
      expect(config.name).toBe('dbname');
      expect(config.port).toBe('5432');
      expect(config.url).toBe('postgres://user:password@localhost:5432/dbname');
    });

    it('should throw an error if configuration is invalid', () => {
      process.env.DATABASE_HOST = '';
      process.env.DATABASE_USER = '';
      process.env.DATABASE_PASSWORD = '';
      process.env.DATABASE_NAME = '';
      process.env.DATABASE_PORT = '';
      process.env.DATABASE_URL = '';
      expect(() => databaseConfig()).toThrow();
    });
  });
});
