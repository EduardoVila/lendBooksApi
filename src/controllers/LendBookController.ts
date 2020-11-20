import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import lendBooksView from '../views/lend_books_view';

import LendBook from '../models/LendBook';
import Book from '../models/Book';
import User from '../models/User';

const getBookById = async (id:number) => {
  const booksRepository = getRepository(Book);

  return await booksRepository.findOne(id);
};

const getUserById = async (id:number) => {
  const usersRepository = getRepository(User);

  return await usersRepository.findOne(id);;
}

export default {
  async lend(req: Request, res: Response) {
    const {
      logged_user_id,
      book_id,
      to_user_id
    } = req.body;

    const data = {
      logged_user_id,
      book_id,
      to_user_id
    };

    const schema = Yup.object().shape({
      logged_user_id: Yup.number().integer().required(),
      book_id: Yup.number().integer().required(),
      to_user_id: Yup.number().integer().required()
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const logged_user = await getUserById(logged_user_id);
    if (!logged_user) return res.status(404).json({ errors: { logged_user_id: ['user id not found'] } });
    
    const to_user = await getUserById(to_user_id);
    if (!to_user) return res.status(404).json({ errors: { to_user_id: ['user id not found'] } });

    const book = await getBookById(book_id);
    if (!book) return res.status(404).json({ errors: { book_id: ['book id not found'] } });

    const lendBooksRepository = getRepository(LendBook);
    if (await lendBooksRepository.findOne({ book })) return res.status(400).json({errors: {book_id: ["book is already lent"]}});

    const lendBook = lendBooksRepository.create({ book: book, from_user: logged_user, to_user: to_user });

    await lendBooksRepository.save(lendBook);

    return res.status(201).json(lendBooksView.render(lendBook));
  },

  async return(req: Request, res: Response) {
    const {
      logged_user_id,
      book_id
    } = req.body;

    const data = {
      logged_user_id,
      book_id,
    };

    const schema = Yup.object().shape({
      logged_user_id: Yup.number().integer().required(),
      book_id: Yup.number().integer().required(),
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const logged_user = await getUserById(logged_user_id);
    if (!logged_user) return res.status(404).json({ errors: { logged_user_id: ['user id not found'] } });

    const book = await getBookById(book_id);
    if (!book) return res.status(404).json({ errors: { book_id: ['book id not found'] } });


    const lendBooksRepository = getRepository(LendBook);
    const lendedBook = await lendBooksRepository.findOne({ 
      where: {
        book,
        to_user: logged_user
      },
      relations: [ 'from_user', 'to_user', 'book' ]
    });

    if (!lendedBook) return res.status(404).send();
    if (lendedBook.returned_at) return res.status(400).json({errors: {book_id: ["book is already returned"]}});

    const currentDate = new Date;
    const updatedLendedBook = lendBooksRepository.merge(lendedBook, { returned_at: currentDate.toISOString() });

    lendBooksRepository.save(updatedLendedBook);

    return res.status(200).json(lendBooksView.render(updatedLendedBook));
  }
}