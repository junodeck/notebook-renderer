import { useState, useEffect, useCallback } from "react";

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
    code: {
      background: string;
      text: string;
      keyword: string;
      string: string;
      comment: string;
      number: string;
    };
  };
  typography: {
    fontFamily: string;
    codeFontFamily: string;
    fontSize: {
      base: string;
      heading: string;
      code: string;
    };
  };
}

export const defaultThemes: Record<string, ThemeConfig> = {
  default: {
    name: "default",
    displayName: "Default",
    description: "Clean, minimal design",
    colors: {
      background: "#ffffff",
      foreground: "#1a1a1a",
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      muted: "#f8fafc",
      border: "#e2e8f0",
      code: {
        background: "#f8fafc",
        text: "#1e293b",
        keyword: "#7c3aed",
        string: "#059669",
        comment: "#64748b",
        number: "#dc2626",
      },
    },
    typography: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      codeFontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: {
        base: "16px",
        heading: "24px",
        code: "14px",
      },
    },
  },

  "jupiter-dark": {
    name: "jupiter-dark",
    displayName: "Jupiter Dark",
    description: "Dark theme inspired by Jupiter's atmosphere",
    colors: {
      background: "#0f0f0f",
      foreground: "#e2e8f0",
      primary: "#f97316",
      secondary: "#a855f7",
      accent: "#fbbf24",
      muted: "#1e1e1e",
      border: "#374151",
      code: {
        background: "#1a1a1a",
        text: "#e2e8f0",
        keyword: "#a855f7",
        string: "#34d399",
        comment: "#6b7280",
        number: "#f97316",
      },
    },
    typography: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      codeFontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: {
        base: "16px",
        heading: "28px",
        code: "14px",
      },
    },
  },

  "jupiter-light": {
    name: "jupiter-light",
    displayName: "Jupiter Light",
    description: "Light theme with Jupiter colors",
    colors: {
      background: "#fefefe",
      foreground: "#1a1a1a",
      primary: "#ea580c",
      secondary: "#9333ea",
      accent: "#f59e0b",
      muted: "#fef3c7",
      border: "#fed7aa",
      code: {
        background: "#fff7ed",
        text: "#1c1917",
        keyword: "#9333ea",
        string: "#059669",
        comment: "#78716c",
        number: "#ea580c",
      },
    },
    typography: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      codeFontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: {
        base: "16px",
        heading: "26px",
        code: "14px",
      },
    },
  },

  scientific: {
    name: "scientific",
    displayName: "Scientific",
    description: "Academic paper style",
    colors: {
      background: "#ffffff",
      foreground: "#111827",
      primary: "#1f2937",
      secondary: "#6b7280",
      accent: "#3b82f6",
      muted: "#f9fafb",
      border: "#d1d5db",
      code: {
        background: "#f9fafb",
        text: "#111827",
        keyword: "#1f2937",
        string: "#059669",
        comment: "#6b7280",
        number: "#dc2626",
      },
    },
    typography: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      codeFontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: {
        base: "18px",
        heading: "32px",
        code: "16px",
      },
    },
  },

  presentation: {
    name: "presentation",
    displayName: "Presentation",
    description: "High contrast for presentations",
    colors: {
      background: "#1e293b",
      foreground: "#f8fafc",
      primary: "#0ea5e9",
      secondary: "#64748b",
      accent: "#06b6d4",
      muted: "#334155",
      border: "#475569",
      code: {
        background: "#0f172a",
        text: "#f8fafc",
        keyword: "#38bdf8",
        string: "#4ade80",
        comment: "#94a3b8",
        number: "#fb7185",
      },
    },
    typography: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      codeFontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: {
        base: "20px",
        heading: "36px",
        code: "18px",
      },
    },
  },
};

export interface UseThemeReturn {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  setTheme: (themeName: string) => void;
  applyTheme: (theme: ThemeConfig) => void;
  resetTheme: () => void;
}

export function useTheme(initialTheme: string = "default"): UseThemeReturn {
  const [currentThemeName, setCurrentThemeName] = useState(initialTheme);

  const currentTheme = defaultThemes[currentThemeName] || defaultThemes.default;
  const availableThemes = Object.values(defaultThemes);

  const applyTheme = useCallback((theme: ThemeConfig) => {
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty("--nb-bg", theme.colors.background);
    root.style.setProperty("--nb-fg", theme.colors.foreground);
    root.style.setProperty("--nb-primary", theme.colors.primary);
    root.style.setProperty("--nb-secondary", theme.colors.secondary);
    root.style.setProperty("--nb-accent", theme.colors.accent);
    root.style.setProperty("--nb-muted", theme.colors.muted);
    root.style.setProperty("--nb-border", theme.colors.border);

    // Code colors
    root.style.setProperty("--nb-code-bg", theme.colors.code.background);
    root.style.setProperty("--nb-code-text", theme.colors.code.text);
    root.style.setProperty("--nb-code-keyword", theme.colors.code.keyword);
    root.style.setProperty("--nb-code-string", theme.colors.code.string);
    root.style.setProperty("--nb-code-comment", theme.colors.code.comment);
    root.style.setProperty("--nb-code-number", theme.colors.code.number);

    // Typography
    root.style.setProperty("--nb-font-family", theme.typography.fontFamily);
    root.style.setProperty(
      "--nb-code-font-family",
      theme.typography.codeFontFamily
    );
    root.style.setProperty("--nb-font-size", theme.typography.fontSize.base);
    root.style.setProperty(
      "--nb-heading-size",
      theme.typography.fontSize.heading
    );
    root.style.setProperty("--nb-code-size", theme.typography.fontSize.code);

    // Add theme class to body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, "")
      .trim();
    document.body.classList.add(`theme-${theme.name}`);
  }, []);

  const setTheme = useCallback((themeName: string) => {
    if (defaultThemes[themeName]) {
      setCurrentThemeName(themeName);
    }
  }, []);

  const resetTheme = useCallback(() => {
    setCurrentThemeName("default");
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (currentTheme) {
      applyTheme(currentTheme);
    }
  }, [currentTheme, applyTheme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove theme classes
      document.body.className = document.body.className
        .replace(/theme-\w+/g, "")
        .trim();
    };
  }, []);

  return {
    currentTheme: currentTheme as ThemeConfig,
    availableThemes,
    setTheme,
    applyTheme,
    resetTheme,
  };
}

export default useTheme;
