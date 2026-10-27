"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { jumpTo } from "@/components/smooth-scroll";
import { CURTAIN_OPEN_EVENT } from "@/lib/intro";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  "/": "Inicio",
  "/clases": "Clases",
  "/escuela": "La escuela",
  "/contacto": "Contacto",
};

const CLOSE_MS = 700;
const HOLD_MS = 260;
const OPEN_MS = 1100;

type Phase = "idle" | "closing" | "opening";

/**
 * Cambio de escena: al pulsar un enlace interno el telón se cierra con el nombre de la página,
 * se navega por detrás y vuelve a abrirse. Con movimiento reducido, navegación normal.
 */
export function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const phaseRef = useRef<Phase>("idle");
  const target = useRef<string | null>(null);
  const lastPath = useRef(pathname);

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (phaseRef.current !== "idle" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      target.current = url.pathname + url.search + url.hash;
      setLabel(LABELS[url.pathname] ?? "");
      document.documentElement.classList.add("curtain");
      phaseRef.current = "closing";
      setPhase("closing");
      setTimeout(() => router.push(target.current ?? "/", { scroll: false }), CLOSE_MS);
      // Seguridad: si la navegación no llega, se abre igualmente.
      setTimeout(() => {
        if (phaseRef.current !== "closing") return;
        document.documentElement.classList.remove("curtain");
        go("opening");
        setTimeout(() => go("idle"), OPEN_MS);
      }, 5000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (phaseRef.current !== "closing") return;

    const hash = target.current?.split("#")[1];
    const timers = [
      setTimeout(() => {
        jumpTo(hash ? `#${hash}` : 0);
        document.documentElement.classList.remove("curtain");
        window.dispatchEvent(new Event(CURTAIN_OPEN_EVENT));
        go("opening");
      }, HOLD_MS),
      setTimeout(() => go("idle"), HOLD_MS + OPEN_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  const closed = phase === "closing";
  const panel = "velvet absolute inset-y-0 w-[50.5%] transition-transform will-change-transform";
  const timing = { transitionDuration: `${closed ? CLOSE_MS : OPEN_MS}ms`, transitionTimingFunction: "var(--ease-curtain)" };

  return (
    <div className={cn("fixed inset-0 z-[150]", phase === "idle" ? "pointer-events-none" : "pointer-events-auto")} aria-hidden="true">
      <div className={cn(panel, "left-0 origin-left shadow-[inset_-30px_0_40px_-20px_rgba(0,0,0,0.9)]")} style={{ ...timing, transform: `scaleX(${closed ? 1 : 0})` }} />
      <div className={cn(panel, "right-0 origin-right shadow-[inset_30px_0_40px_-20px_rgba(0,0,0,0.9)]")} style={{ ...timing, transform: `scaleX(${closed ? 1 : 0})` }} />

      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-[opacity,transform,translate,scale,rotate] duration-500",
          closed ? "translate-y-0 opacity-100 delay-300" : "-translate-y-3 opacity-0 delay-0",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/logo-coppelia-white.svg" alt="" className="h-16 w-auto opacity-90" />
        <p className="display mt-5 text-[clamp(2.6rem,8vw,5rem)] italic">{label}</p>
      </div>

      <p className={cn("absolute left-5 top-5 flex items-center gap-2.5 text-xs text-white/55 transition-opacity duration-300 sm:left-8 sm:top-7", closed ? "opacity-100 delay-300" : "opacity-0")}>
        <span className="h-2 w-2 rounded-full bg-tutu shadow-[0_0_12px_2px_rgba(191,225,248,0.7)]" />
        <span className="font-semibold text-white/85">Q</span>
        Cambio de escena
      </p>
    </div>
  );
}
