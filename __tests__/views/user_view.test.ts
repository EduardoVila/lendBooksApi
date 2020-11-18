import { getRepository } from 'typeorm';

import connection from '../../src/database/connection';

import User from '../../src/models/User';
import users_view from '../../src/views/users_view';

describe('user_view', () => {
  let user:User;

  beforeAll(async () => {
    await connection.create();

    const userRepository = getRepository(User);

    user = await userRepository.save(userRepository.create({email: 'eduardo@mail.com', name: 'Eduardo de Vila'}));
  });
  
  afterAll(async () => {
    await connection.close();
  });
  
  beforeEach(async () => {
    await connection.clear();
  });

  describe('render', () => {
    it ('return the corrects informations', () => {
      const userRender = users_view.render(user);

      expect(userRender).toHaveProperty('id');
      expect(userRender.id).toEqual(user.id);

      expect(userRender).toHaveProperty('name');
      expect(userRender.name).toEqual(user.name);

      expect(userRender).toHaveProperty('email');
      expect(userRender.email).toEqual(user.email);
    });
  })
});