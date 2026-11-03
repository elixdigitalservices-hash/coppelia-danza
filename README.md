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
- `/escuela`: historia desde 1986, el vídeo «Somos danza», los créditos de agradecimiento, filosofía, las aulas y los festivales
- `/alumnos`: todos los festivales de fin de curso desde 1988 con su teatro, fecha, fotos, vídeos y programas de mano. Entrada con el patio de butacas del Gran Teatro bajo el cañón de luz, pantalla de cine con el resumen 2015-2016, los teatros como entradas, archivo año a año con filtro por centro y regla de años, programas de mano que se reparten como cartas y un visor a pantalla completa con telón
- `/blog` y `/blog/[slug]`: los 21 artículos de la web antigua (2014-2018) con sus fotos y vídeos
- `/contacto`: formulario que abre WhatsApp con el mensaje escrito, datos de contacto y mapa
- `/aviso-legal`: datos del titular (los de la web antigua), uso de la web y privacidad

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
- En `/alumnos` (`src/components/alumnos/`): años perfilados que se llenan de luz, abanico de miniaturas que se abre al pasar, entradas que se inclinan en 3D con brillo satinado, contador 1988-2023 y visor con telón, polvo y acercamiento lento. Los vídeos solo cargan YouTube (sin cookies) o Vimeo (sin rastreo) al darle al play (`video-screen.tsx`).
- Todo lo que depende del scroll usa `useSectionProgress` (`src/lib/scroll.ts`). La aceleración nativa de Framer para opacidades fallaba con rangos parciales, así que el progreso se calcula en JavaScript.

## Contenido

- Los datos del negocio (teléfonos, dirección, disciplinas, historia y preguntas frecuentes) están en `src/data/site.ts`.
- El logo vectorizado está en `public/media/logo-coppelia.svg` (negro) y `logo-coppelia-white.svg` (blanco). Los trazos que usa la intro están en `src/lib/logo-paths.ts`.
- Las fotos están en `public/media/photos/`, reveladas desde los originales de `Fotos originales/` (niveles, contraste, color y nitidez). En `blur/` están sus fondos desenfocados, que se usan cuando una foto se muestra entera a pantalla completa.
- Festivales, teatros y vídeos: `src/data/festivales.ts`. Sus fotos, programas, carteles y miniaturas de vídeo salen de `node scripts/festivales.js "$PWD"`, que escribe `public/media/festivales/` y `src/data/festival-photos.ts` con las medidas reales.
- Blog: `node scripts/blog.js "$PWD"` trae los artículos de la API de WordPress de la web antigua a `src/data/blog.json` y sus imágenes a `public/media/blog/`. Deja fuera las entradas que solo eran un vídeo de festival (ya están en `/alumnos`) y la zona privada de alumnos (con contraseña).
- Cada foto de `src/data/site.ts` tiene sus medidas reales y un punto de interés (`focus`). Los marcos usan la proporción real de la foto, así que no se recortan; donde un marco tiene que recortar, se centra en ese punto.

## Pendiente de confirmar con la escuela

- Horarios del curso actual (la web los deriva a WhatsApp).
- Que el 617 319 293 tiene WhatsApp y que el fijo 954 155 101 y el correo web@coppeliadanza.com siguen activos.
- Que el centro de Córdoba ya no está abierto (la web solo presenta Tomares; Córdoba aparece como parte de la historia).
- Cifras antiguas: "+5.000 bailarines en escena" (dato de 2014) y "+98 % de aprobados ACADE" (dato de 2017).
- Permiso para usar las fotos con menores y créditos de los fotógrafos (Blanca de la Cruz, Rafa Núñez Ollero y Millán Herce, cuya marca de agua sale en las fotos de Sevilla 2015).
- Festivales: en qué teatro fueron los de Córdoba de 2008 a 2012, el de Tomares de 2013, el de 2019 (y de qué centro) y la gala de Tomares de 2023; y si hay festivales de 2017-2025 que añadir. Las fotos del Gran Teatro y del Teatro Central vienen de la web antigua, sin autor.
- Blog: algunas imágenes y vídeos de los artículos son de terceros (películas, anuncios, fotos de bailarines famosos), igual que en la web antigua.
- Aviso legal: que el titular, el NIF, el domicilio de Córdoba y info@coppeliadanza.com siguen vigentes, y si el 678 232 707 sigue activo.
- La web antigua menciona Danzas Urbanas (2018); no se ha añadido porque no aparece en las clases actuales.

## Publicación

- Producción: https://coppelia-danza.vercel.app (proyecto Vercel `coppelia-danza`, equipo `elix-digital-services`).
- Para volver a publicar: `vercel deploy --prod --scope elix-digital-services` desde esta carpeta.
- Mientras la web no esté en coppeliadanza.com, se publica con `noindex` y `robots.txt` cerrado, para no competir con la web antigua en Google. Al conectar el dominio, se indexa sola (ver `isFinalDomain` en `src/data/site.ts`).
