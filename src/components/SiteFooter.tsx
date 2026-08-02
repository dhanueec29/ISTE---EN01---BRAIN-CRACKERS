import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 text-sm text-muted-foreground sm:px-6">
        <p className="min-w-0 truncate">© {new Date().getFullYear()} EcoSort AI</p>
        <Link to="/guide" className="shrink-0 transition-colors hover:text-foreground">
          Sorting guide
        </Link>
      </div>
    </footer>
  );
}
