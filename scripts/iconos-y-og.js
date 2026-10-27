// Genera icon.png, apple-icon.png y la imagen para compartir (public/media/og.jpg).
// Uso: node scripts/iconos-y-og.js "$PWD"
const path = require("path"), fs = require("fs");
const P = process.argv[2];
const sharp = require(path.join(P, "node_modules/sharp"));
const logoBlack = fs.readFileSync(path.join(P, "public/media/logo-coppelia.svg"));
const logoWhite = fs.readFileSync(path.join(P, "public/media/logo-coppelia-white.svg"));
(async () => {
  // Iconos: logo negro sobre blanco, como el perfil de Instagram
  for (const [file, size] of [["src/app/icon.png", 512], ["src/app/apple-icon.png", 180]]) {
    const inner = Math.round(size * 0.8);
    const mark = await sharp(logoBlack, { density: 400 }).resize(inner, inner, { fit: "contain", background: "#fff" }).png().toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
      .composite([{ input: mark, gravity: "center" }]).png().toFile(path.join(P, file));
  }
  // OG 1200x630: la bailarina a la izquierda, marca a la derecha
  const W = 1200, H = 630;
  const photo = await sharp(path.join(P, "public/media/photos/salto-grand-jete.jpg")).extract({ left: 120, top: 500, width: 1330, height: 1102 }).resize(760, H, { fit: "cover" }).toBuffer();
  const fade = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="0.66" stop-color="#000" stop-opacity="1"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`);
  const mark = await sharp(logoWhite, { density: 300 }).resize(150, 150, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const text = Buffer.from(`<svg width="${W}" height="${H}">
    <text x="830" y="330" font-family="Helvetica Neue" font-size="15" letter-spacing="6" fill="#ffffffb0">STUDIO DE DANZA</text>
    <text x="826" y="410" font-family="Didot" font-style="italic" font-size="88" fill="#fff">Coppelia</text>
    <text x="830" y="462" font-family="Helvetica Neue" font-size="22" fill="#bfe1f8">Tomares · desde 1986</text>
  </svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#000" } })
    .composite([{ input: photo, left: 0, top: 0 }, { input: fade, left: 0, top: 0 }, { input: mark, left: 826, top: 130 }, { input: text, left: 0, top: 0 }])
    .jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(P, "public/media/og.jpg"));
  console.log("ok");
})();
