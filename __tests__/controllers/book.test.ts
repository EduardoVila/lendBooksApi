import supertest from 'supertest';
import { getRepository } from 'typeorm';

import createServer from '../../src/createServer';
import connection from '../../src/database/connection';

import User from '../../src/models/User';

const app = createServer();

describe('books', () => {
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
    describe('when the user passed does not exist', () => {
      const params = { title: 'The Brothers Karamazov', pages: 840, logged_user_id: 999 };

      it('returns an error', async () => {
        await supertest(app)
        .post('/book')
        .send(params)
        .then(res => {
          expect(res.status).toEqual(404);
        });
      });
    });

    describe('when the user passed exist', () => {
      let user:User;

      beforeEach( async () => {
        const userRepository = getRepository(User);

        user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
      });

      describe('when does not pass the title', () => {
        it('returns an error', async () => {  
          const params = { pages: 840, logged_user_id: user.id };

          await supertest(app)
          .post('/book')
          .send(params)
          .then(res => {
            expect(res.status).toEqual(400);
            expect(res.body.errors).toMatchObject({title: ["title is a required field"]});
          });
        });
      });

      describe('when does not pass the pages', () => {
        it('returns an error', async () => {
          const params = { title: 'The Brothers Karamazov', logged_user_id: user.id };

          await supertest(app)
          .post('/book')
          .send(params)
          .then(res => {
            expect(res.status).toEqual(400);
            expect(res.body.errors).toMatchObject({pages: ["pages is a required field"]});
          });
        });
      });

      describe('when pass the corrects params', () => {
        it('creates the user', async () => {
          const params = { title: 'The Brothers Karamazov', pages: 840, logged_user_id: user.id };

          await supertest(app)
          .post('/book')
          .send(params)
          .then(res => {
            expect(res.status).toEqual(201);
            expect(res.body).toEqual(expect.objectContaining({ title: 'The Brothers Karamazov', pages: 840 }));
          });
        });
      });
    });
  });
});