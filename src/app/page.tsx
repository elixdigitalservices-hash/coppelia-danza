import { Audiences } from "@/components/audiences";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { FilmDay } from "@/components/fx/film-day";
import { Manifesto } from "@/components/fx/manifesto";
import { Marquee } from "@/components/fx/marquee";
import { WordZoom } from "@/components/fx/word-zoom";
import { Header } from "@/components/header";
import { History } from "@/components/history";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/intro";
import { OnStage } from "@/components/on-stage";
import { Repertoire } from "@/components/repertoire";
import { StudioSpace } from "@/components/studio-space";
import { photos } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <Intro />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Audiences />
        <Repertoire />
        <FilmDay />
        <StudioSpace />
        <History />
        <WordZoom word="escena" photo={photos.escenaFinal} portrait={photos.escenaArqueras} after="Cada fin de curso, un teatro de verdad." />
        <OnStage />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
