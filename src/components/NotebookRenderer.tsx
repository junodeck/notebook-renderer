import React from "react";
import { clsx } from "clsx";
import type { JupiterNotebook, CustomCellComponents } from "../types";
import { CodeCellWrapper } from "./cells/CodeCellWrapper";
import { MarkdownCellWrapper } from "./cells/MarkdownCellWrapper";
import { RawCellWrapper } from "./cells/RawCellWrapper";
import { SlideshowLayout } from "./layouts/SlideshowLayout";
import { PageLayout } from "./layouts/PageLayout";

export interface NotebookRendererProps {
  notebook: JupiterNotebook;
  theme?: string;
  layout?: "page" | "slideshow";
  className?: string;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
  showMetadata?: boolean;
  customComponents?: CustomCellComponents;
}

export const NotebookRenderer: React.FC<NotebookRendererProps> = ({
  notebook,
  theme = "default",
  layout = "page",
  className,
  showExecutionCount = true,
  showCellNumbers = false,
  showMetadata = false,
  customComponents,
}) => {
  const baseClasses = clsx(
    "notebook-renderer",
    `theme-${theme}`,
    `layout-${layout}`,
    className
  );

  // Merge default components with custom components
  const components = {
    CodeCell: customComponents?.CodeCell || CodeCellWrapper,
    MarkdownCell: customComponents?.MarkdownCell || MarkdownCellWrapper,
    RawCell: customComponents?.RawCell || RawCellWrapper,
  };

  if (layout === "slideshow") {
    return (
      <div className={baseClasses}>
        <SlideshowLayout
          notebook={notebook}
          theme={theme}
          showExecutionCount={showExecutionCount}
          showCellNumbers={showCellNumbers}
          showMetadata={showMetadata}
          customComponents={components}
        />
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <PageLayout
        notebook={notebook}
        theme={theme}
        showExecutionCount={showExecutionCount}
        showCellNumbers={showCellNumbers}
        showMetadata={showMetadata}
        customComponents={components}
      />
    </div>
  );
};

export default NotebookRenderer;
