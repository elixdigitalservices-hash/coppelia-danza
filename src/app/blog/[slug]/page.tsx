import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoScreen } from "@/components/alumnos/video-screen";
import { PostCard } from "@/components/blog/post-card";
import { Footer } from "@/components/footer";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { RevealText } from "@/components/fx/reveal-text";
import { StageImage } from "@/components/fx/stage-image";
import { Header } from "@/components/header";
import { formatDate, postBySlug, posts, readingMinutes, toPhoto, toVideo, type Block } from "@/data/blog";
import type { CSSProperties } from "react";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: post.cover ? { images: [{ url: post.cover.src, width: post.cover.width, height: post.cover.height }] } : undefined,
  };
}

function Content({ block, first }: { block: Block; first: boolean }) {
  switch (block.type) {
    case "p":
      return <p className={first ? "drop-cap" : undefined} dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "h":
      return <h2 className="display !mt-14 text-[clamp(1.9rem,3vw,2.6rem)] text-white" dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "quote":
      return <blockquote className="display !my-12 border-l-2 border-tutu pl-6 text-[clamp(1.6rem,2.6vw,2.2rem)] italic leading-[1.15] text-white" dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={block.ordered ? "list-decimal pl-6" : "list-disc pl-6"}>
          {block.items.map((item, i) => (
            <li key={i} className="mt-2" dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </List>
      );
    }
    case "img":
      return (
        <figure className="!my-12">
          <StageImage photo={toPhoto(block, block.alt)} natural sizes="(min-width: 1024px) 52rem, 100vw" className="mx-auto max-h-[85svh] rounded-xl" />
          {block.caption && <figcaption className="mt-3 text-center text-sm text-white/50" dangerouslySetInnerHTML={{ __html: block.caption }} />}
        </figure>
      );
    case "video":
      return (
        <figure className="!my-12">
          <VideoScreen video={toVideo(block)} sizes="(min-width: 1024px) 52rem, 100vw" className="rounded-xl" />
          {block.caption && <figcaption className="mt-3 text-center text-sm text-white/50" dangerouslySetInnerHTML={{ __html: block.caption }} />}
        </figure>
      );
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();

  const index = posts.indexOf(post);
  const more = [posts[index + 1], posts[index - 1], posts[index + 2]].filter(Boolean).slice(0, 2);
  const firstParagraph = post.blocks.findIndex((b) => b.type === "p");

  return (
    <>
      <Header />
      <main className="bg-noche">
        <article>
          <header className="relative overflow-hidden pt-[4.5rem]" style={{ "--sx": "50%", "--sy": "40%", "--sr": 1.3 } as CSSProperties}>
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(circle min(90vw, 46rem) at 50% 40%, rgba(255,241,208,0.08), transparent 70%)" }}
              aria-hidden="true"
            >
              <DustCanvas count={50} />
            </div>
            <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-12 text-center sm:px-8 lg:pt-20">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-tutu">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                Blog
              </Link>
              <h1 className="display mt-6 text-balance text-[clamp(2.8rem,7vw,6.2rem)]">
                <RevealText text={post.title} delay={150} stagger={18} />
              </h1>
              <p className="mt-6 flex items-center justify-center gap-3 text-sm text-white/55">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{readingMinutes(post)} min de lectura</span>
              </p>
            </div>
            {post.cover && (
              <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
                <StageImage photo={toPhoto(post.cover, post.cover.alt || post.title)} natural priority sizes="(min-width: 1152px) 72rem, 100vw" className="mx-auto max-h-[78svh] rounded-[1.5rem]" delay={250} />
              </div>
            )}
          </header>

          <div className="article-body mx-auto max-w-[44rem] px-5 pb-24 pt-14 text-lg leading-[1.75] text-white/75 sm:px-8 lg:pt-20">
            {post.blocks.map((block, i) => (
              <Content key={i} block={block} first={i === firstParagraph} />
            ))}
            <p className="hand !mt-14 text-2xl text-tutu">Studio de Danza Coppelia</p>
          </div>
        </article>

        {more.length > 0 && (
          <section className="mx-auto max-w-[90rem] border-t border-white/12 px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="sigue-leyendo">
            <h2 id="sigue-leyendo" className="display text-[clamp(2.4rem,5vw,4rem)]">
              <RevealText text="Sigue leyendo." />
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2">
              {more.map((p, i) => (
                <PostCard key={p.slug} post={p} delay={i * 120} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
