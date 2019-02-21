import axios from 'axios';
import iconv from 'iconv-lite';
import jsdom, {JSDOM} from 'jsdom';
import signale from 'signale';

// 책 정보 구조 정의
export interface IBook {
  imgUrl: string;
  price: string;
  title: string;
  score: string;
}

export class Crawler {
  private baseUrl: string;
  private currentDom: JSDOM;
  private endpoint = '';
  private currentPage = 1;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 엔드포인트를 입력해서 baseUrl의 세부 페이지를 로드
   * @param target endpoint
   */
  public async load(target: string, params: { [key: string]: any }) {
    this.endpoint = target;
    // load context
    const html = await this.get(target, params);
    return this;
  }

  /**
   * 다음 페이지 이동
   */
  public async next() {
    // next context
    const c: any = this.currentDom.window;
    await this.get(this.endpoint, {
      vPplace: 'top',
      vPstartno: this.currentPage * 20,
      vPstrCategory: 'TOT',
      vPstrKeyWord: 'node.js',
    });
    this.currentPage += 1;

    return this;
  }

  /**
   * 현재 페이지 크롤링
   */
  public async crawl(dom?: JSDOM): Promise<IBook[]> {
    // crawl context
    if (!dom && !this.currentDom) { return; }
    const body = (dom || this.currentDom).window.document.body;
    const rows = body.querySelectorAll(`#container > div:nth-child(19) > form > table tr`);
    const results: IBook[] = [];
    rows.forEach((node) => {
      // 이미지 가져오기
      let imgUrl;
      if (node.querySelector('.cover img')) {
        imgUrl = node.querySelector('.cover img').getAttribute('src');
      }
      // 제목 가져오기
      let title;
      if (node.querySelector('.title a')) {
        title = node.querySelector('.title a').textContent
          .replace(/\s{1,}/g, ' ').replace(/,/g, '').trim();
      }
      // 평점 가져오기
      let score;
      if (node.querySelector('.review.klover a')) {
        score = node.querySelector('.review.klover a').textContent
          .replace('Klover', '').replace(/\s{1,}/g, ' ').replace(/,/g, '').trim();
      }
      // 가격 가져오기
      let price;
      if (node.querySelector('.org_price del')) {
        price = node.querySelector('.org_price del').textContent
          .replace(/\s{1,}/g, ' ').replace(/,/g, '').trim();
      }
      results.push({ imgUrl, title, price, score });
    });

    return results;
  }

  public async get(url: string, params: { [key: string]: any }) {
    const res = await await axios.create({ baseURL: this.baseUrl })
      .get(url, {
        params,
        responseType: 'arraybuffer',
      });
    this.currentDom = new JSDOM(iconv.decode(new Buffer(res.data), 'EUC-KR'));
    return res.data;
  }

}
