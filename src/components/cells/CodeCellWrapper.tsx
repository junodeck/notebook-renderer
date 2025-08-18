import React from "react";
import type { CellComponentProps } from "../../types";
import { CodeCell } from "./CodeCell";

export const CodeCellWrapper: React.FC<CellComponentProps> = ({
  cell,
  showExecutionCount,
}) => {
  // Extract language from notebook metadata or cell metadata
  const language =
    (cell.metadata?.language as string) ||
    (
      (cell.metadata as Record<string, unknown>)?.kernelspec as {
        language?: string;
      }
    )?.language ||
    "python";

  return (
    <CodeCell
      source={cell.source}
      language={language}
      executionCount={cell.executionCount}
      metadata={cell.metadata}
      showExecutionCount={showExecutionCount}
      showLineNumbers={false}
    />
  );
};
