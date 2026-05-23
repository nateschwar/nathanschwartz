import { createFileRoute, Link } from "@tanstack/react-router";
import portrait from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About — Nathan Schwartz" },
      {
        name: "description",
        content:
          "Nathan Schwartz is a sports photographer and graphic designer working with athletes, teams, and brands.",
      },
      { property: "og:title", content: "About — Nathan Schwartz" },
      { property: "og:description", content: "Photographer & designer for sport." },
      { property: "og:image", content: portrait },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="grid grid-cols-1 gap-16 px-8 py-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <img
          src={portrait}
          alt="Nathan Schwartz portrait"
          width={1000}
          height={1200}
          loading="lazy"
          className="w-full object-cover"
        />
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-vivid">About</p>
        <h1 className="font-display text-5xl font-black uppercase italic leading-[0.9] md:text-7xl">
          Behind the <span className="text-electric">Lens</span>
        </h1>
        <div className="mt-10 space-y-6 text-lg text-white/70">
          <p>
            Nathan Schwartz is a sports photographer and graphic designer based out of the field,
            the court, and the track. For the last decade he's worked alongside athletes, teams,
            and brands to translate raw athletic moments into images and identities that endure.
          </p>
          <p>
            The studio operates at the intersection of documentation and design — capturing the
            real, then shaping it into visual systems that move with the same energy as the sport
            itself.
          </p>
          <p>
            Available worldwide for editorial, commercial, and brand commissions.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
          {[
            { k: "10+", v: "Years in sport" },
            { k: "200+", v: "Athletes shot" },
            { k: "40+", v: "Brand identities" },
            { k: "3", v: "Continents working" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-4xl italic text-vivid">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/40">{s.v}</div>
            </div>
          ))}
        </div>

        <Link
          to="/contact"
          className="mt-10 inline-block bg-electric px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-vivid hover:text-dark"
        >
          Work with me →
        </Link>
      </div>
    </section>
  );
}
