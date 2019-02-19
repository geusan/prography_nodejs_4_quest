import fs from 'fs';
import path from 'path';
import signale from 'signale';

export class FileManager {

  private manager: any;
  private content: string[][];
  private header: string[];
  private readonly FILENAME = 'result.csv';

  constructor() {
    this.manager = '';
    this.content = [];
    this.header = [];

  }

  public setHeaders(header: string[]) {
    this.header = header;
  }

  public append(value: string[]) {
    this.content = [...this.content, [...value]];
  }

  public save(target?: string) {
    fs.writeFileSync(path.join(__dirname, target || this.FILENAME), this.csv());
  }

  public read(target?: string) {
    const csv = fs.readFileSync(path.join(__dirname, target || this.FILENAME))
      .toString().split('\n').map((d: string) => d.split(','));
    return {
      content: csv.slice(1),
      header: csv[0],
    };
  }

  private csv(): string {
    return [this.header, ...this.content]
      .map((row: string[]): string => row.join(','))
      .join('\n');
  }

}
