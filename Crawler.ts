import axios from 'axios';
import jsdom, {JSDOM} from 'jsdom';
import signale from 'signale';

export interface IBook {
  imgUrl: string;
  price: string;
  title: string;
  score: string;
}
// const interactive = new Signale({ interactive: true, scope: 'interactive' });
export class Crawler {
  private baseUrl: string;
  private currentDom: JSDOM;
  private virtualConsole: jsdom.VirtualConsole;
  private currentPage = 1;
  private cnt = 0;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 엔드포인트를 입력해서 baseUrl의 세부 페이지를 로드
   * @param target endpoint
   */
  public async load(target: string, params: { [key: string]: any }) {
    // load context
    const html = await axios.create({ baseURL: this.baseUrl }).get(target, { params });
    this.virtualConsole = new jsdom.VirtualConsole();
    this.currentDom = new JSDOM(html.data, { virtualConsole: this.virtualConsole });
    this.virtualConsole.sendTo(console);
    const c: any = this.currentDom.window;
    for (const node of c.searchFrm.children) {
      // signale.log(node.name, node.value);
    }
    signale.log(c.searchFrm.action);
    return this;
  }

  /**
   * 다음 페이지 이동
   */
  public async next() {
    // next context
    const c: any = this.currentDom.window;
    const html = await axios.create({ baseURL: this.baseUrl })
      .get(
        '/search/SearchCommonMain.jsp',
         {
           params: {
            vPplace: 'top',
            vPstartno: this.currentPage * 20,
            vPstrCategory: 'TOT',
            vPstrKeyWord: 'node.js',
            },
          },
        );
    // signale.log('new dom', html.data);
    this.currentDom = new JSDOM(html.data);
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
    const rows = body.querySelectorAll(`#container > div:nth-child(19) > form > table > tbody > tr`);
    const results: IBook[] = [];
    rows.forEach((node) => {
      let imgUrl;
      if (node.children[0].querySelector('div.cover img')) {
        imgUrl = node.children[0].querySelector('div.cover img').getAttribute('src');
      }
      let title;
      if (node.children[1].querySelector('div.title a')) {
        title = node.children[1].querySelector('div.title a').textContent
          .replace(/\s{1,}/g, ' ').trim();
      }
      let score;
      if (node.children[2].querySelector('div.review.klover a')) {
        score = node.children[2].querySelector('div.review.klover a').textContent
          .replace('Klover', '').replace(/\s{1,}/g, ' ').trim();
      }
      let price;
      if (node.children[3].querySelector('div.org_price del')) {
        price = node.children[3].querySelector('div.org_price del').textContent
          .replace(/\s{1,}/g, ' ').trim();
      }
      results.push({ imgUrl, title, price, score });
      this.cnt += 1;
      signale.log('crawl cnt ', this.cnt, title);
    });

    return results;
  }

}
