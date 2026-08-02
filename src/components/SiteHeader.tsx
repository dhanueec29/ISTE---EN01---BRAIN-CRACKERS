import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Recycle, ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Scanner" },
  { to: "/guide", label: "Guide" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.9)",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 border-b border-border/50"
      >
        <motion.div
          initial={false}
          animate={{ paddingTop: scrolled ? 6 : 12, paddingBottom: scrolled ? 6 : 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6"
        >
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <motion.span
              whileHover={{ rotate: 90, scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl accent-gradient"
            >
              <Recycle className="h-5 w-5 text-accent-foreground" />
            </motion.span>
            <motion.span
              initial={false}
              animate={{ fontSize: scrolled ? "1rem" : "1.125rem" }}
              className="truncate font-display font-bold"
            >
              EcoSort AI
            </motion.span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full accent-gradient"
                    />
                  )}
                </Link>
              );
            })}
            <Button asChild size="sm" className="glow-hover ml-1">
              <a href="/#scanner">
                <ScanLine className="h-4 w-4" /> Scan now
              </a>
            </Button>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground transition-colors hover:bg-secondary sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-md sm:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 w-[78%] max-w-xs border-l border-border bg-card p-6 shadow-2xl sm:hidden"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <span className="truncate font-display text-lg font-bold">EcoSort AI</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-8 grid gap-2">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, type: "spring", stiffness: 300, damping: 26 }}
                  >
                    <Link
                      to={item.to}
                      className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        pathname === item.to
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <Button asChild size="lg" className="mt-3 glow-hover">
                  <a href="/#scanner" onClick={() => setOpen(false)}>
                    <ScanLine className="h-4 w-4" /> Scan now
                  </a>
                </Button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
