import {injectable} from 'inversify';
import pino, {Logger as PinoInstance} from 'pino';
import {Logger} from './logger.interface.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance = pino();

  public info(message: string): void {
    this.logger.info(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }
}
