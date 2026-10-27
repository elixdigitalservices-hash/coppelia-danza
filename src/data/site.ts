// Datos del negocio. Fuentes: coppeliadanza.com (web antigua) e Instagram @studiodedanzacoppelia (oct. 2026).

// Dominio definitivo de la escuela. Mientras la web viva en otra URL (p. ej. *.vercel.app) se usa esa
// para las imágenes de compartir y no se deja indexar, para no competir con la web antigua.
const FINAL_URL = "https://www.coppeliadanza.com";
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : FINAL_URL);
export const isFinalDomain = new URL(siteUrl).hostname.endsWith("coppeliadanza.com");

export const studio = {
  name: "Studio de Danza Coppelia",
  founded: 1986,
  founder: "Sonsoles Rodríguez de Mondelo",
  phone: "617 319 293",
  phoneHref: "tel:+34617319293",
  landline: "954 155 101",
  landlineHref: "tel:+34954155101",
  email: "web@coppeliadanza.com",
  instagram: "https://www.instagram.com/studiodedanzacoppelia/",
  instagramHandle: "@studiodedanzacoppelia",
  street: "Calle Navarro Caro, 81 · Local 2 y 3",
  postalCode: "41940",
  city: "Tomares",
  region: "Sevilla",
  geo: { lat: 37.37568, lng: -6.05201 },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+Navarro+Caro+81+41940+Tomares+Sevilla",
  mapsEmbed: "https://www.google.com/maps?q=Calle+Navarro+Caro+81,+41940+Tomares,+Sevilla&output=embed",
};

const whatsappNumber = "34617319293";

export function whatsappLink(text = "Hola, me gustaría reservar una clase de prueba en Coppelia.") {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: "/clases", label: "Clases" },
  { href: "/escuela", label: "La escuela" },
  { href: "/contacto", label: "Contacto" },
];

/** focus: punto de interés (object-position) para cuando el marco recorta la foto. */
export type Photo = { src: string; alt: string; width: number; height: number; focus: string; credit?: string };

const photo = (file: string, alt: string, width: number, height: number, focus = "50% 50%", credit?: string): Photo => ({
  src: `/media/photos/${file}`,
  alt,
  width,
  height,
  focus,
  credit,
});

export const photos = {
  arco: photo("escena-arco.jpg", "Bailarina de Coppelia arqueando la espalda sobre un escenario a oscuras", 2200, 1463, "40% 45%"),
  primerasPuntas: photo("primeras-puntas.jpg", "Cinco alumnas sentadas en estrella uniendo sus primeras zapatillas de puntas", 2400, 1920),
  dosBailarinas: photo("dos-bailarinas.jpg", "Dos pequeñas bailarinas con tutú se dan la mano en el escenario", 1605, 2006, "50% 45%"),
  peques: photo("peques-clase.jpg", "Alumnas de Pre-Ballet en clase con las manos en la cintura", 1038, 1844, "55% 32%"),
  pequeSalto: photo("peque-salto.jpg", "Una niña salta sonriendo durante la clase de ballet", 1098, 1952, "52% 35%"),
  barraCentro: photo("barra-centro.jpg", "Alumnas trabajando en la barra frente al espejo", 1920, 2400, "50% 35%"),
  barraEspejo: photo("barra-espejo.jpg", "Alumnas en relevé en la barra del aula grande", 1920, 2400, "50% 32%"),
  aulaGrande: photo("aula-grande.jpg", "Aula de 145 m² con barras, espejos y suelo de danza", 2052, 1154),
  aulaPiano: photo("aula-piano.jpg", "Aula de Coppelia con piano, barras y espejos", 2071, 1164, "40% 50%"),
  clasico: photo("clasico-arabesque.jpg", "Bailarina en arabesque sobre puntas en una función de ballet clásico", 1600, 1465, "58% 40%"),
  fitness: photo("ballet-fitness.jpg", "Bailarín con el brazo en alto en una función", 1418, 1600, "42% 32%"),
  contemporanea: photo("contemporanea.jpg", "Grupo de danza contemporánea en movimiento sobre el escenario", 1600, 1159, "50% 35%"),
  pilates: photo("pilates-barra.jpg", "Alumna estirando apoyada en la barra", 1600, 1330, "35% 35%"),
  claseBN: photo("clase-barra-bn.jpg", "Clase de ballet en blanco y negro", 1600, 835, "60% 45%"),
  escenaAzul: photo("escena-azul.jpg", "Cuatro bailarinas en un grupo escultórico con luz azul", 1800, 1800, "55% 45%"),
  escenaTutus: photo("escena-tutus.jpg", "Corro de bailarinas con tutús de colores en el escenario", 2000, 1333, "45% 55%", "Rafa Núñez Ollero"),
  escenaArqueras: photo("escena-arqueras.jpg", "Bailarina con tutú rojo y arco en plena variación, rodeada de compañeras", 1600, 2400, "50% 45%"),
  escenaRojo: photo("escena-rojo.jpg", "Bailarinas con vestuario rojo de encaje y abanico", 1600, 1067, "45% 45%", "Blanca de la Cruz"),
  escenaFinal: photo("escena-final.jpg", "Grupo de bailarinas con vestidos de colores sobre un escenario iluminado en azul y rosa", 1600, 1066, "50% 72%"),
  escenaTeatro: photo("escena-teatro.jpg", "Función de fin de curso con un gran grupo de alumnas con tutú", 1600, 1063),
  estiramiento: photo("estiramiento-bn.jpg", "Bailarina estirando sobre la barra con los brazos extendidos", 1600, 883, "58% 50%"),
  escenaPareja: photo("escena-pareja.jpg", "Dos bailarinas con tutú blanco y flor roja", 1600, 1387, "55% 40%", "Blanca de la Cruz"),
  puntas: photo("puntas-bn.jpg", "Pies en puntas en blanco y negro", 1600, 998),
  converse: photo("tutu-converse.jpg", "Tutú negro con zapatillas amarillas", 2400, 1832, "50% 70%"),
  // Festival Coppelia Córdoba 2012 y 2014 (galerías de la web antigua)
  salto: photo("salto-grand-jete.jpg", "Bailarina de Coppelia suspendida en el aire en un grand jeté, con tutú rojo y blanco", 1600, 2400, "50% 24%"),
  escenaBlancas: photo("escena-blancas.jpg", "Tres bailarinas con tutú blanco bordado inclinadas en diagonal", 1600, 2400, "55% 35%"),
  escenaArabesque: photo("escena-arabesque.jpg", "Grupo de bailarinas con tutú blanco en arabesque sobre el escenario", 2400, 1464, "48% 50%"),
};

/** Fondo desenfocado de una foto, para mostrarla entera sobre pantalla completa. */
export const blurOf = (p: Photo) => p.src.replace("/media/photos/", "/media/photos/blur/");

export type Discipline = {
  slug: string;
  name: string;
  levels: string;
  line: string;
  body: string;
  points: string[];
  photo: Photo;
};

export const disciplines: Discipline[] = [
  {
    slug: "ballet-clasico",
    name: "Ballet clásico",
    levels: "Pre-Ballet y hasta 7 niveles",
    line: "La base de todos los bailes. Técnica, musicalidad y disciplina desde los 3 años.",
    body: "Es la madre de todas las disciplinas y el centro de nuestra escuela. Empezamos con Pre-Ballet a través del juego, el ritmo y la música, y avanzamos nivel a nivel hasta las puntas, la preparación de exámenes oficiales y el ballet para adultos.",
    points: ["Pre-Ballet de 3 a 6 años", "Niveles básico, elemental y avanzado desde 6 años", "Preparación de pruebas oficiales ACADE", "Ballet para adultos, empieces cuando empieces"],
    photo: photos.clasico,
  },
  {
    slug: "danza-contemporanea",
    name: "Danza contemporánea",
    levels: "Hasta 3 niveles",
    line: "Expresión, suelo y libertad de movimiento sobre una base técnica sólida.",
    body: "Huye de las posiciones rígidas y busca comunicar emociones a través del cuerpo: niveles, suelo, giros y desplazamientos que desafían la verticalidad del clásico. Recomendamos combinarla con ballet para avanzar de verdad.",
    points: ["Tres niveles según edad y experiencia", "Trabajo de suelo, diagonales y saltos", "Ideal combinada con ballet clásico"],
    photo: photos.contemporanea,
  },
  {
    slug: "ballet-fitness",
    name: "Ballet Fitness",
    levels: "Incluye Barre Fit · sin nivel previo",
    line: "Entrena como una bailarina: fuerza, tono y control sin necesidad de saber ballet.",
    body: "Una propuesta inspirada en la técnica del ballet que combina el trabajo en barra con ejercicios fuera de ella. Más completa que el Barre Fit que está de moda, y pensada para disfrutar del movimiento mientras trabajas todo el cuerpo.",
    points: ["Fuerza, tonificación y flexibilidad", "Equilibrio, coordinación y control corporal", "No se requiere nivel de iniciación"],
    photo: photos.fitness,
  },
  {
    slug: "pilates",
    name: "Pilates aplicado a la danza",
    levels: "Todas las edades",
    line: "Conciencia corporal, postura y una espalda fuerte. Para bailarines y para quien no baila.",
    body: "Entrenamiento de bajo impacto que trabaja la musculatura profunda, especialmente del tronco, la respiración y el equilibrio. Ayuda a prevenir lesiones, corrige la postura y mejora el dolor de espalda, por eso encaja con cualquier edad y condición física.",
    points: ["Bajo impacto en las articulaciones", "Corrección postural y prevención del dolor de espalda", "Complemento perfecto para la técnica de danza"],
    photo: photos.pilates,
  },
];

export const audiences = [
  {
    ages: "3–6",
    unit: "años",
    title: "Pre-Ballet",
    body: "Primer contacto con la danza a través del juego, el ritmo y la música. Postura, posiciones de pies y brazos y mucha diversión.",
    photo: photos.peques,
  },
  {
    ages: "6+",
    unit: "años",
    title: "Ballet y contemporáneo",
    body: "Siete niveles de clásico, tres de contemporáneo, las primeras puntas y preparación para pruebas oficiales si hay vocación.",
    photo: photos.primerasPuntas,
  },
  {
    ages: "Adultos",
    unit: "",
    title: "Ballet, Ballet Fitness y Pilates",
    body: "Para retomar o para empezar de cero. Una válvula de escape, ejercicio de calidad y una forma de expresarte.",
    photo: photos.barraCentro,
  },
];

export const milestones = [
  { year: "1986", title: "Se abre el telón", body: "El 27 de septiembre abrimos nuestro primer centro, en Los Chopos (Córdoba), junto a Auxi Vargas." },
  { year: "2013", title: "En el tribunal de ACADE", body: "Sonsoles Rodríguez de Mondelo forma parte del tribunal de las pruebas de nivel de ACADE en 2012 y 2013." },
  { year: "2015", title: "Dos teatros", body: "170 alumnos llenan el Gran Teatro de Córdoba ante casi 900 personas, y Tomares baila por primera vez en el Teatro Central de Sevilla." },
  { year: "2016", title: "Treinta años", body: "Lo celebramos como mejor sabemos: 90 alumnos de Tomares cierran el curso sobre las tablas del Teatro Central." },
  { year: "2017", title: "Nueva casa en Tomares", body: "Inauguramos las instalaciones de la calle Navarro Caro: dos grandes aulas junto a la Avenida del Aljarafe." },
  { year: "2026", title: "40 años en movimiento", body: "Cuatro décadas y generaciones de alumnos: niñas que hoy son profesoras y que nos traen a sus hijos a bailar." },
];

export const values = [
  { name: "Disciplina", body: "Es la base del baile. Para lograr un objetivo hay que ser persistente y trabajar duro." },
  { name: "Igualdad", body: "Todos, sin importar edad, sexo o circunstancias, tenemos derecho a una formación de calidad y a disfrutar de la danza." },
  { name: "Responsabilidad", body: "Puntualidad, respeto y cuidado del material común: valores que ayudan a crecer respetándose a uno mismo y a los demás." },
  { name: "Organización", body: "Nos une el amor por la danza y por compartir lo que sabemos, en una relación de respeto mutuo con el profesorado." },
];

export const facts = [
  { value: "40", label: "años enseñando danza en Córdoba y Sevilla" },
  { value: "+98%", label: "de aprobados en los exámenes de ACADE" },
  { value: "+5.000", label: "bailarines han salido a escena con nosotros" },
  { value: "260 m²", label: "de aulas: 145 m² y 115 m²" },
];

export const faqs = [
  {
    q: "¿Hay una edad para empezar ballet?",
    a: "No. Hay quien empieza con 3 años en Pre-Ballet, quien llega en la adolescencia y quien se acerca por primera vez de adulto. Lo importante no es compararte con quien empezó antes, sino saber dónde estás y trabajar desde ahí.",
  },
  {
    q: "¿Cómo funciona la clase de prueba?",
    a: "La primera clase es gratis y la matrícula también. Escríbenos por WhatsApp o llámanos, cuéntanos la edad y la experiencia, y te proponemos el grupo y el horario que mejor encajan.",
  },
  {
    q: "¿Necesito saber ballet para hacer Ballet Fitness?",
    a: "No. El Ballet Fitness no requiere nivel de iniciación: usa la técnica del ballet como entrenamiento, dentro y fuera de la barra.",
  },
  {
    q: "¿Preparáis exámenes y pruebas oficiales?",
    a: "Sí. Somos centro adherido a ACADE y nuestros alumnos superan sus exámenes con más de un 98 % de aprobados. También preparamos a quien tiene vocación para las pruebas de acceso a la carrera profesional.",
  },
  {
    q: "¿Hacéis festival de fin de curso?",
    a: "Sí. Cada curso termina sobre un escenario de verdad. Para nosotros el festival es una clase más, la más especial: se aprende a presentarse ante el público y a disfrutar del trabajo hecho.",
  },
  {
    q: "¿Dónde estáis y cómo se llega?",
    a: "En la calle Navarro Caro, 81 (locales 2 y 3), en Tomares, muy cerca de la Avenida del Aljarafe. La lanzadera del metro de San Juan Alto para a pocos metros de la puerta.",
  },
  {
    q: "¿Qué horarios tenéis?",
    a: "Los horarios dependen del grupo, la edad y el nivel. Pregúntanos por WhatsApp o en el 617 319 293 y te enviamos los del curso actual.",
  },
];
