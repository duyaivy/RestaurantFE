"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMarkdownContentProps {
  content: string;
}

export function ChatMarkdownContent({ content }: ChatMarkdownContentProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none wrap-break-word [&_a]:text-amber-300 [&_a]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/40 [&_pre]:p-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
