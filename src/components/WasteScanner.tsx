import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "motion/react";
import {
  Upload,
  ScanLine,
  Loader2,
  RotateCcw,
  Recycle,
  Leaf,
  AlertTriangle,
  Cpu,
  Trash2,
  RefreshCw,
  CheckCircle2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/CountUp";
import { ScoreGauge } from "@/components/ScoreGauge";
import { celebrate } from "@/lib/celebrate";
import { scanWaste } from "@/lib/classify.functions";
import type { ScanResult } from "@/lib/classify.server";

const MAX_EDGE = 1024;
const HISTORY_KEY = "ecosort-history";

const CATEGORY_META: Record<
  string,
  { icon: typeof Recycle; chip: string; co2: number }
> = {
  Recyclable: { icon: Recycle, chip: "bg-leaf text-leaf-foreground", co2: 1.4 },
  Organic: { icon: Leaf, chip: "bg-organic text-leaf-foreground", co2: 0.6 },
  Hazardous: { icon: AlertTriangle, chip: "bg-hazard text-leaf-foreground", co2: 2.2 },
  "E-Waste": { icon: Cpu, chip: "bg-ewaste text-leaf-foreground", co2: 3.1 },
  Landfill: { icon: Trash2, chip: "bg-landfill text-leaf-foreground", co2: 0.2 },
  Reusable: { icon: RefreshCw, chip: "bg-accent text-accent-foreground", co2: 1.9 },
};

type HistoryEntry = { name: string; category: string; at: number };

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${6 + ((i * 37) % 88)}%`,
  top: `${12 + ((i * 53) % 76)}%`,
  dx: `${((i % 5) - 2) * 10}px`,
  dy: `${-40 - (i % 4) * 18}px`,
  dur: `${2.6 + (i % 5) * 0.4}s`,
  delay: `${(i % 7) * 0.28}s`,
  size: 4 + (i % 3) * 2,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function WasteScanner() {
  const scan = useServerFn(scanWaste);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "scanning">("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [logged, setLogged] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw) as HistoryEntry[]);
    } catch {
      /* ignore */
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setResult(null);
    setLogged(false);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPreview(dataUrl);
      setStatus("ready");
    } catch {
      setError("That image could not be read. Try a different photo.");
    }
  }, []);

  const runScan = useCallback(async () => {
    if (!preview) return;
    setStatus("scanning");
    setError(null);
    setResult(null);
    setLogged(false);
    try {
      const data = await scan({ data: { image: preview } });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Please try again.");
    } finally {
      setStatus("ready");
    }
  }, [preview, scan]);

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setLogged(false);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  const logItem = () => {
    if (!result || logged) return;
    const entry: HistoryEntry = { name: result.itemName, category: result.category, at: Date.now() };
    const next = [entry, ...history].slice(0, 8);
    setHistory(next);
    setLogged(true);
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    celebrate();
  };

  const meta = result ? (CATEGORY_META[result.category] ?? CATEGORY_META["Landfill"]!) : null;
  const CategoryIcon = meta?.icon ?? Recycle;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Uploader */}
      <div className="glass-card grain p-5 sm:p-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />

        {!preview ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
            className={`flex min-h-[280px] w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors sm:min-h-[340px] ${
              dragging
                ? "border-primary bg-secondary"
                : "border-border hover:border-primary/60 hover:bg-secondary/50"
            }`}
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-secondary text-primary badge-pulse">
              <Upload className="h-7 w-7" />
            </span>
            <span className="space-y-1">
              <span className="block font-display text-lg font-semibold">
                Upload a photo of your waste
              </span>
              <span className="block text-sm text-muted-foreground">
                Drag &amp; drop, or tap to take a picture. JPG, PNG or WebP.
              </span>
            </span>
          </motion.button>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={preview}
                alt="Selected waste item"
                className="h-[280px] w-full object-contain sm:h-[340px]"
              />
              <AnimatePresence>
                {status === "scanning" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-foreground/20 backdrop-blur-[1px]"
                  >
                    <div className="scan-laser absolute left-0 h-[3px] w-full accent-gradient" />
                    {PARTICLES.map((p, i) => (
                      <span
                        key={i}
                        className="particle absolute rounded-full"
                        style={
                          {
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            "--dx": p.dx,
                            "--dy": p.dy,
                            "--dur": p.dur,
                            "--delay": p.delay,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                    <span className="absolute inset-4 rounded-xl border border-accent/50" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
              <Button
                size="lg"
                onClick={() => void runScan()}
                disabled={status === "scanning"}
                className="glow-hover w-full"
              >
                {status === "scanning" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analysing…
                  </>
                ) : (
                  <>
                    <ScanLine className="h-4 w-4" /> Scan waste
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={reset}
                disabled={status === "scanning"}
                className="glow-hover"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Reset</span>
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {history.length > 0 && (
          <div className="mt-6 border-t border-border/70 pt-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <History className="h-4 w-4" /> Recycling history
            </h4>
            <ul className="mt-3 space-y-2">
              <AnimatePresence initial={false}>
                {history.map((h) => (
                  <motion.li
                    key={h.at}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2 text-sm"
                  >
                    <span className="truncate font-medium">{h.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{h.category}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </div>

      {/* Result */}
      <div className="glass-card grain min-h-[360px] p-5 sm:p-6">
        {status === "scanning" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
              <div className="min-w-0 space-y-3">
                <div className="skeleton-glow h-6 w-32" />
                <div className="skeleton-glow h-8 w-3/4" />
                <div className="skeleton-glow h-4 w-full" />
              </div>
              <div className="skeleton-glow h-20 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton-glow h-16" />
              ))}
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton-glow h-4" style={{ width: `${90 - i * 12}%` }} />
            ))}
          </div>
        ) : !result ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
              <ScanLine className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-semibold">Your sorting result appears here</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              The assistant identifies the material, picks the right bin and gives step-by-step
              disposal instructions.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-6"
          >
            <motion.header
              variants={fadeUp}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"
            >
              <div className="min-w-0 space-y-2">
                <span
                  className={`badge-pulse inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${meta?.chip}`}
                >
                  <CategoryIcon className="h-3.5 w-3.5 shrink-0" />
                  {result.category}
                </span>
                <h3 className="truncate text-2xl font-bold">{result.itemName}</h3>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-display text-3xl font-bold text-primary">
                  <CountUp value={Math.round(result.confidence)} suffix="%" />
                </div>
                <div className="text-xs text-muted-foreground">confidence</div>
              </div>
            </motion.header>

            <motion.div
              variants={fadeUp}
              className="grid items-center gap-4 rounded-2xl bg-secondary/50 p-4 sm:grid-cols-[auto_minmax(0,1fr)]"
            >
              <ScoreGauge
                value={result.recyclable ? Math.round(result.confidence) : 20}
                label="recyclability"
              />
              <div className="min-w-0 space-y-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  CO₂ offset if sorted correctly
                </div>
                <div className="font-display text-3xl font-bold text-leaf">
                  <CountUp value={meta?.co2 ?? 0.5} decimals={1} suffix=" kg" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated emissions avoided versus sending this item to landfill.
                </p>
              </div>
            </motion.div>

            <motion.dl variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Fact label="Material" value={result.material} />
              <Fact label="Bin" value={result.binColor} />
              <Fact label="Recyclable" value={result.recyclable ? "Yes" : "No"} />
            </motion.dl>

            <motion.section variants={fadeUp}>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                How to dispose of it
              </h4>
              <ol className="space-y-2.5">
                {result.disposalSteps.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-3 text-sm"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0">{step}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.section>

            {result.tips.length > 0 && (
              <motion.section variants={fadeUp}>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Upcycling &amp; smart tips
                </h4>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.12, duration: 0.4 }}
                      className="flex gap-2.5 text-sm"
                    >
                      <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                      <span className="min-w-0">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            )}

            <motion.p
              variants={fadeUp}
              className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground"
            >
              {result.environmentalImpact}
            </motion.p>

            <motion.div variants={fadeUp}>
              <Button size="lg" onClick={logItem} disabled={logged} className="glow-hover w-full">
                <CheckCircle2 className="h-4 w-4" />
                {logged ? "Logged to your history" : "Log this item as recycled"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border px-3 py-2.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm font-semibold">{value}</dd>
    </div>
  );
}
