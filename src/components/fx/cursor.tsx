"use client";

import { useEffect, useRef } from "react";

/**
 * Con ratón: un punto y un aro que siguen al cursor (en modo diferencia, se ven sobre negro y sobre blanco)
 * y un halo cálido muy suave que ilumina las secciones oscuras, como un cañón que te acompaña por la web.
 * Sobre enlaces el aro crece; sobre [data-cursor] muestra su texto.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !label || !glow) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const glowPos = { x: -100, y: -100 };
    let scale = 1;
    let scaleTarget = 1;
    let visible = false;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = glowPos.x = target.x;
        ringPos.y = glowPos.y = target.y;
        document.documentElement.classList.add("has-cursor");
      }
    };

    const onOver = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button, summary, label, input, textarea");
      const text = el?.dataset.cursor ?? "";
      label.textContent = text;
      ring.dataset.mode = text ? "label" : el ? "link" : "";
      scaleTarget = text ? 2.6 : el ? 1.7 : 1;
    };

    const onLeave = () => {
      visible = false;
      document.documentElement.classList.remove("has-cursor");
    };

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.2;
      ringPos.y += (target.y - ringPos.y) * 0.2;
      glowPos.x += (target.x - glowPos.x) * 0.08;
      glowPos.y += (target.y - glowPos.y) * 0.08;
      scale += (scaleTarget - scale) * 0.18;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${scale})`;
      label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      glow.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor-layer pointer-events-none fixed inset-0 z-[300] hidden" aria-hidden="true">
      <div ref={glowRef} className="cursor-glow absolute left-0 top-0" />
      <div ref={ringRef} className="cursor-ring absolute left-0 top-0" />
      <div ref={dotRef} className="cursor-dot absolute left-0 top-0" />
      <span ref={labelRef} className="cursor-label hand absolute left-0 top-0" />
    </div>
  );
}
