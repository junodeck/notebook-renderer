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
    slug: string;
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
    details?: unknown;
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
 * Options for fetching deck list with pagination
 */
export interface FetchDeckListOptions extends FetchDeckOptions {
  /** Number of records to skip (default: 0) */
  skip?: number;
  /** Maximum number of records to return (default: 20, max: 100) */
  limit?: number;
}

/**
 * Result of fetching deck data
 */
export interface FetchDeckResult {
  success: boolean;
  data?: DeckApiResponse["data"];
  error?: string;
}

/**
 * API response for deck list
 */
export interface DeckListApiResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    notebookTitle: string;
    publicUrl: string;
    slug: string;
  }[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Result of fetching deck list
 */
export interface FetchDeckListResult {
  success: boolean;
  data?: DeckListApiResponse["data"];
  pagination?: DeckListApiResponse["pagination"];
  error?: string;
}
