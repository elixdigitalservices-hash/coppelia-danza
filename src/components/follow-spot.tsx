"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Fondo en penumbra y capa iluminada: ambos reciben las variables --sx, --sy y --sr. */
  children: ReactNode;
  /** Punto de reposo del cañón (0–1), normalmente donde está la bailarina. */
  home: { x: number; y: number };
  /** Punto de reposo a partir de 1024 px, si la foto se encuadra distinto. */
  homeWide?: { x: number; y: number };
  on: boolean;
  className?: string;
};

/**
 * Cañón de seguimiento: con ratón, la luz sigue al cursor; en móvil o sin interacción
 * respira despacio alrededor de la bailarina. Con movimiento reducido se queda quieta.
 */
export function FollowSpot({ children, home, homeWide = home, on, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const onRef = useRef(on);

  useEffect(() => {
    onRef.current = on;
  }, [on]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia("(min-width: 1024px)");
    const rest = () => (wide.matches ? homeWide : home);
    let x = rest().x;
    let y = rest().y;
    let tx = x;
    let ty = y;
    let r = 0;
    let following = false;
    let visible = true;
    let raf = 0;
    const t0 = performance.now();

    const apply = () => {
      el.style.setProperty("--sx", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--sy", `${(y * 100).toFixed(2)}%`);
      el.style.setProperty("--sr", r.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      tx = Math.min(1.1, (event.clientX - rect.left) / rect.width);
      ty = (event.clientY - rect.top) / rect.height;
      following = true;
    };
    const onLeave = () => {
      following = false;
    };

    const tick = (now: number) => {
      if (!following) {
        const s = (now - t0) / 1000;
        tx = rest().x + (reduce ? 0 : Math.sin(s * 0.45) * 0.05);
        ty = rest().y + (reduce ? 0 : Math.sin(s * 0.7) * 0.035);
      }
      const ease = reduce ? 1 : 0.075;
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      r += ((onRef.current ? 1 : 0) - r) * (reduce ? 1 : 0.045);
      apply();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    observer.observe(el);
    const section = el.parentElement ?? el;
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    apply();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [home, homeWide]);

  return (
    <div ref={ref} className={cn("absolute inset-0", className)} style={{ "--sx": `${home.x * 100}%`, "--sy": `${home.y * 100}%`, "--sr": 0 } as CSSProperties}>
      {children}
    </div>
  );
}

export const spotMask = "radial-gradient(circle calc(var(--sr) * var(--iris, 1) * var(--spot, 1) * min(max(36vw, 12rem), 25rem) + 1px) at var(--sx) var(--sy), #000 50%, rgba(0,0,0,0.4) 76%, transparent 100%)";
