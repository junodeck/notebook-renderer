import React from "react";
import { clsx } from "clsx";

export interface RawCellProps {
  source: string[];
  metadata?: Record<string, unknown>;
  className?: string;
  preserveWhitespace?: boolean;
}

export const RawCell: React.FC<RawCellProps> = ({
  source,
  metadata,
  className,
  preserveWhitespace = true,
}) => {
  const content = source.join("\n");

  return (
    <div
      className={clsx(
        "raw-cell",
        {
          "preserve-whitespace": preserveWhitespace,
        },
        className
      )}
    >
      <div className="raw-content">
        {preserveWhitespace ? (
          <pre className="raw-text">{content}</pre>
        ) : (
          <div className="raw-text">{content}</div>
        )}
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

export default RawCell;
