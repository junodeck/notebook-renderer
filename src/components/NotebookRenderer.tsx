import React from "react";
import { clsx } from "clsx";
import type { JupiterNotebook } from "../types";
import { CodeCell } from "./cells/CodeCell";
import { MarkdownCell } from "./cells/MarkdownCell";
import { RawCell } from "./cells/RawCell";
import { SlideshowLayout } from "./layouts/SlideshowLayout";
import { PageLayout } from "./layouts/PageLayout";

export interface NotebookRendererProps {
  notebook: JupiterNotebook;
  theme?: string;
  layout?: "page" | "slideshow";
  className?: string;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
}

export const NotebookRenderer: React.FC<NotebookRendererProps> = ({
  notebook,
  theme = "default",
  layout = "page",
  className,
  showExecutionCount = true,
  showCellNumbers = false,
}) => {
  const baseClasses = clsx(
    "notebook-renderer",
    `theme-${theme}`,
    `layout-${layout}`,
    className
  );

  if (layout === "slideshow") {
    return (
      <div className={baseClasses}>
        <SlideshowLayout
          notebook={notebook}
          theme={theme}
          showExecutionCount={showExecutionCount}
          showCellNumbers={showCellNumbers}
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
      />
    </div>
  );
};

export default NotebookRenderer;
