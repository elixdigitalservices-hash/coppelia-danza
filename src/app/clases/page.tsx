import type { Metadata } from "next";
import { Audiences } from "@/components/audiences";
import { ButtonLink, WhatsAppIcon } from "@/components/button-link";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { FilmDay } from "@/components/fx/film-day";
import { Magnetic } from "@/components/fx/magnetic";
import { RevealText } from "@/components/fx/reveal-text";
import { StackDeck } from "@/components/fx/stack-deck";
import { StageImage } from "@/components/fx/stage-image";
import { Header } from "@/components/header";
import { PageHero } from "@/components/page-hero";
import { disciplines, photos, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Clases de ballet, contemporáneo, Ballet Fitness y Pilates en Tomares",
  description:
    "Pre-Ballet desde 3 años, ballet clásico en 7 niveles, danza contemporánea, Ballet Fitness con Barre Fit y Pilates aplicado a la danza en Tomares (Sevilla). Primera clase gratis.",
  alternates: { canonical: "/clases" },
};

export default function ClasesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Clases"
          lead="Ballet clásico, danza contemporánea, Ballet Fitness y Pilates aplicado a la danza. Grupos por edad y nivel, desde los 3 años hasta adultos que empiezan de cero."
          photo={photos.barraEspejo}
          note="primera clase gratis"
        >
          <ButtonLink href={whatsappLink()}>
            <WhatsAppIcon />
            Pide tu clase de prueba
          </ButtonLink>
        </PageHero>

        <Audiences title="¿Por dónde empiezo?" />

        <nav aria-label="Disciplinas" className="border-b border-white/10 bg-noche">
          <ul className="mx-auto flex max-w-[90rem] flex-wrap gap-2 px-5 py-6 sm:px-8">
            {disciplines.map((item) => (
              <li key={item.slug}>
                <a href={`#${item.slug}`} className="inline-block rounded-full border border-white/20 px-4 py-2 text-sm text-white/75 transition-colors hover:border-tutu hover:text-white">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="bg-noche lg:pt-16">
          <StackDeck
            cards={disciplines.map((item, index) => {
              const light = index % 2 === 1;
              return (
                <section
                  key={item.slug}
                  id={item.slug}
                  className={cn("h-full scroll-mt-32", light ? "on-light bg-sala text-noche" : "bg-noche lg:border lg:border-white/10 lg:bg-[#070707]")}
                  aria-labelledby={`${item.slug}-titulo`}
                >
                  <div className="mx-auto grid h-full max-w-[90rem] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10 xl:p-14">
                    <StageImage
                      photo={item.photo}
                      natural
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className={cn("lg:col-span-5 lg:max-h-full lg:self-center", light && "lg:order-2 lg:col-start-8")}
                    />
                    <div className={cn("lg:col-span-6", light ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
                      <p className={cn("text-sm font-medium", light ? "text-tutu-ink" : "text-tutu")}>{item.levels}</p>
                      <h2 id={`${item.slug}-titulo`} className="display mt-4 text-[clamp(3rem,5vw,5rem)]">
                        <RevealText text={item.name} stagger={20} />
                      </h2>
                      <p className={cn("mt-5 max-w-xl text-lg leading-relaxed", light ? "text-linoleo" : "text-white/70")}>{item.body}</p>
                      <ul className={cn("mt-6 grid max-w-xl border-t", light ? "border-noche/15" : "border-white/15")}>
                        {item.points.map((point) => (
                          <li key={point} className={cn("border-b py-3 leading-relaxed", light ? "border-noche/15" : "border-white/15")}>
                            {point}
                          </li>
                        ))}
                      </ul>
                      <Magnetic className="mt-8">
                        <ButtonLink href={whatsappLink(`Hola, me gustaría probar una clase de ${item.name} en Coppelia.`)} variant={light ? "ink" : "tutu"}>
                          <WhatsAppIcon />
                          Probar {item.name.toLowerCase().startsWith("pilates") ? "Pilates" : item.name} gratis
                        </ButtonLink>
                      </Magnetic>
                    </div>
                  </div>
                </section>
              );
            })}
          />
        </div>

        <FilmDay />
        <Faq tone="white" />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
