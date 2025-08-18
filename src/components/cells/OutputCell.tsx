import React from "react";
import { clsx } from "clsx";
import type { JupiterCell, JupiterOutput } from "../../types";

export interface OutputCellProps {
  cell: JupiterCell;
  showExecutionCount?: boolean;
  cellIndex?: number;
  className?: string;
}

export const OutputCell: React.FC<OutputCellProps> = ({
  cell,
  showExecutionCount = false,
  className,
}) => {
  const renderOutput = (output: JupiterOutput) => {
    switch (output.outputType) {
      case "stream":
        return (
          <div className="nb-stream-output">
            <pre className="nb-stream-text">{output.text?.join("") || ""}</pre>
          </div>
        );

      case "display_data":
      case "execute_result":
        return renderDisplayData(output);

      case "error":
        return (
          <div className="nb-error-output">
            <div className="nb-error-name">{output.ename}</div>
            <div className="nb-error-value">{output.evalue}</div>
            {output.traceback && (
              <pre className="nb-error-traceback">
                {output.traceback.join("\n")}
              </pre>
            )}
          </div>
        );

      default:
        return (
          <div className="nb-unknown-output">
            <pre>{JSON.stringify(output, null, 2)}</pre>
          </div>
        );
    }
  };

  const renderDisplayData = (output: JupiterOutput) => {
    if (!output.data) {
      return <div className="nb-empty-output">No data</div>;
    }

    // Priority order for display data
    const displayPriority = [
      "image/png",
      "image/jpeg",
      "image/svg+xml",
      "text/html",
      "text/markdown",
      "application/json",
      "text/plain",
    ];

    for (const mimeType of displayPriority) {
      if (output.data[mimeType as keyof typeof output.data]) {
        return renderMimeType(
          mimeType,
          output.data[mimeType as keyof typeof output.data]
        );
      }
    }

    return <div className="nb-empty-output">No displayable data</div>;
  };

  const renderMimeType = (mimeType: string, data: unknown) => {
    switch (mimeType) {
      case "image/png":
      case "image/jpeg":
        return (
          <div className="nb-image-output">
            <img
              src={`data:${mimeType};base64,${data}`}
              alt="Notebook output"
              className="nb-output-image"
            />
          </div>
        );

      case "image/svg+xml":
        return (
          <div
            className="nb-svg-output"
            dangerouslySetInnerHTML={{ __html: data as string }}
          />
        );

      case "text/html":
        return (
          <div
            className="nb-html-output"
            dangerouslySetInnerHTML={{
              __html: Array.isArray(data) ? data.join("") : (data as string),
            }}
          />
        );

      case "text/markdown":
        // Simple markdown rendering (you might want to use a proper parser)
        const markdown = Array.isArray(data) ? data.join("") : (data as string);
        const __html = markdown
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/`([^`]+)`/g, "<code>$1</code>");
        return (
          <div
            className="nb-markdown-output"
            dangerouslySetInnerHTML={{ __html }}
          />
        );

      case "application/json":
        return (
          <div className="nb-json-output">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        );

      case "text/plain":
        const text = Array.isArray(data) ? data.join("") : (data as string);
        return (
          <div className="nb-text-output">
            <pre className="nb-plain-text">{text}</pre>
          </div>
        );

      default:
        return (
          <div className="nb-unknown-mime-output">
            <div className="nb-mime-type">MIME Type: {mimeType}</div>
            <pre>
              {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  // If no outputs, render empty state
  if (!cell.outputs || cell.outputs.length === 0) {
    return (
      <div
        className={clsx("nb-cell nb-output-cell", "empty-outputs", className)}
      >
        <div className="nb-empty-output">No output</div>
      </div>
    );
  }

  return (
    <div className={clsx("nb-cell nb-output-cell", className)}>
      {/* Show execution count if enabled and available */}
      {showExecutionCount &&
        cell.executionCount !== null &&
        cell.executionCount !== undefined && (
          <div className="nb-execution-count">Out[{cell.executionCount}]:</div>
        )}

      {/* Render all outputs */}
      <div className="nb-outputs-container">
        {cell.outputs.map((output, index) => (
          <div
            key={index}
            className={clsx(
              "nb-output-item",
              `output-type-${output.outputType}`
            )}
          >
            {renderOutput(output)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutputCell;
