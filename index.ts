import express from 'express';
const app = express();
const PORT = 1337;
app.get('/', (req, res)=> res.send('Express + Typescript FTW!'));
app.listen(PORT, () => {
  console.log(`Yup, server rodando bala em http://localhost:${PORT}`);
});
