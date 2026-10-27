"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/button-link";
import { whatsappLink } from "@/data/site";
import { useStageReady } from "@/lib/intro";
import { cn } from "@/lib/utils";

/**
 * Botón de WhatsApp fijo abajo a la derecha, con pulso de luz. Con ratón se despliega con el texto;
 * en móvil saca un bocadillo una vez. Se aparta en las escenas de cine y con el menú abierto.
 */
export function WhatsAppFab() {
  const ready = useStageReady();
  const [hidden, setHidden] = useState(false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    let shown = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      const inScene = Array.from(document.querySelectorAll("[data-hide-cta]")).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < mid && rect.bottom > mid;
      });
      setHidden(inScene || document.documentElement.classList.contains("menu-open"));
      if (!shown && window.scrollY > window.innerHeight * 0.6) {
        shown = true;
        setBubble(true);
        timer = setTimeout(() => setBubble(false), 5000);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new MutationObserver(onScroll);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const visible = ready && !hidden;

  return (
    <div
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 transition-[opacity,transform,translate,scale] duration-500 ease-[var(--ease-out-expo)] sm:bottom-6 sm:right-6",
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-75 opacity-0",
      )}
    >
      <span
        className={cn(
          "hand absolute bottom-full right-1 mb-3 whitespace-nowrap rounded-2xl rounded-br-sm bg-white px-4 py-2 text-xl text-noche shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-[opacity,transform,translate] duration-500 sm:hidden",
          bubble && visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
        aria-hidden="true"
      >
        ¿Hablamos? Primera clase gratis
      </span>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        aria-label="Escríbenos por WhatsApp: primera clase gratis"
        className="group relative flex h-16 items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-8px_rgba(37,211,102,0.7)] transition-[background-color] hover:bg-[#1fbe5b]"
      >
        <span className="absolute inset-0 animate-[wa-pulse_2.6s_ease-out_infinite] rounded-full bg-[#25D366]" aria-hidden="true" />
        <span className="relative grid h-16 w-16 place-items-center">
          <WhatsAppIcon className="h-8 w-8" />
        </span>
        {/* Con ratón, el botón se despliega con el texto */}
        <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap pr-0 font-semibold transition-[max-width,padding] duration-500 ease-[var(--ease-out-expo)] group-hover:max-w-[16rem] group-hover:pr-6 sm:block">
          Clase de prueba gratis
        </span>
      </a>
    </div>
  );
}
