import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, Images, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getGallery, getSubGallery, slugify } from "@/lib/gallery-data";
import { ImageViewer } from "@/components/ImageViewer";

export const Route = createFileRoute("/gallery/BAHSSportsPhoto/girls-volleyball")({
  head: () => {
    const gallery = getGallery("BAHSSportsPhoto");
    const subGallery = getSubGallery("BAHSSportsPhoto", "girls-volleyball");

    return {
      meta: [
        {
          title: subGallery
            ? `${subGallery.title} - ${gallery?.title || "Gallery"}`
            : "Gallery Not Found",
        },
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
  component: SubGalleryPage,
});

function SubGalleryPage() {
  const gallery = getGallery("BAHSSportsPhoto");
  const subGallery = getSubGallery("BAHSSportsPhoto", "girls-volleyball");
  const [viewing, setViewing] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const visibleImages = subGallery?.images || [];
  const current = viewing !== null ? visibleImages[viewing] : null;

  const downloadAllImages = async () => {
    setDownloadingAll(true);
    for (const image of visibleImages) {
      const link = document.createElement("a");
      link.href = image.full;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setDownloadingAll(false);
  };

  useEffect(() => {
    if (viewing === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewing(null);
      if (event.key === "ArrowRight") {
        setViewing((value) => (value === null ? value : (value + 1) % visibleImages.length));
      }
      if (event.key === "ArrowLeft") {
        setViewing((value) =>
          value === null ? value : (value - 1 + visibleImages.length) % visibleImages.length,
        );
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [gallery, viewing, visibleImages.length]);

  if (!gallery || !subGallery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 text-[#161616]">
        <div className="max-w-md text-center">
          <h1 className="font-display text-5xl font-black uppercase italic">Gallery Not Found</h1>
          <Link
            to="/gallery/BAHSSportsPhoto"
            className="mt-6 inline-flex h-11 items-center justify-center bg-black px-5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-vivid hover:text-dark"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#161616]">
      <header className="border-b border-black/10 px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <Link
            to="/gallery/BAHSSportsPhoto"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/55 transition-colors hover:text-black"
          >
            <ChevronLeft aria-hidden="true" size={16} />
            Back to {gallery.title}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <section className="mb-8 grid gap-5 border-b border-black/10 pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              {gallery.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-4 font-display text-5xl font-black uppercase italic leading-none md:text-7xl">
              {subGallery.title}
            </h1>
            <p className="mt-3 text-sm text-black/55">
              {gallery.date} / {gallery.location}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
            <Images aria-hidden="true" size={15} />
            {subGallery.images.length} Images
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
                Gallery View
              </p>
              <h3 className="font-display text-3xl font-black uppercase italic leading-none">
                All Images
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
                {subGallery.images.length} images
              </p>
              <button
                type="button"
                onClick={downloadAllImages}
                disabled={downloadingAll || subGallery.images.length === 0}
                className="inline-flex h-9 items-center justify-center gap-2 bg-black px-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-vivid hover:text-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download aria-hidden="true" size={14} />
                {downloadingAll ? "Downloading..." : "Download All"}
              </button>
            </div>
          </div>

          <section className="columns-2 gap-2 md:columns-3 md:gap-3 xl:columns-4">
            {subGallery.images.map((image, index) => (
              <figure
                key={`${gallery.id}-${subGallery.id}-${image.name}-${index}`}
                className="group mb-2 break-inside-avoid overflow-hidden bg-white shadow-sm md:mb-3"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setViewing(index)}
                    className="block w-full text-left"
                    aria-label={`View ${image.title}`}
                  >
                    <img
                      src={image.preview}
                      alt={image.title}
                      loading="lazy"
                      className={`${image.ratio} w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
                    />
                  </button>
                  <a
                    href={image.full}
                    download={image.name}
                    className="absolute right-3 top-3 inline-flex size-9 items-center justify-center bg-black/85 text-white transition-colors hover:bg-vivid hover:text-dark"
                    aria-label={`Download ${image.title}`}
                  >
                    <Download aria-hidden="true" size={16} />
                  </a>
                </div>
              </figure>
            ))}
          </section>
        </section>
      </main>

      <ImageViewer
        images={visibleImages}
        index={viewing}
        onClose={() => setViewing(null)}
        onIndexChange={setViewing}
      />
    </div>
  );
}
