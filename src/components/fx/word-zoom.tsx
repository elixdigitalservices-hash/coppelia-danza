"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import type { Photo } from "@/data/site";
import { useSectionProgress } from "@/lib/scroll";

const easeIn = (t: number) => t * t * t;
const WORD_CLASS = "display block select-none whitespace-nowrap text-[30vw] italic leading-none portrait:-rotate-90 portrait:text-[23svh]";

/**
 * Una palabra gigante con una función de fondo: al bajar, la cámara vuela a través de las letras
 * y la foto estalla a pantalla completa, a color, como cuando se levanta el telón.
 */
export function WordZoom({ word, photo, portrait, after }: { word: string; photo: Photo; portrait?: Photo; after: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useSectionProgress(ref, ["start start", "end end"]);
  const scale = useTransform(scrollYProgress, [0.06, 0.72], [1, 16], { ease: easeIn });
  const veil = useTransform(scrollYProgress, [0.46, 0.74], [1, 0]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.45, 1]);
  const color = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const hint = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const outline = useTransform(scrollYProgress, [0.1, 0.32], [1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.8, 0.94], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.8, 0.94], [40, 0]);

  if (reduce) return null;

  return (
    <section ref={ref} className="relative h-[280svh] bg-noche" aria-label={`${word}: ${after}`} data-hide-cta>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* En pantallas verticales, una foto vertical del escenario para no recortarla */}
        {[
          { p: photo, className: portrait ? "portrait:hidden" : "" },
          ...(portrait ? [{ p: portrait, className: "landscape:hidden" }] : []),
        ].map(({ p, className }) => (
          <motion.div key={p.src} className={`absolute inset-0 ${className}`} style={{ scale: photoScale }}>
            <Image src={p.src} alt={p.alt} fill sizes="100vw" className="object-cover grayscale" style={{ objectPosition: p.focus }} />
            {/* Al atravesar la palabra, la función recupera el color */}
            <motion.div className="absolute inset-0" style={{ opacity: color }}>
              <Image src={p.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: p.focus }} />
            </motion.div>
          </motion.div>
        ))}

        {/* Negro con la palabra en blanco, en modo multiplicar: la foto solo se ve a través de las letras.
            En vertical la palabra se gira y ocupa toda la altura para que se vea grande. */}
        <motion.div className="absolute inset-0 flex items-center justify-center bg-black mix-blend-multiply" style={{ opacity: veil }} aria-hidden="true">
          <motion.span className={WORD_CLASS + " text-white"} style={{ scale }}>
            {word}
          </motion.span>
        </motion.div>

        {/* Contorno de luz sobre las letras: la palabra se lee aunque detrás haya zonas oscuras de la foto */}
        <motion.div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ opacity: outline }} aria-hidden="true">
          <motion.span
            className={WORD_CLASS + " text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.8)] [text-shadow:0_0_40px_rgba(255,241,208,0.35)]"}
            style={{ scale }}
          >
            {word}
          </motion.span>
        </motion.div>

        <motion.p className="hand absolute inset-x-0 bottom-10 text-center text-2xl text-tutu" style={{ opacity: hint }} aria-hidden="true">
          sigue bajando y entra en escena
        </motion.p>

        <motion.div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent px-5 pb-14 pt-32 sm:px-8 lg:pb-20" style={{ opacity: captionOpacity, y: captionY }}>
          <p className="display mx-auto max-w-[90rem] text-[clamp(2.4rem,6vw,5.5rem)] italic leading-[1]">{after}</p>
        </motion.div>
      </div>
    </section>
  );
}
