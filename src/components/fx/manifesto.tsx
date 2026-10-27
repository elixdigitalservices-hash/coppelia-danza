"use client";

import { useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useSectionProgress } from "@/lib/scroll";

// Filosofía de la escuela (web antigua, "Escuela de Danza Coppelia").
const TEXT =
  "Somos danza y creemos en ella como una forma natural de expresión y aprendizaje. Un encuentro con nuestro cuerpo, una búsqueda de la armonía y una forma saludable de canalizar la energía.";

/** Las palabras se encienden una a una con el scroll, como si un foco fuera leyendo el texto. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useSectionProgress(ref, ["start 0.82", "end 0.42"]);
  const words = TEXT.split(" ");

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const spans = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
    if (!spans) return;
    const lit = p * spans.length * 1.05;
    spans.forEach((span, i) => {
      const v = Math.min(1, Math.max(0, lit - i));
      span.style.opacity = String(0.13 + 0.87 * v);
      span.style.textShadow = v > 0 && v < 1 ? `0 0 ${18 * (1 - v)}px rgba(255,241,208,${0.9 * (1 - v)})` : "none";
    });
  });

  return (
    <section className="relative overflow-hidden bg-noche" aria-label="Nuestra filosofía">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[120vw] -translate-x-1/2 opacity-60"
        style={{ background: "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(255,241,208,0.07), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[90rem] px-5 py-28 sm:px-8 lg:py-44">
        <p ref={ref} className="display max-w-6xl text-[clamp(2.1rem,5vw,4.6rem)] leading-[1.08]">
          {words.map((word, i) => (
            <span key={i} data-word className="transition-[text-shadow] duration-300" style={{ opacity: reduce ? 1 : 0.13 }}>
              {word}{" "}
            </span>
          ))}
        </p>
        <p className="hand mt-10 text-2xl text-tutu sm:text-3xl">— Studio de Danza Coppelia, desde 1986</p>
      </div>
    </section>
  );
}
