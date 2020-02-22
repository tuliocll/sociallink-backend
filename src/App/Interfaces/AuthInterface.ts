import { Request } from 'express';

import UserInterface from './UserInterface';

interface AuthRequest extends Request {
  user: UserInterface;
  token: string;
}

export default AuthRequest;
