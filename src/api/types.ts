import type { JupiterNotebook } from "../types";

/**
 * API response for deck data
 */
export interface DeckApiResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string;
    notebookTitle: string;
    notebookData: JupiterNotebook;
    layout: "page" | "slideshow";
    theme: string;
    cellCount: number;
    visibleCellCount: number;
    visibleCells: string[];
    isPublic: boolean;
    status: "draft" | "published";
    views: number;
    createdAt: string;
    updatedAt: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Options for fetching deck data
 */
export interface FetchDeckOptions {
  /** API key for authentication */
  apiKey: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Custom headers to include */
  headers?: Record<string, string>;
}

/**
 * Result of fetching deck data
 */
export interface FetchDeckResult {
  success: boolean;
  data?: DeckApiResponse["data"];
  error?: string;
}
