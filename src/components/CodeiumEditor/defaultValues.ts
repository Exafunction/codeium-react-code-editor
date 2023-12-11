export const getDefaultValue = (language: string): string => {
  switch (language) {
    case "typescript":
    case "tsx":
    case "javascript":
    case "java":
      return `// Welcome to Codeium Editor!
// Press Enter and use Tab to accept AI suggestions. Here's an example:

// Write me a function that adds two numbers`;
    case "python":
      return `# Welcome to Codeium Editor!
# Press Enter and use Tab to accept AI suggestions. Here's an example:

# Write me a function that adds two numbers`;
    case "css":
      return `/* Welcome to Codeium Editor!
Press Enter and use Tab to accept AI suggestions. Here's an example:*/

/* Write me a function that adds two numbers*/`;
    default:
      return "";
  }
};
