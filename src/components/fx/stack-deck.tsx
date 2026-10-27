"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSectionProgress } from "@/lib/scroll";

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

function Card({ index, total, progress, wide, children }: { index: number; total: number; progress: MotionValue<number>; wide: boolean; children: ReactNode }) {
  const behind = total - index - 1;
  const scale = useTransform(progress, [index / total, 1], [1, 1 - behind * 0.05]);
  const shade = useTransform(progress, [index / total, 1], [0, behind ? Math.min(0.65, behind * 0.22) : 0]);

  return (
    <div className="lg:sticky lg:h-[calc(100svh-9rem)] lg:min-h-[38rem]" style={wide ? { top: `calc(7.5rem + ${index * 14}px)` } : undefined}>
      <motion.div className="relative h-full origin-top overflow-hidden lg:rounded-[2rem]" style={wide ? { scale } : undefined}>
        {children}
        {wide && <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} aria-hidden="true" />}
      </motion.div>
    </div>
  );
}

/** Mazo de tarjetas: en escritorio cada una se queda fija y la siguiente sube por encima mientras la anterior se aleja. */
export function StackDeck({ cards }: { cards: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduce = useReducedMotion();
  const scrollYProgress = useSectionProgress(ref, ["start start", "end end"]);

  return (
    <div ref={ref} className="grid lg:gap-[18vh] lg:px-8 lg:pb-[12vh]">
      {cards.map((card, index) => (
        <Card key={index} index={index} total={cards.length} progress={scrollYProgress} wide={wide && !reduce}>
          {card}
        </Card>
      ))}
    </div>
  );
}
