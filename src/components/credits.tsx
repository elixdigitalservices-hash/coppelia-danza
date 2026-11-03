import { RevealText } from "@/components/fx/reveal-text";
import { thanks } from "@/data/site";

/**
 * Créditos finales, como al acabar una película: los nombres de quienes hicieron posible la escuela
 * suben despacio por una ventana con los bordes fundidos. Se paran al pasar el ratón.
 */
export function Credits() {
  const names = [...thanks.names, ...thanks.names];
  return (
    <section className="relative overflow-hidden bg-noche" aria-labelledby="gracias">
      <div className="mx-auto grid max-w-[90rem] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:py-36">
        <div className="lg:col-span-5">
          <p className="text-xs font-medium uppercase tracking-[0.34em] text-white/45">Con el agradecimiento de la escuela</p>
          <h2 id="gracias" className="display mt-5 text-[clamp(2.8rem,6vw,5.6rem)]">
            <RevealText text="No estuvimos solos." />
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">{thanks.lead}</p>
          <p className="mt-8 max-w-md border-l-2 border-tutu pl-5 text-lg leading-relaxed">
            Y, sobre todo, <span className="display text-2xl italic text-tutu">{thanks.partner}</span>, {thanks.partnerNote}
          </p>
        </div>

        <div className="credits-window relative h-[26rem] overflow-hidden lg:col-span-6 lg:col-start-7 lg:h-[34rem]">
          <ul className="credits-roll text-center" aria-label="Profesores y colaboradores">
            {names.map((name, i) => (
              <li key={`${name}-${i}`} className="display py-2.5 text-[clamp(1.9rem,3.4vw,3rem)] italic" aria-hidden={i >= thanks.names.length || undefined}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
