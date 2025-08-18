import React from "react";
import type { CellComponentProps } from "../../types";
import { CodeCell } from "./CodeCell";

export const CodeCellWrapper: React.FC<CellComponentProps> = ({
  cell,
  showExecutionCount,
  showCellNumbers,
  cellIndex,
}) => {
  // Extract language from notebook metadata or cell metadata
  const language =
    cell.metadata?.language ||
    (cell.metadata as any)?.kernelspec?.language ||
    "python";

  return (
    <CodeCell
      source={cell.source}
      language={language}
      executionCount={cell.executionCount}
      outputs={cell.outputs}
      metadata={cell.metadata}
      showExecutionCount={showExecutionCount}
      showLineNumbers={false}
    />
  );
};
