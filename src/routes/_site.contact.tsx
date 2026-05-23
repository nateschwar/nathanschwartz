import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <section className="px-8 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
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
              <div className="mt-1 text-xl font-medium">hello@nsstudio.com</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Based In</div>
              <div className="mt-1 text-xl font-medium">Available Worldwide</div>
            </div>
          </div>
        </div>

        <div className="relative border border-white/10 p-8 md:p-12">
          <div className="absolute -left-4 -top-4 h-8 w-8 bg-vivid" />
          <form className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                className="border-b border-white/20 bg-transparent py-2 outline-none transition-colors focus:border-electric"
                placeholder="Alex Reed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="border-b border-white/20 bg-transparent py-2 outline-none transition-colors focus:border-electric"
                placeholder="alex@team.com"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="project" className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Project Type
              </label>
              <select
                id="project"
                className="appearance-none border-b border-white/20 bg-dark py-2 outline-none transition-colors focus:border-electric"
              >
                <option>Action Photography Shoot</option>
                <option>Commercial Portrait Session</option>
                <option>Graphic Design & Identity</option>
                <option>Full Brand Package</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="details" className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Project Details
              </label>
              <textarea
                id="details"
                rows={4}
                className="border-b border-white/20 bg-transparent py-2 outline-none transition-colors focus:border-electric"
                placeholder="Tell us about the athlete, brand, or event..."
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                className="w-full bg-electric py-6 font-display text-2xl italic uppercase tracking-tighter text-white transition-all duration-300 hover:bg-vivid hover:text-dark"
              >
                Send Brief →
              </button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-white/30">
                Form submission wiring coming soon
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
