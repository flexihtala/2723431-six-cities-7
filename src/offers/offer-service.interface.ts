import {HydratedDocument} from 'mongoose';
import {OfferEntity} from './offer.model.js';

export type OfferDocument = HydratedDocument<OfferEntity>;

export interface OfferService {
  findById(id: string): Promise<OfferDocument | null>;
  create(offer: OfferEntity): Promise<OfferDocument>;
}
