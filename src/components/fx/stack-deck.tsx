"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSectionProgress } from "@/lib/scroll";
import { cn } from "@/lib/utils";

type Mode = "desktop" | "mobile";

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = matchMedia("(min-width: 1024px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}

type CardProps = { index: number; total: number; progress: MotionValue<number>; active: boolean; mode: Mode; children: ReactNode };

function Card({ index, total, progress, active, mode, children }: CardProps) {
  const behind = total - index - 1;
  const range = [index / total, 1];
  const mobile = mode === "mobile";
  // La tarjeta de debajo se encoge, se oscurece y, en móvil, se ladea: la siguiente "se la come".
  const scale = useTransform(progress, range, [1, 1 - behind * (mobile ? 0.08 : 0.05)]);
  const rotate = useTransform(progress, range, [0, mobile ? -2.2 * behind : 0]);
  const shade = useTransform(progress, range, [0, behind ? Math.min(mobile ? 0.7 : 0.65, behind * (mobile ? 0.3 : 0.22)) : 0]);

  return (
    <div
      className={cn(mobile ? active && "sticky" : "lg:sticky lg:h-[calc(100svh-9rem)] lg:min-h-[38rem]")}
      style={active ? { top: mobile ? `calc(0.75rem + ${index * 12}px)` : `calc(7.5rem + ${index * 14}px)` } : undefined}
    >
      <motion.div
        className={cn("relative origin-top overflow-hidden", mobile ? "rounded-[1.75rem] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]" : "h-full lg:rounded-[2rem]")}
        style={active ? { scale, rotate } : undefined}
      >
        {children}
        {active && <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} aria-hidden="true" />}
      </motion.div>
    </div>
  );
}

/**
 * Mazo de tarjetas: cada una se queda fija y la siguiente sube por encima mientras la anterior se aleja.
 * "desktop": solo a partir de 1024 px (Clases). "mobile": para listas que solo se ven en móvil.
 */
export function StackDeck({ cards, mode = "desktop", className }: { cards: ReactNode[]; mode?: Mode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduce = useReducedMotion();
  const scrollYProgress = useSectionProgress(ref, ["start start", "end end"]);
  const active = !reduce && (mode === "mobile" || wide);

  return (
    <div ref={ref} className={cn("grid", mode === "desktop" ? "lg:gap-[18vh] lg:px-8 lg:pb-[12vh]" : "gap-[12svh] pb-[4svh]", className)}>
      {cards.map((card, index) => (
        <Card key={index} index={index} total={cards.length} progress={scrollYProgress} active={active} mode={mode}>
          {card}
        </Card>
      ))}
    </div>
  );
}
