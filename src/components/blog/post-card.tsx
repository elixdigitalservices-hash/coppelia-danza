import Link from "next/link";
import { StageImage } from "@/components/fx/stage-image";
import { formatDate, readingMinutes, toPhoto, type Article } from "@/data/blog";
import { photos } from "@/data/site";
import { cn } from "@/lib/utils";

/** Tarjeta de artículo: la portada se abre como un telón y, al pasar el ratón, el titular se subraya con luz. */
export function PostCard({ post, large = false, delay = 0 }: { post: Article; large?: boolean; delay?: number }) {
  const cover = post.cover ? toPhoto(post.cover, post.cover.alt || post.title) : photos.puntas;
  return (
    <Link href={`/blog/${post.slug}`} className={cn("post-card group grid gap-5", large && "lg:grid-cols-12 lg:items-center lg:gap-12")} data-cursor="Leer">
      <StageImage
        photo={{ ...cover, alt: "" }}
        sizes={large ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"}
        className={cn("aspect-[4/3] rounded-[1.25rem]", large && "lg:col-span-7 lg:aspect-[16/10]")}
        imageClassName="transition-[transform,scale] duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        delay={delay}
      />
      <div className={cn(large && "lg:col-span-5")}>
        <p className="flex items-center gap-3 text-sm text-white/50">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(post)} min de lectura</span>
        </p>
        <h3 className={cn("display mt-3 text-balance", large ? "text-[clamp(2.4rem,4.4vw,4.2rem)]" : "text-[clamp(1.7rem,2.3vw,2.2rem)] leading-[1.02]")}>
          <span className="post-card-title">{post.title}</span>
        </h3>
        <p className={cn("mt-3 leading-relaxed text-white/60", large ? "text-lg" : "line-clamp-3")}>{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-tutu">
          Leer artículo
          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
