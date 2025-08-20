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

## Domain Configuration

The library automatically detects the correct API domain:

### Development

- **Auto-detection**: Uses `http://localhost:3000` when hostname is `localhost`
- **Port detection**: Automatically uses current port if different

### Production

- **Auto-detection**: Uses current domain with HTTPS
- **Environment override**: Set `JUNODECK_API_URL` environment variable
- **Runtime override**: Set `window.__JUNODECK_API_URL__` in browser

### Build-Time Configuration

For production builds, you can set the API URL at build time:

#### Option 1: Environment Variable

```bash
# During build
JUNODECK_API_URL=https://api.junodeck.com npm run build
```

#### Option 2: Webpack DefinePlugin

```javascript
// webpack.config.js
new webpack.DefinePlugin({
  "process.env.JUNODECK_API_URL": JSON.stringify("https://api.junodeck.com"),
});
```

#### Option 3: Runtime Configuration

```javascript
// Set before importing the library
window.__JUNODECK_API_URL__ = "https://api.junodeck.com";
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

      - name: Build with production API
        env:
          JUNODECK_API_URL: https://junodeck.com
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
console.log(config.baseUrl); // e.g., "https://junodeck.com"
console.log(config.version); // "v1"
```

### `getApiUrl(endpoint)`

Get full API URL for an endpoint:

```typescript
import { getApiUrl } from "@junodeck/notebook-renderer";

const url = getApiUrl("/deck/123");
// Returns: "https://junodeck.com/api/v1/deck/123"
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
  ApiConfig,
} from "@junodeck/notebook-renderer";
```
