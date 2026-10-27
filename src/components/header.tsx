"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MegaMenu } from "@/components/mega-menu";
import { lockScroll } from "@/components/smooth-scroll";
import { nav, studio, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,transform,translate,scale,rotate] duration-500 ease-[var(--ease-out-expo)]",
          scrolled ? "border-b border-white/10 bg-black/80 backdrop-blur-md" : "border-b border-transparent",
          hidden && "-translate-y-full",
        )}
      >
        <span ref={progressRef} className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-tutu" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
        <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label={`${studio.name}, inicio`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo-coppelia-white.svg" alt="" width={42} height={40} className="h-10 w-auto" />
            <span className="leading-none">
              <span className="block text-[9px] font-medium uppercase tracking-[0.34em] text-white/60">Studio de Danza</span>
              <span className="display block text-[1.6rem] italic">Coppelia</span>
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
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
            </nav>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-tutu px-5 py-2.5 text-sm font-semibold text-noche transition-colors hover:bg-white md:inline-block"
            >
              Clase de prueba gratis
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="group -mr-2 flex h-11 items-center gap-3 rounded-full pl-3 pr-2 text-sm text-white/80 transition-colors hover:text-white"
              aria-expanded={open}
              aria-controls="mega-menu"
              onClick={() => setOpen(true)}
            >
              <span className="hidden sm:inline">Menú</span>
              <span className="relative grid h-9 w-9 place-items-center rounded-full border border-white/25 transition-colors group-hover:border-white" aria-hidden="true">
                <span className="absolute h-px w-4 -translate-y-[3px] bg-white transition-transform duration-300 group-hover:-translate-y-[4px]" />
                <span className="absolute h-px w-4 translate-y-[3px] bg-white transition-transform duration-300 group-hover:translate-y-[4px]" />
              </span>
              <span className="sr-only">Abrir menú</span>
            </button>
          </div>
        </div>
      </header>

      <MegaMenu open={open} onClose={close} />
    </>
  );
}
