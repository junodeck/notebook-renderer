import React from "react";
import { clsx } from "clsx";
import Prism from "prismjs";

// Import common language support for Prism
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-r";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";

export interface CodeCellProps {
  source: string[];
  language?: string;
  executionCount?: number | null;
  metadata?: Record<string, unknown>;
  className?: string;
  showExecutionCount?: boolean;
  showLineNumbers?: boolean;
}

export const CodeCell: React.FC<CodeCellProps> = ({
  source,
  language = "python",
  executionCount,
  metadata,
  className,
  showExecutionCount = false,
  showLineNumbers = false,
}) => {
  const code = source.join("\n");

  // Highlight code with Prism
  const highlightedCode = React.useMemo(() => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.text;
      return Prism.highlight(code, grammar!, language);
    } catch (error) {
      console.warn(`Failed to highlight code for language: ${language}`, error);
      return code;
    }
  }, [code, language]);

  return (
    <div
      className={clsx(
        "nb-cell nb-code-cell",
        `language-${language}`,
        {
          "show-line-numbers": showLineNumbers,
        },
        className
      )}
    >
      {/* Execution count indicator */}
      {showExecutionCount && (
        <div className="nb-execution-count">In [{executionCount ?? " "}]:</div>
      )}

      {/* Code input */}
      <div className="nb-code-input">
        <pre className={`language-${language}`}>
          <code
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className={clsx("nb-code-content", {
              "line-numbers": showLineNumbers,
            })}
          />
        </pre>
      </div>

      {/* Metadata (hidden by default, can be styled) */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="cell-metadata" style={{ display: "none" }}>
          {JSON.stringify(metadata)}
        </div>
      )}
    </div>
  );
};

export default CodeCell;
