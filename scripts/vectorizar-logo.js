// Vectoriza el logo antiguo (PNG de 173 px) con potrace. Uso: node scripts/vectorizar-logo.js "$PWD" <carpeta-temporal>
const path = require("path");
const P = process.argv[2], S = process.argv[3];
const sharp = require(path.join(P, "node_modules/sharp"));
const potrace = require(path.join(P, "node_modules/potrace"));
(async () => {
  const src = path.join(P, "Fotos originales/web-antigua/coppelia_transp_bl.png");
  const scale = 8;
  // alpha channel = line art; render black lines on white, upscale smoothly, then threshold
  const alpha = await sharp(src).extractChannel("alpha").negate().toBuffer();
  const meta = await sharp(src).metadata();
  const big = await sharp(alpha, { raw: undefined })
    .resize(meta.width * scale, meta.height * scale, { kernel: "lanczos3" })
    .blur(2.6)
    .threshold(200)
    .png()
    .toBuffer();
  await sharp(big).toFile(path.join(S, "logo_big.png"));
  potrace.trace(big, { turdSize: 60, optTolerance: 0.4, alphaMax: 1.1, threshold: 128 }, (err, svg) => {
    if (err) throw err;
    require("fs").writeFileSync(path.join(S, "logo_trace.svg"), svg);
    console.log(svg.length, svg.slice(0, 300));
  });
})();
