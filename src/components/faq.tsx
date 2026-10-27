"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/button-link";
import { RevealText } from "@/components/fx/reveal-text";
import { faqTopics, faqs, whatsappLink, type Faq as FaqItem } from "@/data/site";
import { cn } from "@/lib/utils";

const ALL = "Todas";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Question({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  const id = useId();
  const external = item.action && /^https?:/.test(item.action.href);

  return (
    <div
      className={cn(
        "faq-item rounded-[1.5rem] border transition-[background-color,border-color,box-shadow] duration-500",
        open ? "border-transparent bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)]" : "border-noche/10 hover:border-noche/25",
      )}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
        >
          <span>
            <span className="block text-xs font-medium text-tutu-ink">{item.topic}</span>
            <span className="mt-1 block text-lg font-semibold leading-snug sm:text-xl">{item.q}</span>
          </span>
          <span
            className={cn(
              "relative mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,transform,translate,scale,rotate] duration-500 ease-[var(--ease-out-expo)]",
              open ? "rotate-[135deg] border-noche bg-noche" : "border-noche/25 group-hover:border-noche",
            )}
            aria-hidden="true"
          >
            <span className={cn("absolute h-px w-3.5", open ? "bg-white" : "bg-noche")} />
            <span className={cn("absolute h-3.5 w-px", open ? "bg-white" : "bg-noche")} />
          </span>
        </button>
      </h3>
      <div id={id} role="region" className={cn("grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div
            className={cn(
              "flex gap-4 px-5 pb-6 transition-[opacity,transform,translate] duration-700 ease-[var(--ease-out-expo)] sm:px-7",
              open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
            )}
          >
            {/* En móvil la foto acompaña a la respuesta; en escritorio vive en el panel de la izquierda */}
            <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl lg:hidden">
              <Image src={item.photo.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: item.photo.focus }} />
            </span>
            <div>
              <p className="max-w-2xl leading-relaxed text-linoleo sm:text-lg">{item.a}</p>
              {item.action && (
                <a
                  href={item.action.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group mt-4 inline-flex items-center gap-2 rounded-full bg-noche px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-tutu-ink"
                >
                  {item.action.label}
                  <Arrow />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Caja para preguntar lo que no está en la lista: abre WhatsApp con la pregunta escrita. */
function AskBox() {
  const [text, setText] = useState("");
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(whatsappLink(`Hola, tengo una pregunta: ${text.trim()}`), "_blank", "noopener,noreferrer");
  };
  return (
    <form onSubmit={onSubmit} className="rounded-[1.5rem] bg-noche p-5 text-white sm:p-6">
      <label htmlFor="pregunta" className="hand block text-2xl text-tutu">
        ¿Otra pregunta?
      </label>
      <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-5 focus-within:ring-2 focus-within:ring-tutu">
        <input
          id="pregunta"
          required
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escríbela aquí…"
          className="min-w-0 flex-1 bg-transparent py-2 text-white outline-none placeholder:text-white/40"
        />
        <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105" aria-label="Enviar la pregunta por WhatsApp">
          <WhatsAppIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-3 text-xs text-white/50">Se abre WhatsApp con tu pregunta escrita.</p>
    </form>
  );
}

export function Faq({ tone = "sala" }: { tone?: "sala" | "white" }) {
  const [topic, setTopic] = useState<string>(ALL);
  const [open, setOpen] = useState<string | null>(faqs[0].q);
  const list = faqs.filter((item) => topic === ALL || item.topic === topic);
  const current = faqs.find((item) => item.q === open) ?? list[0] ?? faqs[0];

  const pick = (next: string) => {
    setTopic(next);
    const first = faqs.find((item) => next === ALL || item.topic === next);
    setOpen(first?.q ?? null);
  };

  return (
    <section className={cn("on-light text-noche", tone === "white" ? "bg-white" : "bg-sala")} aria-labelledby="preguntas">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-36">
        <div className="min-w-0 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="preguntas" className="display text-[clamp(2.8rem,5.6vw,5rem)]">
              <RevealText text="Lo que nos preguntan las familias." />
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-linoleo">Las dudas de siempre, con respuesta. Y si la tuya no está, pregúntanos.</p>

            {/* Foto de la pregunta abierta, cambia con una cortinilla */}
            <div className="relative mt-8 hidden aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-noche lg:block">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[var(--ease-curtain)]"
                  style={{ clipPath: item.q === current.q ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", zIndex: item.q === current.q ? 2 : 1 }}
                >
                  <Image src={item.photo.src} alt="" fill sizes="36vw" className="object-cover" style={{ objectPosition: item.photo.focus }} />
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent p-5 pt-16">
                <p className="display text-2xl italic text-white">{current.q}</p>
              </div>
            </div>

            <div className="mt-6 hidden lg:block">
              <AskBox />
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar preguntas por tema" data-lenis-prevent>
            {[ALL, ...faqTopics].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => pick(item)}
                aria-pressed={topic === item}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                  topic === item ? "border-noche bg-noche font-semibold text-white" : "border-noche/20 text-noche/75 hover:border-noche",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            {list.map((item, index) => (
              <div key={`${topic}-${item.q}`} className="faq-enter" style={{ animationDelay: `${index * 60}ms` }}>
                <Question item={item} open={open === item.q} onToggle={() => setOpen(open === item.q ? null : item.q)} />
              </div>
            ))}
          </div>

          <div className="mt-8 lg:hidden">
            <AskBox />
          </div>
        </div>
      </div>
    </section>
  );
}
