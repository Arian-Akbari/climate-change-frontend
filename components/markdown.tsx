import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Custom type for code props as ReactMarkdown passes 'inline' but it's not in the type definitions
type CodeProps = {
  className?: string;
  children: React.ReactNode;
  inline?: boolean;
};

const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Use simple component definitions to avoid TypeScript errors
        pre: ({ children }) => <div className="pre-wrapper">{children}</div>,
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-4 mr-8 pl-2">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="py-1">{children}</li>,
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-4 mr-8 pl-2">{children}</ul>
        ),
        p: ({ children }) => <p>{children}</p>,
        // @ts-ignore - Use ts-ignore to bypass the type checking for this component
        code: ({ className, children, inline }: CodeProps) => {
          return inline ? (
            <code className={className}>{children}</code>
          ) : (
            <div className={`pre-block ${className || ''}`}>
              <code className={className}>{children}</code>
            </div>
          );
        },
        strong: ({ children }) => (
          <span className="font-semibold">{children}</span>
        ),
        a: ({ href, children }) => (
          <Link
            className="text-blue-500 hover:underline"
            href={href || '#'}
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </Link>
        ),
        h1: ({ children }) => (
          <h1 className="text-3xl font-semibold mt-6 mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mt-6 mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-base font-semibold mt-6 mb-2">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm font-semibold mt-6 mb-2">{children}</h6>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

// Memoize the component for performance
export { Markdown };
export default memo(
  Markdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
