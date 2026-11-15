import {inject, injectable} from 'inversify';
import {isValidObjectId, Model} from 'mongoose';
import {Component} from '../types/component.enum.js';
import {OfferEntity} from './offer.model.js';
import {OfferDocument, OfferService} from './offer-service.interface.js';

@injectable()
export class MongooseOfferService implements OfferService {
  constructor(@inject(Component.OfferModel) private readonly model: Model<OfferEntity>) {}

  public async findById(id: string): Promise<OfferDocument | null> {
    return isValidObjectId(id) ? this.model.findById(id).exec() : null;
  }

  public async create(offer: OfferEntity): Promise<OfferDocument> {
    return this.model.create(offer);
  }
}
