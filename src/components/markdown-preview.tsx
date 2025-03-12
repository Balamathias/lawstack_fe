"use client"

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  noHighlight?: boolean;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  className,
  noHighlight = false,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
	<div className={cn(
		'markdown-preview text-sm leading-relaxed text-foreground',
		'prose dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight',
		'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
		'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none',
		'prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground/30 prose-blockquote:pl-4 prose-blockquote:italic',
		'prose-img:rounded-md prose-img:mx-auto',
		'prose-hr:border-muted',
		'prose-table:border prose-table:border-collapse prose-table:border-border',
		'prose-th:bg-muted/50 prose-th:p-2 prose-th:border prose-th:border-border',
		'prose-td:p-2 prose-td:border prose-td:border-border',
		'prose-li:marker:text-muted-foreground',
		'max-w-none',
		className
	)}
	>
		<ReactMarkdown
		remarkPlugins={[remarkGfm]}
		rehypePlugins={[rehypeRaw]}
		components={{
			h1: ({ children, ...props }) => (
				<h1 className="text-2xl font-semibold mb-4 mt-6 text-foreground/90" {...props}>
				{children}
			</h1>
			),
			h2: ({ children, ...props }) => (
			<h2 className="text-xl font-medium mb-3 mt-5 text-foreground/90" {...props}>
				{children}
			</h2>
			),
			h3: ({ children, ...props }) => (
				<h3 className="text-lg font-medium mb-2 mt-4 text-foreground/90" {...props}>
				{children}
			</h3>
			),
			p: ({ children, ...props }) => (
			<p className="mb-4 leading-relaxed" {...props}>
				{children}
			</p>
			),
			a: ({ children, href, ...props }) => (
				<Link 
				href={href || '#'} 
				target={href?.startsWith('http') ? '_blank' : '_self'} 
				rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
				className="text-green-600 dark:text-green-400 hover:underline transition-colors"
				{...props}
			>
				{children}
			</Link>
			),
			img: ({ src, alt, ...props }) => (
			<div className="my-4 flex justify-center">
				{src && (
				src.startsWith('http') ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
					src={src}
					alt={alt || ''}
					className="rounded-lg max-h-96 object-contain"
					loading="lazy"
					{...props}
					/>
				) : (
					<Image
					src={src}
					alt={alt || ''}
					className="rounded-lg max-h-96 object-contain"
					{...props}
					width={600}
					height={400}
					/>
				)
				)}
			</div>
			),
			// code: ({ node, inline, className, children, ...props }) => {
			//   const match = /language-(\w+)/.exec(className || '');
			//   const language = match && match[1] ? match[1] : '';
			
			//   if (noHighlight || inline) {
			//     return (
			//       <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm" {...props}>
			//         {children}
			//       </code>
			//     );
			//   }
			
			//   return (
			//     <div className="my-4 rounded-lg overflow-hidden">
			//       <SyntaxHighlighter
			//         language={language || 'text'}
			//         style={isDark ? vscDarkPlus : vs}
			//         customStyle={{
				//           margin: 0,
				//           borderRadius: '0.5rem',
				//           fontSize: '0.875rem',
			//         }}
			//         wrapLongLines={true}
			//         showLineNumbers={!inline && language !== 'text' && (children?.toString().split('\n').length || 0) > 1}
			//         {...props}
			//       >
			//         {String(children).replace(/\n$/, '')}
			//       </SyntaxHighlighter>
			//     </div>
			//   );
			// },
			ul: ({ children, ...props }) => (
			<ul className="list-disc pl-6 mb-4 space-y-1.5" {...props}>
				{children}
			</ul>
			),
			ol: ({ children, ...props }) => (
			<ol className="list-decimal pl-6 mb-4 space-y-1.5" {...props}>
				{children}
			</ol>
			),
			li: ({ children, ...props }) => (
			<li className="mb-1" {...props}>
				{children}
			</li>
			),
			blockquote: ({ children, ...props }) => (
			<blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-4 text-muted-foreground" {...props}>
				{children}
			</blockquote>
			),
			hr: (props) => <hr className="my-6 border-muted" {...props} />,
			table: ({ children, ...props }) => (
			<div className="overflow-x-auto my-6">
				<table className="min-w-full border border-border rounded-md overflow-hidden" {...props}>
				{children}
				</table>
			</div>
			),
			thead: ({ children, ...props }) => (
			<thead className="bg-muted/50" {...props}>
				{children}
			</thead>
			),
			th: ({ children, ...props }) => (
			<th className="py-2 px-3 text-left font-medium border-b border-border" {...props}>
				{children}
			</th>
			),
			td: ({ children, ...props }) => (
			<td className="py-2 px-3 border-t border-border" {...props}>
				{children}
			</td>
			),
			pre: ({ children, ...props }) => (
			<pre className="my-4 rounded-lg overflow-hidden bg-transparent p-0" {...props}>
				{children}
			</pre>
			),
		}}
		>
		{content || ''}
		</ReactMarkdown>
	</div>
  );
};

export default MarkdownPreview;