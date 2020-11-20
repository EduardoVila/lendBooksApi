import { Router } from 'express';

import UsersController from './controllers/UsersController';
import BooksController from './controllers/BooksController';
import LendBooksController from './controllers/LendBookController';

const routes = Router();

routes.post('/users', UsersController.create);
routes.get('/users/:id', UsersController.show);

routes.put('/book/lend', LendBooksController.lend);
routes.put('/book/return', LendBooksController.return);
routes.post('/book', BooksController.create);

export default routes;