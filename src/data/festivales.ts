// Festivales de fin de curso. Fuentes: galería, blog y programas de mano de coppeliadanza.com (web antigua)
// y los canales de YouTube y Vimeo de la escuela (nov. 2026). Las fotos salen de scripts/festivales.js.
import { festivalShots } from "@/data/festival-photos";
import { photos, type Photo } from "@/data/site";

const shot = (file: string, focus = "50% 50%"): Photo => {
  const s = festivalShots[file];
  if (!s) throw new Error(`Falta la foto ${file}: ejecuta scripts/festivales.js`);
  return { src: `/media/festivales/${file}`, alt: s.alt, width: s.width, height: s.height, focus, credit: s.credit };
};

const shots = (prefix: string, count: number) => Array.from({ length: count }, (_, i) => shot(`${prefix}-${i + 1}.jpg`));

export type Video = { provider: "youtube" | "vimeo"; id: string; title: string; poster: Photo };

const video = (provider: Video["provider"], id: string, title: string): Video => ({ provider, id, title, poster: shot(`video-${id}.jpg`) });

export const videoSrc = (v: Video) =>
  v.provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`;

export const videoUrl = (v: Video) => (v.provider === "youtube" ? `https://www.youtube.com/watch?v=${v.id}` : `https://vimeo.com/${v.id}`);

export type VenueSlug = "gran-teatro" | "teatro-central" | "rafael-de-leon" | "colegio-inmaculada";

export type Venue = { slug: VenueSlug; name: string; place: string; body: string; photo?: Photo };

export const venues: Venue[] = [
  {
    slug: "gran-teatro",
    name: "Gran Teatro de Córdoba",
    place: "Córdoba",
    body: "Durante años, cada junio, nuestros alumnos de Córdoba cerraron el curso sobre sus tablas. Encontrarnos todos allí se convirtió en una tradición: una inmensa reunión familiar.",
    photo: shot("teatro-gran-teatro.jpg", "50% 60%"),
  },
  {
    slug: "teatro-central",
    name: "Teatro Central",
    place: "Sevilla · Isla de la Cartuja",
    body: "Desde 2015, el escenario de nuestros alumnos de Tomares: un espacio único, moderno y versátil donde expresarse como más les gusta, bailando.",
    photo: shot("teatro-central.jpg", "50% 55%"),
  },
  {
    slug: "rafael-de-leon",
    name: "Auditorio Municipal Rafael de León",
    place: "Tomares",
    body: "La casa de los festivales de Tomares en sus primeros años, a pocos minutos del estudio.",
  },
  {
    slug: "colegio-inmaculada",
    name: "Salón de actos del Colegio Inmaculada",
    place: "Córdoba",
    body: "El programa más antiguo que guardamos: un festival a beneficio de las misiones, cuando aún nos llamábamos Studio de Ballet Coppelia.",
  },
];

export type Festival = {
  id: string;
  year: number;
  title: string;
  /** Centro de la escuela que sube a escena. */
  centre?: "Córdoba" | "Tomares";
  venue?: VenueSlug;
  date?: string;
  facts?: string[];
  note?: string;
  /** Programa de mano o cartel, si lo guardamos. */
  print?: { photo: Photo; kind: "Programa de mano" | "Cartel" };
  photos: Photo[];
  videos: Video[];
};

// De la más reciente a la más antigua.
export const festivals: Festival[] = [
  {
    id: "2023-tomares",
    year: 2023,
    title: "Gala Coppelia Tomares",
    centre: "Tomares",
    note: "La gala de fin de curso de Tomares, en dos partes.",
    photos: [photos.escenaAzul, photos.escenaTutus],
    videos: [],
  },
  {
    id: "2019",
    year: 2019,
    title: "Festival de fin de curso",
    note: "Así anunciábamos el festival: nervios, camerinos y muchas ganas de salir a escena.",
    photos: [],
    videos: [video("youtube", "CtoMeWhDsek", "Promo del festival 2019")],
  },
  {
    id: "2016-sevilla",
    year: 2016,
    title: "Festival de fin de curso",
    centre: "Tomares",
    venue: "teatro-central",
    date: "domingo 26 de junio",
    facts: ["90 alumnos"],
    note: "Un punto y final al curso lleno de ilusión y pasión por la danza.",
    photos: [],
    videos: [video("youtube", "ocauoqqhTpA", "Resumen del festival de Sevilla 2016")],
  },
  {
    id: "2016-cordoba",
    year: 2016,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    venue: "gran-teatro",
    date: "jueves 23 de junio",
    facts: ["Más de 150 alumnos"],
    note: "Una tarde mágica de amor por la danza.",
    photos: [],
    videos: [video("youtube", "iSUwrJZQ7V8", "Resumen del festival de Córdoba 2016")],
  },
  {
    id: "2015-sevilla",
    year: 2015,
    title: "Festival de fin de curso",
    centre: "Tomares",
    venue: "teatro-central",
    date: "jueves 25 de junio · 20:00 h",
    note: "La primera vez de Tomares en el Teatro Central, en la Isla de la Cartuja.",
    print: { photo: shot("2015-sevilla-programa.jpg"), kind: "Programa de mano" },
    photos: shots("2015-sevilla", 12),
    videos: [video("youtube", "tTZqwjyRJT0", "Resumen del festival de Sevilla 2015"), video("vimeo", "132374650", "Ensayo en el Teatro Central 2015")],
  },
  {
    id: "2015-cordoba",
    year: 2015,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    venue: "gran-teatro",
    date: "martes 23 de junio",
    facts: ["170 alumnos", "Casi 900 espectadores"],
    note: "Al final, el saludo: el aplauso como recompensa y 170 sonrisas como premio.",
    photos: shots("2015-cordoba", 7),
    videos: [video("youtube", "aHJshKHVXCs", "Resumen del festival de Córdoba 2015")],
  },
  {
    id: "2014-cordoba",
    year: 2014,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    venue: "gran-teatro",
    date: "miércoles 25 de junio · 20:00 h",
    note: "Encontrarnos todos en el Gran Teatro cada año se ha convertido en una tradición.",
    print: { photo: shot("2014-cordoba-cartel.jpg"), kind: "Cartel" },
    photos: shots("2014-cordoba", 3),
    videos: [video("vimeo", "105322651", "Previa del festival de Córdoba 2014")],
  },
  {
    id: "2014-tomares",
    year: 2014,
    title: "Festival de fin de curso",
    centre: "Tomares",
    venue: "rafael-de-leon",
    date: "sábado 14 de junio · 20:00 h",
    note: "Gracias a los alumnos, el alma de la escuela; a los profesores, su motor; y a los padres.",
    print: { photo: shot("2014-tomares-cartel.jpg"), kind: "Cartel" },
    photos: shots("2014-tomares", 3),
    videos: [
      video("vimeo", "104182708", "Ensayo del festival de Tomares 2014"),
      video("vimeo", "100585810", "El ensayo de Tomares 2014, en fotos"),
      video("vimeo", "95254375", "Tráiler de los festivales 2014"),
    ],
  },
  {
    id: "2013-cordoba",
    year: 2013,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    venue: "gran-teatro",
    note: "«Gracias»: el Gran Teatro lleno, visto desde el escenario.",
    photos: shots("2013-cordoba", 6),
    videos: [video("youtube", "_dmWsGxiQz0", "Ensayo del festival de Córdoba 2013"), video("youtube", "_8RXgjAji9I", "Backstage del festival de Córdoba 2013")],
  },
  {
    id: "2013-tomares",
    year: 2013,
    title: "Fin de curso",
    centre: "Tomares",
    photos: [],
    videos: [video("youtube", "B5VCqBc29vA", "Ensayo de fin de curso 2013")],
  },
  {
    id: "2012-cordoba",
    year: 2012,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    photos: shots("2012-cordoba", 12),
    videos: [],
  },
  {
    id: "2012-tomares",
    year: 2012,
    title: "Festival de fin de curso",
    centre: "Tomares",
    venue: "rafael-de-leon",
    date: "sábado 9 de junio · 20:00 h",
    note: "El centro de Tomares, abierto en 2011, cierra el curso en el auditorio del pueblo.",
    print: { photo: shot("2012-tomares-cartel.jpg"), kind: "Cartel" },
    photos: shots("2012-tomares", 2),
    videos: [],
  },
  {
    id: "2011-cordoba",
    year: 2011,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    photos: shots("2011-cordoba", 7),
    videos: [],
  },
  {
    id: "2010-cordoba",
    year: 2010,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    photos: shots("2010-cordoba", 2),
    videos: [],
  },
  {
    id: "2008-cordoba",
    year: 2008,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    photos: shots("2008-cordoba", 7),
    videos: [],
  },
  {
    id: "2005-cordoba",
    year: 2005,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    venue: "gran-teatro",
    date: "sábado 18 de junio · 20:30 h",
    note: "En la portada del programa, Cristina López y Marta Camino.",
    print: { photo: shot("2005-programa.jpg"), kind: "Programa de mano" },
    photos: [],
    videos: [],
  },
  {
    id: "1995-cordoba",
    year: 1995,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    venue: "gran-teatro",
    date: "martes 27 de junio · 21:00 h",
    note: "En la portada del programa, Lucía Rodríguez.",
    print: { photo: shot("1995-programa.jpg"), kind: "Programa de mano" },
    photos: [],
    videos: [],
  },
  {
    id: "1988-cordoba",
    year: 1988,
    title: "Festival de fin de curso",
    centre: "Córdoba",
    venue: "colegio-inmaculada",
    date: "sábado 7 de mayo · 7 de la tarde",
    note: "A beneficio de las misiones, cuando aún éramos Studio de Ballet Coppelia.",
    print: { photo: shot("1988-programa.jpg"), kind: "Programa de mano" },
    photos: [],
    videos: [],
  },
];

/** Resumen de los festivales de 2015 y 2016 en el Gran Teatro y el Teatro Central. */
export const featuredFilm = video("youtube", "NYmfuqMyFoM", "Resumen de los festivales 2015 y 2016");

/** «Somos danza» (2014): un día de clases en Coppelia. */
export const somosDanza = video("vimeo", "85270322", "Somos danza");

export const venueOf = (slug?: VenueSlug) => venues.find((v) => v.slug === slug);

export const festivalsAt = (slug: VenueSlug) => festivals.filter((f) => f.venue === slug).sort((a, b) => a.year - b.year);
