"use client";

import { motion, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { ButtonLink, WhatsAppIcon } from "@/components/button-link";
import { FollowSpot, spotMask } from "@/components/follow-spot";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { Magnetic } from "@/components/fx/magnetic";
import { RevealText } from "@/components/fx/reveal-text";
import { photos, whatsappLink } from "@/data/site";
import { useStageReady } from "@/lib/intro";
import { useSectionProgress } from "@/lib/scroll";
import { cn } from "@/lib/utils";

// Grand jeté del Festival Coppelia Córdoba 2012. La bailarina queda centrada en el cuadro (focus 50% 24%).
const LEAP = photos.salto;
const DANCER = { x: 0.49, y: 0.5 };
const IMAGE_STYLE: CSSProperties = { objectPosition: LEAP.focus };
const SIZES = "(min-width: 1024px) 57vw, 100vw";

// Estela estroboscópica: copias tenues a lo largo de la trayectoria del salto (viene de la derecha, hacia la izquierda).
const GHOSTS = [
  { x: 4.5, y: 2.2, opacity: 0.3 },
  { x: 9, y: 4.4, opacity: 0.16 },
  { x: 13.5, y: 6.6, opacity: 0.08 },
];

function Ghost({ index, spread, scroll }: { index: number; spread: MotionValue<number>; scroll: MotionValue<number> }) {
  const ghost = GHOSTS[index];
  const x = useTransform(() => `${ghost.x * spread.get() * (1 + scroll.get() * 1.4)}%`);
  const y = useTransform(() => `${ghost.y * spread.get() * (1 + scroll.get() * 1.4)}%`);
  return (
    <motion.div
      className={cn("absolute inset-0 mix-blend-screen [mask-image:linear-gradient(180deg,#000_58%,transparent_74%)]", index === 2 && "hidden sm:block")}
      style={{ x, y, opacity: ghost.opacity }}
      aria-hidden="true"
    >
      <Image src={LEAP.src} alt="" fill sizes={SIZES} className="object-cover grayscale" style={IMAGE_STYLE} />
    </motion.div>
  );
}

export function Hero() {
  const ready = useStageReady();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Al abrirse el telón la estela converge y la bailarina "aterriza" en el aire.
  const spread = useSpring(2.8, { stiffness: 26, damping: 14, mass: 1 });
  const land = useSpring(1, { stiffness: 30, damping: 16 });
  useEffect(() => {
    if (!ready) return;
    spread.set(reduce ? 0 : 1);
    land.set(0);
  }, [ready, reduce, spread, land]);

  // Con el scroll el salto continúa: sube hacia la izquierda, la estela se alarga y el foco se cierra en iris.
  const scrollYProgress = useSectionProgress(sectionRef, ["start start", "end start"]);
  const groupX = useTransform(() => `${5 * land.get() - 6 * scrollYProgress.get()}%`);
  const groupY = useTransform(() => `${3 * land.get() - 9 * scrollYProgress.get()}%`);
  const groupScale = useTransform(() => 1 + 0.05 * land.get() + 0.1 * scrollYProgress.get());
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.75], [1, 0]);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    sectionRef.current?.style.setProperty("--iris", String(Math.max(0, 1 - 1.1 * p)));
  });

  const enter = (delay: number, className?: string) => ({
    className: cn(
      "transition-[opacity,transform,translate,scale,rotate] duration-[1200ms] ease-[var(--ease-out-expo)]",
      ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      className,
    ),
    style: { transitionDelay: ready ? `${delay}ms` : "0ms" },
  });

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[40rem] overflow-hidden bg-noche" style={{ "--spot": 1.3 } as CSSProperties}>
      <FollowSpot
        home={DANCER}
        on={ready}
        className="bottom-[46%] [mask-image:linear-gradient(180deg,#000_72%,transparent)] lg:bottom-0 lg:left-[2vw] lg:right-[41%] lg:[mask-image:radial-gradient(ellipse_62%_70%_at_50%_45%,#000_60%,transparent)]"
      >
        <motion.div className="absolute inset-0" style={reduce ? undefined : { x: groupX, y: groupY, scale: groupScale }}>
          {/* Fuera del foco, blanco y negro en penumbra; dentro, el color del escenario */}
          <Image src={LEAP.src} alt="" fill priority sizes={SIZES} className="object-cover brightness-[0.3] grayscale" style={IMAGE_STYLE} />
          <div className="absolute inset-0" style={{ maskImage: spotMask, WebkitMaskImage: spotMask }}>
            <Image src={LEAP.src} alt={LEAP.alt} fill priority sizes={SIZES} className="object-cover saturate-[1.15]" style={IMAGE_STYLE} />
          </div>

          {/* La estela va encima, en modo trama: solo suma luz donde está la bailarina */}
          {!reduce && GHOSTS.map((_, i) => <Ghost key={i} index={i} spread={spread} scroll={scrollYProgress} />)}
        </motion.div>
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle calc(var(--sr) * var(--iris, 1) * var(--spot, 1) * min(max(36vw, 12rem), 25rem) + 1px) at var(--sx) var(--sy), rgba(255,241,208,0.12), rgba(255,241,208,0.04) 70%, rgba(255,241,208,0) 100%)",
          }}
          aria-hidden="true"
        />
        <DustCanvas count={110} />
      </FollowSpot>

      <motion.div
        className="relative mx-auto flex h-full max-w-[90rem] items-end px-5 pb-12 sm:px-8 sm:pb-16 lg:items-center lg:pb-0 lg:pt-16"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <div className="w-full lg:ml-auto lg:w-[38%]">
          <h1 className="display text-[clamp(4.2rem,12.5vw,8.6rem)]">
            <span className="sr-only">Studio de Danza Coppelia, escuela de ballet en Tomares. </span>
            <RevealText text={"Somos\ndanza."} lines delay={120} stagger={45} />
          </h1>
          <p {...enter(520, "mt-6 max-w-[34rem] text-lg leading-relaxed text-white/80 sm:text-xl")}>
            Escuela de ballet en Tomares desde 1986. Clásico, contemporáneo, Ballet Fitness y Pilates para peques desde 3&nbsp;años, jóvenes y adultos.
          </p>
          <div {...enter(660, "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center")}>
            <Magnetic className="w-full sm:w-auto">
              <ButtonLink href={whatsappLink()} className="w-full sm:w-auto">
                <WhatsAppIcon />
                Pide tu clase de prueba
              </ButtonLink>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <ButtonLink href="/clases" variant="ghost" className="w-full sm:w-auto">
                Ver las clases
              </ButtonLink>
            </Magnetic>
          </div>
          <p
            className="hand mt-5 flex items-center gap-2 text-2xl text-tutu transition-[clip-path] duration-[1400ms] ease-[var(--ease-curtain)]"
            style={{ clipPath: ready ? "inset(-20% 0 -20% 0)" : "inset(-20% 100% -20% 0)", transitionDelay: ready ? "1000ms" : "0ms" }}
          >
            <svg viewBox="0 0 40 24" className="h-6 w-10 -scale-y-100" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
              <path d="M38 4C28 20 13 21 4 12" />
              <path d="M4 12l1.5 7M4 12l7-1" />
            </svg>
            la primera clase y la matrícula, ¡gratis!
          </p>
        </div>
      </motion.div>

      <p
        className={cn(
          "hand pointer-events-none absolute left-8 top-28 hidden text-lg text-white/45 transition-opacity duration-1000 lg:block",
          ready ? "opacity-100 delay-[1800ms]" : "opacity-0",
        )}
        aria-hidden="true"
      >
        Festival Coppelia · Córdoba
      </p>

      <div
        className={cn(
          "pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/45 transition-opacity duration-1000 lg:flex",
          ready ? "opacity-100 delay-[1600ms]" : "opacity-0",
        )}
        aria-hidden="true"
      >
        Desliza
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-curtain)_infinite] bg-tutu" />
        </span>
      </div>
    </section>
  );
}
