import { RevealText } from "@/components/fx/reveal-text";

// Las citas que la escuela eligió para su página «En escena» de la web antigua.
const quotes = [
  { text: "Yo no trato de bailar mejor que nadie. Solo trato de bailar mejor que yo.", author: "Mikhail Baryshnikov" },
  { text: "Los grandes bailarines no son grandes por su técnica, son geniales por su pasión.", author: "Martha Graham" },
  { text: "Pensar es el mayor error que un bailarín puede cometer. No hay que pensar, hay que sentir.", author: "Michael Jackson" },
];

export function Quotes() {
  const [first, ...rest] = quotes;
  return (
    <section className="relative overflow-hidden bg-noche" aria-label="Entreacto">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(255,241,208,0.07), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-36">
        <p className="text-center text-xs font-medium uppercase tracking-[0.34em] text-white/45">Entreacto</p>
        <figure className="mx-auto mt-8 max-w-5xl text-center">
          <blockquote className="display text-[clamp(2.4rem,5.4vw,5rem)] italic leading-[1.02]">
            <RevealText text={`“${first.text}”`} stagger={14} />
          </blockquote>
          <figcaption className="hand mt-6 text-2xl text-tutu">{first.author}</figcaption>
        </figure>

        <div className="mx-auto mt-20 grid max-w-5xl gap-12 border-t border-white/12 pt-12 md:grid-cols-2">
          {rest.map((quote) => (
            <figure key={quote.author}>
              <blockquote className="display text-[clamp(1.7rem,2.6vw,2.3rem)] italic leading-[1.1] text-white/85">“{quote.text}”</blockquote>
              <figcaption className="mt-4 text-sm uppercase tracking-[0.24em] text-white/45">{quote.author}</figcaption>
            </figure>
          ))}
        </div>

        <p className="mx-auto mt-20 max-w-2xl text-center text-lg leading-relaxed text-white/65">
          Estar en escena, como estar en la vida, no es fácil: requiere disciplina, concentración, responsabilidad, compañerismo y, sobre todo, amor por lo que se hace.
          En todos estos años, más de 5.000 bailarines han compartido su pasión con nosotros desde un escenario.
        </p>
      </div>
    </section>
  );
}
