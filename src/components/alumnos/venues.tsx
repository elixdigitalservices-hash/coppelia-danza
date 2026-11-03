"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { RevealText } from "@/components/fx/reveal-text";
import { StageSection } from "@/components/fx/stage-section";
import { festivalsAt, venues, type Venue } from "@/data/festivales";
import { useStageInView } from "@/lib/intro";
import { cn } from "@/lib/utils";

/** Muesca circular del troquel: un círculo del color del fondo que «muerde» la entrada. */
function Notch({ className }: { className: string }) {
  return <span className={cn("absolute h-7 w-7 rounded-full bg-sala", className)} aria-hidden="true" />;
}

function Ticket({ venue, index }: { venue: Venue; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const shown = useStageInView(ref, "0px 0px -12% 0px");
  const shows = festivalsAt(venue.slug);
  const years = shows.map((f) => f.year);
  const range = years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : String(years[0]);
  const tilt = index % 2 === 0 ? -5 : 4;

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      className="ticket group relative flex flex-col overflow-hidden rounded-[1.4rem] bg-noche text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:flex-row"
      style={
        {
          "--tilt": `${tilt}deg`,
          transitionDelay: `${(index % 2) * 140}ms`,
          opacity: shown ? 1 : 0,
          transform: shown ? undefined : `translateY(3.5rem) rotate(${tilt}deg)`,
        } as CSSProperties
      }
    >
      {/* Talón: la foto del patio de butacas o, si no la tenemos, los años en grande */}
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%]">
        {venue.photo ? (
          <>
            <Image
              src={venue.photo.src}
              alt={venue.photo.alt}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
              className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
              style={{ objectPosition: venue.photo.focus }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
            <p className="display absolute bottom-4 left-5 text-4xl italic text-white">{range}</p>
          </>
        ) : (
          <div className="velvet flex h-full min-h-40 flex-col justify-end p-5">
            <p className="display text-[clamp(3rem,5vw,4.4rem)] italic leading-none text-tutu">{range}</p>
          </div>
        )}
      </div>

      {/* Línea de troquel */}
      <div className="relative h-0 w-full border-t-2 border-dashed border-white/20 sm:h-auto sm:w-0 sm:border-l-2 sm:border-t-0" aria-hidden="true">
        <Notch className="-left-3.5 -top-3.5 sm:-left-3.5 sm:-top-3.5" />
        <Notch className="-right-3.5 -top-3.5 sm:-bottom-3.5 sm:-left-3.5 sm:right-auto sm:top-auto" />
      </div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <p className="flex items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
          <span>Entrada · Patio de butacas</span>
          <span className="tabular-nums">Nº {String(index + 1).padStart(3, "0")}</span>
        </p>
        <h3 className="display mt-4 text-[clamp(1.9rem,2.8vw,2.6rem)] leading-[0.95]">{venue.name}</h3>
        <p className="hand mt-2 text-xl text-tutu">{venue.place}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-white/65">{venue.body}</p>
        <div className="mt-auto pt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">{shows.length === 1 ? "Función" : "Funciones"}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {shows.map((f) => (
              <li key={f.id}>
                <a
                  href={`#f-${f.id}`}
                  className="inline-block rounded-full border border-white/25 px-3.5 py-1.5 text-sm tabular-nums transition-colors hover:border-tutu hover:bg-tutu hover:text-noche"
                >
                  {f.year}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Brillo de papel satinado que cruza la entrada al pasar el ratón */}
      <span className="ticket-shine pointer-events-none absolute inset-0" aria-hidden="true" />
    </article>
  );
}

export function Venues() {
  return (
    <StageSection className="bg-sala text-noche" labelledBy="escenarios-titulo">
      <div id="escenarios" className="mx-auto max-w-[90rem] scroll-mt-20 px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="escenarios-titulo" className="display text-[clamp(2.8rem,6.4vw,6rem)] lg:col-span-7">
            <RevealText text="Los teatros donde hemos bailado." />
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-linoleo lg:col-span-4 lg:col-start-9">
            Del salón de actos de un colegio en 1988 al Gran Teatro de Córdoba y el Teatro Central de Sevilla. Cada escenario guarda una parte de nuestra historia.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {venues.map((venue, index) => (
            <Ticket key={venue.slug} venue={venue} index={index} />
          ))}
        </div>
      </div>
    </StageSection>
  );
}
