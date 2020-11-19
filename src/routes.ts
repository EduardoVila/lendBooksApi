import { Router } from 'express';

import UsersController from './controllers/UsersController';
import BooksController from './controllers/BooksController';

const routes = Router();

routes.post('/users', UsersController.create);
routes.get('/users/:id', UsersController.show);

routes.post('/book', BooksController.create);

export default routes;