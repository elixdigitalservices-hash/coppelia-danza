"use client";

import { useEffect, useRef } from "react";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { INTRO_REVEAL_EVENT } from "@/lib/intro";
import { LOGO_D, LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo-paths";

const WORD = "Coppelia";

// Línea de tiempo en ms: sala a negro → cañón → el logo se dibuja → nombre → telón.
const T = {
  beamOn: 300,
  drawStart: 650,
  drawEnd: 3050,
  strokeMs: 760,
  fillIn: 2700,
  fillFull: 3300,
  studioIn: 2950,
  wordIn: 3100,
  handIn: 3800,
  handFull: 4350,
  exit: 4750,
  curtainStart: 4900,
  end: 6200,
};

const CUES = [
  { at: 0, n: "Q1", text: "Sala a negro" },
  { at: T.beamOn, n: "Q2", text: "Cañón 1 · va" },
  { at: T.exit - 200, n: "Q3", text: "Telón · va" },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const range = (t: number, from: number, to: number) => clamp((t - from) / (to - from));
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutExpo = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
const easeInOutQuart = (x: number) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2);

// Encendido de un cañón de arco: un par de parpadeos antes de quedarse fijo.
function strike(t: number) {
  const s = t - T.beamOn;
  if (s < 0) return 0;
  if (s < 70) return 0.55;
  if (s < 120) return 0.08;
  if (s < 190) return 0.8;
  if (s < 240) return 0.3;
  return 0.6 + 0.4 * easeOutExpo(range(s, 240, 900));
}

export function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<SVGGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const studioRef = useRef<HTMLParagraphElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLParagraphElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const cueNRef = useRef<HTMLSpanElement>(null);
  const cueTextRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const light = lightRef.current;
    const stage = stageRef.current;
    const strokes = strokesRef.current;
    const fill = fillRef.current;
    const studio = studioRef.current;
    const word = wordRef.current;
    const hand = handRef.current;
    const hud = hudRef.current;
    const skip = skipRef.current;
    if (!root.classList.contains("intro") || !overlay || !left || !right || !light || !stage || !strokes || !fill || !studio || !word || !hand || !hud || !skip) return;

    clearTimeout(window.__cpIntroT);
    const paths = Array.from(strokes.querySelectorAll("path"));
    const drawn = paths.map(() => -1);
    const letters = Array.from(word.querySelectorAll<HTMLElement>("[data-letter]"));
    const stagger = (T.drawEnd - T.drawStart - T.strokeMs) / Math.max(paths.length - 1, 1);
    let start = performance.now();
    let cue = -1;
    let revealed = false;
    let raf = 0;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      window.dispatchEvent(new Event(INTRO_REVEAL_EVENT));
    };

    const finish = () => {
      cancelAnimationFrame(raf);
      reveal();
      root.classList.remove("intro");
    };

    const skipIntro = () => {
      const now = performance.now();
      if (now - start < T.exit) start = now - T.exit;
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") skipIntro();
    };

    const frame = (now: number) => {
      const t = now - start;
      const out = easeInOutCubic(range(t, T.exit, T.exit + 420));

      // Cue del regidor
      const current = CUES.reduce((found, item, index) => (t >= item.at ? index : found), 0);
      if (current !== cue && cueNRef.current && cueTextRef.current) {
        cue = current;
        cueNRef.current.textContent = CUES[current].n;
        cueTextRef.current.textContent = CUES[current].text;
      }
      hud.style.opacity = String(range(t, 0, 300) * (1 - range(t, T.curtainStart, T.curtainStart + 300)));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${range(t, 0, T.end)})`;

      light.style.opacity = String(strike(t) * (1 - out));

      // El logo se dibuja trazo a trazo: primero él, luego ella.
      for (let i = 0; i < paths.length; i += 1) {
        const from = T.drawStart + i * stagger;
        const p = Math.round(easeInOutCubic(range(t, from, from + T.strokeMs)) * 1000) / 1000;
        if (p !== drawn[i]) {
          drawn[i] = p;
          paths[i].style.strokeDashoffset = String(1 - p);
          paths[i].style.opacity = p > 0 ? "1" : "0";
        }
      }
      fill.style.opacity = String(easeOutExpo(range(t, T.fillIn, T.fillFull)));

      const studioIn = range(t, T.studioIn, T.studioIn + 900);
      studio.style.opacity = String(studioIn);
      studio.style.letterSpacing = `${0.62 - 0.3 * easeOutExpo(studioIn)}em`;

      letters.forEach((letter, index) => {
        const p = easeOutExpo(range(t, T.wordIn + index * 70, T.wordIn + index * 70 + 900));
        letter.style.transform = `translate3d(0, ${(1 - p) * 115}%, 0)`;
      });

      const handIn = easeInOutCubic(range(t, T.handIn, T.handFull));
      hand.style.clipPath = `inset(-20% ${(1 - handIn) * 100}% -20% 0)`;

      stage.style.opacity = String(1 - out);
      stage.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 - 0.04 * out})`;

      // Se abre el telón: cada mitad se recoge hacia su lado.
      if (t >= T.curtainStart) {
        reveal();
        const open = easeInOutQuart(range(t, T.curtainStart, T.end));
        left.style.transform = `scaleX(${1 - open})`;
        right.style.transform = `scaleX(${1 - open})`;
      }

      if (t >= T.end) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("keydown", onKey);
    skip.addEventListener("click", skipIntro);
    start = performance.now();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      skip.removeEventListener("click", skipIntro);
    };
  }, []);

  return (
    <div ref={overlayRef} className="intro-ov" role="presentation">
      <div ref={leftRef} className="velvet absolute inset-y-0 left-0 w-[50.5%] origin-left shadow-[inset_-30px_0_40px_-20px_rgba(0,0,0,0.9)]" aria-hidden="true" />
      <div ref={rightRef} className="velvet absolute inset-y-0 right-0 w-[50.5%] origin-right shadow-[inset_30px_0_40px_-20px_rgba(0,0,0,0.9)]" aria-hidden="true" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10" aria-hidden="true">
        <div ref={stageRef} className="flex flex-col items-center will-change-transform">
          <div className="relative w-[min(52vw,17rem)]">
            {/* Cañón: haz desde el peine y círculo de luz en el suelo */}
            <div ref={lightRef} className="pointer-events-none absolute inset-0 opacity-0">
              <div
                className="absolute bottom-[4%] left-1/2 h-[100vh] w-[240%] -translate-x-1/2 blur-[6px]"
                style={{
                  clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
                  background: "linear-gradient(180deg, rgba(255,241,208,0.02), rgba(255,241,208,0.15))",
                }}
              />
              <div className="absolute bottom-[4%] left-1/2 h-[100vh] w-[240%] -translate-x-1/2" style={{ clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)" }}>
                <DustCanvas shape="beam" count={110} />
              </div>
              <div
                className="absolute -bottom-[10%] left-1/2 h-[30%] w-[200%] -translate-x-1/2"
                style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,241,208,0.4), rgba(255,241,208,0.08) 55%, rgba(255,241,208,0) 70%)" }}
              />
            </div>
            <svg viewBox={LOGO_VIEWBOX} className="relative block h-auto w-full overflow-visible">
              <g ref={strokesRef} fill="none" stroke="#fff" strokeWidth={5}strokeLinejoin="round" strokeLinecap="round">
                {LOGO_PATHS.map((d, index) => (
                  <path key={index} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} opacity={0} />
                ))}
              </g>
              <path ref={fillRef} d={LOGO_D} fill="#fff" fillRule="evenodd" opacity={0} />
            </svg>
          </div>

          <p ref={studioRef} className="mt-9 text-[11px] font-medium uppercase tracking-[0.62em] text-white/75 opacity-0 sm:text-xs">
            Studio de Danza
          </p>
          <div ref={wordRef} className="mt-1 flex overflow-hidden px-[0.1em] pb-[0.12em]">
            {WORD.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                data-letter
                className="display inline-block text-[clamp(3.6rem,15vw,8.75rem)] italic will-change-transform"
                style={{ transform: "translate3d(0,115%,0)" }}
              >
                {char}
              </span>
            ))}
          </div>
          <p ref={handRef} className="hand mt-1 flex items-center gap-2 text-2xl text-tutu sm:text-3xl" style={{ clipPath: "inset(-20% 100% -20% 0)" }}>
            desde 1986
            <svg viewBox="0 0 24 22" className="h-5 w-5" aria-hidden="true">
              <path d="M12 20.5S2 14.3 2 7.6C2 4.5 4.4 2 7.3 2c2 0 3.7 1.1 4.7 2.8C13 3.1 14.7 2 16.7 2 19.6 2 22 4.5 22 7.6c0 6.7-10 12.9-10 12.9Z" fill="currentColor" />
            </svg>
          </p>
        </div>
      </div>

      <div ref={hudRef} className="pointer-events-none absolute inset-0 opacity-0">
        <div className="absolute inset-x-5 top-5 flex items-start justify-between text-xs text-white/55 sm:inset-x-8 sm:top-7" aria-hidden="true">
          <p className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-tutu shadow-[0_0_12px_2px_rgba(191,225,248,0.7)]" />
            <span ref={cueNRef} className="font-semibold text-white/85">Q1</span>
            <span ref={cueTextRef}>Sala a negro</span>
          </p>
          <p className="hidden sm:block">Studio de Danza Coppelia · 1986–2026</p>
        </div>

        <div className="absolute inset-x-5 bottom-6 flex items-center gap-5 sm:inset-x-8 sm:bottom-8">
          <span className="relative h-px flex-1 bg-white/15" aria-hidden="true">
            <span ref={progressRef} className="absolute inset-0 origin-left bg-white/70" style={{ transform: "scaleX(0)" }} />
          </span>
          <button
            ref={skipRef}
            type="button"
            className="pointer-events-auto rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/70 hover:text-white"
          >
            Saltar intro
          </button>
        </div>
      </div>
    </div>
  );
}
