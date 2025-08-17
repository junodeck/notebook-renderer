// Copy only the interfaces from jupiter.ts, no parser functions
export interface JupiterCell {
  id: string;
  type: "code" | "markdown" | "raw";
  source: string[];
  metadata: Record<string, unknown>;
  outputs?: JupiterOutput[];
  executionCount?: number | null;
  tags?: string[];
  visible: boolean;
  grouped?: boolean;
  groupId?: string;
  order: number;
}

export interface JupiterOutput {
  outputType: "stream" | "display_data" | "execute_result" | "error";
  data?: {
    "text/plain"?: string[];
    "text/html"?: string[];
    "image/png"?: string;
    "image/jpeg"?: string;
    "image/svg+xml"?: string;
    "application/json"?: unknown;
    "text/markdown"?: string[];
  };
  text?: string[];
  name?: string;
  executionCount?: number;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

export interface JupiterNotebook {
  metadata: {
    kernelspec?: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info?: {
      name: string;
      version?: string;
    };
    title?: string;
    authors?: string[];
    created?: string;
    modified?: string;
  };
  cells: JupiterCell[];
  nbformat: number;
  nbformat_minor: number;
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
