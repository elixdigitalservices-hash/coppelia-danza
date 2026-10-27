// Revela las fotos de la web desde "Fotos originales/" (niveles, contraste, color, nitidez) y genera sus fondos desenfocados.
// Uso: node scripts/revelar-fotos.js "$PWD" public/media/photos [nombre1.jpg,nombre2.jpg]
const path = require("path"), fs = require("fs");
const [P, OUTDIR, ONLY] = process.argv.slice(2);
const sharp = require(path.join(P, "node_modules/sharp"));
const O = path.join(P, "Fotos originales");

// [origen, salida, recorte?, tono]  tono: "bn" blanco y negro, "color" escenario, "sepia" deja el tono
const jobs = [
  ["instagram/ig_00_2200x1463.jpg", "escena-arco.jpg", null, "bn"],
  ["instagram/ig_02_2835x2268.jpg", "primeras-puntas.jpg", null, "bn"],
  ["instagram/ig_08_1605x2006.jpg", "dos-bailarinas.jpg", null, "bn"],
  ["instagram/ig_01_1038x1844.jpg", "peques-clase.jpg", null, "bn"],
  ["instagram/ig_03_1098x1952.jpg", "peque-salto.jpg", null, "bn"],
  ["instagram/ig_04_2268x2835.jpg", "barra-centro.jpg", null, "bn"],
  ["instagram/ig_05_2268x2835.jpg", "barra-espejo.jpg", null, "bn"],
  ["instagram/ig_14_2052x1154.jpg", "aula-grande.jpg", null, "bn"],
  ["instagram/ig_15_2071x1164.jpg", "aula-piano.jpg", null, "bn"],
  ["instagram/ig_17_1080x1350.jpg", "clasico-arabesque.jpg", { left: 0, top: 330, width: 950, height: 870 }, "bn"],
  ["instagram/ig_18_1080x1350.jpg", "ballet-fitness.jpg", { left: 180, top: 0, width: 780, height: 880 }, "bn"],
  ["instagram/ig_19_1080x1350.jpg", "contemporanea.jpg", { left: 0, top: 346, width: 1080, height: 782 }, "bn"],
  ["instagram/ig_20_1080x1350.jpg", "pilates-barra.jpg", { left: 190, top: 0, width: 890, height: 740 }, "bn"],
  ["web-antigua/foto-3-copia-1.jpg", "clase-barra-bn.jpg", null, "bn"],
  ["web-antigua/foto-124w.jpg", "escena-azul.jpg", null, "color"],
  ["web-antigua/foto-151w.jpg", "escena-tutus.jpg", null, "color"],
  ["web-antigua/IMG_5516.jpg", "escena-arqueras.jpg", null, "color"],
  ["web-antigua/IMG_0406-e1486288458823.jpg", "estiramiento-bn.jpg", null, "bn"],
  ["web-antigua/lorena-rojo-1-f-fb.jpg", "escena-rojo.jpg", null, "color"],
  ["web-antigua/LUNES-35.jpg", "escena-final.jpg", null, "color"],
  ["web-antigua/DSC_7423.jpg", "escena-teatro.jpg", null, "color"],
  ["web-antigua/263016_232765900082243_2250044_n.jpg", "escena-pareja.jpg", null, "color"],
  ["web-antigua/Captura-de-pantalla-2014-03-26-a-las-13.28.28.png", "puntas-bn.jpg", null, "bn"],
  ["web-antigua/Captura-de-pantalla-2014-03-26-a-las-13.31.03.png", "peques-munecas.jpg", null, "sepia"],
  ["web-antigua/Tutu-Converse.jpg", "tutu-converse.jpg", null, "color"],
  ["web-antigua/Recibidor-Tomares.jpg", "recibidor.jpg", null, "color"],
  ["festivales/2014_03_IMG_54262.jpg", "salto-grand-jete.jpg", null, "color"],
  ["festivales/2014_03_IMG_52232.jpg", "escena-blancas.jpg", null, "color"],
  ["festivales/2014_06_Coppelia-Festival-Cordoba-Ballet.jpg", "escena-arabesque.jpg", null, "color"],
];

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  fs.mkdirSync(path.join(OUTDIR, "blur"), { recursive: true });
  for (const [src, out, crop, tone] of jobs) {
    if (ONLY && !ONLY.split(",").includes(out)) continue;
    let img = sharp(path.join(O, src)).rotate();
    if (crop) img = img.extract(crop);
    const meta = await sharp(await img.clone().toBuffer()).metadata();
    // Las fotos pequeñas de la web antigua se suben con cuidado a 1600 px; las grandes se quedan en 2400 como máximo.
    const target = Math.max(meta.width, meta.height) < 1600 ? 1600 : Math.min(2400, Math.max(meta.width, meta.height));
    let pipe = img.resize({ width: target, height: target, fit: "inside", kernel: "lanczos3", withoutEnlargement: false });
    if (tone === "bn") pipe = pipe.grayscale().normalise({ lower: 0.6, upper: 99.6 }).linear(1.07, -7);
    if (tone === "color") pipe = pipe.normalise({ lower: 0.4, upper: 99.7 }).modulate({ saturation: 1.1 }).linear(1.04, -4);
    if (tone === "sepia") pipe = pipe.normalise({ lower: 0.5, upper: 99.5 });
    const upscaled = Math.max(meta.width, meta.height) < 1600;
    pipe = pipe.sharpen(upscaled ? { sigma: 1.1, m1: 0.8, m2: 2.4 } : { sigma: 0.7, m1: 0.5, m2: 1.6 });
    const info = await pipe.jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(path.join(OUTDIR, out));
    // Fondo desenfocado para cuando la foto se muestra entera sobre pantalla completa
    await sharp(path.join(OUTDIR, out)).resize({ width: 480 }).blur(16).modulate({ brightness: 0.75 }).jpeg({ quality: 70 }).toFile(path.join(OUTDIR, "blur", out));
    console.log(out, `${meta.width}x${meta.height} -> ${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB");
  }
})();
