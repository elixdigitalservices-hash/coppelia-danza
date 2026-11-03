"use client";

import { motion, useMotionTemplate, useReducedMotion, useTransform } from "framer-motion";
import { useRef } from "react";
import { VideoScreen } from "@/components/alumnos/video-screen";
import { RevealText } from "@/components/fx/reveal-text";
import type { Video } from "@/data/festivales";
import { useSectionProgress } from "@/lib/scroll";

type Props = { video: Video; id: string; title: string; lead: string; caption: string };

/**
 * La pantalla de cine se despliega al bajar: empieza pequeña, como vista desde el fondo de la sala,
 * y crece hasta ocupar todo el ancho mientras se encienden las luces de la marquesina.
 */
export function FeaturedFilm({ video, id, title, lead, caption }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const progress = useSectionProgress(ref, ["start end", "center center"]);
  const scale = useTransform(progress, [0, 1], [0.72, 1]);
  const radius = useTransform(progress, [0, 1], [40, 14]);
  const glow = useTransform(progress, [0.4, 1], [0, 1]);
  const glowSize = useTransform(glow, (g) => g * 120);
  const glowAlpha = useTransform(glow, (g) => g * 0.22);
  const shadow = useMotionTemplate`0 0 ${glowSize}px rgba(191,225,248,${glowAlpha})`;

  return (
    <section ref={ref} className="relative overflow-hidden bg-noche" aria-labelledby={id}>
      <div className="mx-auto max-w-[90rem] px-5 pb-24 pt-8 sm:px-8 lg:pb-36">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id={id} className="display text-[clamp(2.8rem,6.4vw,6rem)] lg:col-span-7">
            <RevealText text={title} />
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-white/65 lg:col-span-4 lg:col-start-9">{lead}</p>
        </div>

        <motion.div
          className="mt-14 overflow-hidden"
          style={reduce ? { borderRadius: 14 } : { scale, borderRadius: radius, boxShadow: shadow }}
        >
          <VideoScreen video={video} sizes="(min-width: 1440px) 1376px, 100vw" />
        </motion.div>
        <p className="hand mt-5 text-center text-2xl text-tutu">{caption}</p>
      </div>
    </section>
  );
}
