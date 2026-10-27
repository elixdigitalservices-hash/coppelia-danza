import { RevealText } from "@/components/fx/reveal-text";
import { RollingNumber } from "@/components/fx/rolling-number";
import { StageImage } from "@/components/fx/stage-image";
import { StageSection } from "@/components/fx/stage-section";
import { photos } from "@/data/site";

const rooms = [
  { size: "145", label: "Aula grande" },
  { size: "115", label: "Segunda aula" },
];

const details = [
  "Barras, espejos y suelo de danza en las dos aulas",
  "Vestuarios y zonas comunes para esperar con calma",
  "Junto a la Avenida del Aljarafe, fácil desde Sevilla y el Aljarafe",
  "La lanzadera del metro de San Juan Alto para a pocos metros",
];

export function StudioSpace() {
  return (
    <StageSection className="bg-sala text-noche" labelledBy="el-estudio">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="el-estudio" className="display text-[clamp(2.8rem,6.4vw,6rem)]">
              <RevealText text="El espacio importa." />
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-linoleo">
              Dos aulas amplias para que el espacio no sea nunca un límite: diagonales, saltos, trabajo de suelo y desplazamientos con libertad de movimiento.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-noche/15 pt-8">
              {rooms.map((room, index) => (
                <div key={room.size}>
                  <dt className="sr-only">{room.label}</dt>
                  <dd className="display flex items-start text-[clamp(3.6rem,7vw,6.5rem)]">
                    <RollingNumber value={room.size} delay={index * 250} />
                    <span className="ml-1 font-sans text-lg tracking-normal">m²</span>
                  </dd>
                  <dd className="mt-2 text-sm text-linoleo">{room.label}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-12 grid gap-4">
              {details.map((item) => (
                <li key={item} className="flex gap-4 leading-relaxed">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-noche/40" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-6 items-start gap-3 sm:gap-4 lg:col-span-7 lg:col-start-6 lg:pl-8">
            <StageImage photo={photos.aulaGrande} natural sizes="(min-width: 1024px) 55vw, 100vw" className="col-span-6 bg-noche" />
            <StageImage photo={photos.aulaPiano} natural sizes="(min-width: 1024px) 36vw, 66vw" className="col-span-4 bg-noche" delay={150} />
            <StageImage photo={photos.barraEspejo} natural sizes="(min-width: 1024px) 18vw, 33vw" className="col-span-2 bg-noche" delay={300} />
          </div>
        </div>
      </div>
    </StageSection>
  );
}
