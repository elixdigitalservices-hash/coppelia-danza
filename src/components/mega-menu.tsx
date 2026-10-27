"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { WhatsAppIcon } from "@/components/button-link";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { disciplines, photos, studio, whatsappLink, type Photo } from "@/data/site";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Inicio", note: "donde empieza la función", photo: photos.salto },
  { href: "/clases", label: "Clases", note: "cuatro formas de moverse", photo: photos.barraEspejo },
  { href: "/escuela", label: "La escuela", note: "40 años, el mismo dibujo", photo: photos.dosBailarinas },
  { href: "/contacto", label: "Contacto", note: "ven a probar", photo: photos.aulaGrande },
];

const ALL_PHOTOS = [...ITEMS.map((item) => item.photo), ...disciplines.map((item) => item.photo)];

/**
 * Menú a pantalla completa que se abre como un telón. Enlaces gigantes que suben uno a uno,
 * las cuatro disciplinas a mano y, en escritorio, una foto que cambia según el enlace bajo el cursor.
 */
export function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const pagePhoto = (ITEMS.find((item) => item.href === pathname) ?? ITEMS[0]).photo;
  const [photo, setPhoto] = useState<Photo>(pagePhoto);
  // Las fotos del panel solo se cargan la primera vez que se abre el menú.
  const [mounted, setMounted] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setMounted(true);
      setPhoto(pagePhoto);
    }
  }

  useEffect(() => {
    if (!open) return;
    const focus = setTimeout(() => closeRef.current?.focus(), 350);
    return () => clearTimeout(focus);
  }, [open]);

  const panel = "velvet absolute inset-y-0 w-[50.5%] transition-transform duration-700 ease-[var(--ease-curtain)]";
  const curtainDelay = { transitionDelay: open ? "0ms" : "280ms" };
  const line = (index: number): CSSProperties => ({ transitionDelay: open ? `${320 + index * 80}ms` : "0ms" });

  return (
    <div id="mega-menu" role="dialog" aria-modal="true" aria-label="Menú" inert={!open} className={cn("fixed inset-0 z-[60]", !open && "pointer-events-none")}>
      <div className={cn(panel, "left-0 origin-left")} style={{ ...curtainDelay, transform: `scaleX(${open ? 1 : 0})` }} />
      <div className={cn(panel, "right-0 origin-right")} style={{ ...curtainDelay, transform: `scaleX(${open ? 1 : 0})` }} />

      <div
        className={cn("absolute inset-0 overflow-y-auto transition-opacity duration-500", open ? "opacity-100 delay-300" : "opacity-0 delay-0")}
        data-lenis-prevent
      >
        <div className="mx-auto flex min-h-full max-w-[90rem] flex-col px-5 pb-8 sm:px-8">
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between">
            <Link href="/" onClick={onClose} className="flex items-center gap-3" aria-label={`${studio.name}, inicio`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/logo-coppelia-white.svg" alt="" width={42} height={40} className="h-10 w-auto" />
              <span className="display text-[1.6rem] italic leading-none">Coppelia</span>
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-full border border-white/25 py-2 pl-4 pr-2 text-sm transition-colors hover:border-white"
            >
              Cerrar
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white text-noche transition-transform duration-500 group-hover:rotate-90" aria-hidden="true">
                <span className="absolute h-px w-3.5 rotate-45 bg-noche" />
                <span className="absolute h-px w-3.5 -rotate-45 bg-noche" />
              </span>
            </button>
          </div>

          <div className="grid flex-1 gap-10 py-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-6">
            <nav aria-label="Menú principal" className="lg:col-span-7">
              <ul className="grid gap-1 sm:gap-2">
                {ITEMS.map((item, index) => {
                  const current = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        onPointerEnter={() => setPhoto(item.photo)}
                        onFocus={() => setPhoto(item.photo)}
                        aria-current={current ? "page" : undefined}
                        className="group flex flex-wrap items-baseline gap-x-5"
                      >
                        <span className="block overflow-hidden pb-[0.08em]">
                          <span
                            className={cn(
                              "display block text-[clamp(3.2rem,8.4vw,7.6rem)] transition-[transform,translate,color] duration-[900ms] ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-tutu",
                              open ? "translate-y-0" : "translate-y-[110%]",
                              current && "italic text-tutu",
                            )}
                            style={line(index)}
                          >
                            {item.label}
                          </span>
                        </span>
                        <span
                          className={cn("hand text-xl text-white/45 transition-opacity duration-700 group-hover:text-tutu sm:text-2xl", open ? "opacity-100" : "opacity-0")}
                          style={line(index + 2)}
                        >
                          {item.note}
                        </span>
                      </Link>

                      {item.href === "/clases" && (
                        <ul className={cn("mb-3 mt-2 flex flex-wrap gap-2 transition-[opacity,transform,translate] duration-700", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")} style={line(index + 3)}>
                          {disciplines.map((discipline) => (
                            <li key={discipline.slug}>
                              <Link
                                href={`/clases#${discipline.slug}`}
                                onClick={onClose}
                                onPointerEnter={() => setPhoto(discipline.photo)}
                                onFocus={() => setPhoto(discipline.photo)}
                                className="inline-block rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-tutu hover:bg-tutu hover:text-noche"
                              >
                                {discipline.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <aside className="grid gap-5 lg:col-span-5" aria-label="Clase de prueba y contacto">
              {/* Foto que cambia con una cortinilla según el enlace bajo el cursor */}
              <div
                className={cn(
                  "relative hidden aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-white/5 transition-[opacity,transform,translate,scale] duration-[900ms] ease-[var(--ease-out-expo)] lg:block",
                  open ? "scale-100 opacity-100 delay-500" : "scale-95 opacity-0",
                )}
                style={{ "--sx": "50%", "--sy": "45%", "--sr": 1.4 } as CSSProperties}
              >
                {mounted &&
                  ALL_PHOTOS.map((item) => (
                    <div
                      key={item.src}
                      className="absolute inset-0 transition-[clip-path] duration-[800ms] ease-[var(--ease-curtain)]"
                      style={{ clipPath: item.src === photo.src ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", zIndex: item.src === photo.src ? 2 : 1 }}
                    >
                      <Image src={item.src} alt="" fill sizes="36vw" className="object-cover" style={{ objectPosition: item.focus }} />
                    </div>
                  ))}
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_50%_40%,transparent_40%,rgba(0,0,0,0.55))]" />
                {open && <DustCanvas count={40} className="z-10" />}
              </div>

              <div
                className={cn(
                  "rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-5 backdrop-blur-sm transition-[opacity,transform,translate] duration-700 sm:p-6",
                  open ? "translate-y-0 opacity-100 delay-500" : "translate-y-4 opacity-0",
                )}
              >
                <p className="display text-3xl italic">Tu primera clase es gratis.</p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-tutu px-6 font-semibold text-noche transition-colors hover:bg-white"
                >
                  <WhatsAppIcon />
                  Reservar por WhatsApp
                </a>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-white/45">Llámanos</dt>
                    <dd className="mt-1">
                      <a href={studio.phoneHref} className="hover:text-tutu">
                        {studio.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Síguenos</dt>
                    <dd className="mt-1">
                      <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-tutu">
                        Instagram
                      </a>
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-white/45">Visítanos</dt>
                    <dd className="mt-1">
                      <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-tutu">
                        C/ Navarro Caro, 81 · Tomares, Sevilla
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          <p className={cn("hand shrink-0 text-lg text-white/40 transition-opacity duration-700", open ? "opacity-100 delay-700" : "opacity-0")}>
            Studio de Danza Coppelia · Tomares · desde 1986
          </p>
        </div>
      </div>
    </div>
  );
}
