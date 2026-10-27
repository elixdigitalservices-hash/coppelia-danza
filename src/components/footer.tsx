import Link from "next/link";
import { disciplines, nav, studio } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-noche">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo-coppelia-white.svg" alt="" width={84} height={80} className="h-20 w-auto" />
            <span className="leading-none">
              <span className="block text-[10px] font-medium uppercase tracking-[0.34em] text-white/60">Studio de Danza</span>
              <span className="display mt-1 block text-[2.4rem] italic">Coppelia</span>
            </span>
          </Link>
          <p className="mt-6 max-w-xs leading-relaxed text-white/55">Ballet clásico, danza contemporánea, Ballet Fitness y Pilates en Tomares desde 1986.</p>
        </div>

        <nav className="md:col-span-2" aria-label="Pie de página">
          <p className="text-sm text-white/45">Navega</p>
          <ul className="mt-4 grid gap-2.5">
            {[{ href: "/", label: "Inicio" }, ...nav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="text-sm text-white/45">Clases</p>
          <ul className="mt-4 grid gap-2.5">
            {disciplines.map((item) => (
              <li key={item.slug}>
                <Link href={`/clases#${item.slug}`} className="text-white/80 hover:text-white">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <address className="not-italic md:col-span-3">
          <p className="text-sm text-white/45">Visítanos</p>
          <p className="mt-4 leading-relaxed text-white/80">
            {studio.street}
            <br />
            {studio.postalCode} {studio.city}, {studio.region}
          </p>
          <p className="mt-4 grid gap-1.5">
            <a href={studio.phoneHref} className="text-white/80 hover:text-white">
              {studio.phone}
            </a>
            <a href={studio.landlineHref} className="text-white/80 hover:text-white">
              {studio.landline}
            </a>
            <a href={`mailto:${studio.email}`} className="text-white/80 hover:text-white">
              {studio.email}
            </a>
            <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
              Instagram
            </a>
          </p>
        </address>
      </div>
      <div className="mx-auto flex max-w-[90rem] flex-col gap-2 border-t border-white/10 px-5 py-6 text-sm text-white/40 sm:flex-row sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} {studio.name}</p>
        <p>Fotografías: archivo de la escuela, Blanca de la Cruz y Rafa Núñez Ollero.</p>
      </div>
    </footer>
  );
}
