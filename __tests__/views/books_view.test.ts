import { getRepository } from 'typeorm';

import connection from '../../src/database/connection';

import Book from '../../src/models/Book';
import User from '../../src/models/User';
import books_view from '../../src/views/books_view';

describe('book_view', () => {
  let book:Book;

  beforeAll(async () => {
    await connection.create();

    const bookRepository = getRepository(Book);
    const userRepository = getRepository(User);
    
    const user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));

    book = await bookRepository.save(bookRepository.create({title: 'The Brothers Karamazov', pages: 840, user: user }));
  });
  
  afterAll(async () => {
    await connection.close();
  });
  
  beforeEach(async () => {
    await connection.clear();
  });

  describe('render', () => {
    it ('return the corrects informations', () => {
      const bookRender = books_view.render(book);

      expect(bookRender).toHaveProperty('id');
      expect(bookRender.id).toEqual(book.id);

      expect(bookRender).toHaveProperty('title');
      expect(bookRender.title).toEqual(book.title);

      expect(bookRender).toHaveProperty('pages');
      expect(bookRender.pages).toEqual(book.pages);

      expect(bookRender).toHaveProperty('created_at');
      expect(bookRender.created_at).toEqual(book.created_at);
    });
  });

  describe('renderMany', () => {
    it ('return the corrects informations', () => {
      const bookRender = books_view.renderMany([book]);

      expect(bookRender[0]).toHaveProperty('id');
      expect(bookRender[0].id).toEqual(book.id);

      expect(bookRender[0]).toHaveProperty('title');
      expect(bookRender[0].title).toEqual(book.title);

      expect(bookRender[0]).toHaveProperty('pages');
      expect(bookRender[0].pages).toEqual(book.pages);

      expect(bookRender[0]).toHaveProperty('created_at');
      expect(bookRender[0].created_at).toEqual(book.created_at);
    });
  });
});