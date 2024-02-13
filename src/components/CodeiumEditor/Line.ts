import { Range } from './Location';

export class Line {
  readonly text: string;
  readonly range: Range;

  constructor(text: string, range: Range) {
    this.text = text;
    this.range = range;
  }
}
