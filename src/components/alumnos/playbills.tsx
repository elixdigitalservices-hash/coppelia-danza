"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { Viewer, type ViewerSet } from "@/components/alumnos/viewer";
import { RevealText } from "@/components/fx/reveal-text";
import { festivals, venueOf } from "@/data/festivales";
import type { Photo } from "@/data/site";
import { useSectionProgress } from "@/lib/scroll";

type Print = { photo: Photo; label: string; kind: string };

const prints: Print[] = festivals
  .filter((f) => f.print)
  .sort((a, b) => a.year - b.year)
  .map((f) => ({
    photo: f.print!.photo,
    kind: f.print!.kind,
    label: `${f.year} · ${venueOf(f.venue)?.name ?? f.centre ?? ""}`,
  }));

const printSet: ViewerSet = {
  title: "Programas de mano y carteles",
  items: prints.map((p) => ({ kind: "photo", photo: p.photo, label: `${p.kind} · ${p.label}` })),
};

const MID = (prints.length - 1) / 2;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Un programa que sale del montón y ocupa su sitio en el abanico según avanza el scroll. */
function DealtCard({ print, index, progress, reduce, onOpen }: { print: Print; index: number; progress: MotionValue<number>; reduce: boolean; onOpen: () => void }) {
  const offset = index - MID;
  const angle = offset * 4.5;
  const t = useTransform(progress, (p) => (reduce ? 1 : ease(Math.min(1, Math.max(0, (p - 0.04 - index * 0.055) / 0.42)))));
  const x = useTransform(t, (v) => `${offset * 4 * (1 - v) + offset * 11 * v}vw`);
  const y = useTransform(t, (v) => `${34 * (1 - v) + offset * offset * 1.1 * v}svh`);
  const rotate = useTransform(t, (v) => (index % 2 ? -1 : 1) * (4 + index) * (1 - v) + angle * v);
  const landscape = print.photo.width > print.photo.height;

  return (
    <motion.div className="print-card absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2" style={{ x, y, rotate, zIndex: index }}>
      <button
        type="button"
        onClick={onOpen}
        className="group relative block transition-transform duration-500 ease-[var(--ease-out-expo)] hover:[transform:rotate(var(--straight))_translateY(-1.8rem)_scale(1.07)] focus-visible:[transform:rotate(var(--straight))_translateY(-1.8rem)_scale(1.07)]"
        style={{ "--straight": `${-angle}deg` } as CSSProperties}
        data-cursor="Abrir"
        aria-label={`${print.kind} de ${print.label}`}
      >
        <span
          className="relative block overflow-hidden rounded-[3px] bg-white shadow-[0_2px_3px_rgba(0,0,0,0.12),0_28px_50px_-18px_rgba(0,0,0,0.55)]"
          style={{ height: landscape ? "26svh" : "40svh", aspectRatio: `${print.photo.width} / ${print.photo.height}` }}
        >
          <Image src={print.photo.src} alt="" fill sizes="(min-width: 1024px) 26vw, 60vw" className="object-cover" />
          <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_40%,rgba(0,0,0,0.06))]" aria-hidden="true" />
        </span>
        <span className="hand pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-2xl text-tutu-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          {print.label}
        </span>
      </button>
    </motion.div>
  );
}

export function Playbills() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const progress = useSectionProgress(sectionRef, ["start start", "end end"]);
  const [index, setIndex] = useState<number | null>(null);

  const intro = (
    <div className="max-w-4xl">
      <p className="hand text-2xl text-tutu-ink">guardados desde 1988</p>
      <h2 id="programas" className="display mt-3 text-[clamp(2.6rem,5vw,4.8rem)]">
        <RevealText text="Programas de mano y carteles." />
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-linoleo">
        Lo que se imprimió para cada función: del «Studio de Ballet Coppelia» de 1988 al Teatro Central en 2015. Pulsa cualquiera para verlo de cerca.
      </p>
    </div>
  );

  return (
    <section ref={sectionRef} className="on-light relative bg-sala text-noche lg:h-[250svh]" aria-labelledby="programas">
      {/* Escritorio: el montón se reparte en abanico con el scroll */}
      <div className="sticky top-0 hidden h-[100svh] overflow-hidden lg:block">
        <div className="mx-auto max-w-[90rem] px-8 pt-24">{intro}</div>
        <div className="absolute inset-0">
          {prints.map((print, i) => (
            <DealtCard key={print.photo.src} print={print} index={i} progress={progress} reduce={reduce} onOpen={() => setIndex(i)} />
          ))}
        </div>
      </div>

      {/* Móvil y tableta: tira horizontal */}
      <div className="py-24 lg:hidden">
        <div className="px-5 sm:px-8">{intro}</div>
        <ul className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-10 pt-4 [scrollbar-width:none] sm:px-8" data-lenis-prevent>
          {prints.map((print, i) => (
            <li key={print.photo.src} className="shrink-0 snap-center" style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 2.5}deg)` }}>
              <button type="button" onClick={() => setIndex(i)} className="block text-left" aria-label={`${print.kind} de ${print.label}`}>
                <span
                  className="relative block overflow-hidden rounded-[3px] bg-white shadow-[0_24px_40px_-18px_rgba(0,0,0,0.5)]"
                  style={{ height: print.photo.width > print.photo.height ? "11rem" : "17rem", aspectRatio: `${print.photo.width} / ${print.photo.height}` }}
                >
                  <Image src={print.photo.src} alt="" fill sizes="60vw" className="object-cover" />
                </span>
                <span className="hand mt-3 block text-xl text-tutu-ink">{print.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Viewer set={index === null ? null : printSet} index={index ?? 0} onIndex={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
