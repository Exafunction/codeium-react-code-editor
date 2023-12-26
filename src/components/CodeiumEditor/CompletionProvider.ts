import { Code, ConnectError, PromiseClient } from "@connectrpc/connect";
import { CancellationToken } from "./CancellationToken";
import {
  Document as DocumentInfo,
  GetCompletionsResponse,
  CompletionItem,
} from "../../api/proto/exa/language_server_pb/language_server_pb";
import { Document } from "./Document";
import { Position, Range } from "./Location";
import {
  numUtf8BytesToNumCodeUnits,
  numCodeUnitsToNumUtf8Bytes,
} from "../../utils/utf";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { LanguageServerService } from "../../api/proto/exa/language_server_pb/language_server_connect";
import {
  Language,
  Metadata,
} from "../../api/proto/exa/codeium_common_pb/codeium_common_pb";
import { Status } from "./Status";
import { uuid } from "../../utils/uuid";
import MonacoInlineCompletion from "./InlineCompletion";

/**
 * CompletionProvider class for Codeium.
 */
export class MonacoCompletionProvider {
  authHeader: Record<string, string> = {};
  private metadata: Metadata;
  private client: PromiseClient<typeof LanguageServerService>;

  constructor(
    grpcClient: PromiseClient<typeof LanguageServerService>,
    readonly setStatus: (status: Status) => void,
    readonly setMessage: (message: string) => void
  ) {
    this.metadata = new Metadata({
      ideName: "playground",
      ideVersion: "playground",
      extensionName: "playground",
      extensionVersion: "monaco",
      apiKey: "a8a4a691-8432-41c0-b6c8-5b86997aa623", // PLAYGROUND_API_KEY
      sessionId: `demo-${uuid()}`,
    });
    this.client = grpcClient;
    const Authorization = `Basic ${this.metadata.apiKey}-${this.metadata.sessionId}`;
    this.authHeader = { Authorization };
  }

  /**
   * Generate CompletionAndRanges.
   *
   * @param model - Monaco model.
   * @param token - Cancellation token.
   * @returns InlineCompletions or undefined
   */
  public async provideInlineCompletions(
    model: monaco.editor.ITextModel,
    monacoPosition: monaco.Position,
    token: CancellationToken
  ): Promise<
    monaco.languages.InlineCompletions<MonacoInlineCompletion> | undefined
  > {
    const document = new Document(model);
    const position = Position.fromMonaco(monacoPosition);

    // Pre-register cancellation callback to get around bug in Monaco cancellation tokens breaking
    // after await.
    token.onCancellationRequested(() => token.cancellationCallback?.());

    const abortController = new AbortController();
    token.onCancellationRequested(() => {
      abortController.abort();
    });
    const signal = abortController.signal;

    this.setStatus(Status.PROCESSING);
    this.setMessage("Generating completions...");

    const documentInfo = this.getDocumentInfo(document, position);
    const editorOptions = {
      tabSize: BigInt(model.getOptions().tabSize),
      insertSpaces: model.getOptions().insertSpaces,
    };

    // Get completions.
    let getCompletionsResponse: GetCompletionsResponse;
    try {
      getCompletionsResponse = await this.client.getCompletions(
        {
          metadata: this.metadata,
          document: documentInfo,
          editorOptions: editorOptions,
        },
        {
          signal,
          headers: this.authHeader,
        }
      );
    } catch (err) {
      // Handle cancellation.
      if (err instanceof ConnectError && err.code === Code.Canceled) {
        // cancelled
      } else {
        this.setStatus(Status.ERROR);
        this.setMessage("Something went wrong; please try again.");
      }
      return undefined;
    }
    if (!getCompletionsResponse.completionItems) {
      // TODO(nick): Distinguish warning / error states here.
      const message = " No completions were generated";
      this.setStatus(Status.SUCCESS);
      this.setMessage(message);
      return undefined;
    }
    const completionItems = getCompletionsResponse.completionItems;

    // Create inline completion items from completions.
    const inlineCompletionItems = completionItems
      .map((completionItem) =>
        this.createInlineCompletionItem(completionItem, document)
      )
      .filter(
        (item?: MonacoInlineCompletion): item is MonacoInlineCompletion =>
          !!item
      );

    this.setStatus(Status.SUCCESS);
    let message = `Generated ${inlineCompletionItems.length} completions`;
    if (inlineCompletionItems.length === 1) {
      message = `Generated 1 completion`;
    }
    this.setMessage(message);

    return {
      items: inlineCompletionItems,
    };
  }

  /**
   * Record that the last completion shown was accepted by the user.
   * @param ctx - Codeium context
   * @param completionId - unique ID of the last completion.
   */
  public acceptedLastCompletion(completionId: string) {
    try {
      this.client.acceptCompletion(
        {
          metadata: this.metadata,
          completionId: completionId,
        },
        {
          headers: this.authHeader,
        }
      );
    } catch (err) {
      // Swallow the error.
      console.log(err);
    }
  }

  /**
   * Gets document info object for the given document.
   *
   * @param document - The document to get info for.
   * @param position - Optional position used to get offset in document.
   * @returns The document info object and additional UTF-8 byte offset.
   */
  private getDocumentInfo(
    document: Document,
    position: Position
  ): DocumentInfo {
    // The offset is measured in bytes.
    const text = document.getText();
    const numCodeUnits = document.offsetAt(position);
    const offset = numCodeUnitsToNumUtf8Bytes(text, numCodeUnits);

    const documentInfo = new DocumentInfo({
      text: text,
      editorLanguage: document.languageId,
      language: Language.PYTHON,
      cursorOffset: BigInt(offset),
      lineEnding: "\n",
    });

    return documentInfo;
  }

  /**
   * Converts the completion and range to inline completion item.
   *
   * @param completionItem
   * @param document
   * @returns Inline completion item.
   */
  private createInlineCompletionItem(
    completionItem: CompletionItem,
    document: Document
  ): MonacoInlineCompletion | undefined {
    if (!completionItem.completion || !completionItem.range) {
      return undefined;
    }

    // Create and return inlineCompletionItem.
    const text = document.getText();
    const startPosition = document.positionAt(
      numUtf8BytesToNumCodeUnits(text, Number(completionItem.range.startOffset))
    );
    const endPosition = document.positionAt(
      numUtf8BytesToNumCodeUnits(text, Number(completionItem.range.endOffset))
    );
    const range = new Range(startPosition, endPosition);

    const inlineCompletionItem = new MonacoInlineCompletion(
      completionItem.completion.text,
      range,
      completionItem.completion.completionId
    );
    return inlineCompletionItem;
  }
}
