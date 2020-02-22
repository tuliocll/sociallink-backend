import { Request } from 'express';

import LinkInterface from './LinkInterface';

interface AuthRequest extends Request {
  user: {
    _id: string;
    name: string;
    email: string;
    tokens: [string];
    links: [LinkInterface];
  };
  token: string;
}

export default AuthRequest;
