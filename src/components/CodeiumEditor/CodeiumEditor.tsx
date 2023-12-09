"use client";

import React, { useRef } from "react";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

export type CodeiumEditorProps = {
  editorProps: EditorProps;
};

/**
 * Code editor that enables Codeium AI suggestions in the editor.
 */
export const CodeiumEditor: React.FC<CodeiumEditorProps> = ({
  editorProps,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;

    // Pass the editor instance to the user defined onMount prop.
    if (editorProps.onMount) {
      editorProps.onMount(editor, monaco);
    }
  };

  let defaultLanguageProps: EditorProps = {};
  if (!editorProps.defaultLanguage) {
    defaultLanguageProps = {
      defaultLanguage: "javascript",
      defaultValue:
        "// Welcome to Codeium!\n// Press Enter and use Tab to accept AI suggestions. Here's an example:\n\n// Write me a function that adds two numbers.",
    };
  }

  return (
    <Editor
      {...defaultLanguageProps}
      {...editorProps}
      onMount={handleEditorDidMount}
    />
  );
};
