import * as http from 'http';
import 'reflect-metadata';
import app from './application';


const PORT = 1337;

const server = http.createServer(app.instance);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
