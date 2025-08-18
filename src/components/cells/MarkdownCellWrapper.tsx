import React from "react";
import type { CellComponentProps } from "../../types";
import { MarkdownCell } from "./MarkdownCell";

export const MarkdownCellWrapper: React.FC<CellComponentProps> = ({
  cell,
  showExecutionCount,
  showCellNumbers,
  cellIndex,
}) => {
  return <MarkdownCell source={cell.source} metadata={cell.metadata} />;
};
