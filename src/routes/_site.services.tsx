import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/services")({
  head: () => ({
    meta: [
      { title: "Services — Nathan Schwartz" },
      {
        name: "description",
        content:
          "Sports photography, brand design, and content strategy services for athletes, teams, and sports brands.",
      },
      { property: "og:title", content: "Services — Nathan Schwartz" },
      { property: "og:description", content: "Sports photography and graphic design services." },
    ],
  }),
  component: Services,
});

const services = [
  {
    n: "01",
    color: "text-electric",
    title: "Sports Photography",
    blurb:
      "High-speed action and commercial athlete portraits that capture raw emotion and physical peak. On-court, on-track, or in-studio.",
    items: ["Game-day Action Coverage", "Editorial Athlete Portraits", "Commercial Campaign Shoots", "Team Lifestyle Sessions"],
  },
  {
    n: "02",
    color: "text-vivid",
    title: "Brand Design",
    blurb:
      "Visual identities built for momentum. From team logos to event posters, graphics that move as fast as the athletes.",
    items: ["Team & Event Logos", "Tournament Identity Systems", "Poster & Apparel Graphics", "Style Guides"],
  },
  {
    n: "03",
    color: "text-electric",
    title: "Social & Motion",
    blurb:
      "Content optimized for the modern athlete's digital presence. High-impact short-form video and kinetic typography.",
    items: ["Reels & Short Form Edits", "Kinetic Typography", "Stadium LED Graphics", "Sponsor Activation Content"],
  },
];

function Services() {
  return (
    <section className="px-8 py-24">
      <header className="mb-16 max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-vivid">Services</p>
        <h1 className="font-display text-6xl font-black uppercase italic leading-[0.9] md:text-8xl">
          What we <span className="text-electric">do</span>
        </h1>
      </header>

      <div className="space-y-12">
        {services.map((s) => (
          <div
            key={s.n}
            className="grid grid-cols-1 gap-8 border-t border-white/10 pt-12 md:grid-cols-12"
          >
            <div className="md:col-span-3">
              <div className={`font-display text-6xl italic ${s.color}`}>{s.n}</div>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-tight">{s.title}</h2>
            </div>
            <div className="md:col-span-5">
              <p className="text-lg leading-relaxed text-white/70">{s.blurb}</p>
            </div>
            <ul className="space-y-3 md:col-span-4">
              {s.items.map((i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 border-b border-white/5 pb-3 text-sm uppercase tracking-wide"
                >
                  <span className="size-1.5 shrink-0 bg-vivid" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <Link
          to="/contact"
          className="inline-block bg-vivid px-12 py-5 font-display text-2xl italic uppercase tracking-tighter text-dark transition-all hover:bg-electric hover:text-white"
        >
          Request a Quote →
        </Link>
      </div>
    </section>
  );
}
