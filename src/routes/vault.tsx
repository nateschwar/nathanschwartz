import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Images, Lock, Tag } from "lucide-react";
import { useState } from "react";
import { galleries, getGalleryTags } from "@/lib/vault-data";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Vault - Galleries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Vault,
});

function Vault() {
  const isGalleryPage = useRouterState({
    select: (state) => state.location.pathname !== "/vault",
  });
  const [activeTag, setActiveTag] = useState("All");
  const tags = getGalleryTags();
  const filteredGalleries =
    activeTag === "All"
      ? galleries
      : galleries.filter((gallery) => gallery.tags.includes(activeTag));

  if (isGalleryPage) return <Outlet />;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#161616]">
      <header className="border-b border-black/10 bg-[#f7f5f0]/95 px-5 py-5 backdrop-blur md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-black/45">
            Event Galleries
          </p>
          <h1 className="mt-2 font-display text-5xl font-black uppercase italic leading-none md:text-7xl">
            The Vault
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <section className="mb-8 grid gap-5 border-b border-black/10 pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-2xl text-sm leading-relaxed text-black/55">
            Browse client events by tag, open public galleries, or unlock private delivery
            galleries from their dedicated pages.
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
            <Images aria-hidden="true" size={15} />
            {galleries.length} Galleries
          </div>
        </section>

        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`inline-flex h-9 items-center gap-2 px-4 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                activeTag === tag
                  ? "bg-black text-white"
                  : "border border-black/15 text-black/55 hover:border-black hover:text-black"
              }`}
            >
              <Tag aria-hidden="true" size={13} />
              {tag}
            </button>
          ))}
        </div>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGalleries.map((gallery) => (
            <article key={gallery.id} className="group bg-white shadow-sm">
              <Link to="/vault/$galleryId" params={{ galleryId: gallery.id }} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={gallery.cover}
                    alt={gallery.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {gallery.isPrivate && (
                    <span className="absolute right-4 top-4 inline-flex size-9 items-center justify-center bg-black text-white">
                      <Lock aria-hidden="true" size={16} />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {gallery.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-black/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-display text-3xl font-black uppercase italic leading-none">
                    {gallery.title}
                  </h2>
                  <div className="mt-4 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-widest text-black/45">
                    <span>{gallery.date}</span>
                    <span>{gallery.images.length} images</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
