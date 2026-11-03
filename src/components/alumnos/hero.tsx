"use client";

import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { ButtonLink } from "@/components/button-link";
import { FollowSpot, spotMask } from "@/components/follow-spot";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { Magnetic } from "@/components/fx/magnetic";
import { RevealText } from "@/components/fx/reveal-text";
import { festivals, venues } from "@/data/festivales";
import { useStageReady } from "@/lib/intro";
import { useSectionProgress } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const HOUSE = venues[0].photo!;
const FIRST = Math.min(...festivals.map((f) => f.year));
const LAST = Math.max(...festivals.map((f) => f.year));

/**
 * La vista desde el escenario: el patio de butacas del Gran Teatro a oscuras y el cañón de luz
 * descubriéndolo en color. El contador corre de 1988 a la última gala y, al bajar, la cámara entra en la sala.
 */
export function AlumnosHero() {
  const ready = useStageReady();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Marcador: los años corren hasta la última función.
  useEffect(() => {
    const el = counterRef.current;
    if (!ready || !el || reduce) return;
    let raf = 0;
    const t0 = performance.now() + 700;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / 2400));
      el.textContent = String(Math.round(FIRST + (LAST - FIRST) * (1 - Math.pow(1 - t, 4))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, reduce]);

  const progress = useSectionProgress(sectionRef, ["start start", "end start"]);
  const scale = useTransform(progress, [0, 1], [1.06, 1.4]);
  const y = useTransform(progress, [0, 1], ["0%", "8%"]);
  const textY = useTransform(progress, [0, 1], [0, -90]);
  const textOpacity = useTransform(progress, [0.1, 0.7], [1, 0]);
  useMotionValueEvent(progress, "change", (p) => {
    sectionRef.current?.style.setProperty("--iris", String(Math.max(0, 1 - 1.2 * p)));
  });

  const enter = (delay: number, className?: string) => ({
    className: cn(
      "transition-[opacity,transform,translate] duration-[1200ms] ease-[var(--ease-out-expo)]",
      ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      className,
    ),
    style: { transitionDelay: ready ? `${delay}ms` : "0ms" },
  });

  const names = venues.map((v) => v.name);

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[40rem] overflow-hidden bg-noche" style={{ "--spot": 1.5 } as CSSProperties}>
      <FollowSpot home={{ x: 0.5, y: 0.42 }} on={ready}>
        <motion.div className="absolute inset-0" style={reduce ? undefined : { scale, y }}>
          <Image src={HOUSE.src} alt="" fill priority sizes="100vw" className="object-cover brightness-[0.22] grayscale" style={{ objectPosition: HOUSE.focus }} />
          <div className="absolute inset-0" style={{ maskImage: spotMask, WebkitMaskImage: spotMask }}>
            <Image src={HOUSE.src} alt={HOUSE.alt} fill priority sizes="100vw" className="object-cover saturate-[1.15]" style={{ objectPosition: HOUSE.focus }} />
          </div>
        </motion.div>
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle calc(var(--sr) * var(--iris, 1) * var(--spot, 1) * min(max(36vw, 12rem), 25rem) + 1px) at var(--sx) var(--sy), rgba(255,241,208,0.14), rgba(255,241,208,0.04) 70%, rgba(255,241,208,0) 100%)",
          }}
          aria-hidden="true"
        />
        <DustCanvas count={120} />
      </FollowSpot>

      {/* Los teatros pasan, enormes y perfilados, por detrás del título */}
      <div
        className={cn("pointer-events-none absolute inset-x-0 top-[17%] overflow-hidden lg:top-[34%] transition-opacity duration-[2000ms]", ready ? "opacity-100 delay-700" : "opacity-0")}
        aria-hidden="true"
      >
        <div className="venue-marquee flex w-max gap-16 whitespace-nowrap">
          {[...names, ...names].map((name, i) => (
            <span key={i} className="display text-[clamp(4rem,11vw,10rem)] italic text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.16)]">
              {name} ·
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55),transparent_30%,transparent_55%,rgba(0,0,0,0.85))]" aria-hidden="true" />

      <motion.div className="relative mx-auto flex h-full max-w-[90rem] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16" style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
        <p {...enter(200, "hand text-2xl text-tutu")}>nuestros alumnos, desde el escenario</p>
        <h1 className="display mt-2 text-[clamp(4.6rem,15vw,13rem)] leading-[0.85]">
          <RevealText text="En escena" delay={250} stagger={55} />
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <p {...enter(650, "max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl lg:col-span-6")}>
            Estar en escena enseña a estar en la vida. Cada curso termina en un teatro de verdad, y aquí guardamos todos los que hemos pisado: festivales, fotos, vídeos y
            programas de mano.
          </p>
          <div {...enter(800, "lg:col-span-6 lg:justify-self-end")}>
            <p className="display flex items-baseline gap-4 text-[clamp(2.8rem,6vw,5rem)] tabular-nums leading-none">
              <span>{FIRST}</span>
              <span className="h-px w-[clamp(2rem,6vw,5rem)] translate-y-[-0.3em] bg-tutu" aria-hidden="true" />
              <span ref={counterRef} className="italic text-tutu">
                {reduce ? LAST : FIRST}
              </span>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href="#festivales" className="w-full sm:w-auto">
                  Ver los {festivals.length} festivales
                </ButtonLink>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href="#escenarios" variant="ghost" className="w-full sm:w-auto">
                  Nuestros teatros
                </ButtonLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.div>

      <p
        className={cn("hand pointer-events-none absolute right-8 top-28 hidden text-lg text-white/45 transition-opacity duration-1000 lg:block", ready ? "opacity-100 delay-[1800ms]" : "opacity-0")}
        aria-hidden="true"
      >
        el Gran Teatro de Córdoba, visto desde las tablas
      </p>
    </section>
  );
}
