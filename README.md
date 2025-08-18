# @junodeck/notebook-renderer

React components for rendering parsed Jupyter notebooks as beautiful presentations.

## Overview

This library provides React components to render Jupyter notebooks that have been parsed into a JSON structure. It focuses purely on rendering and presentation, without including parsing logic.

## Installation

```bash
# Local workspace installation
npm install @junodeck/notebook-renderer
```

## Features

- 🎨 **Beautiful Rendering** - Clean, modern UI for notebook content
- 📱 **Responsive Design** - Works on all device sizes
- 🎭 **Multiple Layouts** - Slideshow and page layouts
- 🎨 **Themeable** - Customizable themes including Jupiter-inspired designs
- 🔧 **TypeScript** - Full type safety and IntelliSense support
- ⚡ **Performance** - Optimized rendering with React best practices

## Usage

### Setup

First, import the CSS styles in your application:

```tsx
// In your main CSS file or component
import "@junodeck/notebook-renderer/dist/style.css";
```

Or in CSS:

```css
@import "@junodeck/notebook-renderer/dist/style.css";
```

### Theme Support

The library includes built-in light/dark theme support. Set the theme using:

1. **Data attribute** on a parent element:

```html
<div data-theme="dark">
  <!-- Your notebook components -->
</div>
```

2. **CSS class** on a parent element:

```html
<div class="dark">
  <!-- Your notebook components -->
</div>
```

### Custom Styling

You can customize the appearance by overriding CSS custom properties:

```css
:root {
  /* Light theme customization */
  --nb-bg-primary: #ffffff;
  --nb-text-primary: #1e293b;
  --nb-link: #2563eb;
  /* ... other variables */
}

.dark {
  /* Dark theme customization */
  --nb-bg-primary: #0f172a;
  --nb-text-primary: #f1f5f9;
  --nb-link: #60a5fa;
  /* ... other variables */
}
```

### Basic Usage

```tsx
import { NotebookRenderer } from "@junodeck/notebook-renderer";
import type { JupiterNotebook } from "@junodeck/notebook-renderer";
import "@junodeck/notebook-renderer/dist/style.css";

function App() {
  const notebook: JupiterNotebook = {
    // Your parsed notebook data
  };

  return (
    <NotebookRenderer notebook={notebook} theme="jupiter-dark" layout="page" />
  );
}
```

### Individual Cell Components

```tsx
import {
  CodeCell,
  MarkdownCell,
  OutputCell,
} from "@junodeck/notebook-renderer";

function CustomNotebook() {
  return (
    <div>
      <MarkdownCell
        source={["# My Notebook", "This is a markdown cell"]}
        metadata={{}}
      />

      <CodeCell
        source={["print('Hello, World!')"]}
        language="python"
        executionCount={1}
        outputs={[]}
      />

      <OutputCell
        output={{
          outputType: "stream",
          text: ["Hello, World!\n"],
        }}
      />
    </div>
  );
}
```

### Custom Cell Components

You can provide your own custom components to wrap or replace the default cell rendering:

```tsx
import {
  NotebookRenderer,
  type CellComponentProps,
} from "@junodeck/notebook-renderer";

// Custom Code Cell with syntax highlighting theme
const CustomCodeCell: React.FC<CellComponentProps> = ({
  cell,
  showExecutionCount,
  cellIndex,
}) => {
  return (
    <div className="my-custom-code-cell">
      <div className="cell-header">
        Code Cell #{cellIndex + 1}
        {showExecutionCount && cell.executionCount && (
          <span className="execution-count">In [{cell.executionCount}]:</span>
        )}
      </div>
      <pre className="code-content">
        <code>{cell.source.join("\n")}</code>
      </pre>
      {cell.outputs && cell.outputs.length > 0 && (
        <div className="outputs">{/* Render outputs */}</div>
      )}
    </div>
  );
};

// Custom Markdown Cell with enhanced styling
const CustomMarkdownCell: React.FC<CellComponentProps> = ({ cell }) => {
  const markdownContent = cell.source.join("\n");

  return (
    <div className="my-custom-markdown-cell">
      <div className="markdown-content">
        {/* Your custom markdown rendering logic */}
        {markdownContent}
      </div>
    </div>
  );
};

// Use custom components
function App() {
  const customComponents = {
    CodeCell: CustomCodeCell,
    MarkdownCell: CustomMarkdownCell,
    // RawCell: CustomRawCell, // Optional
  };

  return (
    <NotebookRenderer
      notebook={notebook}
      customComponents={customComponents}
      theme="jupiter-dark"
      layout="page"
    />
  );
}
```

### Advanced Custom Components

For more complex customizations, you can create sophisticated wrapper components:

```tsx
import {
  NotebookRenderer,
  type CellComponentProps,
  OutputCell,
} from "@junodeck/notebook-renderer";

// Advanced Code Cell with collapsible outputs
const AdvancedCodeCell: React.FC<CellComponentProps> = ({
  cell,
  showExecutionCount,
  cellIndex,
}) => {
  const [outputsVisible, setOutputsVisible] = useState(true);

  return (
    <div className="advanced-code-cell">
      <div className="cell-toolbar">
        <span className="cell-type">Code</span>
        {showExecutionCount && cell.executionCount && (
          <span className="execution-badge">In [{cell.executionCount}]</span>
        )}
        {cell.outputs && cell.outputs.length > 0 && (
          <button
            onClick={() => setOutputsVisible(!outputsVisible)}
            className="toggle-outputs"
          >
            {outputsVisible ? "Hide" : "Show"} Outputs
          </button>
        )}
      </div>

      <pre className="code-block">
        <code>{cell.source.join("\n")}</code>
      </pre>

      {outputsVisible && cell.outputs && (
        <div className="outputs-section">
          {cell.outputs.map((output, idx) => (
            <OutputCell key={idx} output={output} />
          ))}
        </div>
      )}
    </div>
  );
};

// Markdown Cell with table of contents generation
const TOCMarkdownCell: React.FC<CellComponentProps> = ({ cell }) => {
  const content = cell.source.join("\n");
  const headers = content.match(/^#+\s+(.+)$/gm) || [];

  return (
    <div className="toc-markdown-cell">
      {headers.length > 0 && (
        <div className="toc">
          <h4>Contents:</h4>
          <ul>
            {headers.map((header, idx) => (
              <li key={idx}>{header.replace(/^#+\s+/, "")}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="markdown-content">
        {/* Your markdown rendering */}
        {content}
      </div>
    </div>
  );
};
```

### Custom Layouts

```tsx
import { SlideshowLayout, PageLayout } from '@junodeck/notebook-renderer';

// Slideshow presentation
<SlideshowLayout notebook={notebook} theme="jupiter-light" />

// Single page layout
<PageLayout notebook={notebook} theme="default" />
```

### Hooks

```tsx
import { useNotebook } from "@junodeck/notebook-renderer";

function NotebookStats() {
  const { stats, visibleCells, groups } = useNotebook(notebook);

  return (
    <div>
      <p>Total cells: {stats.totalCells}</p>
      <p>Code cells: {stats.codeCells}</p>
      <p>Reading time: ~{stats.estimatedReadingTime} min</p>
    </div>
  );
}
```

## API Reference

### Components

#### `NotebookRenderer`

Main component for rendering complete notebooks.

**Props:**

- `notebook: JupiterNotebook` - Parsed notebook data
- `theme?: string` - Theme name (default: "default")
- `layout?: "page" | "slideshow"` - Layout type (default: "page")
- `className?: string` - Additional CSS classes
- `showExecutionCount?: boolean` - Show execution counts (default: true)
- `showCellNumbers?: boolean` - Show cell numbers (default: false)
- `showMetadata?: boolean` - Show cell metadata (default: false)
- `customComponents?: CustomCellComponents` - Custom cell components

#### `CodeCell`

Renders code cells with syntax highlighting.

**Props:**

- `source: string[]` - Code lines
- `language?: string` - Programming language (default: "python")
- `executionCount?: number` - Execution number
- `outputs?: JupiterOutput[]` - Cell outputs
- `metadata?: Record<string, unknown>` - Cell metadata

#### `MarkdownCell`

Renders markdown content.

**Props:**

- `source: string[]` - Markdown lines
- `metadata?: Record<string, unknown>` - Cell metadata

#### `OutputCell`

Renders cell outputs (text, images, etc.).

**Props:**

- `output: JupiterOutput` - Output data

### Types

```typescript
interface JupiterNotebook {
  metadata: {
    title?: string;
    kernelspec?: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info?: {
      name: string;
      version?: string;
    };
  };
  cells: JupiterCell[];
  presentation?: {
    layout: "slideshow" | "page";
    theme: string;
    groups: Array<{
      id: string;
      name: string;
      cellIds: string[];
      visible: boolean;
    }>;
  };
}

interface CellComponentProps {
  cell: JupiterCell;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
  cellIndex?: number;
}

interface CustomCellComponents {
  CodeCell?: React.ComponentType<CellComponentProps>;
  MarkdownCell?: React.ComponentType<CellComponentProps>;
  RawCell?: React.ComponentType<CellComponentProps>;
}
```

## Themes

Available themes:

- `default` - Clean, minimal design
- `jupiter-dark` - Dark theme inspired by Jupiter's atmosphere
- `jupiter-light` - Light theme with Jupiter colors
- `scientific` - Academic paper style
- `presentation` - High contrast for presentations

## Examples

### Creating a Custom Code Cell with Copy Button

```tsx
import {
  NotebookRenderer,
  type CellComponentProps,
  OutputCell,
} from "@junodeck/notebook-renderer";

const CopyableCodeCell: React.FC<CellComponentProps> = ({
  cell,
  showExecutionCount,
  cellIndex,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const code = cell.source.join("\n");
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="copyable-code-cell">
      <div className="code-header">
        <span className="cell-label">Code Cell</span>
        {showExecutionCount && cell.executionCount && (
          <span className="execution-count">In [{cell.executionCount}]</span>
        )}
        <button
          onClick={copyToClipboard}
          className="copy-button"
          title="Copy code"
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>

      <pre className="code-content">
        <code>{cell.source.join("\n")}</code>
      </pre>

      {cell.outputs && cell.outputs.length > 0 && (
        <div className="outputs">
          {cell.outputs.map((output, idx) => (
            <OutputCell key={idx} output={output} />
          ))}
        </div>
      )}
    </div>
  );
};

// Usage
function App() {
  return (
    <NotebookRenderer
      notebook={notebook}
      customComponents={{ CodeCell: CopyableCodeCell }}
    />
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build the library
npm run build

# Type checking
npm run type-check
```

## Contributing

This library is part of the JunoDeck project. Please refer to the main project repository for contribution guidelines.

## License

ISC License - see LICENSE file for details.

## Related Projects

- **JunoDeck** - Main application for converting Jupyter notebooks to presentations
- **Jupiter Parser** - Parsing logic for .ipynb files (separate from this rendering library)
