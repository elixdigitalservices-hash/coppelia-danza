import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { photos } from "@/data/site";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-noche pt-[4.5rem]">
        <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:items-center lg:py-28">
          <div className="lg:col-span-6">
            <p className="hand text-3xl text-tutu">error 404</p>
            <h1 className="display mt-4 text-[clamp(3.4rem,8vw,7rem)]">Este paso no está en la coreografía.</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">La página que buscas no existe o ha cambiado de sitio. Volvamos al centro del escenario.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/">Volver al inicio</ButtonLink>
              <ButtonLink href="/clases" variant="ghost">
                Ver las clases
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden lg:col-span-5 lg:col-start-8">
            <Image src={photos.converse.src} alt={photos.converse.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
