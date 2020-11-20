import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import usersView from '../views/users_view';

import User from '../models/User';

export default {
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const usersRepository = getRepository(User);
  
    const user = await usersRepository.findOne(id, {
      relations: [
        'books',
        'lent_books', 'lent_books.from_user', 'lent_books.to_user', 'lent_books.book',
        'borrowed_books', 'borrowed_books.from_user', 'borrowed_books.to_user', 'borrowed_books.book'
      ]
    });

    if (!user) return res.status(404).send();

    return res.status(200).json(usersView.render(user));
  },

  async create(req: Request, res: Response) {
    const {
      name,
      email,
    } = req.body;

    const data = {
      name,
      email,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required()
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const usersRepository = getRepository(User);

    if (await usersRepository.findOne({ email })) return res.status(400).json({errors: {email: ['email already in use']}});

    const user = usersRepository.create(data);

    await usersRepository.save(user);

    return res.status(201).json(usersView.render(user));
  }
}