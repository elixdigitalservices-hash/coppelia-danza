"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/button-link";
import { whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

/** En móvil, el botón de clase de prueba queda a mano en cuanto se deja atrás el hero. */
export function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 900;
      // Se aparta durante las escenas de cine para no tapar su rótulo.
      const inScene = Array.from(document.querySelectorAll("[data-hide-cta]")).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
      });
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearEnd && !inScene);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-40 transition-[opacity,transform,translate,scale,rotate] duration-500 ease-[var(--ease-out-expo)] md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        className="flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-tutu px-6 font-semibold text-noche shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      >
        <WhatsAppIcon />
        Clase de prueba gratis
      </a>
    </div>
  );
}
