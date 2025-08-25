/**
 * Markdown parsing utilities for Jupyter notebook cells
 * Provides comprehensive markdown parsing with support for:
 * - Headers (H1-H6)
 * - Text formatting (bold, italic, strikethrough)
 * - Code blocks and inline code
 * - Links and images
 * - Lists (ordered and unordered)
 * - Tables
 * - Blockquotes
 * - Horizontal rules
 * - Line breaks and paragraphs
 */

export interface MarkdownParseOptions {
  /**
   * Whether to sanitize HTML content (default: true)
   */
  sanitize?: boolean;

  /**
   * Whether to open links in new tab (default: true)
   */
  linksInNewTab?: boolean;

  /**
   * Custom class prefix for generated elements (default: 'nb-md')
   */
  classPrefix?: string;

  /**
   * Whether to enable GitHub Flavored Markdown features (default: true)
   */
  gfm?: boolean;

  /**
   * Whether to enable math expressions (default: false)
   */
  math?: boolean;
}

export interface ParsedMarkdown {
  /**
   * The parsed HTML content
   */
  html: string;

  /**
   * Extracted metadata (headings, links, etc.)
   */
  metadata: {
    headings: Array<{ level: number; text: string; id: string }>;
    links: Array<{ text: string; url: string; title?: string }>;
    images: Array<{ alt: string; src: string; title?: string }>;
    codeBlocks: Array<{ language?: string; code: string }>;
  };
}

/**
 * Escape HTML characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (match) => htmlEscapes[match] || match);
}

/**
 * Generate a URL-friendly ID from text
 */
export function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Parse headers (H1-H6)
 */
function parseHeaders(
  text: string,
  options: MarkdownParseOptions
): {
  text: string;
  headings: Array<{ level: number; text: string; id: string }>;
} {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const classPrefix = options.classPrefix || "nb-md";

  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const parsedText = text.replace(headerRegex, (match, hashes, content) => {
    const level = hashes.length;
    const cleanContent = content.trim();
    const id = generateId(cleanContent);

    headings.push({ level, text: cleanContent, id });

    return `<h${level} id="${id}" class="${classPrefix}-h${level}">${cleanContent}</h${level}>`;
  });

  return { text: parsedText, headings };
}

/**
 * Parse text formatting (bold, italic, strikethrough)
 */
function parseTextFormatting(
  text: string,
  options: MarkdownParseOptions
): string {
  const classPrefix = options.classPrefix || "nb-md";

  return (
    text
      // Strikethrough (GFM)
      .replace(
        /~~(.*?)~~/g,
        `<del class="${classPrefix}-strikethrough">$1</del>`
      )
      // Bold and italic combined
      .replace(
        /\*\*\*(.*?)\*\*\*/g,
        `<strong class="${classPrefix}-bold"><em class="${classPrefix}-italic">$1</em></strong>`
      )
      .replace(
        /\_\_\_(.*?)\_\_\_/g,
        `<strong class="${classPrefix}-bold"><em class="${classPrefix}-italic">$1</em></strong>`
      )
      // Bold
      .replace(
        /\*\*(.*?)\*\*/g,
        `<strong class="${classPrefix}-bold">$1</strong>`
      )
      .replace(
        /\_\_(.*?)\_\_/g,
        `<strong class="${classPrefix}-bold">$1</strong>`
      )
      // Italic
      .replace(/\*(.*?)\*/g, `<em class="${classPrefix}-italic">$1</em>`)
      .replace(/\_(.*?)\_/g, `<em class="${classPrefix}-italic">$1</em>`)
  );
}

/**
 * Parse code blocks and inline code
 */
function parseCode(
  text: string,
  options: MarkdownParseOptions
): { text: string; codeBlocks: Array<{ language?: string; code: string }> } {
  const codeBlocks: Array<{ language?: string; code: string }> = [];
  const classPrefix = options.classPrefix || "nb-md";

  // Code blocks with language
  let parsedText = text.replace(
    /```(\w+)?\n?([\s\S]*?)```/g,
    (match, language, code) => {
      const trimmedCode = code.trim();
      codeBlocks.push({ language: language || undefined, code: trimmedCode });

      const langClass = language ? ` language-${language}` : "";
      return `<pre class="${classPrefix}-code-block"><code class="${classPrefix}-code${langClass}">${escapeHtml(
        trimmedCode
      )}</code></pre>`;
    }
  );

  // Inline code
  parsedText = parsedText.replace(
    /`([^`]+)`/g,
    `<code class="${classPrefix}-inline-code">$1</code>`
  );

  return { text: parsedText, codeBlocks };
}

/**
 * Parse links and images
 */
function parseLinksAndImages(
  text: string,
  options: MarkdownParseOptions
): {
  text: string;
  links: Array<{ text: string; url: string; title?: string }>;
  images: Array<{ alt: string; src: string; title?: string }>;
} {
  const links: Array<{ text: string; url: string; title?: string }> = [];
  const images: Array<{ alt: string; src: string; title?: string }> = [];
  const classPrefix = options.classPrefix || "nb-md";
  const targetAttr = options.linksInNewTab
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  // Images (must come before links as they have similar syntax)
  let parsedText = text.replace(
    /!\[([^\]]*)\]\(([^)]+?)(?:\s+"([^"]+)")?\)/g,
    (match, alt, src, title) => {
      images.push({ alt, src, title });
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(
        alt
      )}" class="${classPrefix}-image"${titleAttr}>`;
    }
  );

  // Links
  parsedText = parsedText.replace(
    /\[([^\]]+)\]\(([^)]+?)(?:\s+"([^"]+)")?\)/g,
    (match, text, url, title) => {
      links.push({ text, url, title });
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(
        url
      )}" class="${classPrefix}-link"${titleAttr}${targetAttr}>${text}</a>`;
    }
  );

  return { text: parsedText, links, images };
}

/**
 * Parse lists (ordered and unordered)
 */
function parseLists(text: string, options: MarkdownParseOptions): string {
  const classPrefix = options.classPrefix || "nb-md";

  // Split text into lines for processing
  const lines = text.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      result.push(line || "");
      i++;
      continue;
    }

    // Check for unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const listItems: string[] = [];

      while (
        i < lines.length &&
        lines[i] &&
        /^\s*[-*+]\s+/.test(lines[i] || "")
      ) {
        const currentLine = lines[i];
        if (currentLine) {
          const itemMatch = currentLine.match(/^\s*[-*+]\s+(.*)$/);
          if (itemMatch && itemMatch[1]) {
            listItems.push(
              `<li class="${classPrefix}-list-item">${itemMatch[1]}</li>`
            );
          }
        }
        i++;
      }

      result.push(
        `<ul class="${classPrefix}-list ${classPrefix}-unordered-list">${listItems.join(
          ""
        )}</ul>`
      );
      continue;
    }

    // Check for ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems: string[] = [];

      while (
        i < lines.length &&
        lines[i] &&
        /^\s*\d+\.\s+/.test(lines[i] || "")
      ) {
        const currentLine = lines[i];
        if (currentLine) {
          const itemMatch = currentLine.match(/^\s*\d+\.\s+(.*)$/);
          if (itemMatch && itemMatch[1]) {
            listItems.push(
              `<li class="${classPrefix}-list-item">${itemMatch[1]}</li>`
            );
          }
        }
        i++;
      }

      result.push(
        `<ol class="${classPrefix}-list ${classPrefix}-ordered-list">${listItems.join(
          ""
        )}</ol>`
      );
      continue;
    }

    result.push(line || "");
    i++;
  }

  return result.join("\n");
}

/**
 * Parse tables (GitHub Flavored Markdown)
 */
function parseTables(text: string, options: MarkdownParseOptions): string {
  if (!options.gfm) return text;

  const classPrefix = options.classPrefix || "nb-md";
  const lines = text.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if this could be a table header
    if (
      line &&
      nextLine &&
      line.includes("|") &&
      nextLine.match(/^\s*\|?[\s:|-]+\|?[\s:|-]*$/)
    ) {
      // Parse table header
      const headerCells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);
      const alignments = nextLine
        .split("|")
        .map((cell) => {
          const trimmed = cell.trim();
          if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
          if (trimmed.endsWith(":")) return "right";
          return "left";
        })
        .filter((_, index) => index < headerCells.length);

      let tableHtml = `<table class="${classPrefix}-table">`;
      tableHtml +=
        '<thead class="' +
        classPrefix +
        '-table-head"><tr class="' +
        classPrefix +
        '-table-row">';

      headerCells.forEach((cell, index) => {
        const align = alignments[index] || "left";
        const alignClass =
          align !== "left" ? ` ${classPrefix}-align-${align}` : "";
        tableHtml += `<th class="${classPrefix}-table-header${alignClass}">${cell}</th>`;
      });

      tableHtml +=
        '</tr></thead><tbody class="' + classPrefix + '-table-body">';

      // Skip header and separator line
      i += 2;

      // Parse table rows
      while (i < lines.length && lines[i] && (lines[i] || "").includes("|")) {
        const currentLine = lines[i];
        if (currentLine && currentLine.includes("|")) {
          const rowCells = currentLine
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell);
          if (rowCells.length > 0) {
            tableHtml += `<tr class="${classPrefix}-table-row">`;
            rowCells.forEach((cell, index) => {
              const align = alignments[index] || "left";
              const alignClass =
                align !== "left" ? ` ${classPrefix}-align-${align}` : "";
              tableHtml += `<td class="${classPrefix}-table-cell${alignClass}">${cell}</td>`;
            });
            tableHtml += "</tr>";
          }
        }
        i++;
      }

      tableHtml += "</tbody></table>";
      result.push(tableHtml);
      continue;
    }

    result.push(line || "");
    i++;
  }

  return result.join("\n");
}

/**
 * Parse blockquotes
 */
function parseBlockquotes(text: string, options: MarkdownParseOptions): string {
  const classPrefix = options.classPrefix || "nb-md";
  const lines = text.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line && line.startsWith(">")) {
      const quoteLines: string[] = [];

      while (
        i < lines.length &&
        lines[i] &&
        (lines[i]!.startsWith(">") || lines[i]!.trim() === "")
      ) {
        const currentLine = lines[i];
        if (currentLine && currentLine.startsWith(">")) {
          quoteLines.push(currentLine.substring(1).trim());
        } else if (currentLine && currentLine.trim() === "") {
          quoteLines.push("");
        }
        i++;
      }

      const quoteContent = quoteLines.join("\n").trim();
      result.push(
        `<blockquote class="${classPrefix}-blockquote">${quoteContent}</blockquote>`
      );
      continue;
    }

    result.push(line || "");
    i++;
  }

  return result.join("\n");
}

/**
 * Parse horizontal rules
 */
function parseHorizontalRules(
  text: string,
  options: MarkdownParseOptions
): string {
  const classPrefix = options.classPrefix || "nb-md";
  return text.replace(
    /^(\s*)([-*_])\s*\2\s*\2[\s-*_]*$/gm,
    `$1<hr class="${classPrefix}-hr">`
  );
}

/**
 * Parse paragraphs and line breaks
 */
function parseParagraphs(text: string, options: MarkdownParseOptions): string {
  const classPrefix = options.classPrefix || "nb-md";

  // Split by double newlines to identify paragraphs
  const blocks = text.split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Don't wrap block elements in paragraphs
      if (trimmed.match(/^<(h[1-6]|ul|ol|table|blockquote|pre|hr|div)/)) {
        return trimmed;
      }

      // Convert single line breaks to <br> within paragraphs
      const withBreaks = trimmed.replace(/\n/g, "<br>");

      return `<p class="${classPrefix}-paragraph">${withBreaks}</p>`;
    })
    .filter((block) => block)
    .join("\n\n");
}

/**
 * Main markdown parsing function
 */
export function parseMarkdown(
  markdown: string,
  options: MarkdownParseOptions = {}
): ParsedMarkdown {
  const opts: Required<MarkdownParseOptions> = {
    sanitize: true,
    linksInNewTab: true,
    classPrefix: "nb-md",
    gfm: true,
    math: false,
    ...options,
  };

  let text = markdown;
  const metadata = {
    headings: [] as Array<{ level: number; text: string; id: string }>,
    links: [] as Array<{ text: string; url: string; title?: string }>,
    images: [] as Array<{ alt: string; src: string; title?: string }>,
    codeBlocks: [] as Array<{ language?: string; code: string }>,
  };

  // Parse in order of precedence

  // 1. Code blocks (must be first to avoid processing markdown inside code)
  const codeResult = parseCode(text, opts);
  text = codeResult.text;
  metadata.codeBlocks = codeResult.codeBlocks;

  // 2. Headers
  const headerResult = parseHeaders(text, opts);
  text = headerResult.text;
  metadata.headings = headerResult.headings;

  // 3. Horizontal rules
  text = parseHorizontalRules(text, opts);

  // 4. Tables (GFM)
  text = parseTables(text, opts);

  // 5. Blockquotes
  text = parseBlockquotes(text, opts);

  // 6. Lists
  text = parseLists(text, opts);

  // 7. Links and images
  const linkResult = parseLinksAndImages(text, opts);
  text = linkResult.text;
  metadata.links = linkResult.links;
  metadata.images = linkResult.images;

  // 8. Text formatting
  text = parseTextFormatting(text, opts);

  // 9. Paragraphs and line breaks (must be last)
  text = parseParagraphs(text, opts);

  return {
    html: text,
    metadata,
  };
}

/**
 * Simple markdown to HTML converter (legacy compatibility)
 */
export function markdownToHtml(
  markdown: string,
  options: MarkdownParseOptions = {}
): string {
  return parseMarkdown(markdown, options).html;
}

/**
 * Extract table of contents from markdown
 */
export function extractTableOfContents(
  markdown: string
): Array<{ level: number; text: string; id: string }> {
  const result = parseMarkdown(markdown, { sanitize: false });
  return result.metadata.headings;
}

/**
 * Extract all links from markdown
 */
export function extractLinks(
  markdown: string
): Array<{ text: string; url: string; title?: string }> {
  const result = parseMarkdown(markdown, { sanitize: false });
  return result.metadata.links;
}

/**
 * Extract all images from markdown
 */
export function extractImages(
  markdown: string
): Array<{ alt: string; src: string; title?: string }> {
  const result = parseMarkdown(markdown, { sanitize: false });
  return result.metadata.images;
}

/**
 * Extract all code blocks from markdown
 */
export function extractCodeBlocks(
  markdown: string
): Array<{ language?: string; code: string }> {
  const result = parseMarkdown(markdown, { sanitize: false });
  return result.metadata.codeBlocks;
}
