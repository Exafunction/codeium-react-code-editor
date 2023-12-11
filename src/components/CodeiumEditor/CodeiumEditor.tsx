"use client";

import React, { useRef } from "react";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { getDefaultValue } from "./defaultValues";

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

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;

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
