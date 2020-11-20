import { getRepository } from 'typeorm';

import connection from '../../src/database/connection';

import Book from '../../src/models/Book';
import User from '../../src/models/User';
import LendBook from '../../src/models/LendBook';
import lend_books_view from '../../src/views/lend_books_view';

describe('lend_book_view', () => {
  let lendBook:LendBook;

  beforeAll(async () => {
    await connection.create();

    const bookRepository = getRepository(Book);
    const userRepository = getRepository(User);
    const lendBookRepository = getRepository(LendBook);
    
    const user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
    const user2 = await userRepository.save(userRepository.create({email: 'foo@mail.com', name: 'Foo'}));
    const book = await bookRepository.save(bookRepository.create({ title: 'Foo title', pages: 840, user: user }));

    lendBook = await lendBookRepository.save(lendBookRepository.create({ from_user: user, to_user: user2, book: book }));
  });
  
  afterAll(async () => {
    await connection.close();
  });
  
  beforeEach(async () => {
    await connection.clear();
  });

  describe('render', () => {
    it ('return the corrects informations', () => {
      const lendBookRender = lend_books_view.render(lendBook);

      expect(lendBookRender).toHaveProperty('from_user');
      expect(lendBookRender.from_user).toEqual(lendBook.from_user.id);

      expect(lendBookRender).toHaveProperty('to_user');
      expect(lendBookRender.to_user).toEqual(lendBook.to_user.id);

      expect(lendBookRender).toHaveProperty('lent_at');
      expect(lendBookRender.lent_at).toEqual(lendBook.lent_at);

      expect(lendBookRender).toHaveProperty('returned_at');
      expect(lendBookRender.returned_at).toBeUndefined;
    });
  });

  describe('renderMany', () => {
    it ('return the corrects informations', () => {
      const lendBookRenderMany = lend_books_view.renderMany([lendBook]);

      expect(lendBookRenderMany[0]).toHaveProperty('from_user');
      expect(lendBookRenderMany[0].from_user).toEqual(lendBook.from_user.id);

      expect(lendBookRenderMany[0]).toHaveProperty('to_user');
      expect(lendBookRenderMany[0].to_user).toEqual(lendBook.to_user.id);

      expect(lendBookRenderMany[0]).toHaveProperty('lent_at');
      expect(lendBookRenderMany[0].lent_at).toEqual(lendBook.lent_at);

      expect(lendBookRenderMany[0]).toHaveProperty('returned_at');
      expect(lendBookRenderMany[0].returned_at).toBeUndefined;
    });
  });
});