import type { Metadata } from "next";
import { PhoneIcon } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { RevealText } from "@/components/fx/reveal-text";
import { Header } from "@/components/header";
import { studio } from "@/data/site";

export const metadata: Metadata = {
  title: "Contacto y clase de prueba gratis",
  description: "Reserva tu clase de prueba gratis en Studio de Danza Coppelia: Calle Navarro Caro 81, Tomares (Sevilla). Teléfono y WhatsApp 617 319 293.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="bg-noche pt-[4.5rem]">
        <section className="mx-auto grid max-w-[90rem] gap-16 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-12 lg:pb-32 lg:pt-24">
          <div className="lg:col-span-5">
            <h1 className="display text-[clamp(3.6rem,9vw,7.5rem)]">
              <RevealText text={"Ven a\nprobar."} lines delay={150} stagger={40} />
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-white/75 sm:text-xl">
              La primera clase es gratis y la matrícula también. Cuéntanos quién va a bailar y te proponemos grupo y horario.
            </p>

            <dl className="mt-14 grid gap-8 border-t border-white/15 pt-10">
              <div>
                <dt className="text-sm text-white/50">Teléfono y WhatsApp</dt>
                <dd className="mt-2">
                  <a href={studio.phoneHref} className="display inline-flex items-center gap-3 text-4xl hover:text-tutu">
                    <PhoneIcon className="h-6 w-6" />
                    {studio.phone}
                  </a>
                  <p className="mt-2 text-white/60">
                    Fijo:{" "}
                    <a href={studio.landlineHref} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                      {studio.landline}
                    </a>
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Dirección</dt>
                <dd className="mt-2 text-lg leading-relaxed">
                  {studio.street}
                  <br />
                  {studio.postalCode} {studio.city}, {studio.region}
                  <p className="mt-2 text-base text-white/60">Junto a la Avenida del Aljarafe. La lanzadera del metro de San Juan Alto para a pocos metros.</p>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Email e Instagram</dt>
                <dd className="mt-2 grid gap-1 text-lg">
                  <a href={`mailto:${studio.email}`} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                    {studio.email}
                  </a>
                  <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                    {studio.instagramHandle}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border border-white/15 p-6 sm:p-10">
              <h2 className="display text-4xl sm:text-5xl">Reserva tu clase de prueba</h2>
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Mapa" className="relative h-[26rem] border-t border-white/10 lg:h-[32rem]">
          <iframe
            src={studio.mapsEmbed}
            title="Mapa: Studio de Danza Coppelia en Calle Navarro Caro 81, Tomares"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full grayscale invert-[0.92] hue-rotate-180"
          />
          <a
            href={studio.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-5 top-5 rounded-full bg-tutu px-5 py-3 text-sm font-semibold text-noche shadow-lg hover:bg-white sm:right-8"
          >
            Abrir en Google Maps
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
