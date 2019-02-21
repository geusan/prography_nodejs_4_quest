import express, { Request, Response } from 'express';
import signale, { Signale } from 'signale';
import { Crawler, IBook } from './Crawler';
import { FileManager } from './FileManager';

const app = express();

const HOST: string = process.env.HOST || '0.0.0.0';
const PORT: number = Number(process.env.PORT) || 3000;

const interactive = new Signale({ interactive: true, scope: 'interactive' });

app.get('/run-crawl', async (req: Request, res: Response) => {
  const maxPage: number = Number(req.query.last) || 5;
  // 크롤러 생성
  const crawler = new Crawler(
    'http://www.kyobobook.co.kr',
  );
  // 파일매니져 생성, 헤더 지정
  const filemanager = new FileManager();
  filemanager.setHeaders(['imgUrl', 'title', 'price', 'score']);
  interactive.info('crawling start!!');
  // 첫번째 페이지 로드
  await crawler.load(
    '/search/SearchCommonMain.jsp', { vPstrCategory: 'TOT', vPstrKeyWord: 'node.js', vPplace: 'top' });

  for (let i = 0; i < maxPage; i += 1) {
    // 페이지 데이터 수집
    const result = await crawler.crawl();
    // 페이지 데이터 저장
    result.forEach((book: IBook) => {
      filemanager.append([book.imgUrl, book.title, book.price || '안팔아', book.score || '없음']);
    });
    interactive.await(`page ${i}/${maxPage} crawled`);
    // 다음 페이지
    await crawler.next();
  }
  interactive.success('all of pages are crawled');

  // 파일로 저장
  filemanager.save();
  res.json({ msg: 'page crawling is ended' });
});

app.get('/list', (_: Request, res: Response) => {
  const fileManager = new FileManager();
  try {
    const result = fileManager.read();
    res.json({
      result: result.content.map((d: any) => ({
        [result.header[0]]: d[0],
        [result.header[1]]: d[1],
        [result.header[2]]: d[2],
        [result.header[3]]: d[3],
      })),
    });
  } catch (e) {
    res.status(412).send('must call /run-crawl first');
  }

});

app.get('*', (_: Request, res: Response) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, HOST, () => {
  signale.info(`server is running on ${PORT}`);
});
