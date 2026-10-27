"use client";

import { motion, useMotionTemplate, useReducedMotion, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSectionProgress } from "@/lib/scroll";

/**
 * Sección clara que entra como un escenario que se abre: empieza recogida, con esquinas redondas,
 * y se despliega a todo el ancho mientras sube.
 */
export function StageSection({ children, className, labelledBy }: { children: ReactNode; className?: string; labelledBy?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useSectionProgress(ref, ["start end", "start 0.2"]);
  const inset = useTransform(scrollYProgress, [0, 1], [7, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const clipPath = useMotionTemplate`inset(0% ${inset}% 0% ${inset}% round ${radius}px)`;

  return (
    <motion.section ref={ref} className={cn("on-light", className)} style={reduce ? undefined : { clipPath }} aria-labelledby={labelledBy}>
      {children}
    </motion.section>
  );
}
