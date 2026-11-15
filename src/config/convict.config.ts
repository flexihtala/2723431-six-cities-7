import convict from 'convict';
import formats from 'convict-format-with-validator';
import dotenv from 'dotenv';
import {injectable} from 'inversify';
import {AppConfig, Config} from './config.interface.js';

convict.addFormats(formats);
convict.addFormat({
  name: 'app-port',
  coerce: (value: unknown): unknown => typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value,
  validate: (value: unknown): void => {
    if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > 65535) {
      throw new Error('PORT должен быть целым числом от 1 до 65535');
    }
  }
});

@injectable()
export class ConvictConfig implements Config {
  private readonly config: convict.Config<AppConfig>;

  constructor() {
    dotenv.config();

    this.config = convict<AppConfig>({
      port: {
        doc: 'Порт REST API',
        format: 'app-port',
        default: null,
        env: 'PORT'
      },
      dbHost: {
        doc: 'IP-адрес сервера базы данных',
        format: 'ipaddress',
        default: null,
        env: 'DB_HOST'
      },
      salt: {
        doc: 'Соль для хеширования паролей',
        format: (value: unknown): void => {
          if (typeof value !== 'string' || value.trim().length === 0) {
            throw new Error('SALT должна быть непустой строкой');
          }
        },
        default: null,
        env: 'SALT',
        sensitive: true
      }
    });

    this.config.validate({allowed: 'strict'});
  }

  public get<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return this.config.get(key) as AppConfig[T];
  }
}
