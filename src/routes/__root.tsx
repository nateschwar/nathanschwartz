import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-black italic text-electric">404</h1>
        <h2 className="mt-4 font-display text-2xl uppercase tracking-tight">Off the field</h2>
        <p className="mt-2 text-sm text-white/60">
          That page doesn't exist. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center bg-vivid px-6 py-3 text-xs font-bold uppercase tracking-widest text-dark transition-colors hover:bg-white"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl uppercase tracking-tight">Something broke</h1>
        <p className="mt-2 text-sm text-white/60">Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-electric px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-vivid hover:text-dark"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nathan Schwartz Photography & Graphics" },
      {
        name: "description",
        content:
          "Nathan Schwartz — sports photographer and graphic designer capturing the split-second intensity of elite performance.",
      },
      { property: "og:title", content: "Nathan Schwartz Photography & Graphics" },
      {
        property: "og:description",
        content: "Sports photography and graphic design for athletes, teams, and brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
