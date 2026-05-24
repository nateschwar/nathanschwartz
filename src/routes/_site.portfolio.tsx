import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import basketballImg from "@/assets/work-basketball.jpg";
import posterImg from "@/assets/work-poster.jpg";
import soccerImg from "@/assets/work-soccer.jpg";
import brandImg from "@/assets/work-brand.jpg";
import swimmerImg from "@/assets/work-swimmer.jpg";
import portraitImg from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/_site/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Nathan Schwartz" },
      {
        name: "description",
        content:
          "Portfolio of Nathan Schwartz — sports photography, graphic design, portraits, couples, and event work.",
      },
      { property: "og:title", content: "Portfolio — Nathan Schwartz" },
      { property: "og:description", content: "Sports, GFX, portraits, couples, and more." },
      { property: "og:image", content: basketballImg },
    ],
  }),
  component: Portfolio,
});

type Category = "All" | "Sports" | "GFX" | "Portraits" | "Couples" | "Other";

const categories: Category[] = ["All", "Sports", "GFX", "Portraits", "Couples", "Other"];

type Work = {
  img: string;
  category: Exclude<Category, "All">;
  title: string;
  year: string;
};

// Placeholder entries — swap images/titles with your real work later.
const works: Work[] = [
  { img: basketballImg, category: "Sports", title: "The Zone / Basketball", year: "2024" },
  { img: soccerImg, category: "Sports", title: "Match Day", year: "2023" },
  { img: swimmerImg, category: "Sports", title: "Hydra Campaign", year: "2024" },
  { img: posterImg, category: "GFX", title: "Apex Racing Series", year: "2024" },
  { img: brandImg, category: "GFX", title: "Atlas Athletic Identity", year: "2023" },
  { img: portraitImg, category: "Portraits", title: "Studio Portrait", year: "2024" },
  { img: portraitImg, category: "Couples", title: "Engagement Session", year: "2024" },
  { img: portraitImg, category: "Other", title: "Graduation Day", year: "2024" },
];

const catColor: Record<Exclude<Category, "All">, string> = {
  Sports: "bg-electric text-white",
  GFX: "bg-vivid text-dark",
  Portraits: "bg-white text-dark",
  Couples: "bg-vivid text-dark",
  Other: "bg-electric text-white",
};

function Portfolio() {
  const [active, setActive] = useState<Category>("All");
  const filtered = active === "All" ? works : works.filter((w) => w.category === active);

  return (
    <section className="px-8 py-24">
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-vivid">Selected Work</p>
        <h1 className="font-display text-6xl font-black uppercase italic leading-[0.9] md:text-8xl">
          The <span className="text-electric">Archive</span>
        </h1>
      </header>

      <div className="mb-12 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              active === c
                ? "bg-white text-dark"
                : "border border-white/20 text-white/70 hover:border-vivid hover:text-vivid"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-sm uppercase tracking-widest text-white/40">
          New work coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {filtered.map((w, i) => (
            <div key={`${w.title}-${i}`} className="group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={w.img}
                  alt={w.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute left-4 top-4 px-3 py-1 text-[10px] font-bold uppercase italic tracking-widest ${catColor[w.category]}`}
                >
                  {w.category}
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <h3 className="font-display text-2xl uppercase italic">{w.title}</h3>
                <span className="text-xs text-white/40">{w.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
