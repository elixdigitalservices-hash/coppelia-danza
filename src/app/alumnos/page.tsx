import type { Metadata } from "next";
import { FestivalArchive } from "@/components/alumnos/archive";
import { FeaturedFilm } from "@/components/alumnos/featured-film";
import { AlumnosHero } from "@/components/alumnos/hero";
import { Playbills } from "@/components/alumnos/playbills";
import { Quotes } from "@/components/alumnos/quotes";
import { Venues } from "@/components/alumnos/venues";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { featuredFilm } from "@/data/festivales";

export const metadata: Metadata = {
  title: "Alumnos en escena: festivales y teatros desde 1988",
  description:
    "Todos los festivales de fin de curso de Studio de Danza Coppelia: el Gran Teatro de Córdoba, el Teatro Central de Sevilla y el Auditorio Rafael de León de Tomares, con fotos, vídeos y programas de mano desde 1988.",
  alternates: { canonical: "/alumnos" },
};

export default function AlumnosPage() {
  return (
    <>
      <Header />
      <main>
        <AlumnosHero />

        <FeaturedFilm
          video={featuredFilm}
          id="dos-teatros"
          title="Dos teatros, dos ciudades."
          lead="Junio de 2015 y 2016: Córdoba en el Gran Teatro y Tomares en el Teatro Central de Sevilla. Dale al play y siéntate en primera fila."
          caption="resumen de los festivales 2015 · 2016"
        />
        <Venues />
        <FestivalArchive />
        <Playbills />
        <Quotes />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
