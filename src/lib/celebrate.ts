import confetti from "canvas-confetti";

const GREEN = ["#2f9e57", "#57d98a", "#a8f07a"];
const GOLD = ["#e8c86a", "#f5e3a1"];

/** Controlled green-and-gold burst, ~1.5s. */
export function celebrate() {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const end = Date.now() + 1500;
  const colors = [...GREEN, ...GOLD];

  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 38,
    scalar: 0.9,
    origin: { y: 0.7 },
    colors,
  });

  const frame = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      startVelocity: 32,
      scalar: 0.8,
      origin: { x: 0, y: 0.75 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      startVelocity: 32,
      scalar: 0.8,
      origin: { x: 1, y: 0.75 },
      colors,
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
