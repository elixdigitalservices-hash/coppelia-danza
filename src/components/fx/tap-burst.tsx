"use client";

import { useEffect } from "react";

/** Al tocar la pantalla (o hacer clic) se enciende un anillo de luz con destellos ✦, como los de su Instagram. */
export function TapBurst() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.createElement("div");
    layer.className = "tap-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const onDown = (event: PointerEvent) => {
      if (event.button > 0) return;
      const burst = document.createElement("span");
      burst.className = "tap-burst";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      const ring = document.createElement("span");
      ring.className = "tap-ring";
      burst.appendChild(ring);
      for (let i = 0; i < 6; i += 1) {
        const spark = document.createElement("span");
        spark.className = "tap-spark";
        spark.style.setProperty("--a", `${i * 60 + Math.random() * 24}deg`);
        spark.style.setProperty("--d", `${34 + Math.random() * 22}px`);
        burst.appendChild(spark);
      }
      layer.appendChild(burst);
      setTimeout(() => burst.remove(), 900);
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      layer.remove();
    };
  }, []);

  return null;
}
