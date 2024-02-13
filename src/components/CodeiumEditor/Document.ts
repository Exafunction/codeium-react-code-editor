import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { Position, Range } from './Location';
import { Line } from './Line';

export class Document {
  private model: monaco.editor.ITextModel;

  readonly uri: monaco.Uri;
  readonly languageId: string;

  constructor(model: monaco.editor.ITextModel) {
    this.model = model;
    this.uri = model.uri;
    this.languageId = model.getLanguageId();
  }

  public get lineCount(): number {
    return this.model.getLineCount();
  }

  public lineAt(positionOrLine: Position | number): Line {
    if (typeof positionOrLine !== 'number') {
      positionOrLine = positionOrLine.line;
    }
    return new Line(
      this.model.getLineContent(positionOrLine + 1),
      new Range(
        new Position(positionOrLine, 0),
        new Position(
          positionOrLine,
          this.model.getLineLength(positionOrLine + 1),
        ),
      ),
    );
  }

  public offsetAt(position: Position): number {
    return this.model.getOffsetAt(Position.fromPosition(position));
  }

  public positionAt(offset: number): Position {
    return Position.fromMonaco(this.model.getPositionAt(offset));
  }

  public getText(range?: Range): string {
    if (!range) {
      return this.model.getValue();
    }
    return this.model.getValueInRange(Range.fromRange(range));
  }
}
