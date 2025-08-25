import "./style.css";

// Export only rendering components, no parser
export { NotebookRenderer } from "./components/NotebookRenderer";
export { CodeCell } from "./components/cells/CodeCell";
export { MarkdownCell } from "./components/cells/MarkdownCell";
export { RawCell } from "./components/cells/RawCell";
export { OutputCell } from "./components/cells/OutputCell";

// Export wrapper components for custom component support
export { CodeCellWrapper } from "./components/cells/CodeCellWrapper";
export { MarkdownCellWrapper } from "./components/cells/MarkdownCellWrapper";
export { RawCellWrapper } from "./components/cells/RawCellWrapper";
export { OutputCellWrapper } from "./components/cells/OutputCellWrapper";

export { SlideshowLayout } from "./components/layouts/SlideshowLayout";
export { PageLayout } from "./components/layouts/PageLayout";
export { useNotebook } from "./hooks/useNotebook";
export { useTheme, defaultThemes } from "./hooks/useTheme";

// Export API functions
export { fetchDeck, fetchNotebook, fetchDeckList } from "./api";
export { getApiConfig, getApiUrl } from "./config";

// Export markdown utilities
export {
  parseMarkdown,
  markdownToHtml,
  extractTableOfContents,
  extractLinks,
  extractImages,
  extractCodeBlocks,
  escapeHtml,
  generateId,
} from "./lib/markdown";

// Export types
export type {
  JupiterNotebook,
  JupiterCell,
  JupiterOutput,
  CellComponentProps,
  CustomCellComponents,
} from "./types";

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

// Export API types
export type {
  DeckApiResponse,
  ApiErrorResponse,
  FetchDeckOptions,
  FetchDeckResult,
  DeckListApiResponse,
  FetchDeckListResult,
  FetchDeckListOptions,
} from "./api/types";
export type { ApiConfig } from "./config";

// Export markdown types
export type { MarkdownParseOptions, ParsedMarkdown } from "./lib/markdown";
