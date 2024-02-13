export const getDefaultValue = (language: string): string => {
  switch (language) {
    case 'typescript':
    case 'tsx':
    case 'javascript':
    case 'java':
      return `// Welcome to Codeium Editor!
// Press Enter and use Tab to accept AI suggestions. Here's an example:

// fib(n) function to calculate the n-th fibonacci number`;
    case 'python':
      return `# Welcome to Codeium Editor!
# Press Enter and use Tab to accept AI suggestions. Here's an example:

# fib(n) function to calculate the n-th fibonacci number`;
    case 'css':
      return `/* Welcome to Codeium Editor!
Press Enter and use Tab to accept AI suggestions. Here's an example:*/

/* .action-button class with a hover effect. */`;
    default:
      return '';
  }
};
