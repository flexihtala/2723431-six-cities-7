import 'reflect-metadata';
import {Application} from './app/application.js';
import {Config} from './config/config.interface.js';
import {Logger} from './logger/logger.interface.js';
import {createContainer} from './container.js';
import {Component} from './types/component.enum.js';

const container = createContainer();
const logger = container.get<Logger>(Component.Logger);

try {
  const config = container.get<Config>(Component.Config);
  logger.info(`Порт приложения: ${config.get('port')}`);
  container.get<Application>(Component.Application).init();
} catch (error) {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
