import {inject, injectable} from 'inversify';
import {Logger} from '../logger/logger.interface.js';
import {Component} from '../types/component.enum.js';

@injectable()
export class Application {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public init(): void {
    this.logger.info('Приложение инициализировано');
  }
}
