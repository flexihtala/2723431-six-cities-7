import {model, Schema} from 'mongoose';
import {User} from '../types/user.type.js';

const userSchema = new Schema<User>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  avatar: {type: String},
  password: {type: String, required: true},
  type: {type: String, required: true}
}, {timestamps: true, collection: 'users'});

export const UserModel = model<User>('User', userSchema);
