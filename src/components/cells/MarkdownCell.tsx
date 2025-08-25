import React from "react";
import { clsx } from "clsx";
import {
  parseMarkdown,
  type MarkdownParseOptions,
  type ParsedMarkdown,
} from "../../lib/markdown";

export interface MarkdownCellProps {
  source: string[];
  metadata?: Record<string, unknown>;
  className?: string;
  /**
   * Options for markdown parsing
   */
  markdownOptions?: MarkdownParseOptions;
  /**
   * Whether to show metadata information (default: false)
   */
  showMetadata?: boolean;
  /**
   * Callback when markdown is parsed (useful for extracting TOC, links, etc.)
   */
  onParsed?: (parsed: ParsedMarkdown) => void;
}

export const MarkdownCell: React.FC<MarkdownCellProps> = ({
  source,
  metadata,
  className,
  markdownOptions,
  showMetadata = false,
  onParsed,
}) => {
  const markdown = source.join("\n");

  // Parse markdown with the new parser
  const parsedMarkdown = React.useMemo(() => {
    const options: MarkdownParseOptions = {
      classPrefix: "nb-md",
      sanitize: true,
      linksInNewTab: true,
      gfm: true,
      ...markdownOptions,
    };

    const result = parseMarkdown(markdown, options);

    // Call onParsed callback if provided
    if (onParsed) {
      onParsed(result);
    }

    return result;
  }, [markdown, markdownOptions, onParsed]);

  return (
    <div className={clsx("nb-cell nb-markdown-cell", className)}>
      <div
        className="nb-markdown-content"
        dangerouslySetInnerHTML={{ __html: parsedMarkdown.html }}
      />

      {/* Metadata display */}
      {showMetadata && metadata && Object.keys(metadata).length > 0 && (
        <div className="nb-cell-metadata">
          <details className="nb-metadata-details">
            <summary className="nb-metadata-summary">Cell Metadata</summary>
            <pre className="nb-metadata-content">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Parsed content metadata (hidden by default, available for styling) */}
      {parsedMarkdown.metadata && (
        <div className="nb-parsed-metadata" style={{ display: "none" }}>
          <div
            data-headings={JSON.stringify(parsedMarkdown.metadata.headings)}
          />
          <div data-links={JSON.stringify(parsedMarkdown.metadata.links)} />
          <div data-images={JSON.stringify(parsedMarkdown.metadata.images)} />
          <div
            data-code-blocks={JSON.stringify(
              parsedMarkdown.metadata.codeBlocks
            )}
          />
        </div>
      )}
    </div>
  );
};

export default MarkdownCell;
