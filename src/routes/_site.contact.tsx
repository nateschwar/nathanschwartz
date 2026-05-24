import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const dropdownStyles = `
  select, .tally-select {
    background: transparent !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
  }
  select:focus, .tally-select:focus {
    border-color: #00d9ff !important;
    background: transparent !important;
  }
`;

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nathan Schwartz" },
      {
        name: "description",
        content: "Start a project with Nathan Schwartz. Sports photography and graphic design inquiries.",
      },
      { property: "og:title", content: "Contact — Nathan Schwartz" },
      { property: "og:description", content: "Start a project — photography or graphic design." },
    ],
  }),
  component: Contact,
});

function Contact() {
  useEffect(() => {
    // Inject minimal styles for dropdown
    const styleEl = document.createElement("style");
    styleEl.textContent = dropdownStyles;
    document.head.appendChild(styleEl);

    // Load Tally embed script
    const w = "https://tally.so/widgets/embed.js";
    const v = function () {
      if (typeof (window as any).Tally !== "undefined") {
        (window as any).Tally.loadEmbeds();
      } else {
        document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((e) => {
          (e as any).src = (e as any).dataset.tallySrc;
        });
      }
    };
    if (typeof (window as any).Tally !== "undefined") {
      v();
    } else if (document.querySelector(`script[src="${w}"]`) == null) {
      const s = document.createElement("script");
      s.src = w;
      s.onload = v;
      s.onerror = v;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <section className="px-8 py-24">
      <div className="grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-vivid">Contact</p>
          <h1 className="font-display text-5xl font-black uppercase italic leading-[0.9] md:text-7xl">
            Start a <span className="text-electric">Project</span>
          </h1>
          <p className="mt-8 max-w-md text-lg text-white/70">
            Currently booking commissions for the 2025 season. Send a brief and we'll get back
            within 48 hours.
          </p>
          <div className="mt-12 space-y-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email</div>
              <a href="mailto:nathan.schwartz.photo@gmail.com" className="mt-1 text-xl font-medium hover:text-vivid transition-colors">
                nathan.schwartz.photo@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="relative border border-white/10 p-8 md:p-12">
          <div className="absolute -left-4 -top-4 h-8 w-8 bg-vivid" />
          <iframe
            data-tally-src="https://tally.so/embed/pbkP7V?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&accentColor=%23ff00ff&hideBranding=1"
            loading="lazy"
            width="100%"
            height="580"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Contact Me"
          />
        </div>
      </div>
    </section>
  );
}
