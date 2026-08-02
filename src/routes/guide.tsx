import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Recycle, Leaf, AlertTriangle, Cpu, Trash2, RefreshCw } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";


export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Waste Sorting Guide — Bins, Materials & Rules | EcoSort AI" },
      {
        name: "description",
        content:
          "A practical guide to the six waste streams: recyclable, organic, hazardous, e-waste, landfill and reusable — with bin colours and disposal rules.",
      },
      { property: "og:title", content: "Waste Sorting Guide | EcoSort AI" },
      {
        property: "og:description",
        content: "Bin colours, materials and disposal rules for six waste streams.",
      },
    ],
  }),
  component: GuidePage,
});

const STREAMS = [
  {
    icon: Recycle,
    name: "Recyclable",
    bin: "Blue bin",
    accent: "text-leaf",
    items: "Paper, cardboard, glass, metal cans, PET & HDPE plastics",
    rules: [
      "Rinse containers so residue does not contaminate the batch",
      "Flatten cardboard and crush bottles to save space",
      "Keep caps on plastic bottles unless your council says otherwise",
    ],
  },
  {
    icon: Leaf,
    name: "Organic",
    bin: "Green bin",
    accent: "text-organic",
    items: "Food scraps, peels, coffee grounds, garden trimmings",
    rules: [
      "No plastic liners — use paper or certified compostable bags",
      "Keep cooked food out of open home compost piles",
      "Drain liquids before binning to reduce odour",
    ],
  },
  {
    icon: AlertTriangle,
    name: "Hazardous",
    bin: "Red bin / drop-off",
    accent: "text-hazard",
    items: "Batteries, paint, solvents, medicines, aerosols, syringes",
    rules: [
      "Never place in kerbside bins — use a hazardous collection point",
      "Keep items in their original labelled container",
      "Tape battery terminals to prevent short circuits",
    ],
  },
  {
    icon: Cpu,
    name: "E-Waste",
    bin: "Certified e-waste centre",
    accent: "text-ewaste",
    items: "Phones, laptops, cables, chargers, appliances, bulbs",
    rules: [
      "Wipe personal data before handing over any device",
      "Remove lithium batteries where possible and recycle separately",
      "Check for manufacturer take-back or trade-in programmes",
    ],
  },
  {
    icon: Trash2,
    name: "Landfill",
    bin: "Black bin",
    accent: "text-landfill",
    items: "Multi-layer wrappers, ceramics, nappies, polystyrene",
    rules: [
      "Only use when no recycling or composting stream accepts the item",
      "Bag sharp items safely to protect collection workers",
      "Reduce volume by choosing refillable alternatives",
    ],
  },
  {
    icon: RefreshCw,
    name: "Reusable",
    bin: "Donate or upcycle",
    accent: "text-primary",
    items: "Clothes, furniture, jars, tools, books, electronics in working order",
    rules: [
      "Clean and repair before donating to a charity or repair café",
      "List usable goods on local reuse networks",
      "Repurpose glass jars for storage before recycling them",
    ],
  },
];

function GuidePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageTransition>
        <main className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <span className="glow-orb -top-10 left-1/4 h-72 w-72 accent-gradient" />
          <div className="max-w-2xl">
            <Link to="/" className="text-sm font-medium text-primary hover:underline">
              ← Back to scanner
            </Link>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">The waste sorting guide</h1>
            <p className="mt-4 text-lg font-light text-muted-foreground">
              Every scan maps your item to one of six streams. Here is what belongs in each, which
              bin it goes to, and the rules that keep recycling batches clean.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STREAMS.map((stream, i) => (
              <motion.article
                key={stream.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.985 }}
                className="glass-card grain glow-hover p-6"
              >
                <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary">
                    <stream.icon className={`h-5 w-5 ${stream.accent}`} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{stream.name}</h2>
                    <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                      {stream.bin}
                    </p>
                  </div>
                </header>
                <p className="mt-4 text-sm text-muted-foreground">{stream.items}</p>
                <ul className="mt-4 space-y-2 border-t border-border pt-4">
                  {stream.rules.map((rule) => (
                    <li key={rule} className="flex gap-2 text-sm">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="min-w-0">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </main>
      </PageTransition>
      <SiteFooter />
    </div>
  );
}

