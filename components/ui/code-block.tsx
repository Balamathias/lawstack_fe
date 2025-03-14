'use client'

import React, { useState } from "react";
import { Check, Copy, Code } from "lucide-react";

interface CodeBlockProps {
  language: string;
  code: string;
  className?: string;
}

export function CodeBlock({ language, code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-lg border bg-muted ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="h-7 w-7 flex items-center justify-center rounded-md transition-colors hover:bg-accent"
          title="Copy code"
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} className="text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
