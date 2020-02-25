import { Response } from 'express';
import * as Yup from 'yup';
import arrayMove from 'array-move';

import User from '../../Database/Schema/User';
import { AuthInterface, LinkInterface } from '../Interfaces';

class LinkController {
  public async index(req: AuthInterface, res: Response): Promise<Response> {
    const user = await User.findOne({ _id: req.user._id });

    return res.json(user.links);
  }

  public async create(req: AuthInterface, res: Response): Promise<Response> {
    const validate = Yup.object().shape({
      name: Yup.string().required(),
      url: Yup.string().required(),
      enabled: Yup.bool().required(),
      clicks: Yup.number().required(),
      image: Yup.string().required(),
    });

    if (!(await validate.isValid(req.body))) {
      return res.json({ error: true, validation: false });
    }

    try {
      const { name, url, enabled, clicks, image } = req.body;

      const user = await User.findOne({ _id: req.user._id });

      const newLink: LinkInterface = {
        name,
        url,
        enabled,
        clicks,
        image,
        position: user.links.length,
      };

      user.links.push(newLink);
      user.save();
      return res.json({ status: 'ok' });
    } catch (err) {
      return res.json({ error: true });
    }
  }

  public async reOrder(req: AuthInterface, res: Response): Promise<Response> {
    const validate = Yup.object().shape({
      _id: Yup.string().required(),
      position: Yup.number().required(),
    });

    if (!(await validate.isValid(req.body))) {
      return res.json({ error: true, validation: false });
    }

    const { _id, position }: { _id: string; position: number } = req.body;

    try {
      const user = await User.findOne({ _id: req.user._id });

      // Verificar se o link pertence ao usuario logado
      const linkAlter = user.links.find(link => link._id.toString() === _id);
      if (!linkAlter) {
        return res.json({ error: 'Sem permissão' });
      }

      // Verifica se a posicao enviada é igual a posicao ja existente na base
      if (linkAlter.position.toPrecision(1) === position.toPrecision(1)) {
        return res.json({ error: 'Sem permissão' });
      }

      // Reordena o array com base na nova posicao (move o item)
      const reorded: LinkInterface[] = arrayMove(user.links, linkAlter.position, position);

      // Atualiza o valor da posicao
      user.links = reorded.map((link, index) => {
        link.position = index;
        return link;
      });

      user.save();

      return res.json({ ok: true });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'Erro ao processar' });
    }
  }
}

export default new LinkController();
