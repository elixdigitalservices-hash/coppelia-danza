"use client";

import { useMotionValueEvent, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { blurOf, photos, type Photo } from "@/data/site";
import { useSectionProgress } from "@/lib/scroll";

type Scene = { photo: Photo; cam: string; text: string; focus: string };

// Texto: publicación de Instagram de la escuela "¡Puntas, barra y acción! Hoy os mostramos un día cualquiera en el studio".
const SCENES: Scene[] = [
  { photo: photos.peques, cam: "Cám. 1 · Pre-Ballet", text: "Un studio que se llena de vida y de música.", focus: "60% 35%" },
  { photo: photos.pequeSalto, cam: "Cám. 2 · Aula grande", text: "Hay ganas de aprender.", focus: "50% 40%" },
  { photo: photos.barraEspejo, cam: "Cám. 1 · Barra", text: "Hay disciplina.", focus: "50% 35%" },
  { photo: photos.claseBN, cam: "Cám. 3 · Centro", text: "Hay ejercicios que cuestan y días en que todo sale un poco mejor.", focus: "50% 50%" },
  { photo: photos.estiramiento, cam: "Cám. 2 · Estiramientos", text: "Hay correcciones, repeticiones, risas y concentración.", focus: "55% 45%" },
  { photo: photos.primerasPuntas, cam: "Cám. 1 · Primeras puntas", text: "Y una misma pasión: la danza.", focus: "50% 50%" },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
const START = 17 * 3600;
const LENGTH = 3.5 * 3600;

function timecode(p: number) {
  const secs = START + p * LENGTH;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  const f = Math.floor((secs * 24) % 24);
  return [h, m, s, f].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Una película que se reproduce con el scroll: bandas de cine, REC, código de tiempo,
 * cambio de cámara, destello en cada corte y subtítulos que se escriben solos.
 */
export function FilmDay() {
  const sectionRef = useRef<HTMLElement>(null);
  const framesRef = useRef<Array<HTMLDivElement | null>>([]);
  const captionRef = useRef<HTMLSpanElement>(null);
  const camRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<Array<HTMLDivElement | null>>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const last = useRef({ scene: -1, chars: -1 });
  const reduce = useReducedMotion();
  // Proporción de la pantalla: decide si cada foto llena el cuadro o se ve entera sobre su propio fondo desenfocado.
  const [screen, setScreen] = useState<number | null>(null);
  useEffect(() => {
    const measure = () => setScreen(window.innerWidth / window.innerHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const fills = (photo: Photo) => screen !== null && Math.abs(Math.log(photo.width / photo.height / screen)) < 0.38;
  const scrollYProgress = useSectionProgress(sectionRef, ["start start", "end end"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const n = SCENES.length;
    const intro = clamp(p / 0.06);
    const body = clamp((p - 0.06) / 0.9);
    const pos = body * n;
    const scene = Math.min(n - 1, Math.floor(pos));
    const t = pos - scene;

    // Bandas de cine y rótulo inicial
    barsRef.current.forEach((bar) => bar && (bar.style.transform = `scaleY(${smooth(intro)})`));
    if (titleRef.current) {
      titleRef.current.style.opacity = String(1 - clamp((p - 0.04) / 0.05));
      titleRef.current.style.transform = `scale(${1 + 0.15 * clamp(p / 0.09)})`;
    }
    if (hudRef.current) hudRef.current.style.opacity = String(clamp((p - 0.03) / 0.04));
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${body})`;
    if (tcRef.current) tcRef.current.textContent = timecode(body);

    // Fotogramas: zoom lento (Ken Burns) y fundido al siguiente al final de cada plano
    framesRef.current.forEach((frame, i) => {
      if (!frame) return;
      const local = pos - i;
      let opacity = 0;
      if (i === scene) opacity = 1;
      if (i === scene + 1) opacity = smooth(clamp((t - 0.86) / 0.14));
      if (i === 0 && p < 0.06) opacity = 1;
      frame.style.opacity = String(opacity);
      if (opacity > 0) {
        const k = clamp((local + 0.15) / 1.15);
        // Zoom lento: más marcado cuando la foto llena el cuadro, casi nulo cuando se ve entera.
        const fill = frame.dataset.fit === "fill";
        const zoom = fill ? 1.16 - 0.14 * k : 1.05 - 0.05 * k;
        const pan = fill ? (i % 2 ? -1 : 1) * (1.2 - 2.4 * k) : 0;
        frame.style.transform = `scale(${zoom}) translate3d(${pan}%, 0, 0)`;
      }
    });

    // Destello de corte
    if (flashRef.current) {
      const edge = Math.min(t, 1 - t);
      flashRef.current.style.opacity = String(body > 0 && body < 1 && scene > 0 ? Math.max(0, 0.22 - edge * 2.2) : 0);
    }

    // Subtítulo que se escribe
    const text = SCENES[scene].text;
    const chars = Math.round(clamp((t - 0.06) / 0.5) * text.length);
    if (scene !== last.current.scene) {
      last.current.scene = scene;
      if (camRef.current) camRef.current.textContent = SCENES[scene].cam;
      if (sceneRef.current) sceneRef.current.textContent = `Escena ${scene + 1} / ${n}`;
    }
    if (chars !== last.current.chars || scene !== last.current.scene) {
      last.current.chars = chars;
      if (captionRef.current) captionRef.current.textContent = text.slice(0, chars);
    }
  });

  if (reduce) {
    return (
      <section className="bg-noche" aria-labelledby="un-dia">
        <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
          <h2 id="un-dia" className="display text-[clamp(2.8rem,6vw,5.5rem)]">
            Un día cualquiera en el studio
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SCENES.map((scene) => (
              <figure key={scene.photo.src}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={scene.photo.src} alt={scene.photo.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="display mt-3 text-2xl italic">{scene.text}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-noche" style={{ height: `calc(100svh + ${SCENES.length * 80}svh)` }} aria-labelledby="un-dia" data-hide-cta>
      <h2 id="un-dia" className="sr-only">
        Un día cualquiera en el studio
      </h2>
      <ol className="sr-only">
        {SCENES.map((scene) => (
          <li key={scene.text}>{scene.text}</li>
        ))}
      </ol>

      <div className="sticky top-0 h-[100svh] overflow-hidden" aria-hidden="true">
        {SCENES.map((scene, i) => {
          const fill = fills(scene.photo);
          return (
            <div
              key={scene.photo.src}
              ref={(el) => {
                framesRef.current[i] = el;
              }}
              data-fit={fill ? "fill" : "whole"}
              className="absolute inset-0 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {!fill && <Image src={blurOf(scene.photo)} alt="" fill sizes="50vw" className="scale-110 object-cover brightness-[0.55] grayscale" />}
              <Image
                src={scene.photo.src}
                alt=""
                fill
                sizes="100vw"
                className={fill ? "object-cover brightness-[0.85] grayscale" : "object-contain brightness-[0.9] grayscale drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"}
                style={{ objectPosition: fill ? scene.focus : "50% 50%" }}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]" />
        <div className="film-grain" />
        <div ref={flashRef} className="absolute inset-0 bg-[#fff6e6] opacity-0" />

        {/* Rótulo inicial */}
        <div ref={titleRef} className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 px-6 text-center">
          <p className="hand text-2xl text-tutu sm:text-3xl">¡puntas, barra y acción!</p>
          <p className="display mt-4 text-[clamp(3rem,9vw,8rem)] leading-[0.95]">
            Un día cualquiera
            <br />
            <span className="italic">en el studio</span>
          </p>
        </div>

        {/* Bandas de cine */}
        <div ref={(el) => { barsRef.current[0] = el; }} className="absolute inset-x-0 top-0 h-[9svh] origin-top bg-black lg:h-[11svh]" style={{ transform: "scaleY(0)" }} />
        <div ref={(el) => { barsRef.current[1] = el; }} className="absolute inset-x-0 bottom-0 h-[9svh] origin-bottom bg-black lg:h-[11svh]" style={{ transform: "scaleY(0)" }} />

        {/* Visor y HUD */}
        <div ref={hudRef} className="absolute inset-x-4 inset-y-[10svh] opacity-0 sm:inset-x-8 lg:inset-y-[12svh]">
          <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-white/60" />
          <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-white/60" />
          <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-white/60" />
          <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-white/60" />

          <p className="absolute left-4 top-4 flex items-center gap-2 text-[11px] font-semibold text-white/85 sm:left-6 sm:top-5 sm:text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d4d]" />
            REC
          </p>
          <p className="absolute right-4 top-4 text-[11px] text-white/75 sm:right-6 sm:top-5 sm:text-xs">
            <span ref={camRef}>{SCENES[0].cam}</span>
          </p>
          <p className="absolute bottom-4 left-4 font-mono text-[11px] tabular-nums text-white/75 sm:bottom-5 sm:left-6 sm:text-xs">
            <span ref={tcRef}>17:00:00:00</span>
          </p>
          <p className="absolute bottom-4 right-4 text-[11px] text-white/75 sm:bottom-5 sm:right-6 sm:text-xs">
            <span ref={sceneRef}>Escena 1 / {SCENES.length}</span>
          </p>

          {/* Subtítulo */}
          <p className="absolute inset-x-4 bottom-14 text-center sm:inset-x-16 sm:bottom-16">
            <span className="display inline bg-black/45 px-2 text-[clamp(1.7rem,4.2vw,3.6rem)] italic leading-[1.25] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
              <span ref={captionRef} />
              <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] animate-pulse bg-tutu" />
            </span>
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
          <span ref={progressRef} className="absolute inset-0 origin-left bg-tutu" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
