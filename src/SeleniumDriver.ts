import qs from 'qs';
import { Builder, WebDriver } from 'selenium-webdriver';
import signale from 'signale';

export class SeleniumDriver {
  private driver: WebDriver;
  constructor() {
    this.driver = new Builder()
      .forBrowser('firefox')
      .build();
  }
  public async get(url: string, params: { [key: string]: any }) {
    await this.driver.get(url + '?' + qs.stringify(params));
    return this.driver.getPageSource();
  }

  public quit() {
    this.driver.close();
  }
}
