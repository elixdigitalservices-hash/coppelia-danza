"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lockScroll } from "@/components/smooth-scroll";
import { nav, studio, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Se esconde al bajar y vuelve al subir; la línea azul marca cuánto queda de función.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.6);
        last = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,transform,translate,scale,rotate] duration-500 ease-[var(--ease-out-expo)]",
          scrolled || open ? "border-b border-white/10 bg-black/80 backdrop-blur-md" : "border-b border-transparent",
          hidden && !open && "-translate-y-full",
        )}
      >
        <span ref={progressRef} className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-tutu" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
        <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)} aria-label={`${studio.name}, inicio`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo-coppelia-white.svg" alt="" width={42} height={40} className="h-10 w-auto" />
            <span className="leading-none">
              <span className="block text-[9px] font-medium uppercase tracking-[0.34em] text-white/60">Studio de Danza</span>
              <span className="display block text-[1.6rem] italic">Coppelia</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Principal">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "relative text-[15px] transition-colors hover:text-white",
                  pathname === item.href ? "text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-tutu" : "text-white/70",
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-tutu px-5 py-2.5 text-sm font-semibold text-noche transition-colors hover:bg-white"
            >
              Clase de prueba gratis
            </a>
          </nav>

          <button
            type="button"
            className="relative -mr-2 grid h-11 w-11 place-items-center md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={cn("absolute h-px w-6 bg-white transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute h-px w-6 bg-white transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </header>

      <div
        id="menu-movil"
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-between bg-noche px-5 pb-10 pt-28 transition-[opacity,visibility] duration-500 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="grid gap-2" aria-label="Menú móvil">
          {[{ href: "/", label: "Inicio" }, ...nav].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "display text-[3.4rem] transition-[opacity,transform,translate,scale,rotate] duration-700 ease-[var(--ease-out-expo)]",
                pathname === item.href ? "italic text-tutu" : "text-white",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: open ? `${120 + index * 60}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="grid gap-3">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-tutu px-6 py-4 text-center font-semibold text-noche">
            Pide tu clase de prueba gratis
          </a>
          <a href={studio.phoneHref} className="rounded-full border border-white/30 px-6 py-4 text-center font-semibold">
            Llamar al {studio.phone}
          </a>
        </div>
      </div>
    </>
  );
}
