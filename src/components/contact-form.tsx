"use client";

import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/button-link";
import { disciplines, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

const dancers = ["Peque de 3 a 6 años", "Niño o adolescente", "Adulto"] as const;
const options = [...disciplines.map((item) => item.name), "Aún no lo sé"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2.5 text-sm transition-colors",
        active ? "border-tutu bg-tutu font-semibold text-noche" : "border-white/25 text-white/75 hover:border-white/60 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

/** Sin backend: compone el mensaje y abre WhatsApp con él listo para enviar. */
export function ContactForm() {
  const [dancer, setDancer] = useState<(typeof dancers)[number]>("Peque de 3 a 6 años");
  const [interest, setInterest] = useState<string>(options[0]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = [
      `Hola, soy ${name.trim()}. Me gustaría reservar una clase de prueba en Coppelia.`,
      `Para: ${dancer}${age.trim() ? ` (${age.trim()} años)` : ""}.`,
      `Me interesa: ${interest}.`,
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  const field = "w-full border-b border-white/25 bg-transparent pb-3 text-xl text-white outline-none transition-colors placeholder:text-white/30 focus:border-tutu";

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      <fieldset>
        <legend className="mb-4 text-sm text-white/55">¿Quién va a bailar?</legend>
        <div className="flex flex-wrap gap-2">
          {dancers.map((item) => (
            <Chip key={item} active={dancer === item} onClick={() => setDancer(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-4 text-sm text-white/55">¿Qué te gustaría probar?</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((item) => (
            <Chip key={item} active={interest === item} onClick={() => setInterest(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-10 sm:grid-cols-[1fr_9rem]">
        <label className="grid gap-3">
          <span className="text-sm text-white/55">Tu nombre</span>
          <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" className={field} placeholder="Nombre" />
        </label>
        <label className="grid gap-3">
          <span className="text-sm text-white/55">Edad de quien baila</span>
          <input value={age} onChange={(event) => setAge(event.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" className={field} placeholder="Opcional" />
        </label>
      </div>

      <label className="grid gap-3">
        <span className="text-sm text-white/55">¿Algo más que debamos saber?</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          className={cn(field, "resize-none leading-8")}
          placeholder="Experiencia previa, horarios que te vienen bien…"
        />
      </label>

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-tutu px-7 text-[15px] font-semibold text-noche transition-colors hover:bg-white"
        >
          <WhatsAppIcon />
          Enviar por WhatsApp
        </button>
        <p className="max-w-xs text-sm leading-6 text-white/50">Se abre WhatsApp con tu mensaje escrito. Solo tienes que pulsar enviar.</p>
      </div>
    </form>
  );
}
