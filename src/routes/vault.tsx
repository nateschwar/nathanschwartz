import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import basketballImg from "@/assets/work-basketball.jpg";
import posterImg from "@/assets/work-poster.jpg";
import soccerImg from "@/assets/work-soccer.jpg";
import brandImg from "@/assets/work-brand.jpg";
import swimmerImg from "@/assets/work-swimmer.jpg";
import heroImg from "@/assets/hero-action.jpg";
import portraitImg from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Vault — Private" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Vault,
});

// `preview` = compressed/optimized URL shown in the grid + viewer.
// `full` = original/uncompressed file served on download.
// Today both point at the same asset; swap `full` to a hi-res original
// (e.g. /downloads/work-basketball-original.jpg in /public) when ready.
type Item = { preview: string; full: string; name: string; title: string };

const items: Item[] = [
  { preview: heroImg, full: heroImg, name: "hero-action.jpg", title: "Hero — Action" },
  { preview: basketballImg, full: basketballImg, name: "basketball.jpg", title: "Basketball" },
  { preview: soccerImg, full: soccerImg, name: "soccer.jpg", title: "Soccer" },
  { preview: swimmerImg, full: swimmerImg, name: "swimmer.jpg", title: "Swimmer" },
  { preview: posterImg, full: posterImg, name: "apex-poster.jpg", title: "Apex Poster" },
  { preview: brandImg, full: brandImg, name: "atlas-brand.jpg", title: "Atlas Brand" },
  { preview: portraitImg, full: portraitImg, name: "portrait.jpg", title: "Portrait" },
];

async function downloadOriginal(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
}

function Vault() {
  const [viewing, setViewing] = useState<number | null>(null);

  useEffect(() => {
    if (viewing === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(null);
      if (e.key === "ArrowRight") setViewing((v) => (v === null ? v : (v + 1) % items.length));
      if (e.key === "ArrowLeft")
        setViewing((v) => (v === null ? v : (v - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewing]);

  const current = viewing !== null ? items[viewing] : null;

  return (
    <div className="min-h-screen bg-dark px-8 py-16 text-white">
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-vivid">Private</p>
        <h1 className="font-display text-5xl font-black uppercase italic leading-[0.9] md:text-7xl">
          The <span className="text-electric">Vault</span>
        </h1>
        <p className="mt-4 text-sm text-white/60">
          Previews are compressed. Click an image to view, or download to get the full-resolution file.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={it.name} className="group relative overflow-hidden border border-white/10">
            <button
              type="button"
              onClick={() => setViewing(i)}
              className="block w-full"
              aria-label={`View ${it.title}`}
            >
              <img
                src={it.preview}
                alt={it.title}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
            <div className="flex items-center justify-between gap-2 bg-black/60 px-3 py-2">
              <span className="truncate text-[11px] uppercase tracking-widest text-white/70">
                {it.title}
              </span>
              <button
                type="button"
                onClick={() => downloadOriginal(it.full, it.name)}
                className="shrink-0 bg-vivid px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-dark transition-colors hover:bg-white"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setViewing(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setViewing(null)}
            className="absolute right-6 top-6 text-2xl text-white/70 hover:text-vivid"
          >
            ✕
          </button>

          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setViewing((v) => (v === null ? v : (v - 1 + items.length) % items.length));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 px-4 py-2 text-3xl text-white/60 hover:text-vivid"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setViewing((v) => (v === null ? v : (v + 1) % items.length));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-3xl text-white/60 hover:text-vivid"
          >
            ›
          </button>

          <div
            className="flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.full}
              alt={current.title}
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-white/60">
                {current.title}
              </span>
              <button
                type="button"
                onClick={() => downloadOriginal(current.full, current.name)}
                className="bg-vivid px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-dark transition-colors hover:bg-white"
              >
                Download Original
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
