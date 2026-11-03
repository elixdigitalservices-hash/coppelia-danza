import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { ButtonLink } from "@/components/button-link";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageHero } from "@/components/page-hero";
import { posts, toPhoto } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog: historias de la danza y de la escuela",
  description: "Artículos de Studio de Danza Coppelia sobre ballet, festivales, puntas, cine, fotografía y la vida de la escuela.",
  alternates: { canonical: "/blog" },
};

const featured = posts.find((p) => p.slug === "coppeliacumplehoy30anos") ?? posts[0];
const rest = posts.filter((p) => p !== featured);
const years = [...new Set(rest.map((p) => p.date.slice(0, 4)))];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="bg-noche">
        <PageHero
          title="Blog"
          lead={`Historias de la escuela, de la danza y de nuestros festivales: ${posts.length} artículos escritos entre 2014 y 2018, de las zapatillas de punta al ballet en los Juegos Olímpicos.`}
          photo={toPhoto(featured.cover!, featured.cover!.alt || featured.title)}
          note="desde el estudio"
        >
          <ButtonLink href="#articulos">Empezar a leer</ButtonLink>
        </PageHero>

        <section id="articulos" className="mx-auto max-w-[90rem] scroll-mt-20 px-5 pb-24 pt-10 sm:px-8 lg:pb-36" aria-label="Artículos">
          <div className="border-t border-white/12 pt-12">
            <p className="hand mb-6 text-2xl text-tutu">el más especial</p>
            <PostCard post={featured} large />
          </div>

          {years.map((year) => (
            <div key={year} className="year-row mt-20 grid gap-10 border-t border-white/12 pt-12 lg:mt-28 lg:grid-cols-[15rem_1fr]">
              <p className="year-outline display w-fit text-[clamp(3.8rem,6.2vw,6rem)] leading-[0.85] lg:sticky lg:top-28 lg:self-start" aria-hidden="true">
                {year}
              </p>
              <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
                {rest
                  .filter((p) => p.date.startsWith(year))
                  .map((post, i) => (
                    <PostCard key={post.slug} post={post} delay={(i % 3) * 120} />
                  ))}
              </div>
            </div>
          ))}
        </section>

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
