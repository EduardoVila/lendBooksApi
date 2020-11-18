import supertest from 'supertest';
import { getRepository } from 'typeorm';

import createServer from '../../src/createServer';
import connection from '../../src/database/connection';

import User from '../../src/models/User';
import users_view from '../../src/views/users_view';

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

      it('returns the correct user informations', async () => {
        await supertest(app)
        .get(`/users/${user.id}`)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(users_view.render(user));
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
    })
  });
});