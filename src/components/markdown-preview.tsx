// import { cn } from "@/lib/utils";
// import { TerminalIcon } from "lucide-react";
// import { icons } from "../ui/icons";
// import CopyButton from "./CopyButton";

import React from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

// import "highlight.js/styles/atom-one-dark.min.css";

export default function MarkdownPreview({
	content,
	className = "sm:p-10",
}: {
	content: string;
	className?: string;
}) {
	return (
		<Markdown
			rehypePlugins={[rehypeHighlight]}
			components={{
				h1: ({ node, ...props }) => {
					return <h1 {...props} className="text-2xl font-bold text-primary hover:underline transition-all" />;
				},
				h2: ({ node, ...props }) => {
					return (
						<h1
							{...props}
							className="text-2xl font-bold my-4 text-primary hover:underline transition-all"
						/>
					);
				},
				h3: ({ node, ...props }) => {
					return (
						<h1
							{...props}
							className="text-xl font-bold my-4 text-primary hover:underline transition-all"
						/>
					);
				},
				a: ({ node, ...props }) => {
					return (
						<a
							{...props}
							className="my-4 text-primary hover:underline transition-all"
						/>
					);
				},
				b: ({ node, ...props }) => {
					return (
						<b
							{...props}
							className="my-4 text-fuchsia-700 transition-all font-bold"
						/>
					);
				},
				blockquote: ({ node, ...props }) => {
					return (
						<blockquote
							{...props}
							className="my-4 hover:underline transition-all p-4 border rounded-md"
						/>
					);
				},
				i: ({ node, ...props }) => {
					return (
						<i
							{...props}
							className="italic text-muted-foreground"
						/>
					);
				},
				p: ({ node, ...props }) => {
					return (
						<p
							{...props}
							className="my-4 text-normal text-muted-foreground leading-relaxed"
						/>
					);
				},
			}}
		>
			{content}
		</Markdown>
	);
}