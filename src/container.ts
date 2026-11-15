import {Container} from 'inversify';
import {Model} from 'mongoose';
import {Application} from './app/application.js';
import {Config} from './config/config.interface.js';
import {ConvictConfig} from './config/convict.config.js';
import {DatabaseClient} from './database/database-client.interface.js';
import {MongooseDatabaseClient} from './database/mongoose-database-client.js';
import {Logger} from './logger/logger.interface.js';
import {PinoLogger} from './logger/pino.logger.js';
import {OfferImporter} from './offers/import-offers.js';
import {OfferEntity, OfferModel} from './offers/offer.model.js';
import {OfferService} from './offers/offer-service.interface.js';
import {MongooseOfferService} from './offers/mongoose-offer-service.js';
import {Component} from './types/component.enum.js';
import {User} from './types/user.type.js';
import {MongooseUserService} from './user/mongoose-user-service.js';
import {UserModel} from './user/user.model.js';
import {UserService} from './user/user-service.interface.js';

export function createContainer(): Container {
  const container = new Container();

  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config>(Component.Config).to(ConvictConfig).inSingletonScope();
  container.bind<Application>(Component.Application).to(Application).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongooseDatabaseClient).inSingletonScope();
  container.bind<Model<User>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<Model<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<UserService>(Component.UserService).to(MongooseUserService).inSingletonScope();
  container.bind<OfferService>(Component.OfferService).to(MongooseOfferService).inSingletonScope();
  container.bind<OfferImporter>(Component.OfferImporter).to(OfferImporter);

  return container;
}
