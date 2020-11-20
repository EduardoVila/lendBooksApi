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

const app = createServer();

describe('users', () => {
  beforeAll(async () => {
    await connection.create();
  });
  
  afterAll(async () => {
    await connection.close();
  });
  
  beforeEach(async () => {
    await connection.clear();
  });

  describe('#create', () => {
    describe('when does not pass the name', () => {
      const params = { email: 'eduardo@mail.com' };

      it('returns an error', async () => {
        await supertest(app)
        .post('/users')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(400);
          expect(res.body.errors).toMatchObject({name: ["name is a required field"]});
        });
      });
    });

    describe('when does not pass the email', () => {
      const params = { name: 'Eduardo de Vila' };

      it('returns an error', async () => {
        await supertest(app)
        .post('/users')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(400);
          expect(res.body.errors).toMatchObject({email: ["email is a required field"]});
        });
      });
    });

    describe('when pass a wrong email', () => {
      const params = { email: 'eduardo', name: 'Eduardo de Vila' };

      it('returns an error', async () => {
        await supertest(app)
        .post('/users')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(400);
          expect(res.body.errors).toMatchObject({email: ["email must be a valid email"]});
        });
      });
    });

    describe('when pass an existent email', () => {
      const params = { email: 'eduardo@mail.com', name: 'Eduardo de Vila' };

      beforeEach( async () => {
        const userRepository = getRepository(User);

        const user = userRepository.create(params);

        await userRepository.save(user);
      });

      it('returns an error', async () => {
        await supertest(app)
        .post('/users')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(400);
          expect(res.body.errors).toMatchObject({email: ["email already in use"]});
        });
      });
    });

    describe('when pass the corrects params', () => {
      const params = { email: 'eduardo@mail.com', name: 'Eduardo de Vila' };

      it('creates the user', async () => {
        await supertest(app)
        .post('/users')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(201);
          expect(res.body).toMatchObject(params);
        });
      });
    });
  });

  describe('#show', () => {
    describe('when pass the id of an existent user', () => {
      let user:User;

      beforeEach( async () => {
        const userRepository = getRepository(User);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
      });

      describe('when the user has neither a book nor borrowed a book', () => {
        it('returns the correct user informations', async () => {
          await supertest(app)
          .get(`/users/${user.id}`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.collection).toHaveLength(0);
            expect(res.body.lent_books).toHaveLength(0);
            expect(res.body.borrowed_books).toHaveLength(0);
            expect(JSON.stringify(res.body)).toEqual(JSON.stringify(users_view.render(user)));
          });
        });
      });

      describe('when the user has a book', () => {
        let book:Book;

        beforeEach( async () => {
          const bookRepository = getRepository(Book);

          book = await bookRepository.save(bookRepository.create({title: 'Foo title', pages: 840, user: user}));
        });

        it('returns the user with the book in your collection', async () => {
          await supertest(app)
          .get(`/users/${user.id}`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.collection).toHaveLength(1);
            expect(JSON.stringify(res.body.collection)).toEqual(JSON.stringify(book_view.renderMany([book])));
          });
        });
      });

      describe('when the user lent a book', () => {
        let book:Book;
        let lentBook:LendBook;
        let user2:User;

        beforeEach( async () => {
          const bookRepository = getRepository(Book);
          const lendBookRepository = getRepository(LendBook);
          const userRepository = getRepository(User);
          
          user2 = await userRepository.save(userRepository.create({ email: 'foo@mail.com', name: 'Foo' }));
          book = await bookRepository.save(bookRepository.create({ title: 'Foo title', pages: 840, user: user }));
          lentBook = await lendBookRepository.save(lendBookRepository.create({ from_user: user, book: book, to_user: user2 }))
        });

        it('returns the user with the book in your collection and in the lent books', async () => {
          await supertest(app)
          .get(`/users/${user.id}`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.collection).toHaveLength(1);
            expect(JSON.stringify(res.body.collection)).toEqual(JSON.stringify(book_view.renderMany([book])));
            expect(res.body.lent_books).toHaveLength(1);
            expect(JSON.stringify(res.body.lent_books)).toEqual(JSON.stringify(lend_book_view.renderMany([lentBook])))
          });
        });
      });

      describe('when the user borrowed a book', () => {
        let book:Book;
        let lentBook:LendBook;
        let user2:User;

        beforeEach( async () => {
          const bookRepository = getRepository(Book);
          const lendBookRepository = getRepository(LendBook);
          const userRepository = getRepository(User);
          
          user2 = await userRepository.save(userRepository.create({ email: 'foo@mail.com', name: 'Foo' }));
          book = await bookRepository.save(bookRepository.create({ title: 'Foo title', pages: 840, user: user2 }));
          lentBook = await lendBookRepository.save(lendBookRepository.create({ from_user: user2, book: book, to_user: user }))
        });

        it('returns the user with the book in your collection and in the lent books', async () => {
          await supertest(app)
          .get(`/users/${user.id}`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.borrowed_books).toHaveLength(1);
            expect(JSON.stringify(res.body.borrowed_books)).toEqual(JSON.stringify(lend_book_view.renderMany([lentBook])))
          });
        });
      });

      describe('when pass a id that does not pertence to any user', () => {
        it('returns an error', async () => {
          await supertest(app)
          .get('/users/9999')
          .then(res => {
            expect(res.status).toEqual(404);
          });
        });
      });
    });
  });
});