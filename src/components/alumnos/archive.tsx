"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Viewer, type ViewerItem, type ViewerSet } from "@/components/alumnos/viewer";
import { RevealText } from "@/components/fx/reveal-text";
import { RollingNumber } from "@/components/fx/rolling-number";
import { festivals, venueOf, venues, type Festival } from "@/data/festivales";
import { useStageInView } from "@/lib/intro";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "Córdoba", label: "Córdoba" },
  { key: "Tomares", label: "Tomares y Sevilla" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/** Todo lo que se puede ver de un festival, en el orden del visor: fotos, vídeos y el programa o cartel. */
function itemsOf(festival: Festival): ViewerItem[] {
  return [
    ...festival.photos.map((photo) => ({ kind: "photo" as const, photo })),
    ...festival.videos.map((video) => ({ kind: "video" as const, video })),
    ...(festival.print ? [{ kind: "photo" as const, photo: festival.print.photo, label: festival.print.kind }] : []),
  ];
}

/** Teatro y ciudad; si no sabemos el teatro, el centro que bailó. */
function placeOf(festival: Festival) {
  const venue = venueOf(festival.venue);
  if (venue) return { name: venue.name, place: venue.place };
  return { name: festival.centre ?? "Studio de Danza Coppelia", place: "" };
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Abanico de miniaturas: se abre como una mano de cartas al pasar por encima de la función. */
function Fan({ items, onOpen }: { items: ViewerItem[]; onOpen: (index: number) => void }) {
  const shown = items.slice(0, 3);
  const rest = items.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((item, i) => {
        const photo = item.kind === "photo" ? item.photo : item.video.poster;
        const angle = (i - (shown.length - 1) / 2) * 7;
        return (
          <button
            key={`${photo.src}-${i}`}
            type="button"
            onClick={() => onOpen(i)}
            className="fan-card relative -ml-8 h-24 w-[4.6rem] shrink-0 overflow-hidden rounded-md border-2 border-white/90 bg-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.55)] first:ml-0 sm:h-28 sm:w-[5.4rem]"
            style={{ "--a": `${angle}deg`, "--i": i - (shown.length - 1) / 2, zIndex: i } as CSSProperties}
            aria-label={item.kind === "video" ? `Ver el vídeo «${item.video.title}»` : `Ver la foto ${i + 1}`}
          >
            <Image src={photo.src} alt="" fill sizes="96px" className="object-cover" style={{ objectPosition: photo.focus }} />
            {item.kind === "video" && (
              <span className="absolute inset-0 grid place-items-center bg-black/35" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
      {rest > 0 && (
        <button
          type="button"
          onClick={() => onOpen(shown.length)}
          className="relative z-10 -ml-4 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-tutu text-sm font-semibold text-noche shadow-lg transition-transform duration-300 hover:scale-110"
          aria-label={`Ver ${rest} más`}
        >
          +{rest}
        </button>
      )}
    </div>
  );
}

function YearGroup({ year, list, onOpen }: { year: number; list: Festival[]; onOpen: (festival: Festival, index: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const shown = useStageInView(ref, "0px 0px -10% 0px");

  // La luz de la fila sigue al ratón.
  const onMove = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <li
      ref={ref}
      id={`y-${year}`}
      data-year={year}
      onPointerMove={onMove}
      className={cn(
        "year-row group/year relative grid scroll-mt-36 gap-x-10 gap-y-6 border-t border-white/12 py-10 transition-[opacity,transform,translate] duration-[1100ms] ease-[var(--ease-out-expo)] lg:grid-cols-[15rem_1fr] lg:py-14",
        shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/year:opacity-100"
        style={{ background: "radial-gradient(circle 26rem at var(--mx, 50%) var(--my, 50%), rgba(255,241,208,0.07), transparent 70%)" }}
        aria-hidden="true"
      />
      <p className="year-outline display relative w-fit text-[clamp(3.8rem,6.2vw,6rem)] leading-[0.85] tabular-nums lg:sticky lg:top-44 lg:self-start" aria-hidden="true">
        {year}
      </p>

      <div className="relative grid gap-10">
        {list.map((festival) => {
          const items = itemsOf(festival);
          const { name, place } = placeOf(festival);
          const photoCount = festival.photos.length;
          const videoCount = festival.videos.length;
          const open = (index: number) => onOpen(festival, index);
          return (
            <article key={festival.id} id={`f-${festival.id}`} className="festival scroll-mt-32 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-tutu">
                  <span className="sr-only">{year} · </span>
                  {festival.title}
                  {festival.venue && festival.centre && <span className="text-white/45"> · centro de {festival.centre}</span>}
                </p>
                <h3 className="display mt-3 text-[clamp(2rem,3.6vw,3.2rem)] italic">
                  {name}
                </h3>
                {(place || festival.date) && <p className="mt-2 text-white/70">{[place, festival.date].filter(Boolean).join(" · ")}</p>}
                {festival.facts && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {festival.facts.map((fact) => (
                      <li key={fact} className="rounded-full border border-tutu/40 px-3 py-1 text-sm text-tutu">
                        {fact}
                      </li>
                    ))}
                  </ul>
                )}
                {festival.note && <p className="mt-4 max-w-xl leading-relaxed text-white/60">{festival.note}</p>}
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => open(0)}
                    className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-tutu"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/30 transition-colors group-hover/year:border-tutu" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                    {[
                      photoCount ? plural(photoCount, "foto", "fotos") : null,
                      videoCount ? plural(videoCount, "vídeo", "vídeos") : null,
                      festival.print ? festival.print.kind.toLowerCase() : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </button>
                )}
              </div>
              {items.length > 0 && <Fan items={items} onOpen={open} />}
            </article>
          );
        })}
      </div>
    </li>
  );
}

export function FestivalArchive() {
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [viewer, setViewer] = useState<{ set: ViewerSet; index: number } | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const groups = useMemo(() => {
    const list = filter === "todos" ? festivals : festivals.filter((f) => f.centre === filter);
    const byYear = new Map<number, Festival[]>();
    list.forEach((f) => byYear.set(f.year, [...(byYear.get(f.year) ?? []), f]));
    return [...byYear.entries()];
  }, [filter]);

  // El año que cruza el centro de la pantalla se marca en la regla.
  useEffect(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-year]");
    if (!rows) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(Number((entry.target as HTMLElement).dataset.year))),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [groups]);

  const years = groups.map(([year]) => year);
  const activeIndex = active === null ? -1 : years.indexOf(active);

  const totals = {
    festivals: festivals.length,
    venues: venues.length,
    photos: festivals.reduce((n, f) => n + f.photos.length, 0),
    videos: festivals.reduce((n, f) => n + f.videos.length, 0),
  };

  const openFestival = (festival: Festival, index: number) => {
    const { name, place } = placeOf(festival);
    setViewer({
      set: { title: `${festival.title} ${festival.year}`, subtitle: [name, place, festival.date].filter(Boolean).join(" · "), items: itemsOf(festival) },
      index,
    });
  };

  return (
    <section id="festivales" className="scroll-mt-20 bg-noche" aria-labelledby="festival-a-festival">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="hand text-2xl text-tutu">el archivo de la escuela</p>
            <h2 id="festival-a-festival" className="display mt-3 text-[clamp(3rem,7vw,6.4rem)]">
              <RevealText text="Festival a festival." />
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-white/65 lg:col-span-4 lg:col-start-9">
            Del programa más antiguo que guardamos, el de 1988, a la gala de 2023: fotos, vídeos, programas de mano y carteles de cada fin de curso.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-6 border-y border-white/12 py-8 sm:grid-cols-4">
          {[
            { value: String(totals.festivals), label: "festivales en el archivo" },
            { value: String(totals.venues), label: "escenarios" },
            { value: String(totals.photos), label: "fotos de función" },
            { value: String(totals.videos), label: "vídeos" },
          ].map((item, i) => (
            <div key={item.label}>
              <dt className="sr-only">{item.label}</dt>
              <dd className="display text-[clamp(3rem,6vw,5rem)] leading-none">
                <RollingNumber value={item.value} delay={i * 180} />
              </dd>
              <dd className="mt-2 text-sm text-white/55">{item.label}</dd>
            </div>
          ))}
        </dl>

        <div className="sticky top-3 z-20 mt-10 grid justify-items-center gap-3 lg:top-5">
          <div className="flex gap-1 rounded-full border border-white/15 bg-black/75 p-1 backdrop-blur-md" role="group" aria-label="Filtrar por centro">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={filter === item.key}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors duration-300 sm:px-5",
                  filter === item.key ? "bg-tutu font-semibold text-noche" : "text-white/70 hover:text-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Regla de años: el indicador viaja al año que se está leyendo */}
          <nav aria-label="Ir a un año" className="relative hidden w-full max-w-5xl rounded-full border border-white/10 bg-black/70 px-6 py-2.5 backdrop-blur-md lg:block">
            <ol className="relative flex justify-between">
              {years.map((year, i) => (
                <li key={year}>
                  <a
                    href={`#y-${year}`}
                    className={cn(
                      "block text-xs tabular-nums transition-[color,transform] duration-500",
                      i === activeIndex ? "scale-125 font-semibold text-tutu" : "text-white/45 hover:text-white",
                    )}
                  >
                    {year}
                  </a>
                </li>
              ))}
            </ol>
            <span
              className="absolute bottom-0 h-[2px] rounded-full bg-tutu shadow-[0_0_12px_rgba(191,225,248,0.9)] transition-[left,width,opacity] duration-700 ease-[var(--ease-out-expo)]"
              style={{
                left: `calc(1.5rem + ${activeIndex < 0 ? 0 : activeIndex / Math.max(1, years.length - 1)} * (100% - 3rem) - 1rem)`,
                width: "2rem",
                opacity: activeIndex < 0 ? 0 : 1,
              }}
              aria-hidden="true"
            />
          </nav>
        </div>

        <ol ref={listRef} key={filter} className="mt-8">
          {groups.map(([year, list]) => (
            <YearGroup key={year} year={year} list={list} onOpen={openFestival} />
          ))}
        </ol>
      </div>

      <Viewer
        set={viewer?.set ?? null}
        index={viewer?.index ?? 0}
        onIndex={(index) => setViewer((v) => (v ? { ...v, index } : v))}
        onClose={() => setViewer(null)}
      />
    </section>
  );
}
