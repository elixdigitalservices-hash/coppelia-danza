"use client";

import { useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Progreso de scroll de un elemento (0–1) calculado en JS.
 * La aceleración nativa de Framer para opacidades dejaba de aplicarse fuera de su rango
 * y el valor volvía al estilo inicial (el velo de la palabra reaparecía al final).
 */
export function useSectionProgress(target: RefObject<HTMLElement | null>, offset: Offset) {
  const { scrollYProgress } = useScroll({ target, offset });
  return useTransform(() => scrollYProgress.get());
}
