import Link from "next/link";
import { nav, studio } from "@/data/site";

const link = "text-white/75 transition-colors hover:text-white";

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

      <div className="mx-auto flex max-w-[90rem] flex-col gap-1 border-t border-white/10 py-4 pl-5 pr-24 text-xs text-white/40 sm:flex-row sm:justify-between sm:pl-8 sm:pr-28">
        <p>
          © {new Date().getFullYear()} {studio.name} · desde 1986
        </p>
        <p>Fotos: archivo de la escuela, Blanca de la Cruz y Rafa Núñez Ollero</p>
      </div>
    </footer>
  );
}
