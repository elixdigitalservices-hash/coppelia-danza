"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let lenis: Lenis | null = null;

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Salto instantáneo (tras un cambio de escena): a una posición o a un #ancla, dejando sitio a la cabecera. */
export function jumpTo(target: number | string) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  const top = el ? el.getBoundingClientRect().top + window.scrollY - 128 : typeof target === "number" ? target : 0;
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo(0, top);
}

export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ autoRaf: true, duration: 1.15, anchors: { offset: -128 } });
    lenis = instance;

    // Hold the page still while the intro overlay is up (also covers the inline script's failsafe timeout).
    const root = document.documentElement;
    let observer: MutationObserver | undefined;
    if (root.classList.contains("intro")) {
      instance.stop();
      observer = new MutationObserver(() => {
        if (root.classList.contains("intro")) return;
        instance.start();
        observer?.disconnect();
      });
      observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    }

    return () => {
      observer?.disconnect();
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
