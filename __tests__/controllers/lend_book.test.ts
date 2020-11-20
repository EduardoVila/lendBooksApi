import supertest from 'supertest';
import { getRepository } from 'typeorm';

import createServer from '../../src/createServer';
import connection from '../../src/database/connection';

import User from '../../src/models/User';
import users_view from '../../src/views/users_view';

import Book from '../../src/models/Book';
import book_view from '../../src/views/books_view';

import LendBook from '../../src/models/LendBook';
import lend_book_view from '../../src/views/lend_books_view';
import LendBookController from '../../src/controllers/LendBookController';

const app = createServer();

describe('lend_book', () => {
  beforeAll(async () => {
    await connection.create();
  });
  
  afterAll(async () => {
    await connection.close();
  });
  
  beforeEach(async () => {
    await connection.clear();
  });

  describe('#lend', () => {
    describe('when the logged user does not exist', () => {
      it('returns an error', async () => {
        const params = { logged_user_id: 999, book_id: 999, to_user_id: 1000 };

        await supertest(app)
        .put('/book/lend')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(404);
          expect(res.body.errors).toMatchObject({logged_user_id: ["user id not found"]});
        });
      });
    });

    describe('when the to_user does not exist', () => {
      let user:User;

      beforeEach( async () => {
        const userRepository = getRepository(User);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user.id, book_id: 999, to_user_id: 1000 };

        await supertest(app)
        .put('/book/lend')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(404);
          expect(res.body.errors).toMatchObject({to_user_id: ["user id not found"]});
        });
      });
    });

    describe('when the book does not exist', () => {
      let user:User;
      let user2:User;

      beforeEach( async () => {
        const userRepository = getRepository(User);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
        user2 = await userRepository.save(userRepository.create({email: 'foo@mail.com', name: 'Foo'}));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user.id, book_id: 999, to_user_id: user2.id };

        await supertest(app)
        .put('/book/lend')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(404);
          expect(res.body.errors).toMatchObject({book_id: ["book id not found"]});
        });
      });
    });

    describe('when pass the corrects params but the book is already lent', () => {
      let user:User;
      let user2:User;
      let book:Book;
      let lendBook:LendBook;

      beforeEach( async () => {
        const userRepository = getRepository(User);
        const bookRepository = getRepository(Book);
        const lendBookRepository = getRepository(LendBook);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
        user2 = await userRepository.save(userRepository.create({email: 'foo@mail.com', name: 'Foo'}));
        book = await bookRepository.save(bookRepository.create({title: 'Foo title', pages: 840, user: user}));
        lendBook = await lendBookRepository.save(lendBookRepository.create({ from_user: user, to_user: user2, book: book }));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user.id, book_id: book.id, to_user_id: user2.id };

        await supertest(app)
        .put('/book/lend')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(400);
          expect(res.body.errors).toMatchObject({book_id: ["book is already lent"]});
        });
      });
    });

    describe('when pass the corrects params', () => {
      let user:User;
      let user2:User;
      let book:Book;

      beforeEach( async () => {
        const userRepository = getRepository(User);
        const bookRepository = getRepository(Book);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
        user2 = await userRepository.save(userRepository.create({email: 'foo@mail.com', name: 'Foo'}));
        book = await bookRepository.save(bookRepository.create({title: 'Foo title', pages: 840, user: user}));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user.id, book_id: book.id, to_user_id: user2.id };

        await supertest(app)
        .put('/book/lend')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(201);
          expect(res.body).toMatchObject({ book_id: book.id, from_user: user.id, to_user: user2.id });
        });
      });
    });
  });

  describe('#return', () => {
    describe('when the logged user does not exist', () => {
      it('returns an error', async () => {
        const params = { logged_user_id: 999, book_id: 999 };

        await supertest(app)
        .put('/book/return')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(404);
          expect(res.body.errors).toMatchObject({logged_user_id: ["user id not found"]});
        });
      });
    });

    describe('when the book does not exist', () => {
      let user:User;

      beforeEach( async () => {
        const userRepository = getRepository(User);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user.id, book_id: 999 };

        await supertest(app)
        .put('/book/return')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(404);
          expect(res.body.errors).toMatchObject({book_id: ["book id not found"]});
        });
      });
    });

    describe('when pass the corrects params but the book are not lent', () => {
      let user:User;
      let book:Book;

      beforeEach( async () => {
        const userRepository = getRepository(User);
        const bookRepository = getRepository(Book);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
        book = await bookRepository.save(bookRepository.create({title: 'Foo title', pages: 840, user: user}));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user.id, book_id: book.id };

        await supertest(app)
        .put('/book/return')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(404);
        });
      });
    });

    describe('when pass the corrects params', () => {
      let user:User;
      let user2:User;
      let book:Book;
      let lentBook:LendBook;

      beforeEach( async () => {
        const userRepository = getRepository(User);
        const bookRepository = getRepository(Book);
        const lendBookRepository = getRepository(LendBook);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
        user2 = await userRepository.save(userRepository.create({email: 'foo@mail.com', name: 'Foo'}));
        book = await bookRepository.save(bookRepository.create({title: 'Foo title', pages: 840, user: user}));

        lentBook = await lendBookRepository.save(lendBookRepository.create({ from_user: user, to_user: user2, book: book }));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user2.id, book_id: book.id };

        await supertest(app)
        .put('/book/return')
        .send(params)
        .then(async res => {
          expect(res.status).toEqual(200);
        });
      });
    });

    describe('when pass the corrects params but the book is already returned', () => {
      let user:User;
      let user2:User;
      let book:Book;

      beforeEach( async () => {
        const userRepository = getRepository(User);
        const bookRepository = getRepository(Book);
        const lendBookRepository = getRepository(LendBook);
        const currentDate = new Date;

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
        user2 = await userRepository.save(userRepository.create({email: 'foo@mail.com', name: 'Foo'}));
        book = await bookRepository.save(bookRepository.create({title: 'Foo title', pages: 840, user: user}));

        await lendBookRepository.save(lendBookRepository.create({ from_user: user, to_user: user2, book: book, returned_at: currentDate.toISOString() }));
      });

      it('returns an error', async () => {
        const params = { logged_user_id: user2.id, book_id: book.id };

        await supertest(app)
        .put('/book/return')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(400);
          expect(res.body.errors).toMatchObject({book_id: ["book is already returned"]});
        });
      });
    });
  });
});