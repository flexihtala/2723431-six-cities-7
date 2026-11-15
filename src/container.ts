import {Container} from 'inversify';
import {Application} from './app/application.js';
import {Config} from './config/config.interface.js';
import {ConvictConfig} from './config/convict.config.js';
import {Logger} from './logger/logger.interface.js';
import {PinoLogger} from './logger/pino.logger.js';
import {Component} from './types/component.enum.js';

export function createContainer(): Container {
  const container = new Container();

  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config>(Component.Config).to(ConvictConfig).inSingletonScope();
  container.bind<Application>(Component.Application).to(Application).inSingletonScope();

  return container;
}
