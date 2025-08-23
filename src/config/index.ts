/**
 * Configuration for the JunoDeck Notebook Renderer
 */

export interface ApiConfig {
  baseUrl: string;
  version: string;
}

/**
 * Get the base URL based on environment
 * This can be overridden by setting JUNODECK_API_URL environment variable
 */
export function getApiConfig(): ApiConfig {
  // Check if we're in browser environment
  const isBrowser = typeof window !== "undefined";

  // Environment variable override (for build time configuration)
  const envApiUrl = isBrowser
    ? (window as Window & { __JUNODECK_API_URL__?: string })
        .__JUNODECK_API_URL__
    : process.env.JUNODECK_API_URL;

  if (envApiUrl) {
    return {
      baseUrl: envApiUrl,
      version: "v1",
    };
  }

  // Default to www.junodeck.cc for all environments
  // Only override with environment variable
  return {
    baseUrl: "https://www.junodeck.cc",
    version: "v1",
  };
}

/**
 * Get the full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  const config = getApiConfig();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${config.baseUrl}/api/${config.version}${cleanEndpoint}`;
}
