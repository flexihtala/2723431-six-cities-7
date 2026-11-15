import {createReadStream} from 'node:fs';
import {access} from 'node:fs/promises';
import {createInterface} from 'node:readline';
import {inject, injectable} from 'inversify';
import {DatabaseClient} from '../database/database-client.interface.js';
import {Logger} from '../logger/logger.interface.js';
import {Component} from '../types/component.enum.js';
import {UserService} from '../user/user-service.interface.js';
import {OfferService} from './offer-service.interface.js';
import {parseOffer} from './parse-offer.js';

@injectable()
export class OfferImporter {
  constructor(
    @inject(Component.DatabaseClient) private readonly database: DatabaseClient,
    @inject(Component.UserService) private readonly users: UserService,
    @inject(Component.OfferService) private readonly offers: OfferService,
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public async import(filepath: string, uri: string): Promise<number> {
    await access(filepath);
    await this.database.connect(uri);
    const lines = createInterface({input: createReadStream(filepath), crlfDelay: Infinity});
    let count = 0;

    try {
      for await (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        const {author, ...offer} = parseOffer(line);
        const user = await this.users.findByEmail(author.email) ?? await this.users.create(author);
        await this.offers.create({...offer, author: user._id, commentCount: 0});
        count++;
      }
      this.logger.info(`Импортировано предложений: ${count}`);
      return count;
    } finally {
      lines.close();
      await this.database.disconnect();
    }
  }
}
