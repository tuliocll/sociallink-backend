import { Request } from 'express';

import { UserInterface } from './';

interface AuthRequest extends Request {
  user: UserInterface;
  token: string;
}

export default AuthRequest;
