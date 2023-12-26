import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export default class MonacoInlineCompletion
  implements monaco.languages.InlineCompletion
{
  readonly insertText: string;
  // TODO(prem): Why is this property needed?
  readonly text: string;
  readonly range: monaco.IRange;
  readonly command: {
    id: string;
    title: string;
    arguments: string[];
  };

  constructor(insertText: string, range: monaco.IRange, completionId: string) {
    this.insertText = insertText;
    this.text = insertText;
    this.range = range;
    this.command = {
      id: "codeium.acceptCompletion",
      title: "Accept Completion",
      arguments: [completionId, insertText],
    };
  }
}
