"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { useStageInView } from "@/lib/intro";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  /** ms antes de la primera letra */
  delay?: number;
  /** ms entre letras */
  stagger?: number;
  /** Cada línea forzada se separa con "\n". */
  lines?: boolean;
};

/**
 * Titular que sube letra a letra desde una ranura, como el nombre de la intro.
 * El texto real queda para lectores de pantalla; las letras animadas son decorativas.
 */
export function RevealText({ text, className, delay = 0, stagger = 30, lines = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useStageInView(ref);
  let index = 0;

  const renderWords = (line: string) =>
    line.split(" ").map((word, w, all) => (
      <Fragment key={`${word}-${w}`}>
        <span className="reveal-word">
          {Array.from(word).map((char) => {
            const style = { transitionDelay: `${delay + index++ * stagger}ms` } as CSSProperties;
            return (
              <span key={index} className="reveal-char" style={style}>
                {char}
              </span>
            );
          })}
        </span>
        {/* El espacio va entre ranuras: dentro de un inline-block se perdería. */}
        {w < all.length - 1 && " "}
      </Fragment>
    ));

  return (
    <span ref={ref} className={cn("reveal-text", className)} data-shown={shown}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <span aria-hidden="true">
        {lines
          ? text.split("\n").map((line, l) => (
              <span key={l} className="block">
                {renderWords(line)}
              </span>
            ))
          : renderWords(text)}
      </span>
    </span>
  );
}
