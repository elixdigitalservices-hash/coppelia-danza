import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { FinalCta } from "@/components/final-cta";
import { Manifesto } from "@/components/fx/manifesto";
import { RevealText } from "@/components/fx/reveal-text";
import { StageImage } from "@/components/fx/stage-image";
import { StageSection } from "@/components/fx/stage-section";
import { WordZoom } from "@/components/fx/word-zoom";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { History } from "@/components/history";
import { OnStage } from "@/components/on-stage";
import { PageHero } from "@/components/page-hero";
import { StudioSpace } from "@/components/studio-space";
import { Values } from "@/components/values";
import { photos } from "@/data/site";

export const metadata: Metadata = {
  title: "La escuela: 40 años de danza en Tomares",
  description:
    "Studio de Danza Coppelia abrió en 1986. Especialistas en danza clásica, centro adherido a ACADE con más del 98 % de aprobados, dos aulas de 145 y 115 m² en Tomares y festivales en teatros de verdad.",
  alternates: { canonical: "/escuela" },
};

export default function EscuelaPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="La escuela"
          lead="Coppelia nació en 1986 de un amor: la danza clásica. Cuarenta años después seguimos enseñando, aprendiendo y llenando nuestras aulas de música."
          photo={photos.estiramiento}
          note="desde 1986"
        >
          <ButtonLink href="/clases">Ver las clases</ButtonLink>
          <ButtonLink href="/contacto" variant="ghost">
            Visítanos en Tomares
          </ButtonLink>
        </PageHero>

        <Manifesto />

        <StageSection className="bg-sala text-noche" labelledBy="ballet-base">
          <div className="mx-auto grid max-w-[90rem] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:py-36">
            <StageImage photo={photos.claseBN} natural sizes="(min-width: 1024px) 48vw, 100vw" className="bg-noche lg:col-span-6" />
            <div className="lg:col-span-5 lg:col-start-8">
              <h2 id="ballet-base" className="display text-[clamp(2.8rem,5.6vw,5rem)]">
                <RevealText text="El ballet, la base de todos los bailes." />
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-linoleo">
                El hip-hop, el contemporáneo, el jazz o la danza española se nutren del ballet clásico. Al enseñarlo enseñamos a controlar mente y cuerpo a la vez:
                disciplina, concentración, capacidad de esfuerzo y una técnica sólida que luego se lleva a cualquier estilo.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-linoleo">
                Por eso, aunque puedes matricularte en cualquier disciplina por separado, si quieres avanzar de verdad te recomendamos combinarla con clásico.
              </p>
            </div>
          </div>
        </StageSection>

        <History />
        <Values />
        <WordZoom word="escena" photo={photos.escenaFinal} portrait={photos.escenaArqueras} after="Cada fin de curso, un teatro de verdad." />
        <OnStage />
        <StudioSpace />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
