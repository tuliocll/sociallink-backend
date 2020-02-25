import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import User from '../../Database/Schema/User';
import { AuthInterface } from '../Interfaces';

const auth = async (req: AuthInterface, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Erro ao processar solicitação!' });
  }
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findOne({ _id: data._id, 'tokens.token': token });
    if (!user) {
      throw new Error('Usuario não encontrado');
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: 'Sem permissão' });
  }
};

export default auth;
