import {randomBytes, scrypt as scryptCallback} from 'node:crypto';
import {promisify} from 'node:util';
import {inject, injectable} from 'inversify';
import {isValidObjectId, Model} from 'mongoose';
import {User} from '../types/user.type.js';
import {Component} from '../types/component.enum.js';
import {UserDocument, UserService} from './user-service.interface.js';

const scrypt = promisify(scryptCallback);

@injectable()
export class MongooseUserService implements UserService {
  constructor(@inject(Component.UserModel) private readonly model: Model<User>) {}

  public async findById(id: string): Promise<UserDocument | null> {
    return isValidObjectId(id) ? this.model.findById(id).exec() : null;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({email}).exec();
  }

  public async create(user: User): Promise<UserDocument> {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(user.password, salt, 64) as Buffer).toString('hex');
    return this.model.create({...user, password: `${salt}:${hash}`});
  }
}
