"use client";

import { motion, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RevealText } from "@/components/fx/reveal-text";
import { StageImage } from "@/components/fx/stage-image";
import { milestones, photos } from "@/data/site";
import { LOGO_D, LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo-paths";
import { cn } from "@/lib/utils";
import { useSectionProgress } from "@/lib/scroll";

const YEARS = milestones.map((item) => Number(item.year));
const STOPS = milestones.map((_, index) => index / (milestones.length - 1));

/**
 * Cuarenta años en un scroll: el contador corre de 1986 a 2026 siguiendo la línea de tiempo
 * y el logo se dibuja trazo a trazo hasta quedar completo en el último hito.
 */
export function History() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const strokesRef = useRef<SVGGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  const scrollYProgress = useSectionProgress(timelineRef, ["start 0.65", "end 0.55"]);
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });
  const year = useTransform(progress, STOPS, YEARS);

  useMotionValueEvent(year, "change", (value) => {
    if (yearRef.current) yearRef.current.textContent = String(Math.round(value));
  });

  useMotionValueEvent(progress, "change", (p) => {
    const paths = strokesRef.current?.children;
    if (!paths || !fillRef.current) return;
    const drawn = Math.min(1, p / 0.85) * paths.length;
    for (let i = 0; i < paths.length; i += 1) {
      const local = Math.min(1, Math.max(0, drawn - i));
      (paths[i] as SVGPathElement).style.strokeDashoffset = String(1 - local);
    }
    fillRef.current.style.opacity = String(Math.min(1, Math.max(0, (p - 0.82) / 0.15)));
  });

  // El hito que cruza el centro de la pantalla se ilumina.
  useEffect(() => {
    const items = timelineRef.current?.querySelectorAll<HTMLElement>("[data-milestone]");
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.milestone));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-noche" aria-labelledby="historia">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 sm:px-8 lg:pt-36">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="historia" className="display text-[clamp(2.8rem,6.4vw,6rem)] lg:col-span-7">
            <RevealText text="Cuarenta años, el mismo dibujo." />
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-white/65 lg:col-span-4 lg:col-start-9">
            Nuestro logo son dos niños que se dan la mano para bailar. Lo dibujamos en 1986 y lo seguimos viendo cada día en clase.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[90rem] gap-x-16 px-5 pb-24 pt-12 sm:px-8 lg:grid-cols-12 lg:pb-36 lg:pt-20">
        {/* Móvil: tira fija con año y logo. Escritorio: columna fija a la izquierda. */}
        <div className="sticky top-0 z-10 -mx-5 border-b border-white/10 bg-black/85 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:static lg:col-span-5 lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex items-center justify-between gap-6 lg:sticky lg:top-28 lg:block">
            <p className="display text-[3.4rem] leading-none tabular-nums lg:text-[clamp(6rem,11vw,10rem)]" aria-hidden="true">
              <span ref={yearRef}>{reduce ? "2026" : "1986"}</span>
            </p>
            <svg viewBox={LOGO_VIEWBOX} className="h-16 w-auto shrink-0 overflow-visible lg:mt-10 lg:h-auto lg:w-[min(22rem,100%)]" aria-hidden="true">
              <g ref={strokesRef} fill="none" stroke="#fff" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
                {LOGO_PATHS.map((d, index) => (
                  <path key={index} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={reduce ? 0 : 1} />
                ))}
              </g>
              <path ref={fillRef} d={LOGO_D} fill="#fff" fillRule="evenodd" opacity={reduce ? 1 : 0} />
            </svg>
            <p className="hand mt-6 hidden text-2xl text-tutu lg:block">el mismo dibujo desde 1986</p>
          </div>
        </div>

        <div ref={timelineRef} className="relative mt-10 pl-8 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:pl-12">
          <span className="absolute bottom-0 left-0 top-0 w-px bg-white/15" aria-hidden="true" />
          <motion.span className="absolute left-0 top-0 h-full w-px origin-top bg-tutu shadow-[0_0_14px_rgba(191,225,248,0.8)]" style={{ scaleY: progress }} aria-hidden="true" />

          <ol>
            {milestones.map((item, index) => (
              <li
                key={item.year}
                data-milestone={index}
                className={cn(
                  "relative grid gap-3 border-t border-white/10 py-10 transition-opacity duration-700 sm:grid-cols-[9rem_1fr] sm:gap-8 lg:py-14",
                  active >= index || reduce ? "opacity-100" : "opacity-35",
                )}
              >
                <span
                  className={cn(
                    "absolute -left-8 top-12 h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-[background-color,box-shadow,transform,translate,scale,rotate] duration-500 lg:-left-12 lg:top-16",
                    active >= index ? "scale-125 bg-tutu shadow-[0_0_14px_3px_rgba(191,225,248,0.7)]" : "bg-white/30",
                  )}
                  aria-hidden="true"
                />
                <p className={cn("display text-5xl sm:text-[3.4rem]", index === milestones.length - 1 && "italic text-tutu")}>{item.year}</p>
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-white/65">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="relative mt-6 max-w-md">
            <StageImage photo={photos.dosBailarinas} natural sizes="(min-width: 1024px) 28rem, 100vw" />
            <figcaption className="hand mt-4 text-2xl text-tutu">y así se ve el logo en escena</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
