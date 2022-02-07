import * as http from 'http';
import 'reflect-metadata';
import app from './application';
import mainDb from './db/db';


const PORT = 3000;

const server = http.createServer(app.instance);

mainDb.prepare();

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
