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

### Basic Usage

```tsx
import { NotebookRenderer } from "@junodeck/notebook-renderer";
import type { JupiterNotebook } from "@junodeck/notebook-renderer";

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
```

## Themes

Available themes:

- `default` - Clean, minimal design
- `jupiter-dark` - Dark theme inspired by Jupiter's atmosphere
- `jupiter-light` - Light theme with Jupiter colors
- `scientific` - Academic paper style
- `presentation` - High contrast for presentations

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
