import axios from 'axios';
import jsdom, {JSDOM} from 'jsdom';
import signale from 'signale';

// const interactive = new Signale({ interactive: true, scope: 'interactive' });

export class Crawler {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

}
