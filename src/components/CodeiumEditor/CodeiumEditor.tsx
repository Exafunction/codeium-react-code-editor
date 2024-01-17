"use client";

import React, { useRef, useState } from "react";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";
import { Status } from "./Status";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { getDefaultValue } from "./defaultValues";

import { LanguageServerService } from "../../api/proto/exa/language_server_pb/language_server_connect";
import { InlineCompletionProvider } from "./InlineCompletionProvider";
import { CodeiumLogo } from "../CodeiumLogo/CodeiumLogo";

interface CodeiumEditorProps extends EditorProps {
  language: string;
}

/**
 * Code editor that enables Codeium AI suggestions in the editor.
 */
export const CodeiumEditor: React.FC<CodeiumEditorProps> = (props) => {
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
    if (props.onMount) {
      props.onMount(editor, monaco);
    }
  };

  let defaultLanguageProps: EditorProps = {
    defaultLanguage: props.language,
    defaultValue: getDefaultValue(props.language),
  };

  return (
    <div style={{
      width: props.width,
      height: props.height
    }}>
      <a href="https://codeium.com?referrer=codeium-editor">
        <CodeiumLogo
          width={30}
          height={30}
          style={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
        />
      </a>
      <Editor
        {...defaultLanguageProps}
        {...props}
        onMount={handleEditorDidMount}
        options={{
          scrollBeyondLastColumn: 0,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
            vertical: "hidden",
          },
          codeLens: false,
          // for resizing, but apparently might have "severe performance impact"
          // automaticLayout: true,
          minimap: {
            enabled: false,
          },
          quickSuggestions: false,
          folding: false,
          foldingHighlight: false,
          foldingImportsByDefault: false,
          links: false,
          fontSize: 14,
          wordWrap: "on",
          ...props.options
        }}
      />
    </div>
  );
};
