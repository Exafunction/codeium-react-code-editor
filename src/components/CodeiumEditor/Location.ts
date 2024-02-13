import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export class Position implements monaco.IPosition {
  readonly line: number;
  readonly character: number;

  // monaco.IPosition fields.
  readonly lineNumber: number;
  readonly column: number;

  constructor(line: number, character: number) {
    this.line = line;
    this.character = character;

    this.lineNumber = line + 1;
    this.column = character + 1;
  }

  static fromMonaco(position: monaco.Position): Position {
    return new Position(position.lineNumber - 1, position.column - 1);
  }

  static fromPosition(position: Position): Position {
    return new Position(position.line, position.character);
  }
}

export class Range implements monaco.IRange {
  readonly start: Position;
  readonly end: Position;

  // monaco.IRange fields.
  readonly startLineNumber: number;
  readonly startColumn: number;
  readonly endLineNumber: number;
  readonly endColumn: number;

  constructor(start: Position, end: Position) {
    this.start = start;
    this.end = end;

    this.startLineNumber = start.line + 1;
    this.startColumn = start.character + 1;
    this.endLineNumber = end.line + 1;
    this.endColumn = end.character + 1;
  }

  static fromMonaco(range: monaco.IRange): Range {
    return new Range(
      new Position(range.startLineNumber - 1, range.startColumn - 1),
      new Position(range.endLineNumber - 1, range.endColumn - 1),
    );
  }

  static fromRange(range: Range): Range {
    return new Range(range.start, range.end);
  }
}

export class LocationFactory {
  position(line: number, character: number): Position {
    return new Position(line, character) as Position;
  }
  range(start: Position, end: Position): Range {
    return new Range(start, end) as Range;
  }
}
