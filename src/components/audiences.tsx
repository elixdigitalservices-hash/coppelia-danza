import { RevealText } from "@/components/fx/reveal-text";
import { StackDeck } from "@/components/fx/stack-deck";
import { StageImage } from "@/components/fx/stage-image";
import { StageSection } from "@/components/fx/stage-section";
import { audiences } from "@/data/site";
import { cn } from "@/lib/utils";

export function Audiences({ title = "Hay un sitio para ti en la barra." }: { title?: string }) {
  return (
    <StageSection className="bg-sala text-noche" labelledBy="para-quien">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="para-quien" className="display text-[clamp(2.8rem,6.4vw,6rem)] lg:col-span-7">
            <RevealText text={title} />
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-linoleo lg:col-span-4 lg:col-start-9">
            Cada alumno llega con un cuerpo, un ritmo y unos objetivos distintos. Agrupamos por edad y nivel, y te acompañamos en cada etapa.
          </p>
        </div>

        {/* Móvil: tarjetas apiladas, cada foto sube y se "come" a la anterior */}
        <StackDeck
          mode="mobile"
          className="mt-12 md:hidden"
          cards={audiences.map((item) => (
            <article key={item.title} className="bg-white p-2.5">
              <StageImage photo={item.photo} natural sizes="100vw" className="w-full max-h-[50svh] rounded-[1.3rem] bg-noche" />
              <div className="px-3 pb-4 pt-5">
                <p className="display flex items-baseline gap-2 text-[3.4rem]">
                  {item.ages}
                  {item.unit && <span className="font-sans text-base tracking-normal text-linoleo">{item.unit}</span>}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-linoleo">{item.body}</p>
              </div>
            </article>
          ))}
        />

        {/* Tablet y escritorio: tres columnas escalonadas */}
        <div className="mt-16 hidden items-start gap-6 md:grid md:grid-cols-3 lg:mt-24 lg:gap-12">
          {audiences.map((item, index) => (
            <article key={item.title} className={cn(index === 1 && "md:mt-28", index === 2 && "md:mt-14")}>
              <StageImage photo={item.photo} natural sizes="30vw" className="max-h-[82svh] bg-noche" delay={index * 140} />
              <p className="display mt-7 flex items-baseline gap-2 text-[clamp(3.2rem,5.4vw,4.8rem)]">
                <RevealText text={item.ages} delay={200 + index * 140} stagger={60} />
                {item.unit && <span className="font-sans text-base tracking-normal text-linoleo">{item.unit}</span>}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-linoleo">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </StageSection>
  );
}
