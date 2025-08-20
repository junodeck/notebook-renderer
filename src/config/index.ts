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

  // Auto-detect based on current location (browser only)
  if (isBrowser) {
    const { protocol, hostname, port } = window.location;

    // Development detection
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("dev")
    ) {
      const devPort = port || "3000";
      return {
        baseUrl: `${protocol}//${hostname}:${devPort}`,
        version: "v1",
      };
    }

    // Production - use current domain
    return {
      baseUrl: `${protocol}//${hostname}`,
      version: "v1",
    };
  }

  // Server-side fallback
  return {
    baseUrl:
      process.env.NODE_ENV === "production"
        ? "https://junodeck.com"
        : "http://localhost:3000",
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
