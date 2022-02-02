import 'reflect-metadata';

import app from './application';
import * as http from 'http';

const PORT = 1337;

const server = http.createServer(app.instance);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
