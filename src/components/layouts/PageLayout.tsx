import React from "react";
import { clsx } from "clsx";
import type { JupiterNotebook } from "../../types";
import { CodeCell } from "../cells/CodeCell";
import { MarkdownCell } from "../cells/MarkdownCell";
import { RawCell } from "../cells/RawCell";

export interface PageLayoutProps {
  notebook: JupiterNotebook;
  theme?: string;
  className?: string;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
  showMetadata?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  notebook,
  theme = "default",
  className,
  showExecutionCount = true,
  showCellNumbers = false,
  showMetadata = false,
}) => {
  const visibleCells = notebook.cells.filter((cell) => cell.visible !== false);

  const renderCell = (cell: any, index: number) => {
    const cellProps = {
      key: cell.id || `cell-${index}`,
      className: clsx("notebook-cell", {
        grouped: cell.grouped,
        [`group-${cell.groupId}`]: cell.groupId,
      }),
    };

    switch (cell.type) {
      case "code":
        return (
          <div {...cellProps}>
            {showCellNumbers && (
              <div className="cell-number">[{index + 1}]</div>
            )}
            <CodeCell
              source={cell.source}
              language={notebook.metadata.language_info?.name || "python"}
              executionCount={cell.executionCount}
              outputs={cell.outputs}
              metadata={cell.metadata}
              showExecutionCount={showExecutionCount}
            />
          </div>
        );

      case "markdown":
        return (
          <div {...cellProps}>
            {showCellNumbers && (
              <div className="cell-number">[{index + 1}]</div>
            )}
            <MarkdownCell source={cell.source} metadata={cell.metadata} />
          </div>
        );

      case "raw":
        return (
          <div {...cellProps}>
            {showCellNumbers && (
              <div className="cell-number">[{index + 1}]</div>
            )}
            <RawCell source={cell.source} metadata={cell.metadata} />
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
      <footer className="notebook-footer">
        <div className="notebook-stats">
          <span>{notebook.cells.length} total cells</span>
          <span>{visibleCells.length} visible cells</span>
          {notebook.metadata.language_info && (
            <span>Language: {notebook.metadata.language_info.name}</span>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
