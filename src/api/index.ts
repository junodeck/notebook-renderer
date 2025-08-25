import { getApiUrl } from "../config";
import type {
  DeckApiResponse,
  ApiErrorResponse,
  FetchDeckOptions,
  FetchDeckResult,
  DeckListApiResponse,
  FetchDeckListResult,
  FetchDeckListOptions,
} from "./types";

/**
 * Fetch deck data from the JunoDeck API
 *
 * @param deckId - The ID of the deck to fetch
 * @param options - API options including API key
 * @returns Promise with deck data or error
 *
 * @example
 * ```typescript
 * import { fetchDeck } from "@junodeck/notebook-renderer";
 *
 * const result = await fetchDeck("deck-123", {
 *   apiKey: "jdk_your_api_key_here"
 * });
 *
 * if (result.success && result.data) {
 *   // Use result.data.notebookData with NotebookRenderer
 *   console.log(result.data.title);
 * }
 * ```
 */
export async function fetchDeck(
  deckId: string,
  options: FetchDeckOptions
): Promise<FetchDeckResult> {
  const { apiKey, timeout = 10000, headers = {} } = options;

  if (!deckId) {
    return {
      success: false,
      error: "Deck ID is required",
    };
  }

  if (!apiKey) {
    return {
      success: false,
      error: "API key is required",
    };
  }

  try {
    const url = getApiUrl(`/deck/${encodeURIComponent(deckId)}`);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle HTTP errors
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData: ApiErrorResponse = await response.json();
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // If we can't parse error response, use HTTP status
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const data: DeckApiResponse = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error?.message || "API returned unsuccessful response",
      };
    }

    // Validate that we have the required notebook data
    if (!data.data?.notebookData) {
      return {
        success: false,
        error: "Invalid response: missing notebook data",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    // Handle network errors, timeouts, etc.
    let errorMessage = "Failed to fetch deck data";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Request timed out";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Fetch deck data and return only the notebook data ready for NotebookRenderer
 *
 * @param deckId - The ID of the deck to fetch
 * @param options - API options including API key
 * @returns Promise with notebook data or null if failed
 *
 * @example
 * ```typescript
 * import { fetchNotebook, NotebookRenderer } from "@junodeck/notebook-renderer";
 *
 * const notebook = await fetchNotebook("deck-123", {
 *   apiKey: "jdk_your_api_key_here"
 * });
 *
 * if (notebook) {
 *   // Ready to use with NotebookRenderer
 *   return <NotebookRenderer notebook={notebook} theme="jupiter-light" />;
 * }
 * ```
 */
export async function fetchNotebook(deckId: string, options: FetchDeckOptions) {
  const result = await fetchDeck(deckId, options);

  if (result.success && result.data) {
    return result.data.notebookData;
  }

  // Log error for debugging
  if (!result.success) {
    console.error("Failed to fetch notebook:", result.error);
  }

  return null;
}

/**
 * Fetch all published decks for the authenticated user with pagination
 *
 * @param options - API options including API key and pagination parameters
 * @returns Promise with deck list, pagination metadata, or error
 *
 * @example
 * ```typescript
 * import { fetchDeckList } from "@junodeck/notebook-renderer";
 *
 * const result = await fetchDeckList({
 *   apiKey: "jdk_your_api_key_here",
 *   skip: 0,
 *   limit: 10
 * });
 *
 * if (result.success && result.data) {
 *   console.log(`Found ${result.pagination.total} decks total`);
 *   result.data.forEach(deck => {
 *     console.log(`${deck.title}: ${deck.publicUrl}`);
 *     if (deck.subtitle) console.log(`Subtitle: ${deck.subtitle}`);
 *     if (deck.tag) console.log(`Tag: ${deck.tag}`);
 *   });
 *   if (result.pagination.hasMore) {
 *     console.log("More decks available");
 *   }
 * }
 * ```
 */
export async function fetchDeckList(
  options: FetchDeckListOptions
): Promise<FetchDeckListResult> {
  const {
    apiKey,
    timeout = 10000,
    headers = {},
    skip = 0,
    limit = 20,
  } = options;

  if (!apiKey) {
    return {
      success: false,
      error: "API key is required",
    };
  }

  try {
    // Build URL with query parameters
    const baseUrl = getApiUrl("/deck");
    const url = new URL(baseUrl);
    url.searchParams.set("skip", skip.toString());
    url.searchParams.set("limit", limit.toString());

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle HTTP errors
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData: ApiErrorResponse = await response.json();
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // If we can't parse error response, use HTTP status
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const data: DeckListApiResponse = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: "API returned unsuccessful response",
      };
    }

    return {
      success: true,
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    // Handle network errors, timeouts, etc.
    let errorMessage = "Failed to fetch deck list";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Request timed out";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
