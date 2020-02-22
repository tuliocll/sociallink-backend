import { Request, Response } from 'express';
import * as Yup from 'yup';

import User from '../../Database/Schema/User';

class UserController {
  public async index(req: Request, res: Response): Promise<Response> {
    const users = await User.find();

    return res.json(users);
  }

  // Create user
  public async create(req: Request, res: Response): Promise<Response> {
    const validate = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await validate.isValid(req.body))) {
      return res.json({ error: true, validation: false });
    }

    try {
      const { name, email, password } = req.body;

      const user = await User.create({ name, email, password });

      const token = await user.generateAuthToken();

      return res.json({ user, token });
    } catch (err) {
      console.log(err);
      return res.json({ error: true });
    }
  }

  //Login a registered user
  public async login(req: Request, res: Response): Promise<Response> {
    const validate = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await validate.isValid(req.body))) {
      return res.json({ error: true, validation: false });
    }

    try {
      const { email, password } = req.body;
      const user = await User.schema.statics.findByCredentials(email, password);

      if (!user) {
        return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
      }
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}

export default new UserController();
