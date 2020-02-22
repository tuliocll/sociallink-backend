import { Document } from 'mongoose';
import LinkInterface from './LinkInterface';

interface UserInterface extends Document {
  _id: string;
  name: string;
  usernick: string;
  email: string;
  password: string;
  tokens: [string];
  links: LinkInterface[];
  generateAuthToken(): string;
  findByCredentials(): UserInterface;
}

export default UserInterface;
