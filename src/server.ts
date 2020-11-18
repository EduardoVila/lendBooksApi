import createServer from './createServer';
import connection from './database/connection';

connection.create();

const app = createServer();

app.listen(3333);