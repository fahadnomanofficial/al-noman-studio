import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, type MotionValue, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE as unknown as number[] } },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Magnetic effect — element gently leans toward the cursor. */
export function useMagnetic(strength = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      x.set(relX * strength);
      y.set(relY * strength);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, x, y]);

  return { ref, x: x as MotionValue<number>, y: y as MotionValue<number> };
}

/** Tracks normalised mouse position (-1..1) for cursor-driven parallax. */
export function useMousePosition() {
  const x = useSpring(0, { stiffness: 60, damping: 20, mass: 0.6 });
  const y = useSpring(0, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return { x, y };
}

/** IntersectionObserver-based active section tracker. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observers: IntersectionObserver[] = [];
    const visibility = new Map<string, number>();

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibility.set(id, entry.intersectionRatio);
          });
          let best = ids[0];
          let max = 0;
          visibility.forEach((ratio, key) => {
            if (ratio > max) {
              max = ratio;
              best = key;
            }
          });
          if (max > 0) setActive(best);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-20% 0px -40% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}
