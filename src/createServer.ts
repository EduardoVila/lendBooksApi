import errorHandler from './errors/handler';
import 'express-async-errors';
import cors from 'cors';

import express from 'express';
import routes from './routes';

export default function createServer() {
	const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use(routes);
  app.use(errorHandler);
  
  return app
};