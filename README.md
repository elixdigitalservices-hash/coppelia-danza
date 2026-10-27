# Studio de Danza Coppelia

Web de Studio de Danza Coppelia (Tomares, Sevilla), hecha con Next.js, React, TypeScript y Tailwind CSS.

## Arrancar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. La intro sale cada vez que se carga o se recarga la home (con `/?nointro` se salta). Al navegar entre páginas no se repite: se usa el telón.

## Rutas

- `/`: home con la intro (sala a negro, cañón de luz, el logo se dibuja trazo a trazo y se abre el telón). El hero es un grand jeté del Festival Coppelia Córdoba 2012: a color bajo el cañón de luz, en blanco y negro fuera de él, con una estela estroboscópica que acompaña el salto
- `/clases`: las cuatro disciplinas, para quién es cada una y preguntas frecuentes
- `/escuela`: historia desde 1986, filosofía, las aulas y los festivales
- `/contacto`: formulario que abre WhatsApp con el mensaje escrito, datos de contacto y mapa

## Efectos

Están en `src/components/fx/` y todos respetan "reducir movimiento" del sistema:

- `page-curtain.tsx`: telón de terciopelo entre páginas, con el nombre de la página de destino.
- `dust-canvas.tsx`: polvo de escenario que solo brilla dentro del haz de luz (intro, hero, cabeceras y cierre).
- `reveal-text.tsx` y `stage-image.tsx`: titulares que suben letra a letra y fotos que se abren desde el centro.
- `marquee.tsx`: nombres de las disciplinas que corren según la velocidad del scroll.
- `stage-section.tsx`: secciones claras que se despliegan como un escenario.
- `rolling-number.tsx`: cifras que ruedan como un marcador.
- `stack-deck.tsx`: tarjetas apiladas de las disciplinas en `/clases` (solo escritorio).
- `cursor.tsx` y `magnetic.tsx`: cursor-foco y botones magnéticos (solo con ratón).
- `film-day.tsx`: "Un día cualquiera en el studio", una película que avanza con el scroll (bandas de cine, REC, código de tiempo, cámaras, destellos de corte y subtítulos que se escriben solos).
- `word-zoom.tsx`: vuelo a través de la palabra "escena" hasta la foto del festival, que pasa de blanco y negro a color.
- `manifesto.tsx`: la filosofía de la escuela, con las palabras encendiéndose una a una.
- La historia (`history.tsx`) lleva un contador de 1986 a 2026, y el logo se dibuja con el scroll. La galería (`on-stage.tsx`) se desplaza en horizontal con giro 3D tipo coverflow. El cierre (`final-cta.tsx`) da los tres avisos del teatro antes de abrir el telón.
- Todo lo que depende del scroll usa `useSectionProgress` (`src/lib/scroll.ts`). La aceleración nativa de Framer para opacidades fallaba con rangos parciales, así que el progreso se calcula en JavaScript.

## Contenido

- Los datos del negocio (teléfonos, dirección, disciplinas, historia y preguntas frecuentes) están en `src/data/site.ts`.
- El logo vectorizado está en `public/media/logo-coppelia.svg` (negro) y `logo-coppelia-white.svg` (blanco). Los trazos que usa la intro están en `src/lib/logo-paths.ts`.
- Las fotos están en `public/media/photos/`, reveladas desde los originales de `Fotos originales/` (niveles, contraste, color y nitidez). En `blur/` están sus fondos desenfocados, que se usan cuando una foto se muestra entera a pantalla completa.
- Cada foto de `src/data/site.ts` tiene sus medidas reales y un punto de interés (`focus`). Los marcos usan la proporción real de la foto, así que no se recortan; donde un marco tiene que recortar, se centra en ese punto.

## Pendiente de confirmar con la escuela

- Horarios del curso actual (la web los deriva a WhatsApp).
- Que el 617 319 293 tiene WhatsApp y que el fijo 954 155 101 y el correo web@coppeliadanza.com siguen activos.
- Que el centro de Córdoba ya no está abierto (la web solo presenta Tomares; Córdoba aparece como parte de la historia).
- Cifras antiguas: "+5.000 bailarines en escena" (dato de 2014) y "+98 % de aprobados ACADE" (dato de 2017).
- Permiso para usar las fotos con menores y créditos de los fotógrafos (Blanca de la Cruz y Rafa Núñez Ollero).

## Publicación

- Producción: https://coppelia-danza.vercel.app (proyecto Vercel `coppelia-danza`, equipo `elix-digital-services`).
- Para volver a publicar: `vercel deploy --prod --scope elix-digital-services` desde esta carpeta.
- Mientras la web no esté en coppeliadanza.com, se publica con `noindex` y `robots.txt` cerrado, para no competir con la web antigua en Google. Al conectar el dominio, se indexa sola (ver `isFinalDomain` en `src/data/site.ts`).
