"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { Photo } from "@/data/site";
import { useStageInView } from "@/lib/intro";
import { useSectionProgress } from "@/lib/scroll";
import { cn } from "@/lib/utils";

type Props = {
  photo: Photo;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** El marco toma la proporción real de la foto: se ve entera, sin recortes. */
  natural?: boolean;
  /** Desplazamiento vertical suave de la foto dentro del marco al hacer scroll. */
  parallax?: boolean;
  delay?: number;
  children?: ReactNode;
};

/** Foto que se descubre abriéndose desde el centro, como un telón, y se asienta con un leve zoom. */
export function StageImage({ photo, sizes, className, imageClassName, priority, natural = false, parallax = true, delay = 0, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useStageInView(ref, "0px 0px -8% 0px");
  const reduce = useReducedMotion();
  const scrollYProgress = useSectionProgress(ref, ["start end", "end start"]);
  const y = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);
  const move = parallax && !reduce;
  const frame: CSSProperties = { transitionDelay: `${delay}ms`, ...(natural ? { aspectRatio: `${photo.width} / ${photo.height}` } : null) };

  return (
    <div ref={ref} className={cn("stage-reveal relative overflow-hidden bg-white/5", className)} data-shown={shown} style={frame}>
      <motion.div className={cn("absolute inset-x-0", move ? "-inset-y-[4%]" : "inset-y-0")} style={move ? { y } : undefined}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("stage-reveal-img object-cover", imageClassName)}
          style={{ transitionDelay: `${delay}ms`, objectPosition: photo.focus }}
        />
      </motion.div>
      {children}
    </div>
  );
}
