import { RevealText } from "@/components/fx/reveal-text";
import { RollingNumber } from "@/components/fx/rolling-number";
import { facts, studio, values } from "@/data/site";

export function Values() {
  return (
    <section className="on-light bg-white text-noche" aria-labelledby="filosofia">
      <div className="mx-auto grid max-w-[90rem] gap-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-36">
        <div className="lg:col-span-7">
          <h2 id="filosofia" className="display text-[clamp(2.8rem,6.4vw,6rem)]">
            <RevealText text="Nos apasiona verte crecer." />
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-linoleo">
            Somos especialistas en danza clásica, con un profesorado altamente cualificado y décadas formando bailarines profesionales y aficionados. Y un compromiso
            esencial: la seguridad, la salud y el bienestar de cada alumno.
          </p>

          <dl className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {values.map((item) => (
              <div key={item.name} className="border-t border-noche/15 pt-6">
                <dt className="display text-[2.4rem] italic">
                  <RevealText text={item.name} stagger={30} />
                </dt>
                <dd className="mt-3 leading-relaxed text-linoleo">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9" aria-label="Coppelia en cifras">
          <div className="bg-sala p-8 sm:p-10">
            <ul className="grid gap-8">
              {facts.map((fact, index) => (
                <li key={fact.label}>
                  <p className="display text-[3.4rem] leading-none">
                    <RollingNumber value={fact.value} delay={index * 200} />
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-linoleo">{fact.label}</p>
                </li>
              ))}
            </ul>
            <p className="mt-10 border-t border-noche/15 pt-6 text-sm leading-relaxed text-linoleo">
              Centro adherido a ACADE (Asociación de Centros Autónomos de Enseñanza Privada). Desde 1986 con {studio.founder}.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
