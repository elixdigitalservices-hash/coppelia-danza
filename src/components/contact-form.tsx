"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/button-link";
import { disciplines, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

const DANCERS = [
  { value: "Peque de 3 a 6 años", title: "Peque", detail: "3 a 6 años" },
  { value: "Niño o adolescente", title: "Niño o joven", detail: "desde 6 años" },
  { value: "Adulto", title: "Adulto", detail: "sin límite" },
] as const;

const OPTIONS = [...disciplines.map((item) => item.name), "Aún no lo sé"];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-white/55">{label}</span>
      {children}
    </label>
  );
}

/** Sin backend: compone el mensaje, lo enseña como una burbuja de chat y abre WhatsApp con él listo para enviar. */
export function ContactForm() {
  const [dancer, setDancer] = useState<string>(DANCERS[0].value);
  const [interest, setInterest] = useState<string>(OPTIONS[0]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);

  const text = [
    `Hola, soy ${name.trim() || "…"}. Me gustaría reservar una clase de prueba en Coppelia.`,
    `Para: ${dancer}${age.trim() ? ` (${age.trim()} años)` : ""}.`,
    `Me interesa: ${interest}.`,
    message.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  const input =
    "w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-lg text-white outline-none transition-colors placeholder:text-white/30 focus:border-tutu focus:bg-white/[0.09]";

  return (
    <form onSubmit={onSubmit} className="grid gap-8">
      <fieldset>
        <legend className="mb-3 text-sm text-white/55">¿Quién va a bailar?</legend>
        <div className="grid grid-cols-3 gap-2">
          {DANCERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setDancer(item.value)}
              aria-pressed={dancer === item.value}
              className={cn(
                "rounded-2xl border px-2 py-3.5 text-center transition-[background-color,border-color,color,transform,translate,scale] duration-300 active:scale-95",
                dancer === item.value ? "border-tutu bg-tutu text-noche" : "border-white/15 bg-white/[0.04] text-white hover:border-white/40",
              )}
            >
              <span className="block font-semibold">{item.title}</span>
              <span className={cn("mt-0.5 block text-xs", dancer === item.value ? "text-noche/70" : "text-white/50")}>{item.detail}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm text-white/55">¿Qué te gustaría probar?</legend>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setInterest(item)}
              aria-pressed={interest === item}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm transition-[background-color,border-color,color,transform,translate,scale] duration-300 active:scale-95",
                interest === item ? "border-tutu bg-tutu font-semibold text-noche" : "border-white/20 text-white/80 hover:border-white/50",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-[1fr_6.5rem] gap-3">
        <Field label="Tu nombre">
          <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" className={input} placeholder="Nombre" />
        </Field>
        <Field label="Edad">
          <input value={age} onChange={(event) => setAge(event.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" className={input} placeholder="—" />
        </Field>
      </div>

      <Field label="¿Algo más? (opcional)">
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className={cn(input, "resize-none")} placeholder="Experiencia previa, días que te vienen bien…" />
      </Field>

      {/* Vista previa: así llegará el mensaje */}
      <div className="rounded-[1.5rem] bg-[#0b141a] p-4" aria-live="polite">
        <p className="mb-3 flex items-center gap-2 text-xs text-white/50">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </span>
          Así llegará tu mensaje a Coppelia
        </p>
        <div className="ml-auto w-fit max-w-[92%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-4 py-3 text-[15px] leading-relaxed text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          {text.split("\n").map((row, index) => (
            <p key={index}>{row}</p>
          ))}
          <p className="mt-1 text-right text-[11px] text-white/55">ahora ✓✓</p>
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-white/65">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-tutu)]"
        />
        Acepto que Studio de Danza Coppelia use estos datos solo para responder a mi consulta.
      </label>

      <button
        type="submit"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[15px] font-semibold text-white transition-[background-color,transform,translate,scale] hover:bg-[#1fbe5b] active:scale-[0.98]"
      >
        <WhatsAppIcon />
        Enviar por WhatsApp
      </button>
    </form>
  );
}
