import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { Dispatch, SetStateAction } from "react";
import { PromiseClient } from "@connectrpc/connect";
import { Status } from "./Status";
import { MonacoCompletionProvider } from "./CompletionProvider";
import { LanguageServerService } from "../../api/proto/exa/language_server_pb/language_server_connect";
import MonacoInlineCompletion from "./InlineCompletion";

declare module "monaco-editor" {
  namespace editor {
    interface ICodeEditor {
      _commandService: { executeCommand(command: string): unknown };
    }
  }
}

export class InlineCompletionProvider
  implements
    monaco.languages.InlineCompletionsProvider<
      monaco.languages.InlineCompletions<MonacoInlineCompletion>
    >
{
  private numCompletionsProvided: number;
  readonly completionProvider: MonacoCompletionProvider;
  constructor(
    grpcClient: PromiseClient<typeof LanguageServerService>,
    readonly setCompletionCount: Dispatch<SetStateAction<number>>,
    setCodeiumStatus: Dispatch<SetStateAction<Status>>,
    setCodeiumStatusMessage: Dispatch<SetStateAction<string>>
  ) {
    this.numCompletionsProvided = 0;
    this.completionProvider = new MonacoCompletionProvider(
      grpcClient,
      setCodeiumStatus,
      setCodeiumStatusMessage
    );
  }

  freeInlineCompletions() {
    // nothing
  }

  async provideInlineCompletions(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.InlineCompletionContext,
    token: monaco.CancellationToken
  ) {
    const completions = await this.completionProvider.provideInlineCompletions(
      model,
      position,
      token
    );
    // Only count completions provided if non-empty (i.e. exclude cancelled
    // requests).
    // TODO(nick): don't count cached results either.
    // TODO(nick): better distinguish warning and error states.
    if (completions) {
      this.numCompletionsProvided += 1;
      this.setCompletionCount(this.numCompletionsProvided);
    }
    return completions;
  }

  public acceptedLastCompletion(completionId: string) {
    this.completionProvider.acceptedLastCompletion(completionId);
  }
}
