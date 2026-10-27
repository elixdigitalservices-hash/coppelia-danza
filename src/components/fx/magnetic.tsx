"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Atracción sutil: como mucho unos píxeles y sin rebote, para que el botón se deslice en vez de saltar.
const MAX = 6;
const SPRING = { stiffness: 140, damping: 24, mass: 0.6 };
const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));

/** Con ratón, el botón se deja atraer un poco por el cursor. En táctil no hace nada. */
export function Magnetic({ children, className, strength = 0.12 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(clamp((event.clientX - rect.left - rect.width / 2) * strength));
    y.set(clamp((event.clientY - rect.top - rect.height / 2) * strength));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} className={cn("inline-flex", className)} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
