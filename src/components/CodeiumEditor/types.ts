import {
  Completion,
  CompletionSource,
} from "../../api/proto/exa/codeium_common_pb/codeium_common_pb";
import { Language } from "../../models";

export type CompletionAndRange = {
  completion: Completion;
  range: Range;
};

export type CompletionDetailsWrapper = {
  index: number;
  document: Document;
  completion: Completion;
  annotatedCompletionLines: string[];
  prompt: string;
};

export type CompletionsAndMetadata = {
  completions: Completion[];
  source: CompletionSource;
  latencyMs: number;
  promptId: string;
  timestamp: number;
};

export type Document = {
  /**
   * The absolute path of the document.
   */
  absolutePath: string;

  /**
   * The document content.
   */
  text: string;

  /**
   * Language of the document.
   */
  language: Language;
};
