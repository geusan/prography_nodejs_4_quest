import express from 'express';
import signale from 'signale';

const app = express();

const HOST: string = process.env.HOST || '0.0.0.0';
const PORT: number = Number(process.env.PORT) || 3000;

app.get('/run-crawl', (req, res) => {
  res.json({ msg: 'hello' });
});

app.get('/list', (req, res) => {
  res.json({ msg: 'hello' });
});

app.listen(PORT, HOST, () => {
  signale.info(`server is running on ${PORT}`);
});
