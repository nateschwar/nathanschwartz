import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ViewerImage = {
  preview: string;
  full: string;
  name: string;
  title: string;
};

type Props = {
  images: ViewerImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export function ImageViewer({ images, index, onClose, onIndexChange }: Props) {
  const open = index !== null && images[index];
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch / pinch state
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
    startMidX: number;
    startMidY: number;
    startOffset: { x: number; y: number };
  } | null>(null);
  const panRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const next = useCallback(() => {
    if (index === null || images.length === 0) return;
    onIndexChange((index + 1) % images.length);
    reset();
  }, [index, images.length, onIndexChange, reset]);

  const prev = useCallback(() => {
    if (index === null || images.length === 0) return;
    onIndexChange((index - 1 + images.length) % images.length);
    reset();
  }, [index, images.length, onIndexChange, reset]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync fullscreen state with the browser
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          } else {
            onClose();
          }
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "f":
        case "F":
          event.preventDefault();
          void toggleFullscreen();
          break;
        case "+":
        case "=":
          event.preventDefault();
          setScale((s) => Math.min(MAX_SCALE, s + 0.5));
          break;
        case "-":
        case "_":
          event.preventDefault();
          setScale((s) => {
            const next = Math.max(MIN_SCALE, s - 0.5);
            if (next === 1) setOffset({ x: 0, y: 0 });
            return next;
          });
          break;
        case "0":
          event.preventDefault();
          reset();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev, onClose, toggleFullscreen, reset]);

  // Reset when image changes
  useEffect(() => {
    reset();
  }, [index, reset]);

  // Wheel zoom
  const onWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    setScale((s) => {
      const delta = event.deltaY > 0 ? -0.2 : 0.2;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  // Touch handlers (pinch zoom + pan)
  const distance = (a: React.Touch, b: React.Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const onTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]];
      pinchRef.current = {
        startDist: distance(a, b),
        startScale: scale,
        startMidX: (a.clientX + b.clientX) / 2,
        startMidY: (a.clientY + b.clientY) / 2,
        startOffset: { ...offset },
      };
    } else if (event.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // double-tap toggle zoom
        setScale((s) => (s > 1 ? 1 : 2));
        setOffset({ x: 0, y: 0 });
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
      if (scale > 1) {
        panRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          offsetX: offset.x,
          offsetY: offset.y,
        };
      }
    }
  };

  const onTouchMove = (event: React.TouchEvent) => {
    if (event.touches.length === 2 && pinchRef.current) {
      event.preventDefault();
      const [a, b] = [event.touches[0], event.touches[1]];
      const dist = distance(a, b);
      const ratio = dist / pinchRef.current.startDist;
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, pinchRef.current.startScale * ratio),
      );
      setScale(newScale);
    } else if (event.touches.length === 1 && panRef.current && scale > 1) {
      event.preventDefault();
      const dx = event.touches[0].clientX - panRef.current.x;
      const dy = event.touches[0].clientY - panRef.current.y;
      setOffset({
        x: panRef.current.offsetX + dx,
        y: panRef.current.offsetY + dy,
      });
    }
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (event.touches.length < 2) pinchRef.current = null;
    if (event.touches.length === 0) {
      panRef.current = null;
      if (scale <= 1) setOffset({ x: 0, y: 0 });
    }
  };

  // Mouse drag pan when zoomed
  const onMouseDown = (event: React.MouseEvent) => {
    if (scale <= 1) return;
    event.preventDefault();
    panRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  useEffect(() => {
    if (!open) return;
    const onMove = (event: MouseEvent) => {
      if (!panRef.current) return;
      const dx = event.clientX - panRef.current.x;
      const dy = event.clientY - panRef.current.y;
      setOffset({
        x: panRef.current.offsetX + dx,
        y: panRef.current.offsetY + dy,
      });
    };
    const onUp = () => {
      panRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [open]);

  if (!open) return null;
  const current = images[index!];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4 py-6 text-white"
      onClick={() => onClose()}
      onWheel={onWheel}
    >
      {/* Top controls */}
      <div
        className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-8 md:top-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() =>
            setScale((s) => {
              const n = Math.max(MIN_SCALE, s - 0.5);
              if (n === 1) setOffset({ x: 0, y: 0 });
              return n;
            })
          }
          className="inline-flex size-10 items-center justify-center text-white/70 transition-colors hover:text-vivid"
        >
          <ZoomOut aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => setScale((s) => Math.min(MAX_SCALE, s + 0.5))}
          className="inline-flex size-10 items-center justify-center text-white/70 transition-colors hover:text-vivid"
        >
          <ZoomIn aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={() => void toggleFullscreen()}
          className="inline-flex size-10 items-center justify-center text-white/70 transition-colors hover:text-vivid"
        >
          {isFullscreen ? (
            <Minimize2 aria-hidden="true" size={20} />
          ) : (
            <Maximize2 aria-hidden="true" size={20} />
          )}
        </button>
        <button
          type="button"
          aria-label="Close"
          onClick={() => onClose()}
          className="inline-flex size-10 items-center justify-center text-white/70 transition-colors hover:text-vivid"
        >
          <X aria-hidden="true" size={24} />
        </button>
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={(event) => {
          event.stopPropagation();
          prev();
        }}
        className="absolute left-2 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-vivid md:left-6"
      >
        <ChevronLeft aria-hidden="true" size={34} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={(event) => {
          event.stopPropagation();
          next();
        }}
        className="absolute right-2 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-vivid md:right-6"
      >
        <ChevronRight aria-hidden="true" size={34} />
      </button>

      <div
        ref={stageRef}
        className="flex max-h-[90vh] max-w-[92vw] flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        style={{ touchAction: scale > 1 ? "none" : "pan-y" }}
      >
        <img
          src={current.preview}
          alt={current.title}
          draggable={false}
          className="max-h-[78vh] max-w-[92vw] select-none object-contain transition-transform duration-150"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            cursor: scale > 1 ? "grab" : "zoom-in",
          }}
        />
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold uppercase tracking-widest">
            {current.title}
            <span className="ml-3 text-white/40">
              {index! + 1} / {images.length}
            </span>
          </p>
          <a
            href={current.full}
            download={current.name}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-11 items-center justify-center gap-2 bg-vivid px-5 text-[11px] font-bold uppercase tracking-widest text-dark transition-colors hover:bg-white"
          >
            <Download aria-hidden="true" size={16} />
            Download Original
          </a>
        </div>
      </div>
    </div>
  );
}
