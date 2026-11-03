"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { VideoScreen } from "@/components/alumnos/video-screen";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { lockScroll } from "@/components/smooth-scroll";
import type { Video } from "@/data/festivales";
import type { Photo } from "@/data/site";
import { cn } from "@/lib/utils";

export type ViewerItem = { kind: "photo"; photo: Photo; label?: string } | { kind: "video"; video: Video };

export type ViewerSet = { title: string; subtitle?: string; items: ViewerItem[] };

type Props = {
  set: ViewerSet | null;
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
};

const thumbOf = (item: ViewerItem) => (item.kind === "photo" ? item.photo : item.video.poster);

/**
 * Visor a pantalla completa: se cierra un telón de terciopelo, el foco ilumina la foto o el vídeo
 * y se pasa de uno a otro con flechas, teclado o deslizando el dedo.
 */
export function Viewer({ set, index, onIndex, onClose }: Props) {
  const open = set !== null;
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [direction, setDirection] = useState(1);
  // El último conjunto se queda montado mientras el telón se abre al cerrar.
  const [shown, setShown] = useState<ViewerSet | null>(set);
  if (set && set !== shown) setShown(set);

  const items = shown?.items ?? [];
  const count = items.length;
  const go = (step: number) => {
    if (count < 2) return;
    setDirection(step);
    onIndex((index + step + count) % count);
  };

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const focus = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 350);
    return () => {
      clearTimeout(focus);
      lockScroll(false);
      opener.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // La miniatura activa se mantiene a la vista en la tira inferior.
  useEffect(() => {
    const active = stripRef.current?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    active?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [index, reduce, open]);

  const current = items[Math.min(index, count - 1)];
  const panel = "velvet absolute inset-y-0 w-[50.5%] transition-transform duration-700 ease-[var(--ease-curtain)]";
  const curtainDelay = { transitionDelay: open ? "0ms" : "260ms" };

  return (
    <div role="dialog" aria-modal="true" aria-label={shown?.title ?? "Visor"} inert={!open} className={cn("fixed inset-0 z-[70]", !open && "pointer-events-none")}>
      <div className={cn(panel, "left-0 origin-left")} style={{ ...curtainDelay, transform: `scaleX(${open ? 1 : 0})` }} />
      <div className={cn(panel, "right-0 origin-right")} style={{ ...curtainDelay, transform: `scaleX(${open ? 1 : 0})` }} />

      {shown && (
        <div className={cn("absolute inset-0 flex flex-col transition-opacity duration-500", open ? "opacity-100 delay-300" : "opacity-0 delay-0")}>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(255,241,208,0.13),transparent_70%)]"
            style={{ "--sx": "50%", "--sy": "45%", "--sr": 1.8 } as CSSProperties}
            aria-hidden="true"
          >
            {open && <DustCanvas count={45} />}
          </div>

          <div className="relative flex shrink-0 items-start justify-between gap-6 px-5 pb-3 pt-5 sm:px-8">
            <div className="min-w-0">
              <p className="display truncate text-[clamp(1.7rem,3.4vw,2.8rem)] italic">{shown.title}</p>
              {shown.subtitle && <p className="mt-1 truncate text-sm text-white/60 sm:text-base">{shown.subtitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <p className="hidden text-sm tabular-nums text-white/55 sm:block" aria-live="polite">
                {Math.min(index, count - 1) + 1} / {count}
              </p>
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
          </div>

          <div className="relative min-h-0 flex-1 px-5 sm:px-20 lg:px-28">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {current && (
                <motion.div
                  key={`${shown.title}-${index}`}
                  custom={direction}
                  className="absolute inset-0 flex items-center justify-center px-5 py-2 sm:px-20 lg:px-28"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 90, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -90, scale: 0.96 }}
                  transition={{ duration: reduce ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                  drag={count > 1 && current.kind === "photo" ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70 || info.velocity.x < -400) go(1);
                    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1);
                  }}
                >
                  {current.kind === "photo" ? (
                    <figure className="flex h-full w-full flex-col items-center justify-center">
                      <div className="relative w-full flex-1">
                        <Image
                          src={current.photo.src}
                          alt={current.photo.alt}
                          fill
                          sizes="(min-width: 1024px) 80vw, 100vw"
                          className="kenburns pointer-events-none select-none object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
                          draggable={false}
                        />
                      </div>
                      <figcaption className="mt-3 flex max-w-3xl flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-center text-sm text-white/65">
                        {current.label && <span className="hand text-xl text-tutu">{current.label}</span>}
                        <span>{current.photo.alt}</span>
                        {current.photo.credit && <span className="text-white/40">Foto: {current.photo.credit}</span>}
                      </figcaption>
                    </figure>
                  ) : (
                    <div className="w-full max-w-[min(100%,calc((100svh-15rem)*16/9))]">
                      <VideoScreen key={current.video.id} video={current.video} sizes="80vw" className="rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.7)]" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 backdrop-blur transition-colors hover:border-tutu hover:bg-tutu hover:text-noche sm:grid lg:left-8"
                  aria-label="Anterior"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 backdrop-blur transition-colors hover:border-tutu hover:bg-tutu hover:text-noche sm:grid lg:right-8"
                  aria-label="Siguiente"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div ref={stripRef} className="relative flex shrink-0 gap-2 overflow-x-auto px-5 pb-5 pt-3 [scrollbar-width:none] sm:justify-center sm:px-8" data-lenis-prevent>
              {items.map((item, i) => {
                const thumb = thumbOf(item);
                return (
                  <button
                    key={`${thumb.src}-${i}`}
                    type="button"
                    data-thumb={i}
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      onIndex(i);
                    }}
                    className={cn(
                      "relative h-14 shrink-0 overflow-hidden rounded-md transition-[opacity,transform,box-shadow] duration-300 sm:h-16",
                      i === index ? "opacity-100 shadow-[0_0_0_2px_var(--color-tutu)]" : "opacity-45 hover:opacity-90",
                    )}
                    style={{ aspectRatio: `${Math.max(0.6, Math.min(1.8, thumb.width / thumb.height))}` }}
                    aria-label={item.kind === "video" ? `Vídeo: ${item.video.title}` : `Foto ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    <Image src={thumb.src} alt="" fill sizes="120px" className="object-cover" />
                    {item.kind === "video" && (
                      <span className="absolute inset-0 grid place-items-center bg-black/30" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                          <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
