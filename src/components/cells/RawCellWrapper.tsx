import React from "react";
import type { CellComponentProps } from "../../types";
import { RawCell } from "./RawCell";

export const RawCellWrapper: React.FC<CellComponentProps> = ({
  cell,
  showExecutionCount,
  showCellNumbers,
  cellIndex,
}) => {
  return <RawCell source={cell.source} metadata={cell.metadata} />;
};
