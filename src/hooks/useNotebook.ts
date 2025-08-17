import { useMemo } from "react";
import type { JupiterNotebook, JupiterCell } from "../types";

export interface NotebookStats {
  totalCells: number;
  codeCells: number;
  markdownCells: number;
  rawCells: number;
  cellsWithOutputs: number;
  estimatedReadingTime: number;
  visibleCells: number;
  groupedCells: number;
}

export interface NotebookGroup {
  id: string;
  name: string;
  cellIds: string[];
  visible: boolean;
  cells: JupiterCell[];
}

export interface UseNotebookReturn {
  stats: NotebookStats;
  visibleCells: JupiterCell[];
  groups: NotebookGroup[];
  cellsById: Record<string, JupiterCell>;
  language: string;
  title: string;
  kernelInfo: {
    displayName?: string;
    language?: string;
    name?: string;
  };
}

export function useNotebook(notebook: JupiterNotebook): UseNotebookReturn {
  const stats = useMemo((): NotebookStats => {
    let totalWords = 0;
    let codeCells = 0;
    let markdownCells = 0;
    let rawCells = 0;
    let cellsWithOutputs = 0;
    let visibleCells = 0;
    let groupedCells = 0;

    notebook.cells.forEach((cell) => {
      // Count cell types
      switch (cell.type) {
        case "code":
          codeCells++;
          if (cell.outputs && cell.outputs.length > 0) {
            cellsWithOutputs++;
          }
          // Count words in code comments
          const codeText = cell.source.join(" ");
          const comments = codeText.match(/#.*$/gm) || [];
          totalWords += comments.join(" ").split(/\s+/).length;
          break;

        case "markdown":
          markdownCells++;
          // Count words in markdown
          const markdownText = cell.source.join(" ").replace(/[#*`]/g, "");
          totalWords += markdownText
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
          break;

        case "raw":
          rawCells++;
          break;
      }

      // Count visible and grouped cells
      if (cell.visible !== false) {
        visibleCells++;
      }
      if (cell.grouped) {
        groupedCells++;
      }
    });

    return {
      totalCells: notebook.cells.length,
      codeCells,
      markdownCells,
      rawCells,
      cellsWithOutputs,
      estimatedReadingTime: Math.ceil(totalWords / 200), // 200 words per minute
      visibleCells,
      groupedCells,
    };
  }, [notebook.cells]);

  const visibleCells = useMemo(() => {
    return notebook.cells.filter((cell) => cell.visible !== false);
  }, [notebook.cells]);

  const cellsById = useMemo(() => {
    return notebook.cells.reduce((acc, cell) => {
      acc[cell.id] = cell;
      return acc;
    }, {} as Record<string, JupiterCell>);
  }, [notebook.cells]);

  const groups = useMemo((): NotebookGroup[] => {
    const presentationGroups = notebook.presentation?.groups || [];

    // @ts-expect-error - TODO: fix this
    return presentationGroups.map((group) => ({
      ...group,
      cells: group.cellIds.map((cellId) => cellsById[cellId]).filter(Boolean),
    }));
  }, [notebook.presentation?.groups, cellsById]);

  const language = useMemo(() => {
    return notebook.metadata.language_info?.name || "python";
  }, [notebook.metadata.language_info?.name]);

  const title = useMemo(() => {
    return notebook.metadata.title || "Untitled Notebook";
  }, [notebook.metadata.title]);

  const kernelInfo = useMemo(() => {
    return {
      displayName: notebook.metadata.kernelspec?.display_name,
      language: notebook.metadata.kernelspec?.language,
      name: notebook.metadata.kernelspec?.name,
    };
  }, [notebook.metadata.kernelspec]);

  return {
    stats,
    visibleCells,
    groups,
    cellsById,
    language,
    title,
    kernelInfo,
  };
}

export default useNotebook;
