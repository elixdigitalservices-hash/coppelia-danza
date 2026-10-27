"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RevealText } from "@/components/fx/reveal-text";
import { StackDeck } from "@/components/fx/stack-deck";
import { StageImage } from "@/components/fx/stage-image";
import { disciplines } from "@/data/site";
import { cn } from "@/lib/utils";

/** Programa de mano: cada disciplina es una línea; con ratón, su foto sigue al cursor. */
export function Repertoire() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview || !hovering) return;
    const pos = { ...target.current };
    let raf = 0;

    const tick = () => {
      const dx = target.current.x - pos.x;
      pos.x += dx * 0.14;
      pos.y += (target.current.y - pos.y) * 0.14;
      const tilt = Math.max(-8, Math.min(8, dx * 0.06));
      preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovering]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    onMove(event);
    setHovering(true);
  };

  return (
    <section className="bg-noche" aria-labelledby="disciplinas">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="disciplinas" className="display text-[clamp(2.8rem,6.4vw,6rem)] lg:col-span-7">
            <RevealText text="Cuatro formas de moverse." />
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-white/65 lg:col-span-4 lg:col-start-9">
            Del Pre-Ballet a las puntas, del suelo contemporáneo a la barra del Ballet Fitness. Elige una o combínalas.
          </p>
        </div>

        {/* Móvil: tarjetas apiladas que se van comiendo unas a otras */}
        <StackDeck
          mode="mobile"
          className="mt-12 md:hidden"
          cards={disciplines.map((item) => (
            <Link key={item.slug} href={`/clases#${item.slug}`} className="block border border-white/10 bg-[#0c0c0c] p-2.5">
              <StageImage photo={item.photo} natural sizes="100vw" className="w-full max-h-[46svh] rounded-[1.3rem]" />
              <span className="block px-3 pb-4 pt-5">
                <span className="text-sm font-medium text-tutu">{item.levels}</span>
                <span className="display mt-2 block text-[2.7rem]">{item.name}</span>
                <span className="mt-2 block leading-relaxed text-white/75">{item.line}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Ver la clase
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </Link>
          ))}
        />

        <div ref={listRef} className="relative mt-14 hidden md:block lg:mt-20" onPointerMove={onMove} onPointerEnter={onEnter} onPointerLeave={() => setHovering(false)}>
          <ul className="border-t border-white/15">
            {disciplines.map((item, index) => (
              <li key={item.slug} className="border-b border-white/15">
                <Link
                  href={`/clases#${item.slug}`}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  data-cursor="Ver"
                  className="group grid gap-x-8 gap-y-3 py-8 md:grid-cols-12 md:items-baseline lg:py-11"
                >
                  <span className="display text-[clamp(2.5rem,5.2vw,4.75rem)] transition-[color,transform,translate,scale,rotate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-tutu md:col-span-6">
                    <RevealText text={item.name} delay={index * 120} stagger={18} />
                  </span>
                  <span className="text-sm font-medium text-white/55 md:col-span-2">{item.levels}</span>
                  <span className="max-w-sm leading-relaxed text-white/80 md:col-span-4">{item.line}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            ref={previewRef}
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-10 hidden w-[20rem] overflow-hidden transition-[clip-path,height] duration-700 ease-[var(--ease-curtain)] lg:block",
              hovering ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(50%_0_50%_0)]",
            )}
            style={{ height: `calc(20rem * ${disciplines[active].photo.height / disciplines[active].photo.width})` }}
            aria-hidden="true"
          >
            {disciplines.map((item, index) => (
              <Image
                key={item.slug}
                src={item.photo.src}
                alt=""
                fill
                sizes="20rem"
                className={cn(
                  "object-cover transition-[opacity,transform,translate,scale,rotate] duration-700 ease-[var(--ease-out-expo)]",
                  index === active ? "scale-100 opacity-100" : "scale-110 opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
