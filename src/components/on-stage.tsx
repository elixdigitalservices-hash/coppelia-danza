"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { RevealText } from "@/components/fx/reveal-text";
import { photos, type Photo } from "@/data/site";
import { cn } from "@/lib/utils";
import { useSectionProgress } from "@/lib/scroll";

const shots: Array<{ photo: Photo; caption: string }> = [
  { photo: photos.escenaBlancas, caption: "Tres tutús blancos" },
  { photo: photos.escenaTutus, caption: "Corro de tutús" },
  { photo: photos.escenaArqueras, caption: "Arqueras" },
  { photo: photos.escenaArabesque, caption: "Arabesque" },
  { photo: photos.escenaAzul, caption: "Grupo lírico" },
  { photo: photos.escenaRojo, caption: "En rojo" },
  { photo: photos.escenaPareja, caption: "Dúo en blanco" },
];

// Coverflow: cada foto gira en perspectiva según lo lejos que esté del centro de la pantalla.
function flow(figures: Array<HTMLElement | null>, trackX: number) {
  const vw = window.innerWidth;
  figures.forEach((figure) => {
    if (!figure) return;
    const d = (figure.offsetLeft + figure.offsetWidth / 2 + trackX - vw / 2) / vw;
    const a = Math.min(Math.abs(d), 1.2);
    figure.style.transform = `perspective(1600px) rotateY(${Math.max(-34, Math.min(34, -d * 38))}deg) scale(${1 - a * 0.14})`;
    const dim = figure.querySelector<HTMLElement>("[data-dim]");
    if (dim) dim.style.opacity = String(Math.min(0.6, a * 0.7));
  });
}

/**
 * El scroll vertical mueve un pase de diapositivas horizontal: la sección se queda fija
 * mientras las funciones desfilan girando en 3D, cada foto con su propio paralaje.
 */
export function OnStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | undefined>(undefined);
  const distance = useMotionValue(0);
  const reduce = useReducedMotion();
  const figuresRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return;
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distance.set(d);
      setHeight(`calc(100svh + ${d}px)`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance, reduce]);

  const scrollYProgress = useSectionProgress(sectionRef, ["start start", "end end"]);
  const x = useTransform(() => -scrollYProgress.get() * distance.get());
  const inner = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);

  useMotionValueEvent(x, "change", (value) => flow(figuresRef.current, value));
  useEffect(() => {
    if (!reduce) flow(figuresRef.current, x.get());
  }, [height, reduce, x]);

  return (
    <section ref={sectionRef} className="relative bg-noche" style={{ height: reduce ? undefined : height }} aria-labelledby="en-escena" data-hide-cta>
      <div className={cn("flex flex-col justify-center overflow-hidden", !reduce && "sticky top-0 h-[100svh]")}>
        <motion.div
          ref={trackRef}
          className={cn("flex w-max items-center gap-4 px-5 sm:gap-6 sm:px-8 lg:pr-[12vw]", reduce && "w-auto overflow-x-auto py-16")}
          style={reduce ? undefined : { x }}
        >
          <div className="w-[82vw] max-w-[34rem] shrink-0 pr-4 sm:w-[60vw] lg:w-[34rem] lg:pr-10">
            <h2 id="en-escena" className="display text-[clamp(3rem,7vw,6rem)]">
              <RevealText text={"El escenario\ntambién es clase."} lines />
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">
              Cada curso termina con un festival en un teatro de verdad. No es una meta: es la clase más especial, donde se aprende a presentarse ante el público y a disfrutar del trabajo hecho.
            </p>
            <p className="hand mt-8 flex items-center gap-3 text-2xl text-tutu">
              desliza hacia abajo
              <svg viewBox="0 0 48 16" className="h-4 w-12" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
                <path d="M2 8h42M38 2l6 6-6 6" />
              </svg>
            </p>
          </div>

          {shots.map(({ photo, caption }, index) => {
            const ratio = photo.width / photo.height;
            // Altura fija por foto y ancho según su proporción real: ninguna se recorta.
            const size = { "--r": ratio, aspectRatio: `${photo.width} / ${photo.height}` } as CSSProperties;
            return (
              <figure
                key={photo.src}
                ref={(el) => {
                  figuresRef.current[index] = el;
                }}
                className={cn("shrink-0 will-change-transform", index % 2 === 1 ? "self-end pb-[5svh]" : "self-start pt-[5svh]")}
              >
                <div
                  className="relative w-[min(84vw,calc(52svh*var(--r)))] overflow-hidden bg-white/5 lg:w-[min(70vw,calc(60svh*var(--r)))]"
                  style={size}
                  data-cursor="¡Bravo!"
                >
                  <motion.div className="absolute -inset-x-[3%] inset-y-0" style={reduce ? undefined : { x: inner }}>
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 70vw, 84vw" className="object-cover" style={{ objectPosition: photo.focus }} />
                  </motion.div>
                  <div data-dim className="pointer-events-none absolute inset-0 bg-black opacity-0" aria-hidden="true" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-6 text-sm">
                  <span className="display text-2xl italic">{caption}</span>
                  {photo.credit && <span className="text-white/45">Foto: {photo.credit}</span>}
                </figcaption>
              </figure>
            );
          })}

          <blockquote className="w-[82vw] max-w-[36rem] shrink-0 pl-4 sm:w-[60vw] lg:w-[40rem] lg:pl-16">
            <p className="display text-[clamp(2.4rem,5vw,4.5rem)] italic leading-[1.02]">“Estar en escena enseña a estar en la vida.”</p>
            <footer className="mt-6 text-white/55">Más de 5.000 bailarines han salido a escena con Coppelia.</footer>
          </blockquote>
        </motion.div>

        {!reduce && (
          <div className="absolute inset-x-5 bottom-6 h-px bg-white/15 sm:inset-x-8" aria-hidden="true">
            <motion.span className="absolute inset-0 origin-left bg-tutu" style={{ scaleX: scrollYProgress }} />
          </div>
        )}
      </div>
    </section>
  );
}
