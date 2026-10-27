import type { CSSProperties, ReactNode } from "react";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { RevealText } from "@/components/fx/reveal-text";
import { StageImage } from "@/components/fx/stage-image";
import type { Photo } from "@/data/site";

type Props = {
  title: string;
  lead: ReactNode;
  photo: Photo;
  note?: string;
  children?: ReactNode;
};

export function PageHero({ title, lead, photo, note, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-noche pt-[4.5rem]" style={{ "--sx": "28%", "--sy": "45%", "--sr": 1.3 } as CSSProperties}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle min(80vw, 44rem) at 28% 45%, rgba(255,241,208,0.08), transparent 70%)" }}
        aria-hidden="true"
      >
        <DustCanvas count={60} />
      </div>
      <div className="relative mx-auto grid max-w-[90rem] gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-12 lg:items-end lg:pb-24 lg:pt-24">
        <div className="lg:col-span-7">
          <h1 className="display text-[clamp(4rem,11vw,9.5rem)]">
            <RevealText text={title} delay={150} stagger={40} />
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">{lead}</p>
          {children && <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
        <figure className="relative lg:col-span-4 lg:col-start-9">
          <StageImage photo={photo} natural priority sizes="(min-width: 1024px) 30vw, 100vw" className="max-h-[75svh]" delay={200} />
          {note && <figcaption className="hand mt-4 text-2xl text-tutu">{note}</figcaption>}
        </figure>
      </div>
    </section>
  );
}
