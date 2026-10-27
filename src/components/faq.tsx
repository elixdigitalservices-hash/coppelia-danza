"use client";

import { useId, useState } from "react";
import { ButtonLink, WhatsAppIcon } from "@/components/button-link";
import { RevealText } from "@/components/fx/reveal-text";
import { faqs, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

function Question({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-noche/15">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-start justify-between gap-6 py-7 text-left text-xl font-semibold leading-snug sm:text-2xl"
        >
          <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">{q}</span>
          <span
            className={cn(
              "relative mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,transform,translate,scale,rotate] duration-500 ease-[var(--ease-out-expo)]",
              open ? "rotate-45 border-noche bg-noche" : "border-noche/25",
            )}
            aria-hidden="true"
          >
            <span className={cn("absolute h-px w-3.5", open ? "bg-white" : "bg-noche")} />
            <span className={cn("absolute h-3.5 w-px", open ? "bg-white" : "bg-noche")} />
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={cn("grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "max-w-2xl pb-8 text-lg leading-relaxed text-linoleo transition-[opacity,transform,translate,scale,rotate] duration-700 ease-[var(--ease-out-expo)]",
              open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
            )}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq({ tone = "sala" }: { tone?: "sala" | "white" }) {
  return (
    <section className={cn("on-light text-noche", tone === "white" ? "bg-white" : "bg-sala")} aria-labelledby="preguntas">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-36">
        <div className="lg:col-span-4">
          <h2 id="preguntas" className="display text-[clamp(2.8rem,5.6vw,5rem)]">
            <RevealText text="Lo que nos preguntan las familias." />
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-linoleo">¿Te queda alguna duda? Escríbenos por WhatsApp y te respondemos.</p>
          <ButtonLink href={whatsappLink("Hola, tengo una duda sobre las clases de Coppelia.")} variant="ink" className="mt-8">
            <WhatsAppIcon />
            Preguntar por WhatsApp
          </ButtonLink>
        </div>

        <div className="border-t border-noche/15 lg:col-span-7 lg:col-start-6">
          {faqs.map((item) => (
            <Question key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
