"use client";

import React, { useRef, useState } from "react";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createPromiseClient, PromiseClient } from "@connectrpc/connect";
import { Status } from "./Status";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { getDefaultValue } from "./defaultValues";
import { LanguageServerService } from "../../api/proto/exa/language_server_pb/language_server_connect";
import { InlineCompletionProvider } from "./InlineCompletionProvider";

export type CodeiumEditorProps = {
  language?: string;
  width: string | number;
  height: string | number;
  onMount?: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
};

/**
 * Code editor that enables Codeium AI suggestions in the editor.
 */
export const CodeiumEditor: React.FC<CodeiumEditorProps> = ({
  language = "python",
  width,
  height,
  onMount,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const inlineCompletionsProviderRef = useRef<InlineCompletionProvider | null>(
    null
  );
  const [completionCount, setCompletionCount] = useState(0);
  const [codeiumStatus, setCodeiumStatus] = useState(Status.INACTIVE);
  const [codeiumStatusMessage, setCodeiumStatusMessage] = useState("");

  const handleEditorDidMount = async (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    const transport = createConnectTransport({
      baseUrl: "https://web-backend.codeium.com",
      useBinaryFormat: true,
    });
    const grpcClient = createPromiseClient(LanguageServerService, transport);

    inlineCompletionsProviderRef.current = new InlineCompletionProvider(
      grpcClient,
      setCompletionCount,
      setCodeiumStatus,
      setCodeiumStatusMessage
    );

    monaco.languages.registerInlineCompletionsProvider(
      { pattern: "**" },
      inlineCompletionsProviderRef.current
    );
    monaco.editor.registerCommand(
      "codeium.acceptCompletion",
      (_: unknown, completionId: string, insertText: string) => {
        inlineCompletionsProviderRef.current?.acceptedLastCompletion(
          completionId
        );
      }
    );

    // CORS pre-flight cache optimization.
    try {
      await grpcClient.getCompletions({});
    } catch (e) {
      // This is expected.
    }

    // Pass the editor instance to the user defined onMount prop.
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  let defaultLanguageProps: EditorProps = {
    defaultLanguage: language,
    defaultValue: getDefaultValue(language),
  };

  return (
    <Editor
      {...defaultLanguageProps}
      width={width}
      height={height}
      language={language}
      onMount={handleEditorDidMount}
    />
  );
};
