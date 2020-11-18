import { Router } from 'express';

import UsersController from './controllers/UsersController';

const routes = Router();

routes.post('/users', UsersController.create);
routes.get('/users/:id', UsersController.show);

export default routes;