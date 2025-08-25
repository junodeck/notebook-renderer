# JunoDeck Notebook Renderer API

The notebook renderer library includes built-in API functions to fetch deck data from JunoDeck servers.

## Quick Start

```typescript
import { fetchNotebook, NotebookRenderer } from "@junodeck/notebook-renderer";

// Fetch and render a deck
const MyComponent = () => {
  const [notebook, setNotebook] = useState(null);

  useEffect(() => {
    fetchNotebook("deck-123", {
      apiKey: "jdk_your_api_key_here",
    }).then(setNotebook);
  }, []);

  if (!notebook) return <div>Loading...</div>;

  return (
    <NotebookRenderer notebook={notebook} theme="jupiter-light" layout="page" />
  );
};
```

## API Functions

### `fetchDeck(deckId, options)`

Fetches complete deck data including metadata and notebook content.

```typescript
const result = await fetchDeck("deck-123", {
  apiKey: "jdk_your_api_key_here",
  timeout: 10000, // optional, defaults to 10s
  headers: { "Custom-Header": "value" }, // optional
});

if (result.success) {
  console.log(result.data.title);
  console.log(result.data.subtitle); // Optional subtitle
  console.log(result.data.heroImageUrl); // Optional hero image
  console.log(result.data.tag); // Optional categorization tag
  console.log(result.data.notebookData); // JupiterNotebook object
  console.log(result.data.theme);
} else {
  console.error(result.error);
}
```

### `fetchNotebook(deckId, options)`

Convenience function that returns only the notebook data, ready for `NotebookRenderer`.

```typescript
const notebook = await fetchNotebook("deck-123", {
  apiKey: "jdk_your_api_key_here",
});

if (notebook) {
  // Ready to use with NotebookRenderer
} else {
  // Handle error (logged to console)
}
```

### `fetchDeckList(options)`

Fetch all published decks created by the authenticated user with pagination support.

```typescript
const result = await fetchDeckList({
  apiKey: "jdk_your_api_key_here",
  skip: 0, // optional, default: 0
  limit: 10, // optional, default: 20, max: 100
  timeout: 10000, // optional
  headers: { "Custom-Header": "value" }, // optional
});

if (result.success && result.data && result.pagination) {
  console.log(`Found ${result.pagination.total} decks total`);
  console.log(
    `Showing ${result.data.length} decks (${result.pagination.skip + 1}-${
      result.pagination.skip + result.data.length
    })`
  );

  result.data.forEach((deck) => {
    console.log(`${deck.title}: ${deck.publicUrl}`);
    console.log(`Notebook: ${deck.notebookTitle}`);
    if (deck.subtitle) console.log(`Subtitle: ${deck.subtitle}`);
    if (deck.tag) console.log(`Tag: ${deck.tag}`);
    if (deck.heroImageUrl) console.log(`Hero Image: ${deck.heroImageUrl}`);
  });

  if (result.pagination.hasMore) {
    console.log("More decks available - use skip parameter for next page");
  }
} else {
  console.error(result.error);
}
```

#### Pagination Example

```typescript
// Fetch first page
let skip = 0;
const limit = 5;

do {
  const result = await fetchDeckList({
    apiKey: "jdk_your_api_key_here",
    skip,
    limit,
  });

  if (result.success && result.data && result.pagination) {
    console.log(`Page ${Math.floor(skip / limit) + 1}:`);
    result.data.forEach((deck, index) => {
      console.log(`${skip + index + 1}. ${deck.title}`);
      if (deck.subtitle) console.log(`   Subtitle: ${deck.subtitle}`);
      if (deck.tag) console.log(`   Tag: ${deck.tag}`);
    });

    if (result.pagination.hasMore) {
      skip += limit; // Move to next page
    } else {
      break; // No more pages
    }
  } else {
    console.error("Failed to fetch decks:", result.error);
    break;
  }
} while (true);
```

## Domain Configuration

The library uses `https://www.junodeck.cc` as the default API domain for all environments.

### Default Behavior

- **Default URL**: Always uses `https://www.junodeck.cc` unless overridden
- **Environment override**: Set `JUNODECK_API_URL` environment variable to use a different URL
- **Runtime override**: Set `window.__JUNODECK_API_URL__` in browser to use a different URL

### Local Development

For local development, you'll typically want to override the default URL:

```bash
# Set environment variable for local development
export JUNODECK_API_URL=http://localhost:3000
# or
JUNODECK_API_URL=http://localhost:3000 npm run dev
```

### Build-Time Configuration

For production builds, you can set the API URL at build time:

#### Option 1: Environment Variable

```bash
# During build - use custom API URL
JUNODECK_API_URL=https://api.custom-domain.com npm run build

# For local development
JUNODECK_API_URL=http://localhost:3000 npm run build
```

#### Option 2: Webpack DefinePlugin

```javascript
// webpack.config.js
new webpack.DefinePlugin({
  "process.env.JUNODECK_API_URL": JSON.stringify(
    "https://api.custom-domain.com"
  ),
});
```

#### Option 3: Runtime Configuration

```javascript
// Set before importing the library
window.__JUNODECK_API_URL__ = "https://api.custom-domain.com";
```

### GitHub Actions Example

```yaml
name: Build and Deploy
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build with custom API (optional)
        env:
          JUNODECK_API_URL: https://api.custom-domain.com
        run: npm run build

      - name: Deploy
        run: npm run deploy
```

## Configuration API

### `getApiConfig()`

Get current API configuration:

```typescript
import { getApiConfig } from "@junodeck/notebook-renderer";

const config = getApiConfig();
console.log(config.baseUrl); // "https://www.junodeck.cc" (default)
console.log(config.version); // "v1"
```

### `getApiUrl(endpoint)`

Get full API URL for an endpoint:

```typescript
import { getApiUrl } from "@junodeck/notebook-renderer";

const url = getApiUrl("/deck/123");
// Returns: "https://www.junodeck.cc/api/v1/deck/123"
```

## Error Handling

The API functions provide detailed error information:

```typescript
const result = await fetchDeck("deck-123", { apiKey: "invalid" });

if (!result.success) {
  switch (result.error) {
    case "Request timed out":
      // Handle timeout
      break;
    case "HTTP 401: Unauthorized":
      // Handle invalid API key
      break;
    case "HTTP 404: Not Found":
      // Handle deck not found
      break;
    default:
      // Handle other errors
      console.error("API Error:", result.error);
  }
}
```

## TypeScript Types

All functions are fully typed:

```typescript
import type {
  DeckApiResponse,
  FetchDeckOptions,
  FetchDeckResult,
  DeckListApiResponse,
  FetchDeckListResult,
  FetchDeckListOptions,
  ApiConfig,
} from "@junodeck/notebook-renderer";
```
