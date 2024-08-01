import React from 'react';
import { Box, IconButton, useClipboard } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const { hasCopied, onCopy } = useClipboard(code);

  return (
    <Box position="relative" my={4}>
      <IconButton
        aria-label="Copy code"
        icon={<CopyIcon />}
        size="sm"
        onClick={onCopy}
        position="absolute"
        top={4}
        right={2}
        zIndex="1"
        bg={hasCopied ? 'green.500' : 'gray.700'}
        _hover={{ bg: hasCopied ? 'green.400' : 'gray.600' }}
      />
      <SyntaxHighlighter language={language} style={tomorrow}>
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

export default CodeBlock;
