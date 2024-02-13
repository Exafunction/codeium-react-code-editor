import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { CodeiumEditor } from '../components';
import { Document, Language } from '../models';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof CodeiumEditor> = {
  title: 'Example/Editor',
  component: CodeiumEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
} satisfies Meta<typeof CodeiumEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseParams = {
  width: '700px',
  height: '500px',
};

const PYTHON_SNIPPET = `# Need inspiration? Try adding extra constraints or context to this parse json function!
# Or scratch everything and use your imagination.

def parse_json_lines(filename: str) -> List[Any]:
    output = []
    with open(filename, "r", encoding="utf-8") as f:
`;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const PythonEditor: Story = {
  args: {
    ...baseParams,
    language: 'python',
    value: PYTHON_SNIPPET,
  },
};

const JAVASCRIPT_SNIPPET = `
// Need inspiration? Try common JavaScript utilities like debounce,
// date validation, or number to currency!

// Convert HTML string to DOM object
function parseStringAsHtml(content, selector) {
`;

export const JavaScriptEditor: Story = {
  args: {
    ...baseParams,
    language: 'javascript',
    value: JAVASCRIPT_SNIPPET,
  },
};

const GO_SNIPPET = `
// Need inspiration? See how fast you can set up and use a logger.
// Or scratch everything and use your imagination.

package main

import (
	"fmt"
	"log"
)

func main() {
    // Configure log and create a new logger
`;
export const GoEditor: Story = {
  args: {
    ...baseParams,
    language: 'go',
    value: GO_SNIPPET,
  },
};

const JAVA_SNIPPET = `
// Need inspiration? Try adding additional conditions or other helper
// functions on "widgets."
// Or scratch everything and use your imagination.

/**
 * @return ArrayList of all visible widgets
 */
public ArrayList<Widget> getVisibleWidgets() {
`;

export const JavaEditor: Story = {
  args: {
    ...baseParams,
    language: 'java',
    value: JAVA_SNIPPET,
  },
};

const CPP_SNIPPET = `
// Need inspiration? Try finishing this Matrix class with constructors,
// destructors, getter/setters, utilities like transpose, etc.
// Or scratch everything and use your imagination.

// 2D Matrix class
template <class T>
class Matrix() {
 public:
  Matrix(int rows, int cols) {
`;

export const CppEditor: Story = {
  args: {
    ...baseParams,
    language: 'cpp',
    value: CPP_SNIPPET,
  },
};

const MARKDOWN_SNIPPET = `# Readme Template
Author: [Your Name]

This is a template for your README.md file.

## Features

List of features:`;

export const MarkdownEditor: Story = {
  args: {
    ...baseParams,
    language: 'markdown',
    value: MARKDOWN_SNIPPET,
  },
};

const HTML_SNIPPET = `<html>
  <head>
    <title>Contact Form</title>
  </head>
  <body>
    <h1>Contact Form</h1>
    <p>I'm a simple contact form.</p>

    <form>
      <label for="name">Name:</label>
      <input type="text" id="name-field-id" name="name" />

      <label for="email">Email:</label>
      <input type="email" id="email-field-id" name="email" />
    </form>
  </body>
</html>
`;

export const HTMLEditor: Story = {
  args: {
    ...baseParams,
    language: 'html',
    value: HTML_SNIPPET,
  },
};

export const MultiFileContext: Story = {
  decorators: (Story) => (
    <div>
      <h1>Multi File Context</h1>
      <p>
        Neighboring file at <code>index.html</code> passed into the{' '}
        <code>otherDocuments</code> property:
      </p>
      <code>
        <pre>{HTML_SNIPPET}</pre>
      </code>
      <div>
        <h3>Context Aware Editor</h3>
        <Story />
      </div>
    </div>
  ),
  args: {
    ...baseParams,
    language: 'javascript',
    options: {
      scrollbar: {
        vertical: 'hidden',
      },
    },
    value: `// You have context over a sample HTML page.
// Codeium's generation will take this context into account when suggesting.

// Get the contact form values by ID.`,
    otherDocuments: [
      new Document({
        absolutePath: '/index.html',
        relativePath: 'index.html',
        text: HTML_SNIPPET,
        editorLanguage: 'html',
        language: Language.HTML,
      }),
    ],
  },
};
