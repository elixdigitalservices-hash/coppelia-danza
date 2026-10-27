import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { PhoneIcon, WhatsAppIcon } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { RevealText } from "@/components/fx/reveal-text";
import { StageImage } from "@/components/fx/stage-image";
import { Header } from "@/components/header";
import { photos, studio, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contacto y clase de prueba gratis",
  description: "Reserva tu clase de prueba gratis en Studio de Danza Coppelia: Calle Navarro Caro 81, Tomares (Sevilla). Teléfono y WhatsApp 617 319 293.",
  alternates: { canonical: "/contacto" },
};

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ACTIONS: Array<{ href: string; label: string; detail: string; icon: ReactNode; tone: string; external?: boolean }> = [
  { href: whatsappLink(), label: "WhatsApp", detail: "Escríbenos", icon: <WhatsAppIcon className="h-5 w-5" />, tone: "bg-[#25D366] text-white", external: true },
  { href: studio.phoneHref, label: "Llamar", detail: studio.phone, icon: <PhoneIcon className="h-5 w-5" />, tone: "bg-tutu text-noche" },
  { href: studio.mapsUrl, label: "Cómo llegar", detail: "Navarro Caro, 81", icon: <PinIcon />, tone: "bg-white text-noche", external: true },
  { href: studio.instagram, label: "Instagram", detail: "@studiodedanzacoppelia", icon: <InstagramIcon />, tone: "bg-white/10 text-white", external: true },
];

const STEPS = [
  { title: "Nos escribes", body: "Por WhatsApp, por teléfono o con el formulario. Cuéntanos la edad y si ya ha bailado antes." },
  { title: "Te proponemos grupo", body: "Te enviamos el grupo y el horario que mejor encajan con la edad y el nivel." },
  { title: "Vienes a bailar", body: "La primera clase es gratis y la matrícula también. Solo tienes que traer ganas." },
];

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="bg-noche">
        {/* Cabecera */}
        <section className="relative overflow-hidden pt-[4.5rem]" style={{ "--sx": "30%", "--sy": "40%", "--sr": 1.2 } as CSSProperties}>
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle min(90vw, 44rem) at 30% 40%, rgba(255,241,208,0.08), transparent 70%)" }} aria-hidden="true">
            <DustCanvas count={50} />
          </div>
          <div className="relative mx-auto grid max-w-[90rem] gap-8 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-12 lg:items-end lg:pb-16 lg:pt-20">
            <div className="lg:col-span-6">
              <h1 className="display text-[clamp(3.6rem,10vw,7.5rem)]">
                <RevealText text={"Ven a\nprobar."} lines delay={150} stagger={40} />
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">Cuéntanos quién va a bailar y te proponemos grupo y horario. Te respondemos por WhatsApp.</p>
              <p className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-tutu px-4 py-1.5 text-sm font-semibold text-noche">Primera clase gratis</span>
                <span className="rounded-full border border-tutu/50 px-4 py-1.5 text-sm font-semibold text-tutu">Matrícula gratis</span>
              </p>
            </div>
            <figure className="lg:col-span-5 lg:col-start-8">
              <StageImage photo={photos.aulaGrande} natural sizes="(min-width: 1024px) 40vw, 100vw" className="rounded-[1.75rem]" delay={200} />
              <figcaption className="hand mt-3 text-xl text-tutu">te esperamos en el aula grande</figcaption>
            </figure>
          </div>
        </section>

        {/* Accesos directos de un toque */}
        <section aria-label="Contacto directo" className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ACTIONS.map((action) => (
              <li key={action.label}>
                <a
                  href={action.href}
                  {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition-[background-color,border-color,transform,translate,scale] duration-300 hover:border-white/30 active:scale-[0.97] sm:p-5"
                >
                  <span className={`grid h-11 w-11 place-items-center rounded-full ${action.tone}`}>{action.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold">{action.label}</span>
                    <span className="mt-0.5 block truncate text-sm text-white/55">{action.detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/45">
            También en el fijo{" "}
            <a href={studio.landlineHref} className="text-white/75 underline decoration-white/25 underline-offset-4">
              {studio.landline}
            </a>{" "}
            o en{" "}
            <a href={`mailto:${studio.email}`} className="text-white/75 underline decoration-white/25 underline-offset-4">
              {studio.email}
            </a>
          </p>
        </section>

        <section className="mx-auto grid max-w-[90rem] gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-12 lg:items-start lg:gap-x-16 lg:gap-y-12 lg:pb-32 lg:pt-24">
          {/* Qué pasa después. En móvil el orden es: pasos, formulario y mapa. */}
          <div className="min-w-0 lg:col-span-5 lg:row-start-1">
            <h2 className="display text-[clamp(2.4rem,5vw,3.8rem)]">
              <RevealText text="Así de fácil." />
            </h2>
            <ol className="relative mt-8 grid gap-7 pl-12">
              <span className="absolute bottom-3 left-[1.05rem] top-3 w-px bg-gradient-to-b from-tutu via-white/20 to-transparent" aria-hidden="true" />
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="display absolute -left-12 top-0 grid h-9 w-9 place-items-center rounded-full border border-tutu/60 bg-noche text-lg italic text-tutu">{index + 1}</span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-white/60">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Formulario */}
          <div className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-8 lg:sticky lg:top-24">
              <h2 className="display text-[clamp(2.2rem,4.6vw,3.4rem)]">Reserva tu clase de prueba</h2>
              <p className="mb-8 mt-2 text-white/55">Rellénalo en 30 segundos: se abre WhatsApp con el mensaje escrito.</p>
              <ContactForm />
            </div>
          </div>

          {/* Mapa */}
          <div className="min-w-0 lg:col-span-5 lg:row-start-2">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
              <div className="relative h-60 bg-white/5 sm:h-72">
                {/* Se ve mientras carga el mapa */}
                <div className="absolute inset-0 grid place-items-center text-center text-white/40" aria-hidden="true">
                  <span className="grid justify-items-center gap-2">
                    <PinIcon />
                    <span className="text-sm">Tomares, Sevilla</span>
                  </span>
                </div>
                <iframe
                  src={studio.mapsEmbed}
                  title="Mapa: Studio de Danza Coppelia en Calle Navarro Caro 81, Tomares"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale invert-[0.92] hue-rotate-180"
                />
              </div>
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="leading-relaxed">
                  {studio.street}
                  <br />
                  <span className="text-white/55">
                    {studio.postalCode} {studio.city} · metro San Juan Alto
                  </span>
                </p>
                <a
                  href={studio.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-noche transition-colors hover:bg-tutu"
                >
                  <PinIcon />
                  Abrir en Maps
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
