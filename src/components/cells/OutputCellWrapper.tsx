import React from "react";
import type { CellComponentProps } from "../../types";
import { OutputCell } from "./OutputCell";

export interface OutputCellWrapperProps extends CellComponentProps {
  className?: string;
}

export const OutputCellWrapper: React.FC<OutputCellWrapperProps> = ({
  cell,
  showExecutionCount = true,
  cellIndex,
  className,
}) => {
  return (
    <OutputCell
      cell={cell}
      showExecutionCount={showExecutionCount}
      cellIndex={cellIndex}
      className={className}
    />
  );
};

export default OutputCellWrapper;
