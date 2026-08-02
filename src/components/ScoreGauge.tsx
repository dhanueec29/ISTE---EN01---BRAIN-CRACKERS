import { motion } from "motion/react";
import { CountUp } from "./CountUp";

export function ScoreGauge({ value, label }: { value: number; label: string }) {
  const size = 132;
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke="var(--color-muted)"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="var(--color-leaf)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
          transition={{ type: "spring", stiffness: 60, damping: 12, mass: 1.1, delay: 0.15 }}
        />
      </svg>
      <div className="absolute grid place-items-center text-center">
        <span className="font-display text-3xl font-bold text-primary">
          <CountUp value={pct} suffix="%" />
        </span>
        <span className="text-[0.68rem] uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
