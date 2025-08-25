import React, { useEffect } from "react";
import { clsx } from "clsx";
import type { JupiterNotebook, CustomCellComponents } from "../types";
import { CodeCellWrapper } from "./cells/CodeCellWrapper";
import { MarkdownCellWrapper } from "./cells/MarkdownCellWrapper";
import { RawCellWrapper } from "./cells/RawCellWrapper";
import { OutputCellWrapper } from "./cells/OutputCellWrapper";
import { SlideshowLayout } from "./layouts/SlideshowLayout";
import { PageLayout } from "./layouts/PageLayout";
import { useTheme } from "../hooks/useTheme";

export interface NotebookRendererProps {
  notebook: JupiterNotebook;
  theme?: string;
  layout?: "page" | "slideshow";
  className?: string;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
  showMetadata?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  customComponents?: CustomCellComponents;
}

export const NotebookRenderer: React.FC<NotebookRendererProps> = ({
  notebook,
  theme = "default",
  layout = "page",
  className,
  showExecutionCount = false,
  showCellNumbers = false,
  showMetadata = false,
  showHeader = true,
  showFooter = true,
  customComponents,
}) => {
  // Use the theme hook to apply theme changes
  const { setTheme } = useTheme(theme);

  // Apply theme when it changes
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

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
    OutputCell: customComponents?.OutputCell || OutputCellWrapper,
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
          showHeader={showHeader}
          showFooter={showFooter}
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
        showHeader={showHeader}
        showFooter={showFooter}
        customComponents={components}
      />
    </div>
  );
};

export default NotebookRenderer;
