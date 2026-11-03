// Artículos del blog de la web antigua (2014–2018). Generado por scripts/blog.js en src/data/blog.json.
import articles from "@/data/blog.json";
import type { Video } from "@/data/festivales";
import type { Photo } from "@/data/site";

type Image = { src: string; width: number; height: number };

export type Block =
  | { type: "p" | "h" | "quote"; html: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | ({ type: "img"; alt: string; caption: string } & Image)
  | { type: "video"; provider: "youtube" | "vimeo"; id: string; title: string; poster: Image; caption?: string };

export type Article = { slug: string; title: string; date: string; excerpt: string; cover: (Image & { alt: string }) | null; blocks: Block[] };

export const posts = articles as Article[];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export const toPhoto = (image: Image, alt = ""): Photo => ({ ...image, alt, focus: "50% 50%" });

export const toVideo = (block: Extract<Block, { type: "video" }>): Video => ({
  provider: block.provider,
  id: block.id,
  title: block.title,
  poster: toPhoto(block.poster),
});

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

/** Minutos de lectura a 200 palabras por minuto. */
export const readingMinutes = (post: Article) => {
  const words = post.blocks
    .map((b) => ("html" in b ? b.html : "items" in b ? b.items.join(" ") : ""))
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
