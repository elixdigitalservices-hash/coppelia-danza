// Prepara las fotos, programas, carteles y miniaturas de vídeo de los festivales (página /alumnos)
// y genera src/data/festival-photos.ts con sus medidas reales.
// Uso: node scripts/festivales.js "$PWD"
const path = require("path"), fs = require("fs");
const [P] = process.argv.slice(2);
const sharp = require(path.join(P, "node_modules/sharp"));
const O = path.join(P, "Fotos originales");
const OUT = path.join(P, "public/media/festivales");
const BDLC = "Blanca de la Cruz";
const MH = "Millán Herce";

// [origen en "Fotos originales/", salida, alt, tono, crédito]  tono: "color" escenario, "papel" programas y carteles
const jobs = [
  ["festivales/2016_09_Programa-Coppelia-88.jpeg", "1988-programa.jpg", "Programa de mano del festival de fin de curso de 1988, en el salón de actos del Colegio Inmaculada", "papel"],
  ["festivales/2016_09_Programa-Coppelia-95-2.jpeg", "1995-programa.jpg", "Programa de mano del festival de fin de curso en el Gran Teatro, 27 de junio de 1995", "papel"],
  ["festivales/2016_09_Programa-Coppelia-2005.jpeg", "2005-programa.jpg", "Programa de mano del festival de fin de curso en el Gran Teatro, 18 de junio de 2005", "papel"],

  ["festivales/2014_03_LUNES-35.jpg", "2008-cordoba-1.jpg", "Gran grupo de bailarinas con vestuario de colores bajo luz rosa y azul", "color"],
  ["festivales/2014_03_LUNES-65.jpg", "2008-cordoba-2.jpg", "Cuerpo de baile con tutús y arcos de flores en fila", "color"],
  ["festivales/2014_03_LUNES-41.jpg", "2008-cordoba-3.jpg", "Bailarinas con tutú blanco ante el telón abierto", "color"],
  ["festivales/2014_03_LUNES-3.jpg", "2008-cordoba-4.jpg", "Las más pequeñas con faldas amarillas ante un decorado de palacio", "color"],
  ["festivales/2014_03_LUNES-74.jpg", "2008-cordoba-5.jpg", "Bailarinas con aros de flores en el escenario", "color"],
  ["festivales/2014_03_LUNES-19.jpg", "2008-cordoba-6.jpg", "Bailarinas de vestido azul en una coreografía lírica", "color"],
  ["festivales/2014_03_LUNES-67.jpg", "2008-cordoba-7.jpg", "Fila de bailarinas con tutú rosa en arabesque", "color"],

  ["festivales/2014_03_DSC_7423.jpg", "2010-cordoba-1.jpg", "Saludo final con todo el elenco, de las más pequeñas a las mayores", "color"],
  ["festivales/2014_03_DSC_7369-2.jpg", "2010-cordoba-2.jpg", "Bailarina sobre una gran flor en el escenario", "color"],

  ["festivales/2014_03_427370_377986572226841_180406637_n.jpg", "2011-cordoba-1.jpg", "Grupo de bailarinas con tutú romántico blanco bajo luz azul", "color"],
  ["festivales/2014_03_263016_232765900082243_2250044_n.jpg", "2011-cordoba-2.jpg", "Dos bailarinas con tutú blanco y flor roja", "color", BDLC],
  ["festivales/2014_03_264450_232766060082227_783449_n.jpg", "2011-cordoba-3.jpg", "Bailarina en arabesque sobre un escenario naranja", "color", BDLC],
  ["festivales/2014_03_421447_377976615561170_364280619_n.jpg", "2011-cordoba-4.jpg", "Bailarinas de verde sobre el suelo bajo un haz de luz", "color"],
  ["festivales/2014_03_428911_377976588894506_549146047_n.jpg", "2011-cordoba-5.jpg", "Bailarinas con tutú blanco a contraluz", "color"],
  ["festivales/2014_03_539229_516813855010778_2078257628_n.jpg", "2011-cordoba-6.jpg", "Las pequeñas con tutú azul ante un decorado de bosque", "color"],
  ["festivales/2014_03_395606_377976562227842_94335794_n.jpg", "2011-cordoba-7.jpg", "Bailarinas bajando al patio de butacas por el pasillo central", "color"],

  ["festivales/2014_03_546748_466932059998958_1720221550_n.jpg", "2012-tomares-cartel.jpg", "Cartel del festival de fin de curso de Tomares en el Auditorio Rafael de León, 9 de junio de 2012", "papel"],
  ["festivales/2014_03_487960_493349474023883_408572675_n.jpg", "2012-tomares-1.jpg", "Alumnas con los brazos en alto alrededor de una estantería de juguetes", "color"],
  ["festivales/2014_03_179708_671853656173463_1136633772_n.jpg", "2012-tomares-2.jpg", "Pareja de baile ante un decorado de casita con jardín", "color"],

  ["festivales/2014_03_IMG_54262.jpg", "2012-cordoba-1.jpg", "Bailarina suspendida en un grand jeté con tutú rojo y blanco", "color"],
  ["festivales/2014_03_IMG_52232.jpg", "2012-cordoba-2.jpg", "Tres bailarinas con tutú blanco bordado inclinadas en diagonal", "color"],
  ["festivales/2014_03_IMG_55162.jpg", "2012-cordoba-3.jpg", "Bailarina con tutú rojo y arco en plena variación", "color"],
  ["festivales/2014_03_IMG_55382.jpg", "2012-cordoba-4.jpg", "Pas de deux con vestuario rojo", "color"],
  ["festivales/2014_03_IMG_52752.jpg", "2012-cordoba-5.jpg", "Bailarina en puntas con tutú blanco sobre fondo azul", "color"],
  ["festivales/2014_03_IMG_51252.jpg", "2012-cordoba-6.jpg", "Dos pequeñas bailarinas con tutú azul", "color"],
  ["festivales/2014_03_IMG_54652.jpg", "2012-cordoba-7.jpg", "Una niña sentada en el escenario con los brazos en alto", "color"],
  ["festivales/2014_03_IMG_53962.jpg", "2012-cordoba-8.jpg", "Bailarinas con tutú verde ante un decorado de jardín", "color"],
  ["festivales/2014_03_IMG_56782.jpg", "2012-cordoba-9.jpg", "Bailarinas con tutú dorado en una escena egipcia", "color"],
  ["festivales/2014_03_IMG_57412.jpg", "2012-cordoba-10.jpg", "Las pequeñas en fila con tutú azul claro", "color"],
  ["festivales/2014_03_IMG_53591.jpg", "2012-cordoba-11.jpg", "Bailarina de negro bajo luz azul", "color"],
  ["festivales/2014_03_392251_504503886241775_1713513184_n1.jpg", "2012-cordoba-12.jpg", "Saludo final ante un decorado egipcio", "color"],

  ["festivales/2014_03_996172_676604849031677_1421209377_n2.jpg", "2013-cordoba-1.jpg", "El patio de butacas del Gran Teatro lleno, visto desde el escenario, con la palabra «Gracias»", "color"],
  ["festivales/2014_03_maria-rojo-1-f-buena-calidad3.jpg", "2013-cordoba-2.jpg", "Bailarinas con vestido rojo de encaje recostadas en el suelo", "color", BDLC],
  ["festivales/2014_03_lorena-rojo-1-f-fb3.jpg", "2013-cordoba-3.jpg", "Bailarina de rojo con abanico entre sus compañeras", "color", BDLC],
  ["festivales/2014_03_ffc-20132.jpg", "2013-cordoba-4.jpg", "Bailarina con vestido dorado ante una cuna, rodeada de compañeras", "color"],
  ["festivales/2014_03_1014395_680672688624893_1528712424_n2.jpg", "2013-cordoba-5.jpg", "Foto de grupo de las mayores con vestuario rojo y ramos de flores", "color"],
  ["festivales/2014_03_947241_684795334879295_1663174986_n2.jpg", "2013-cordoba-6.jpg", "Alumnas esperando su turno entre bambalinas", "color"],

  ["festivales/2014_05_FestivalTomares.jpg", "2014-tomares-cartel.jpg", "Cartel del festival de fin de curso de Tomares en el Auditorio Rafael de León, 14 de junio de 2014", "papel"],
  ["festivales/2014_06_Coppelia-Ballet-Tomares-3.jpg", "2014-tomares-1.jpg", "Bailarinas con faldas azules de vuelo", "color"],
  ["festivales/2014_06_Coppelia-Ballet-Tomares-1.jpg", "2014-tomares-2.jpg", "Cuatro alumnas con tutús de colores y delantal", "color"],
  ["festivales/2014_06_Coppelia-Ballet-Tomares-2.jpg", "2014-tomares-3.jpg", "Niños y niñas vestidos de blanco frente a una bailarina", "color"],

  ["festivales/2014_05_FestivalCordoba.jpg", "2014-cordoba-cartel.jpg", "Cartel del festival de fin de curso en el Gran Teatro, 25 de junio de 2014", "papel"],
  ["festivales/2014_06_Coppelia-Festival-Cordoba-Ballet.jpg", "2014-cordoba-1.jpg", "Grupo de bailarinas con tutú blanco en arabesque", "color"],
  ["festivales/2014_06_Festival-Coppelia-Baile-Cordoba.jpg", "2014-cordoba-2.jpg", "Baile de cintas alrededor de un mayo con vestidos de colores", "color"],
  ["festivales/2014_06_Coppelia-Cordoba-Ballet-Baile.jpg", "2014-cordoba-3.jpg", "Tres bailarinas de lila en diagonal", "color"],

  ["festivales/2015_06_Cordoba-1.jpg", "2015-cordoba-1.jpg", "Saludo final de los 170 alumnos ante un decorado del Taj Mahal", "color", BDLC],
  ["festivales/2016_09_0554.jpg", "2015-cordoba-2.jpg", "El elenco ante el Taj Mahal en el Gran Teatro", "color", MH],
  ["festivales/2015_06_Cordoba-4.jpg", "2015-cordoba-3.jpg", "Bailarinas con diadema dorada frente al espejo del camerino", "color", BDLC],
  ["festivales/2015_06_Cordoba-2.jpg", "2015-cordoba-4.jpg", "Una bailarina se coloca la diadema antes de salir a escena", "color", BDLC],
  ["festivales/2015_06_Cordoba-5.jpg", "2015-cordoba-5.jpg", "Todo el elenco sobre el escenario al final de la función", "color", BDLC],
  ["festivales/2015_06_Ensayo-Cordoba-2015-3.jpg", "2015-cordoba-6.jpg", "Ensayo en el estudio: alumnas en puntas junto a la barra", "color", BDLC],
  ["festivales/2015_06_Ensayo-Córdoba-2015-1.jpg", "2015-cordoba-7.jpg", "Ensayo en el estudio frente al espejo", "color", BDLC],

  ["festivales/2016_09_Programa-Coppelia-2015.jpeg", "2015-sevilla-programa.jpg", "Programa de mano del festival en el Teatro Central, 25 de junio de 2015", "papel"],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-32.jpg", "2015-sevilla-1.jpg", "Bailarinas de azul con faldas de vuelo en el Teatro Central", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-149.jpg", "2015-sevilla-2.jpg", "Tres hadas con alas y varita", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-156.jpg", "2015-sevilla-3.jpg", "Una pequeña dentro de una flor gigante", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-107.jpg", "2015-sevilla-4.jpg", "Grupo de bailarinas con tutú blanco y los brazos en alto", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-473.jpg", "2015-sevilla-5.jpg", "Bailarina en arabesque sobre puntas", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-118.jpg", "2015-sevilla-6.jpg", "Dos niños con pantalón naranja bailando en el suelo", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-169.jpg", "2015-sevilla-7.jpg", "Hadas con tutú rosa saludando", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-232.jpg", "2015-sevilla-8.jpg", "Dos hadas de lila con varita", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-240.jpg", "2015-sevilla-9.jpg", "Hadas de azul con alas", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-312.jpg", "2015-sevilla-10.jpg", "Bailarinas de lila en diagonal", "color", MH],
  ["festivales/2016_09_2015-COPPELIA-SEVILLA-57.jpg", "2015-sevilla-11.jpg", "Dos pequeñas con tutú marrón", "color", MH],
  ["festivales/2015_06_General-Tomares-2015-5.jpg", "2015-sevilla-12.jpg", "Ensayo general de Tomares en el estudio", "color", BDLC],

  ["festivales/2015_06_Gran-Teatro.jpg", "teatro-gran-teatro.jpg", "El patio de butacas y los palcos del Gran Teatro de Córdoba, vistos desde el escenario", "color"],
  ["festivales/2015_06_Teatro_Central.jpg", "teatro-central.jpg", "El patio de butacas del Teatro Central de Sevilla, visto desde el escenario", "color"],
];

// Vídeos de los festivales: la miniatura se descarga una vez a "Fotos originales/videos/".
const videos = [
  ["youtube", "NYmfuqMyFoM", "Resumen de los festivales 2015 y 2016"],
  ["youtube", "CtoMeWhDsek", "Promo del festival 2019"],
  ["youtube", "ocauoqqhTpA", "Resumen del festival de Sevilla 2016"],
  ["youtube", "iSUwrJZQ7V8", "Resumen del festival de Córdoba 2016"],
  ["youtube", "tTZqwjyRJT0", "Resumen del festival de Sevilla 2015"],
  ["vimeo", "132374650", "Ensayo en el Teatro Central 2015"],
  ["youtube", "aHJshKHVXCs", "Resumen del festival de Córdoba 2015"],
  ["vimeo", "105322651", "Previa del festival de Córdoba 2014"],
  ["vimeo", "104182708", "Ensayo del festival de Tomares 2014"],
  ["vimeo", "100585810", "El ensayo de Tomares 2014, en fotos"],
  ["vimeo", "95254375", "Tráiler de los festivales 2014"],
  ["youtube", "_dmWsGxiQz0", "Ensayo del festival de Córdoba 2013"],
  ["youtube", "_8RXgjAji9I", "Backstage del festival de Córdoba 2013"],
  ["youtube", "B5VCqBc29vA", "Ensayo de fin de curso 2013"],
  ["vimeo", "85270322", "Somos danza"],
];

async function poster(provider, id) {
  const dir = path.join(O, "videos");
  const file = path.join(dir, `${id}.jpg`);
  if (fs.existsSync(file)) return file;
  fs.mkdirSync(dir, { recursive: true });
  let urls;
  if (provider === "youtube") urls = ["maxresdefault", "sddefault", "hqdefault"].map((q) => `https://i.ytimg.com/vi/${id}/${q}.jpg`);
  else {
    const meta = await (await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1280`)).json();
    urls = [meta.thumbnail_url.replace(/_\d+x\d+/, "_1280"), meta.thumbnail_url];
  }
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) continue;
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    return file;
  }
  throw new Error(`Sin miniatura para ${provider} ${id}`);
}

async function develop(src, out, tone) {
  const meta = await sharp(src).metadata();
  const long = Math.max(meta.width, meta.height);
  // Las fotos pequeñas de la web antigua se suben con cuidado hasta 1000 px; las grandes se quedan en 1600.
  const target = long < 1000 ? 1000 : Math.min(1600, long);
  let pipe = sharp(src).rotate().resize({ width: target, height: target, fit: "inside", kernel: "lanczos3" });
  if (tone === "color") pipe = pipe.normalise({ lower: 0.4, upper: 99.7 }).modulate({ saturation: 1.08 }).linear(1.03, -3);
  if (tone === "papel") pipe = pipe.normalise({ lower: 0.3, upper: 99.8 });
  pipe = pipe.sharpen(long < 1000 ? { sigma: 1, m1: 0.7, m2: 2.2 } : { sigma: 0.6, m1: 0.5, m2: 1.4 });
  return pipe.jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(path.join(OUT, out));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const shots = {};
  for (const [src, out, alt, tone, credit] of jobs) {
    const info = await develop(path.join(O, src), out, tone);
    shots[out] = { width: info.width, height: info.height, alt, ...(credit ? { credit } : null) };
    console.log(out, `${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB");
  }
  for (const [provider, id, title] of videos) {
    const out = `video-${id}.jpg`;
    const src = await poster(provider, id);
    const info = await develop(src, out, "color");
    shots[out] = { width: info.width, height: info.height, alt: `Fotograma del vídeo «${title}»` };
    console.log(out, `${info.width}x${info.height}`);
  }
  const body = Object.entries(shots)
    .map(([file, s]) => `  ${JSON.stringify(file)}: ${JSON.stringify(s).replace(/"(\w+)":/g, "$1: ")},`)
    .join("\n");
  fs.writeFileSync(
    path.join(P, "src/data/festival-photos.ts"),
    `// Generado por scripts/festivales.js: medidas reales de las fotos de public/media/festivales.\n\nexport type Shot = { width: number; height: number; alt: string; credit?: string };\n\nexport const festivalShots: Record<string, Shot> = {\n${body}\n};\n`,
  );
})();
