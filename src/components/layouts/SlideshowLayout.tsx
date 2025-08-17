import React, { useState, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import type { JupiterNotebook } from "../../types";
import { CodeCell } from "../cells/CodeCell";
import { MarkdownCell } from "../cells/MarkdownCell";
import { RawCell } from "../cells/RawCell";

export interface SlideshowLayoutProps {
  notebook: JupiterNotebook;
  theme?: string;
  className?: string;
  showExecutionCount?: boolean;
  showCellNumbers?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

interface Slide {
  id: string;
  title: string;
  cells: any[];
  type: "title" | "content" | "code" | "conclusion";
}

export const SlideshowLayout: React.FC<SlideshowLayoutProps> = ({
  notebook,
  theme = "default",
  className,
  showExecutionCount = true,
  showCellNumbers = false,
  autoAdvance = false,
  autoAdvanceDelay = 5000,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Convert notebook cells to slides
  const slides = React.useMemo(() => {
    const generatedSlides: Slide[] = [];
    let currentSlide: Slide | null = null;
    const visibleCells = notebook.cells.filter(
      (cell) => cell.visible !== false
    );

    visibleCells.forEach((cell, index) => {
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
          // @ts-expect-error - TODO: fix this
          const level = headerMatch[1].length;
          // @ts-expect-error - TODO: fix this
          const title = headerMatch[2].trim();

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
  // @ts-expect-error - TODO: fix this
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

  const renderCell = (cell: any, index: number) => {
    const cellProps = {
      key: cell.id || `cell-${index}`,
      className: clsx("slide-cell", {
        grouped: cell.grouped,
        [`group-${cell.groupId}`]: cell.groupId,
      }),
    };

    switch (cell.type) {
      case "code":
        return (
          <div {...cellProps}>
            <CodeCell
              source={cell.source}
              language={notebook.metadata.language_info?.name || "python"}
              executionCount={cell.executionCount}
              outputs={cell.outputs}
              metadata={cell.metadata}
              showExecutionCount={showExecutionCount}
            />
          </div>
        );

      case "markdown":
        return (
          <div {...cellProps}>
            <MarkdownCell source={cell.source} metadata={cell.metadata} />
          </div>
        );

      case "raw":
        return (
          <div {...cellProps}>
            <RawCell source={cell.source} metadata={cell.metadata} />
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
            This notebook doesn't contain any visible cells to display as
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
            <header className="slide-header">
              <h1 className="slide-title">{currentSlide.title}</h1>
            </header>

            <div className="slide-content">
              {currentSlide.cells.map((cell, index) => renderCell(cell, index))}
            </div>
          </div>
        )}
      </main>

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
    </div>
  );
};

export default SlideshowLayout;
