// Trae los artículos del blog de la web antigua (WordPress) con sus imágenes y vídeos
// y genera src/data/blog.json. Las entradas que solo eran un vídeo de festival ya están en /alumnos.
// Uso: node scripts/blog.js "$PWD"
const path = require("path"), fs = require("fs");
const [P] = process.argv.slice(2);
const sharp = require(path.join(P, "node_modules/sharp"));
const API = "https://www.coppeliadanza.com/wp-json/wp/v2";
const OUT = path.join(P, "public/media/blog");
const CACHE = path.join(P, "Fotos originales/blog");
const MIN_TEXT = 600;

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const textOf = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Deja solo negritas, cursivas, saltos y enlaces externos; el resto de etiquetas se quitan. */
function inline(html) {
  let s = html
    .replace(/<(\/?)b\b[^>]*>/g, "<$1strong>")
    .replace(/<(\/?)i\b[^>]*>/g, "<$1em>")
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, inner) =>
      /^https?:\/\//.test(href) && !/coppeliadanza\.com|besbello\.com/.test(href)
        ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`
        : inner,
    )
    .replace(/<(?!\/?(strong|em|br|a)\b)[^>]+>/g, "")
    .replace(/<br\s*\/?>/g, "<br>")
    .replace(/<(strong|em)>\s*<\/\1>/g, "");
  s = decode(s).replace(/ /g, " ").replace(/\s+/g, " ").trim();
  return s.replace(/&(?![a-z]+;|#\d+;)/g, "&amp;");
}

async function download(url, file) {
  const local = path.join(CACHE, file);
  if (!fs.existsSync(local)) {
    const res = await fetch(url.replace(/^http:/, "https:").replace("coppeliadanza.besbello.com", "www.coppeliadanza.com"), { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()));
  }
  const info = await sharp(local)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .sharpen({ sigma: 0.5 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, file.replace(/\.\w+$/, ".jpg")));
  return { src: `/media/blog/${file.replace(/\.\w+$/, ".jpg")}`, width: info.width, height: info.height };
}

async function poster(provider, id, file) {
  const urls =
    provider === "youtube"
      ? ["maxresdefault", "sddefault", "hqdefault"].map((q) => `https://i.ytimg.com/vi/${id}/${q}.jpg`)
      : [(await (await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1280`)).json()).thumbnail_url];
  for (const url of urls) {
    try {
      return await download(url, file);
    } catch {}
  }
  return null;
}

const fullSize = (src) => src.replace(/-\d+x\d+(\.\w+)$/, "$1");

async function blocksOf(post) {
  let html = post.content.rendered.split('<div class="sharedaddy')[0].split('<div id="jp-relatedposts')[0];
  html = html.replace(/\[mc4wp_form[^\]]*\]/g, "").replace(/<\/?(div|span)\b[^>]*>/g, "");
  const raw = html.match(/<(p|h[1-6]|blockquote|ul|ol|iframe)\b[^>]*>[\s\S]*?<\/\1>/g) ?? [];
  const blocks = [];
  let n = 0;
  for (const chunk of raw) {
    const tag = chunk.match(/^<(\w+)/)[1];
    const centered = /text-align:\s*center/.test(chunk.slice(0, 120));
    const img = chunk.match(/<img\b[^>]*src="([^"]+)"[^>]*>/);
    const frame = chunk.match(/<iframe\b[^>]*src="([^"]+)"/);
    const text = textOf(chunk);
    const prev = blocks[blocks.length - 1];

    if (img) {
      const href = chunk.match(/<a\b[^>]*href="([^"]+\.(?:jpe?g|png|gif))"/i);
      const src = fullSize(href ? href[1] : img[1]);
      const alt = textOf((img[0].match(/alt="([^"]*)"/) ?? ["", ""])[1]);
      n += 1;
      try {
        blocks.push({ type: "img", ...(await download(src, `${post.slug}-${n}${path.extname(src)}`)), alt, caption: "" });
      } catch (error) {
        console.warn("  imagen perdida", src, error.message);
      }
      continue;
    }
    if (frame) {
      const yt = frame[1].match(/youtube\.com\/embed\/([\w-]+)/);
      const vm = frame[1].match(/vimeo\.com\/video\/(\d+)/);
      const provider = yt ? "youtube" : vm ? "vimeo" : null;
      if (!provider) continue;
      const id = (yt ?? vm)[1];
      const shot = await poster(provider, id, `video-${id}.jpg`);
      const watch = provider === "youtube" ? `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json` : `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`;
      const title = await fetch(watch).then((r) => (r.ok ? r.json() : {})).then((j) => j.title ?? "Vídeo", () => "Vídeo");
      if (shot) blocks.push({ type: "video", provider, id, title, poster: shot });
      continue;
    }
    if (!text) continue;
    // Pie de foto: un h5/h6 o un párrafo centrado y corto justo debajo de una imagen.
    if (prev && (prev.type === "img" || prev.type === "video") && !prev.caption && (/^h[56]$/.test(tag) || (centered && text.length < 180))) {
      prev.caption = inline(chunk.replace(/^<\w+[^>]*>|<\/\w+>$/g, ""));
      continue;
    }
    const inner = inline(chunk.replace(/^<\w+[^>]*>|<\/\w+>$/g, ""));
    if (/^h[1-6]$/.test(tag)) blocks.push({ type: "h", html: inner });
    else if (tag === "blockquote") blocks.push({ type: "quote", html: inner });
    else if (tag === "ul" || tag === "ol") blocks.push({ type: "list", ordered: tag === "ol", items: (chunk.match(/<li\b[^>]*>[\s\S]*?<\/li>/g) ?? []).map((li) => inline(li.replace(/^<li[^>]*>|<\/li>$/g, ""))) });
    else blocks.push({ type: centered && text.length < 200 ? "quote" : "p", html: inner });
  }
  return blocks;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(CACHE, { recursive: true });
  const posts = await (await fetch(`${API}/posts?per_page=100&categories_exclude=28`, { headers: { "User-Agent": "Mozilla/5.0" } })).json();
  const articles = [];
  for (const post of posts) {
    if (post.content.protected || textOf(post.content.rendered.split('<div class="sharedaddy')[0]).length < MIN_TEXT) {
      console.log("· fuera:", textOf(post.title.rendered));
      continue;
    }
    console.log("+", textOf(post.title.rendered));
    let cover = null;
    if (post.featured_media) {
      const media = await (await fetch(`${API}/media/${post.featured_media}`, { headers: { "User-Agent": "Mozilla/5.0" } })).json();
      if (media.source_url) cover = { ...(await download(media.source_url, `${post.slug}-portada${path.extname(media.source_url)}`)), alt: textOf(media.alt_text || media.title?.rendered || "") };
    }
    const blocks = await blocksOf(post);
    articles.push({
      slug: post.slug,
      title: textOf(post.title.rendered),
      date: post.date.slice(0, 10),
      excerpt: textOf(post.excerpt.rendered).replace(/\s*(Leer más|\[…\]|…)\s*$/, "…"),
      cover,
      blocks,
    });
  }
  fs.writeFileSync(path.join(P, "src/data/blog.json"), JSON.stringify(articles, null, 1));
  console.log(articles.length, "artículos");
})();
