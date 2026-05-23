import { createFileRoute } from "@tanstack/react-router";
import basketballImg from "@/assets/work-basketball.jpg";
import posterImg from "@/assets/work-poster.jpg";
import soccerImg from "@/assets/work-soccer.jpg";
import brandImg from "@/assets/work-brand.jpg";
import swimmerImg from "@/assets/work-swimmer.jpg";

export const Route = createFileRoute("/_site/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Nathan Schwartz" },
      {
        name: "description",
        content:
          "Selected sports photography and graphic design work — basketball, soccer, swimming, motorsports, and brand identity.",
      },
      { property: "og:title", content: "Portfolio — Nathan Schwartz" },
      { property: "og:description", content: "Selected sports photography and graphic design work." },
      { property: "og:image", content: basketballImg },
    ],
  }),
  component: Portfolio,
});

const works = [
  { img: basketballImg, label: "Photography", title: "The Zone / NBA Finals", year: "2024", cls: "bg-electric", span: "md:col-span-8 aspect-[16/10]" },
  { img: posterImg, label: "Graphics", title: "Apex Racing Series", year: "2024", cls: "bg-vivid text-dark", span: "md:col-span-4 aspect-[3/4]" },
  { img: swimmerImg, label: "Photography", title: "Hydra Campaign", year: "2024", cls: "bg-electric", span: "md:col-span-4 aspect-[3/4]" },
  { img: soccerImg, label: "Photography", title: "Champions League Finals", year: "2023", cls: "bg-electric", span: "md:col-span-8 aspect-[16/10]" },
  { img: brandImg, label: "Graphics", title: "Atlas Athletic Identity", year: "2023", cls: "bg-vivid text-dark", span: "md:col-span-12 aspect-[21/9]" },
];

function Portfolio() {
  return (
    <section className="px-8 py-24">
      <header className="mb-16 max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-vivid">Selected Work</p>
        <h1 className="font-display text-6xl font-black uppercase italic leading-[0.9] md:text-8xl">
          The <span className="text-electric">Archive</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {works.map((w) => (
          <div key={w.title} className={`group ${w.span.split(" ")[0]} cursor-pointer`}>
            <div className="relative overflow-hidden">
              <img
                src={w.img}
                alt={w.title}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${w.span.split(" ").slice(1).join(" ")}`}
              />
              <div className={`absolute left-6 top-6 px-3 py-1 text-[10px] font-bold uppercase italic tracking-widest ${w.cls}`}>
                {w.label}
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <h3 className="font-display text-2xl uppercase italic md:text-3xl">{w.title}</h3>
              <span className="text-xs text-white/40">{w.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
