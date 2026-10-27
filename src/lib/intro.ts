"use client";

import { useEffect, useState, type RefObject } from "react";

export const INTRO_REVEAL_EVENT = "coppelia:intro-reveal";
export const CURTAIN_OPEN_EVENT = "coppelia:curtain-open";

declare global {
  interface Window {
    __cpIntroT?: ReturnType<typeof setTimeout>;
  }
}

// html.intro: la obertura de la home. html.curtain: el telón de cambio de página.
const covered = (root: HTMLElement) => root.classList.contains("intro") || root.classList.contains("curtain");

/** True cuando el escenario está a la vista: sin intro ni telón delante (o empezando a abrirse). */
export function useStageReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reveal = () => setReady(true);

    if (!covered(root)) {
      const frame = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(frame);
    }

    // También se libera si se quita la clase sin evento (timeout de seguridad del script inline).
    const observer = new MutationObserver(() => {
      if (!covered(root)) reveal();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener(INTRO_REVEAL_EVENT, reveal);
    window.addEventListener(CURTAIN_OPEN_EVENT, reveal);

    return () => {
      observer.disconnect();
      window.removeEventListener(INTRO_REVEAL_EVENT, reveal);
      window.removeEventListener(CURTAIN_OPEN_EVENT, reveal);
    };
  }, []);

  return ready;
}

/** Escenario a la vista y el elemento dentro del viewport: dispara una sola vez. */
export function useStageInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px 0px -12% 0px") {
  const ready = useStageReady();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, seen]);

  return ready && seen;
}
