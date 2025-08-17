// Export only rendering components, no parser
export { NotebookRenderer } from "./components/NotebookRenderer";
export { CodeCell } from "./components/cells/CodeCell";
export { MarkdownCell } from "./components/cells/MarkdownCell";
export { RawCell } from "./components/cells/RawCell";
export { OutputCell } from "./components/cells/OutputCell";
export { SlideshowLayout } from "./components/layouts/SlideshowLayout";
export { PageLayout } from "./components/layouts/PageLayout";
export { useNotebook } from "./hooks/useNotebook";
export { useTheme, defaultThemes } from "./hooks/useTheme";

// Export types
export type { JupiterNotebook, JupiterCell, JupiterOutput } from "./types";

// Export component prop types
export type { NotebookRendererProps } from "./components/NotebookRenderer";
export type { CodeCellProps } from "./components/cells/CodeCell";
export type { MarkdownCellProps } from "./components/cells/MarkdownCell";
export type { RawCellProps } from "./components/cells/RawCell";
export type { OutputCellProps } from "./components/cells/OutputCell";
export type { SlideshowLayoutProps } from "./components/layouts/SlideshowLayout";
export type { PageLayoutProps } from "./components/layouts/PageLayout";

// Export hook types
export type {
  UseNotebookReturn,
  NotebookStats,
  NotebookGroup,
} from "./hooks/useNotebook";
export type { UseThemeReturn, ThemeConfig } from "./hooks/useTheme";
