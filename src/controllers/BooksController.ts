import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import booksView from '../views/books_view';

import Book from '../models/Book';
import User from '../models/User';

export default {
  async create(req: Request, res: Response) {
    const {
      logged_user_id,
      title,
      pages,
    } = req.body;

    const data = {
      logged_user_id,
      title,
      pages,
    };

    const schema = Yup.object().shape({
      logged_user_id: Yup.number().integer().required(),
      title: Yup.string().required(),
      pages: Yup.number().integer().required()
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const usersRepository = getRepository(User);
    const logged_user = await usersRepository.findOne(logged_user_id);

    if (!logged_user) return res.status(404).send();

    const booksRepository = getRepository(Book);
    const book = booksRepository.create({ title, pages, user: logged_user });

    await booksRepository.save(book);

    return res.status(201).json(booksView.render(book));
  }
}