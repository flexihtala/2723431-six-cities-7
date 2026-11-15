import {HydratedDocument} from 'mongoose';
import {User} from '../types/user.type.js';

export type UserDocument = HydratedDocument<User>;

export interface UserService {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(user: User): Promise<UserDocument>;
}
