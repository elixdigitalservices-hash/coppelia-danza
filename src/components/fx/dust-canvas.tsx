"use client";

import { useEffect, useRef } from "react";
import { createDust, readVar, spotRadius, type LightFn } from "@/lib/dust";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** "spot": círculo del foco (lee --sx, --sy, --sr, --iris del contenedor). "beam": haz trapezoidal de arriba abajo. */
  shape?: "spot" | "beam";
  count?: number;
};

/** Motas de polvo que solo se ven dentro de la luz. Se pausa fuera de pantalla. */
export function DustCanvas({ className, shape = "spot", count = 80 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const draw = createDust(window.innerWidth < 768 ? Math.round(count * 0.55) : count);
    let width = 0;
    let height = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spotLight = (): LightFn => {
      const sx = (parseFloat(readVar(canvas, "--sx")) || 50) / 100;
      const sy = (parseFloat(readVar(canvas, "--sy")) || 50) / 100;
      const sr = parseFloat(readVar(canvas, "--sr") || "1");
      const iris = parseFloat(readVar(canvas, "--iris") || "1");
      const scale = parseFloat(readVar(canvas, "--spot") || "1");
      const cx = sx * width;
      const cy = sy * height;
      const r = Math.max(1, sr * iris * scale * spotRadius() * 0.85);
      return (x, y) => {
        const d = Math.hypot(x - cx, y - cy) / r;
        return d < 1 ? 1 - d * d : 0;
      };
    };

    const beamLight: LightFn = (x, y) => {
      const t = y / height;
      const half = width * (0.04 + 0.46 * t);
      const d = Math.abs(x - width / 2) / half;
      return d < 1 ? (1 - d) * (0.25 + 0.75 * t) : 0;
    };

    const tick = (now: number) => {
      draw(ctx, width, height, now, now - last, shape === "beam" ? beamLight : spotLight());
      last = now;
      if (visible) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(canvas);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [count, shape]);

  return <canvas ref={ref} className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true" />;
}
