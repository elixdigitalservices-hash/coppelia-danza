import Link from "next/link";
import type { CSSProperties } from "react";
import { nav, studio } from "@/data/site";

const link = "text-white/75 transition-colors hover:text-white";

/** Firma de la agencia, igual que en el resto de webs de ELIX (estilos .firma-elix en globals.css). */
function FirmaElix() {
  return (
    <a
      href="https://elixdigitalservices.com"
      target="_blank"
      rel="noopener"
      className="firma-elix self-start text-white/80 sm:self-auto"
      style={{ "--fe-acento": "var(--color-tutu)" } as CSSProperties}
      aria-label="Diseño y desarrollo: ELIX Digital Services (abre su web en otra pestaña)"
    >
      <span className="fe-texto" aria-hidden="true">
        Diseño y desarrollo
      </span>
      <span className="fe-marca" aria-hidden="true">
        <span className="fe-logo" />
        <svg className="fe-infinito" viewBox="15 20 170 60" preserveAspectRatio="none">
          <path d="M100 50C125 10 185 10 185 50C185 90 125 90 100 50C75 10 15 10 15 50C15 90 75 90 100 50Z" pathLength={1} vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
      <span className="fe-cta" aria-hidden="true">
        <span className="fe-cta-txt">¿Hablamos?</span> <i>↗</i>
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-noche text-sm">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-7 px-5 py-9 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <Link href="/" className="flex items-center gap-3" aria-label={`${studio.name}, inicio`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo-coppelia-white.svg" alt="" width={46} height={44} className="h-11 w-auto" />
          <span className="leading-none">
            <span className="block text-[9px] font-medium uppercase tracking-[0.34em] text-white/55">Studio de Danza</span>
            <span className="display mt-0.5 block text-[1.7rem] italic">Coppelia</span>
          </span>
        </Link>

        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2">
          {[{ href: "/", label: "Inicio" }, ...nav].map((item) => (
            <Link key={item.href} href={item.href} className={link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <address className="flex flex-col gap-1.5 not-italic text-white/60 sm:flex-row sm:flex-wrap sm:gap-x-5">
          <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
            C/ Navarro Caro, 81 · Tomares
          </a>
          <a href={studio.phoneHref} className={link}>
            {studio.phone}
          </a>
          <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className={link}>
            Instagram
          </a>
        </address>
      </div>

      <div className="mx-auto flex max-w-[90rem] flex-col gap-4 border-t border-white/10 px-5 pb-28 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:pb-5 sm:pl-8 sm:pr-28">
        <div className="grid gap-1">
          <p>
            © {new Date().getFullYear()} {studio.name} · desde 1986
          </p>
          <p>Fotos: archivo de la escuela, Blanca de la Cruz y Rafa Núñez Ollero</p>
        </div>
        <FirmaElix />
      </div>
    </footer>
  );
}
