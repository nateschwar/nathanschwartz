import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-action.jpg";
import basketballImg from "@/assets/work-basketball.jpg";
import posterImg from "@/assets/work-poster.jpg";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Nathan Schwartz — Sports Photography & Graphics" },
      {
        name: "description",
        content:
          "Nathan Schwartz captures the split-second intensity of elite performance. Sports photography and graphic design.",
      },
      { property: "og:title", content: "Nathan Schwartz — Sports Photography & Graphics" },
      {
        property: "og:description",
        content: "Sports photography and graphic design for athletes, teams, and brands.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[90vh] items-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src={heroImg}
            alt="Downhill mountain biker kicking up dust"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-8">
          <h1 className="font-display text-[clamp(4rem,15vw,12rem)] font-black uppercase italic leading-[0.85]">
            <span className="block">Speed</span>
            <span className="block text-electric">
              Grit<span className="text-white">&</span>Glory
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-lg font-medium text-white/70">
            Nathan Schwartz — Sports Photographer and Graphic Designer. Capturing the split-second
            intensity of elite performance.
          </p>
          <Link
            to="/portfolio"
            className="mt-10 inline-block bg-vivid px-8 py-4 text-xs font-bold uppercase tracking-widest text-dark transition-colors hover:bg-white"
          >
            View Portfolio →
          </Link>
        </div>
        <div className="absolute bottom-12 right-12 hidden flex-col items-end md:flex">
          <div className="h-24 w-px bg-vivid" />
          <span className="mt-4 text-[10px] uppercase tracking-widest">Scroll to explore</span>
        </div>
      </section>

      {/* Featured Work */}
      <section className="px-8 py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <Link to="/portfolio" className="group md:col-span-8">
            <div className="relative overflow-hidden">
              <img
                src={basketballImg}
                alt="Basketball athlete portrait"
                width={1200}
                height={800}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute left-6 top-6 bg-electric px-3 py-1 text-[10px] font-bold uppercase italic tracking-widest">
                Action Photography
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <h3 className="font-display text-3xl uppercase italic">The Zone / NBA Finals</h3>
              <span className="text-xs text-white/40">2024 Project</span>
            </div>
          </Link>

          <Link to="/portfolio" className="group md:col-span-4">
            <div className="relative overflow-hidden">
              <img
                src={posterImg}
                alt="Motorsports poster design"
                width={800}
                height={1066}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute left-6 top-6 bg-vivid px-3 py-1 text-[10px] font-bold uppercase italic tracking-widest text-dark">
                Visual Identity
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-display text-3xl uppercase italic">Apex Racing Series</h3>
              <p className="mt-1 text-xs uppercase tracking-tighter text-white/40">
                Brand Identity & Motion Graphics
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-white px-8 py-24 text-dark">
        <div className="grid grid-cols-1 gap-12 border-t border-dark/10 pt-12 md:grid-cols-3">
          {[
            { n: "01", c: "text-electric", t: "Sports Photography", d: "High-speed action and commercial athlete portraits that capture raw emotion and physical peak. On-court, on-track, or in-studio." },
            { n: "02", c: "text-vivid", t: "Brand Design", d: "Visual identities built for momentum. From team logos to event posters, we create graphics that move as fast as the athletes." },
            { n: "03", c: "text-electric", t: "Social Strategy", d: "Content optimized for the modern athlete's digital presence. High-impact short-form video and kinetic typography." },
          ].map((s) => (
            <div key={s.n}>
              <div className={`mb-4 font-display text-5xl italic ${s.c}`}>{s.n}</div>
              <h4 className="mb-4 font-display text-2xl uppercase tracking-tight">{s.t}</h4>
              <p className="text-sm leading-relaxed text-dark/60">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-block bg-dark px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-electric"
          >
            All Services →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 text-center">
        <h2 className="font-display text-5xl uppercase italic tracking-tighter md:text-7xl">
          Ready to <span className="text-vivid">capture</span> the moment?
        </h2>
        <Link
          to="/contact"
          className="mt-10 inline-block bg-electric px-12 py-5 font-display text-2xl italic uppercase tracking-tighter transition-all hover:bg-vivid hover:text-dark"
        >
          Start a Project →
        </Link>
      </section>
    </>
  );
}
