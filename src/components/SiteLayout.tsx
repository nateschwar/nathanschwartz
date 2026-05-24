import { Link, Outlet } from "@tanstack/react-router";
import logoWebp from "../assets/logo.webp";

function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-dark/90 px-6 py-5 backdrop-blur-md md:px-8">
      <Link to="/" className="flex items-center gap-3" aria-label="Nathan Schwartz Photography % Graphics">
        { /* <picture>
          <source srcSet={logoWebp} type="image/webp" />
          <img src={logoWebp} alt="Nathan Schwartz Photography & Graphics" className="h-14 md:h-16 w-auto object-contain" />
        </picture> */ }
        <span className="text-[10px] md:text-[11px] leading-none font-display font-black uppercase tracking-[0.3em]">
          Nathan Schwartz Photography & Graphics
        </span>
      </Link>
      <div className="hidden gap-8 text-xs font-semibold uppercase tracking-widest leading-none md:flex md:items-center">
        <Link to="/portfolio" className="transition-colors hover:text-vivid leading-none" activeProps={{ className: "text-vivid" }}>
          Portfolio
        </Link>
        <Link to="/services" className="transition-colors hover:text-electric leading-none" activeProps={{ className: "text-electric" }}>
          Services
        </Link>
        <Link to="/about" className="transition-colors hover:text-vivid leading-none" activeProps={{ className: "text-vivid" }}>
          About
        </Link>
        <Link
          to="/contact"
          className="bg-white px-4 py-2 text-dark transition-colors hover:bg-vivid leading-none"
          activeProps={{ className: "bg-vivid" }}
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-8 border-t border-white/10 px-8 py-12 md:flex-row">
      <div className="text-xs uppercase tracking-[0.2em] text-white/30">
        &copy; {new Date().getFullYear()} Nathan Schwartz. Built for performance.
      </div>
      <div className="flex gap-6">
        {[
          { label: 'Instagram', href: 'https://instagram.com/yourusername' },
          { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-bold uppercase tracking-widest text-vivid transition-colors hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export function SiteLayout() {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
