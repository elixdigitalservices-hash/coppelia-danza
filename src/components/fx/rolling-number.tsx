"use client";

import { useRef } from "react";
import { useStageInView } from "@/lib/intro";
import { cn } from "@/lib/utils";

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);

/** Cifra que rueda como un marcador: cada dígito da una vuelta completa antes de pararse. */
export function RollingNumber({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useStageInView(ref);
  let digitIndex = 0;

  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {Array.from(value).map((char, i) => {
          if (!/\d/.test(char)) {
            return (
              <span key={i} className="inline-block">
                {char}
              </span>
            );
          }
          const order = digitIndex++;
          const target = 10 + Number(char);
          return (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none">
              <span className="invisible">{char}</span>
              <span
                className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1800ms] ease-[var(--ease-out-expo)]"
                style={{ transform: `translateY(${shown ? -target : 0}em)`, transitionDelay: `${delay + order * 120}ms` }}
              >
                {DIGITS.map((digit, d) => (
                  <span key={d} className="block h-[1em] text-center">
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
