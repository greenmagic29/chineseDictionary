import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { StarDictModel } from './model/stardict';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.get('/word', async (req: Request, res: Response) => {
  const word: any = req.query.text ?? "word";
  //const results = await db(`select * from stardict where "word" = @Name`, {'@Name': 'hello'});
  const results = await StarDictModel.getStarDictByWord(word);
  return res.json({ word: results?.[0] ?? {} })
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});