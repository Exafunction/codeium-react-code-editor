# Codeium Editor

[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com/badges/main)

[![NPM](https://nodei.co/npm/@codeium/react-code-editor.png?downloads=true)](https://www.npmjs.com/package/@codeium/react-code-editor)  

Codeium React Editor is a free, open-source code editor with unlimited autocomplete. Brought to you by the team at [Codeium](https://www.codeium.com/). **Free with no account required.**

![codeium demo](docs/codeium_demo.gif)

## Features

- Unlimited autocomplete (no account required)
- Customizable API extended from [Monaco React](https://github.com/suren-atoyan/monaco-react?tab=readme-ov-file#editor)

## Demo

Check it out [here](https://codeium.com/playground)!

## Getting Started

Install using any of these package manager.s

```sh
# NPM
npm install @codeium/react-code-editor

# Yarn
yarn add @codeium/react-code-editor

# PNPM
pnpm install @codeium/react-code-editor
```

Now import the `CodeiumEditor` and enjoy lightning fast autocomplete, directly in your browser, 100% for free!

```tsx
import { CodeiumEditor } from "@codeium/react-code-editor";

export const IdeWithAutocomplete = () => {
  return (
    <div>
      <p>Here's an AI-powered Python editor using Codeium.</p>
      <CodeiumEditor language="python" theme="vs-dark" />
    </div>
  );
};
```

### Examples

Here are some examples of Codeium React Editor used in production:

- [https://khou22.com/programming/codeium](https://khou22.com/programming/codeium?referrer=github) [[src](https://github.com/khou22/khou22.github.io/blob/b2352449d101f7f9cf8a9382f031091d7dd4cfdd/src/app/programming/codeium/page.tsx#L20)]

## How it works

This project is a wrapper around Microsoft's Monaco editor which is the editor that powers VS Code with the extended capability of providing code autocompletion.

The autocompletes are provided by analyzing the editor's content and predicting and providing suggestions based on that context. To learn more about how the autocompletion works, visit [Codeium's FAQ](https://codeium.com/faq).

## API

The core API of the editor is the same as that of the wrapped project. You can view the editor API [here](https://github.com/suren-atoyan/monaco-react?tab=readme-ov-file#editor).

## Acknowledgements

This project would not have been possible without [Suren Atoyan's Monaco React project](https://github.com/suren-atoyan/monaco-react).

## Issues

Create issues in this repositories for anything related to autocompletion functionality. If you have any issues with the editor API or functionality, create an issue in the [editor repository](https://github.com/suren-atoyan/monaco-react).

## License

[License](https://github.com/Exafunction/codeium-react-editor/blob/main/LICENSE)
