import React from "react";
import { clsx } from "clsx";
import type { JupiterOutput } from "../../types";

export interface OutputCellProps {
  output: JupiterOutput;
  className?: string;
}

export const OutputCell: React.FC<OutputCellProps> = ({
  output,
  className,
}) => {
  const renderOutput = () => {
    switch (output.outputType) {
      case "stream":
        return (
          <div className="stream-output">
            <pre className="stream-text">{output.text?.join("") || ""}</pre>
          </div>
        );

      case "display_data":
      case "execute_result":
        return renderDisplayData();

      case "error":
        return (
          <div className="error-output">
            <div className="error-name">{output.ename}</div>
            <div className="error-value">{output.evalue}</div>
            {output.traceback && (
              <pre className="error-traceback">
                {output.traceback.join("\n")}
              </pre>
            )}
          </div>
        );

      default:
        return (
          <div className="unknown-output">
            <pre>{JSON.stringify(output, null, 2)}</pre>
          </div>
        );
    }
  };

  const renderDisplayData = () => {
    if (!output.data) {
      return <div className="empty-output">No data</div>;
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

    return <div className="empty-output">No displayable data</div>;
  };

  const renderMimeType = (mimeType: string, data: unknown) => {
    switch (mimeType) {
      case "image/png":
      case "image/jpeg":
        return (
          <div className="image-output">
            <img
              src={`data:${mimeType};base64,${data}`}
              alt="Notebook output"
              className="output-image"
            />
          </div>
        );

      case "image/svg+xml":
        return (
          <div
            className="svg-output"
            dangerouslySetInnerHTML={{ __html: data as string }}
          />
        );

      case "text/html":
        return (
          <div
            className="html-output"
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
            className="markdown-output"
            dangerouslySetInnerHTML={{ __html }}
          />
        );

      case "application/json":
        return (
          <div className="json-output">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        );

      case "text/plain":
        const text = Array.isArray(data) ? data.join("") : (data as string);
        return (
          <div className="text-output">
            <pre className="plain-text">{text}</pre>
          </div>
        );

      default:
        return (
          <div className="unknown-mime-output">
            <div className="mime-type">MIME Type: {mimeType}</div>
            <pre>
              {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        "output-cell",
        `output-type-${output.outputType}`,
        className
      )}
    >
      {renderOutput()}
    </div>
  );
};

export default OutputCell;
