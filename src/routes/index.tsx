import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Camera,
  Sparkles,
  ScanLine,
  Recycle,
  ShieldCheck,
  Gauge,
  Globe2,
  ArrowRight,
} from "lucide-react";
import heroImage from "@/assets/hero-waste.jpg";
import { WasteScanner } from "@/components/WasteScanner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { CountUp } from "@/components/CountUp";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoSort AI — Smart Waste Segregation & Recycling Assistant" },
      {
        name: "description",
        content:
          "Upload or snap a photo of any item and EcoSort AI instantly identifies the waste type, the right bin and step-by-step disposal instructions.",
      },
      { property: "og:title", content: "EcoSort AI — Smart Waste Segregation & Recycling Assistant" },
      {
        property: "og:description",
        content:
          "Upload or snap a photo of any item and EcoSort AI instantly identifies the waste type, the right bin and step-by-step disposal instructions.",
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    icon: Camera,
    title: "Capture or upload",
    text: "Take a photo with your phone camera or drop in an existing image of the item.",
  },
  {
    icon: Sparkles,
    title: "AI vision analysis",
    text: "A multimodal model recognises the object, its material and its contamination risk.",
  },
  {
    icon: Recycle,
    title: "Sort with confidence",
    text: "Get the correct bin, disposal steps, reuse tips and the impact of doing it right.",
  },
];

const FEATURES = [
  {
    icon: ScanLine,
    title: "Six waste streams",
    text: "Recyclable, organic, hazardous, e-waste, landfill and reusable — each with tailored handling rules.",
  },
  {
    icon: Gauge,
    title: "Confidence scoring",
    text: "Every result carries a confidence value so you know when a second look is worth it.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Photos are resized in your browser, analysed on the fly and never stored on a server.",
  },
  {
    icon: Globe2,
    title: "Impact aware",
    text: "See why the right bin matters — emissions avoided, materials recovered, landfill reduced.",
  },
];

const STATS = [
  { value: 2.1, decimals: 1, suffix: "B", label: "tonnes of municipal waste generated each year" },
  { value: 19, decimals: 0, suffix: "%", label: "of global waste is actually recycled" },
  { value: 3, decimals: 0, prefix: "<", suffix: "s", label: "average time for an EcoSort AI scan" },
];

const TICKER = [
  "Recyclable",
  "Organic",
  "Hazardous",
  "E-waste",
  "Landfill",
  "Reusable",
  "Scan in seconds",
];

const reveal = {

  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageTransition>
        <main>
          {/* Hero */}
          <section className="hero-gradient grain aurora relative overflow-hidden">
            <span className="glow-orb orb-drift -left-20 top-10 h-80 w-80 bg-accent" />
            <span className="glow-orb orb-drift -right-10 bottom-0 h-72 w-72 bg-leaf" />
            <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0"
              >
                <span className="badge-pulse gradient-ring inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> AI-based waste segregation
                </span>
                <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-primary-foreground sm:text-6xl">
                  Point, scan, <span className="text-shimmer">sort it right.</span>
                </h1>
                <p className="mt-5 max-w-lg text-lg font-light text-primary-foreground/80">
                  EcoSort AI looks at a photo of your rubbish, tells you exactly what it is, which
                  bin it belongs in and how to dispose of it responsibly — in seconds.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="animated-gradient glow-hover border-0 text-accent-foreground"
                  >
                    <a href="#scanner">
                      <ScanLine className="h-4 w-4" /> Scan an item
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="glow-hover gradient-ring border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Link to="/guide">
                      Sorting guide <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0"
              >
                <div className="float-soft gradient-ring rounded-3xl">
                  <img
                    src={heroImage}
                    alt="Sorted recyclables: aluminium can, glass jar, cardboard, plastic bottle and a banana peel"
                    width={1600}
                    height={1104}
                    className="w-full rounded-3xl border border-primary-foreground/15 object-cover shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Ticker */}
          <section className="animated-gradient overflow-hidden py-2.5">
            <div className="marquee-track gap-8 text-sm font-semibold uppercase tracking-widest text-accent-foreground">
              {Array.from({ length: 2 }).map((_, block) => (
                <span key={block} className="flex shrink-0 gap-8 pr-8">
                  {TICKER.map((t) => (
                    <span key={t} className="flex items-center gap-2">
                      <Recycle className="h-4 w-4" /> {t}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </section>


          {/* Stats */}
          <section className="aurora relative overflow-hidden border-b border-border bg-card">
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="min-w-0"
                >
                  <div className="font-display text-3xl font-bold text-shimmer sm:text-4xl">
                    <CountUp
                      value={stat.value}
                      decimals={stat.decimals}
                      prefix={stat.prefix ?? ""}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="mt-1 text-sm font-light text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Scanner */}
          <section id="scanner" className="relative scroll-mt-24 py-16 sm:py-24">
            <span className="glow-orb orb-drift left-1/2 top-24 h-72 w-72 -translate-x-1/2 bg-accent" />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold sm:text-4xl">Upload a photo and scan</h2>
                <p className="mt-3 font-light text-muted-foreground">
                  Works with a live camera shot on mobile or any image on desktop. No sign-up needed.
                </p>
              </div>
              <div className="mt-10">
                <WasteScanner />
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="bg-card py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ show: { transition: { staggerChildren: 0.12 } } }}
                className="mt-10 grid gap-5 md:grid-cols-3"
              >
                {STEPS.map((step, i) => (
                  <motion.article
                    key={step.title}
                    variants={reveal}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.985 }}
                    className="glass-card grain glow-hover gradient-ring group p-6"
                  >
                    <span className="text-sm font-semibold text-primary">Step {i + 1}</span>
                    <span className="mt-4 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-leaf group-hover:text-leaf-foreground">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm font-light text-muted-foreground">{step.text}</p>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-3xl font-bold sm:text-4xl">Built for real sorting habits</h2>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                className="mt-10 grid gap-5 sm:grid-cols-2"
              >
                {FEATURES.map((feature) => (
                  <motion.article
                    key={feature.title}
                    variants={reveal}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.985 }}
                    className="glass-card grain glow-hover gradient-ring group grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-leaf group-hover:text-leaf-foreground">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-1.5 text-sm font-light text-muted-foreground">
                        {feature.text}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA */}
          <section className="px-4 pb-20 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="hero-gradient grain aurora relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12"
            >
              <span className="glow-orb orb-drift right-10 top-0 h-56 w-56 bg-accent" />
              <h2 className="relative text-3xl font-bold text-primary-foreground sm:text-4xl">
                Sort one item today
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl font-light text-primary-foreground/80">
                Recycling only works when the bin is right. Scan your next piece of waste and find
                out in seconds.
              </p>
              <Button asChild size="lg" variant="secondary" className="glow-hover relative mt-7">
                <a href="#scanner">
                  <Camera className="h-4 w-4" /> Open the scanner
                </a>
              </Button>
            </motion.div>
          </section>
        </main>
      </PageTransition>

      <SiteFooter />
    </div>
  );
}

