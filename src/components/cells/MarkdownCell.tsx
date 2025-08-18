import React from "react";
import { clsx } from "clsx";

export interface MarkdownCellProps {
  source: string[];
  metadata?: Record<string, unknown>;
  className?: string;
}

export const MarkdownCell: React.FC<MarkdownCellProps> = ({
  source,
  metadata,
  className,
}) => {
  const markdown = source.join("\n");

  // Simple markdown parsing (you might want to use a proper markdown parser like marked or remark)
  const parseMarkdown = (text: string): string => {
    return (
      text
        // Headers
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")

        // Bold and italic
        .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")

        // Code blocks
        .replace(
          /```(\w+)?\n([\s\S]*?)```/g,
          '<pre><code class="language-$1">$2</code></pre>'
        )
        .replace(/`([^`]+)`/g, "<code>$1</code>")

        // Links
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        )

        // Lists
        .replace(/^\* (.*$)/gm, "<li>$1</li>")
        .replace(/^- (.*$)/gm, "<li>$1</li>")
        .replace(/^\d+\. (.*$)/gm, "<li>$1</li>")

        // Line breaks
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>")
    );
  };

  // Wrap content in paragraphs if it doesn't start with a header or list
  const processedMarkdown = React.useMemo(() => {
    const parsed = parseMarkdown(markdown);

    // Wrap lists in ul tags
    const withLists = parsed
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      .replace(/<\/li><li>/g, "</li><li>");

    // Wrap in paragraph if it doesn't start with block elements
    if (!withLists.match(/^<(h[1-6]|ul|ol|pre|div)/)) {
      return `<p>${withLists}</p>`;
    }

    return withLists;
  }, [markdown]);

  return (
    <div className={clsx("markdown-cell", className)}>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: processedMarkdown }}
      />

      {/* Metadata (hidden by default, can be styled) */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="cell-metadata" style={{ display: "none" }}>
          {JSON.stringify(metadata)}
        </div>
      )}
    </div>
  );
};

export default MarkdownCell;
