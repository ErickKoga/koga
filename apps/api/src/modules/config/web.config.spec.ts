import webConfig, { WebConfig } from './web.config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

describe('WebConfig', () => {
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
        VITE_URL: 'http://localhost:3000',
      };

      const config = plainToInstance(WebConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', () => {
      const envConfig = {
        // VITE_URL is missing
      };

      const config = plainToInstance(WebConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('VITE_URL');
    });

    it('should fail validation if fields have invalid types', () => {
      const envConfig = {
        VITE_URL: 12345, // Invalid type
      };

      const config = plainToInstance(WebConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('VITE_URL');
    });

    it('should fail validation if fields are empty', () => {
      const envConfig = {
        VITE_URL: '',
      };

      const config = plainToInstance(WebConfig, envConfig);
      const errors = validateSync(config, {
        skipMissingProperties: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('VITE_URL');
    });
  });

  describe('Configuration Loading', () => {
    it('should load configuration using registerAs', () => {
      process.env.VITE_URL = 'http://localhost:3000';
      const config = webConfig();
      expect(config.url).toBe('http://localhost:3000');
    });

    it('should throw an error if configuration is invalid', () => {
      process.env.VITE_URL = '';
      expect(() => webConfig()).toThrow();
    });
  });
});
