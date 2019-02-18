import axios from 'axios';
import jsdom, {JSDOM} from 'jsdom';
import signale from 'signale';

// const interactive = new Signale({ interactive: true, scope: 'interactive' });

export class Crawler {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 엔드포인트를 입력해서 baseUrl의 세부 페이지를 로드
   * @param target endpoint
   */
  public async load(target: string) {
    // load context
  }

  /**
   * 다음 페이지 이동
   */
  public async next() {
    // next context
  }

  /**
   * 현재 페이지 크롤링
   */
  public async crawl() {
    // crawl context
  }

}
