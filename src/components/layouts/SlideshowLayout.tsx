import React, { useState, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import type {
  JupiterNotebook,
  JupiterCell,
  CellComponentProps,
} from "../../types";
import { CodeCellWrapper } from "../cells/CodeCellWrapper";
import { MarkdownCellWrapper } from "../cells/MarkdownCellWrapper";
import { RawCellWrapper } from "../cells/RawCellWrapper";
import { OutputCellWrapper } from "../cells/OutputCellWrapper";

export interface SlideshowLayoutProps {
  notebook: JupiterNotebook;
  theme?: string;
  className?: string;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
  showMetadata?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  customComponents?: {
    CodeCell: React.ComponentType<CellComponentProps>;
    MarkdownCell: React.ComponentType<CellComponentProps>;
    RawCell: React.ComponentType<CellComponentProps>;
    OutputCell: React.ComponentType<CellComponentProps>;
  };
}

interface Slide {
  id: string;
  title: string;
  cells: JupiterCell[];
  type: "title" | "content" | "code" | "conclusion";
}

export const SlideshowLayout: React.FC<SlideshowLayoutProps> = ({
  notebook,
  theme = "default",
  className,
  showExecutionCount = false,
  showCellNumbers = false,
  showMetadata = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  showHeader = true,
  showFooter = true,
  customComponents,
  autoAdvance = false,
  autoAdvanceDelay = 5000,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Use custom components or fall back to default wrapper ones
  const CellComponents = {
    CodeCell: customComponents?.CodeCell || CodeCellWrapper,
    MarkdownCell: customComponents?.MarkdownCell || MarkdownCellWrapper,
    RawCell: customComponents?.RawCell || RawCellWrapper,
    OutputCell: customComponents?.OutputCell || OutputCellWrapper,
  };

  // Convert notebook cells to slides
  const slides = React.useMemo(() => {
    const generatedSlides: Slide[] = [];
    let currentSlide: Slide | null = null;
    const visibleCells = notebook.cells.filter(
      (cell) => cell.visible !== false
    );

    visibleCells.forEach((cell) => {
      // Create new slide on markdown headers
      if (cell.type === "markdown") {
        const content = cell.source.join("");
        const headerMatch = content.match(/^(#+)\s+(.+)/m);

        if (headerMatch) {
          // Finish previous slide
          if (currentSlide) {
            generatedSlides.push(currentSlide);
          }

          // Start new slide
          const level = headerMatch[1]?.length || 1;
          const title = headerMatch[2]?.trim() || "Untitled";

          currentSlide = {
            id: `slide-${generatedSlides.length}`,
            title,
            cells: [cell],
            type: level === 1 ? "title" : "content",
          };
        } else if (currentSlide) {
          currentSlide.cells.push(cell);
        } else {
          // Create a content slide if no header found
          currentSlide = {
            id: `slide-${generatedSlides.length}`,
            title: `Slide ${generatedSlides.length + 1}`,
            cells: [cell],
            type: "content",
          };
        }
      } else if (currentSlide) {
        currentSlide.cells.push(cell);

        // Mark slide as code-heavy if it has code cells
        if (cell.type === "code" && currentSlide.type === "content") {
          currentSlide.type = "code";
        }
      } else {
        // Create a slide for orphaned cells
        currentSlide = {
          id: `slide-${generatedSlides.length}`,
          title: `Slide ${generatedSlides.length + 1}`,
          cells: [cell],
          type: cell.type === "code" ? "code" : "content",
        };
      }
    });

    // Add final slide
    if (currentSlide) {
      generatedSlides.push(currentSlide);
    }

    return generatedSlides;
  }, [notebook.cells]);

  const currentSlide = slides[currentSlideIndex] || null;

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) =>
      prev < slides.length - 1 ? prev + 1 : prev
    );
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setCurrentSlideIndex(index);
      }
    },
    [slides.length]
  );

  // Auto-advance functionality
  // @ts-expect-error - fix this later
  useEffect(() => {
    if (autoAdvance && isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => {
          if (prev < slides.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, autoAdvanceDelay);

      return () => clearInterval(interval);
    }
  }, [autoAdvance, isPlaying, slides.length, autoAdvanceDelay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case " ":
          event.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          event.preventDefault();
          prevSlide();
          break;
        case "Home":
          event.preventDefault();
          goToSlide(0);
          break;
        case "End":
          event.preventDefault();
          goToSlide(slides.length - 1);
          break;
        case "Escape":
          event.preventDefault();
          setIsPlaying(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, slides.length]);

  const renderCell = (cell: JupiterCell, index: number) => {
    const cellProps = {
      key: cell.id || `cell-${index}`,
      className: clsx("slide-cell", {
        grouped: cell.grouped,
        [`group-${cell.groupId}`]: cell.groupId,
      }),
    };

    // Common cell props for custom components
    const cellComponentProps = {
      cell,
      showExecutionCount,
      showCellNumbers,
      cellIndex: index,
    };

    switch (cell.type) {
      case "code":
        return (
          <div {...cellProps}>
            <CellComponents.CodeCell {...cellComponentProps} />
          </div>
        );

      case "markdown":
        return (
          <div {...cellProps}>
            <CellComponents.MarkdownCell {...cellComponentProps} />
          </div>
        );

      case "raw":
        return (
          <div {...cellProps}>
            <CellComponents.RawCell {...cellComponentProps} />
          </div>
        );

      case "output":
        return (
          <div {...cellProps}>
            <CellComponents.OutputCell {...cellComponentProps} />
          </div>
        );

      default:
        return (
          <div {...cellProps}>
            <div className="unknown-cell">
              <pre>Unknown cell type: {cell.type}</pre>
            </div>
          </div>
        );
    }
  };

  if (slides.length === 0) {
    return (
      <div className={clsx("slideshow-layout", "empty", className)}>
        <div className="empty-slideshow">
          <h2>No slides available</h2>
          <p>
            This notebook doesn&apos;t contain any visible cells to display as
            slides.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "slideshow-layout",
        `theme-${theme}`,
        `slide-type-${currentSlide?.type}`,
        {
          "is-playing": isPlaying,
          "show-execution-count": showExecutionCount,
        },
        className
      )}
    >
      {/* Slide content */}
      <main className="slide-container">
        {currentSlide && (
          <div className="slide">
            {showHeader && (
              <header className="slide-header">
                <h1 className="slide-title">{currentSlide.title}</h1>
              </header>
            )}

            <div className="slide-content">
              {currentSlide.cells.map((cell, index) => renderCell(cell, index))}
            </div>
          </div>
        )}
      </main>

      {/* Navigation controls and slide overview - footer content */}
      {showFooter && (
        <>
          {/* Navigation controls */}
          <nav className="slide-controls">
            <div className="slide-navigation">
              <button
                className="nav-button prev"
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                aria-label="Previous slide"
              >
                ←
              </button>

              <span className="slide-counter">
                {currentSlideIndex + 1} / {slides.length}
              </span>

              <button
                className="nav-button next"
                onClick={nextSlide}
                disabled={currentSlideIndex === slides.length - 1}
                aria-label="Next slide"
              >
                →
              </button>
            </div>

            {autoAdvance && (
              <div className="playback-controls">
                <button
                  className={clsx("play-button", { active: isPlaying })}
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
              </div>
            )}
          </nav>

          {/* Slide thumbnails/overview */}
          <aside className="slide-overview">
            <div className="slide-thumbnails">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={clsx("slide-thumbnail", {
                    active: index === currentSlideIndex,
                    [slide.type]: true,
                  })}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                >
                  <div className="thumbnail-number">{index + 1}</div>
                  <div className="thumbnail-title">{slide.title}</div>
                  <div className="thumbnail-type">{slide.type}</div>
                </button>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default SlideshowLayout;
