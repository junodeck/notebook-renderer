import React from "react";
import { clsx } from "clsx";
import type {
  JupiterNotebook,
  JupiterCell,
  CellComponentProps,
} from "../../types";
import { CodeCellWrapper } from "../cells/CodeCellWrapper";
import { MarkdownCellWrapper } from "../cells/MarkdownCellWrapper";
import { RawCellWrapper } from "../cells/RawCellWrapper";
import { OutputCellWrapper } from "../cells/OutputCellWrapper";

export interface PageLayoutProps {
  notebook: JupiterNotebook;
  theme?: string;
  className?: string;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
  showMetadata?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  customComponents?: {
    CodeCell: React.ComponentType<CellComponentProps>;
    MarkdownCell: React.ComponentType<CellComponentProps>;
    RawCell: React.ComponentType<CellComponentProps>;
    OutputCell: React.ComponentType<CellComponentProps>;
  };
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  notebook,
  theme = "default",
  className,
  showExecutionCount = false,
  showCellNumbers = false,
  showMetadata = false,
  showHeader = true,
  showFooter = true,
  customComponents,
}) => {
  const visibleCells = notebook.cells.filter((cell) => cell.visible !== false);

  // Use custom components or fall back to default wrapper ones
  const CellComponents = {
    CodeCell: customComponents?.CodeCell || CodeCellWrapper,
    MarkdownCell: customComponents?.MarkdownCell || MarkdownCellWrapper,
    RawCell: customComponents?.RawCell || RawCellWrapper,
    OutputCell: customComponents?.OutputCell || OutputCellWrapper,
  };

  const renderCell = (cell: JupiterCell, index: number) => {
    const cellProps = {
      key: cell.id || `cell-${index}`,
      className: clsx("notebook-cell", {
        grouped: cell.grouped,
        [`group-${cell.groupId}`]: cell.groupId,
      }),
    };

    // Common cell props for custom components
    const cellComponentProps = {
      cell,
      showExecutionCount,
      showCellNumbers,
      cellIndex: index,
    };

    switch (cell.type) {
      case "code":
        return (
          <div {...cellProps}>
            {showCellNumbers && (
              <div className="cell-number">[{index + 1}]</div>
            )}
            <CellComponents.CodeCell {...cellComponentProps} />
          </div>
        );

      case "markdown":
        return (
          <div {...cellProps}>
            {showCellNumbers && (
              <div className="cell-number">[{index + 1}]</div>
            )}
            <CellComponents.MarkdownCell {...cellComponentProps} />
          </div>
        );

      case "raw":
        return (
          <div {...cellProps}>
            {showCellNumbers && (
              <div className="cell-number">[{index + 1}]</div>
            )}
            <CellComponents.RawCell {...cellComponentProps} />
          </div>
        );

      case "output":
        return (
          <div {...cellProps}>
            {showCellNumbers && (
              <div className="cell-number">[{index + 1}]</div>
            )}
            <CellComponents.OutputCell {...cellComponentProps} />
          </div>
        );

      default:
        return (
          <div {...cellProps}>
            <div className="unknown-cell">
              <pre>Unknown cell type: {cell.type}</pre>
              <pre>{JSON.stringify(cell, null, 2)}</pre>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        "page-layout",
        `theme-${theme}`,
        {
          "show-cell-numbers": showCellNumbers,
          "show-execution-count": showExecutionCount,
        },
        className
      )}
    >
      {/* Notebook header */}
      {showHeader && (
        <header className="notebook-header">
          {notebook.metadata.title && (
            <h1 className="notebook-title">{notebook.metadata.title}</h1>
          )}

          {showMetadata && (
            <div className="notebook-metadata">
              {notebook.metadata.kernelspec && (
                <div className="kernel-info">
                  <span className="kernel-name">
                    {notebook.metadata.kernelspec.display_name}
                  </span>
                  <span className="kernel-language">
                    ({notebook.metadata.kernelspec.language})
                  </span>
                </div>
              )}

              {notebook.metadata.created && (
                <div className="created-date">
                  Created:{" "}
                  {new Date(notebook.metadata.created).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </header>
      )}

      {/* Notebook cells */}
      <main className="notebook-content">
        {visibleCells.length === 0 ? (
          <div className="empty-notebook">
            <p>No visible cells in this notebook.</p>
          </div>
        ) : (
          <div className="cells-container">
            {visibleCells.map((cell, index) => renderCell(cell, index))}
          </div>
        )}
      </main>

      {/* Notebook footer */}
      {showFooter && (
        <footer className="notebook-footer">
          <div className="notebook-stats">
            <span>{notebook.cells.length} total cells</span>
            <span>{visibleCells.length} visible cells</span>
            {notebook.metadata.language_info && (
              <span>Language: {notebook.metadata.language_info.name}</span>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};

export default PageLayout;
