"use client";

import { motion, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { ButtonLink, PhoneIcon, WhatsAppIcon } from "@/components/button-link";
import { DustCanvas } from "@/components/fx/dust-canvas";
import { Magnetic } from "@/components/fx/magnetic";
import { RevealText } from "@/components/fx/reveal-text";
import { photos, studio, whatsappLink } from "@/data/site";
import { useSectionProgress } from "@/lib/scroll";

const AVISOS = ["Primer aviso", "Segundo aviso", "Tercer aviso"];

function Bell({ ringing }: { ringing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={ringing ? "h-7 w-7 origin-top animate-[bell_0.9s_ease-in-out]" : "h-7 w-7"} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
      <path d="M10 20a2 2 0 0 0 4 0M12 3v2" />
    </svg>
  );
}

/**
 * Telón final. Como en el teatro, suenan los tres avisos; con el tercero las dos mitades
 * se recogen con el scroll y el foco descubre la invitación.
 */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [aviso, setAviso] = useState(0);
  const scrollYProgress = useSectionProgress(ref, ["start end", "start 0.15"]);
  const open = useSpring(useTransform(scrollYProgress, [0.48, 1], [0, 1]), { stiffness: 90, damping: 24, mass: 0.5 });
  const panel = useTransform(open, (v) => 1 - v);
  const glow = useTransform(open, [0.3, 1], [0, 1]);
  const callOpacity = useTransform(open, [0, 0.35], [1, 0]);
  useMotionValueEvent(scrollYProgress, "change", (p) => setAviso(p < 0.08 ? 0 : p < 0.22 ? 1 : p < 0.36 ? 2 : 3));

  return (
    <section ref={ref} className="relative overflow-hidden bg-noche" aria-labelledby="clase-gratis" style={{ "--sx": "30%", "--sy": "38%", "--sr": 1.25 } as CSSProperties}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image src={photos.puntas.src} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: reduce ? 1 : glow,
            background: "radial-gradient(circle min(70vw, 46rem) at 30% 38%, rgba(255,241,208,0.14), rgba(255,241,208,0.04) 60%, transparent 100%)",
          }}
        />
        <DustCanvas count={70} />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 py-28 sm:px-8 lg:py-44">
        <h2 id="clase-gratis" className="display max-w-5xl text-[clamp(3.2rem,9vw,8.5rem)]">
          <RevealText text={"Tu primera clase\nes gratis."} lines delay={250} stagger={30} />
        </h2>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="max-w-xl text-xl leading-relaxed text-white/80">
              Y la matrícula también. Cuéntanos la edad y la experiencia de quien va a bailar y te proponemos grupo y horario.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href={whatsappLink()} className="w-full sm:w-auto">
                  <WhatsAppIcon />
                  Reservar por WhatsApp
                </ButtonLink>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href={studio.phoneHref} variant="ghost" className="w-full sm:w-auto">
                  <PhoneIcon />
                  Llamar al {studio.phone}
                </ButtonLink>
              </Magnetic>
            </div>
          </div>

          <address className="grid gap-6 not-italic sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
            <div>
              <p className="text-sm text-white/50">Dónde</p>
              <p className="mt-2 leading-relaxed">
                {studio.street}
                <br />
                {studio.postalCode} {studio.city}, {studio.region}
              </p>
              <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-tutu underline decoration-tutu/40 underline-offset-4 hover:decoration-tutu">
                Cómo llegar
              </a>
            </div>
            <div>
              <p className="text-sm text-white/50">Síguenos</p>
              <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {studio.instagramHandle}
              </a>
              <p className="mt-4 text-sm text-white/50">Escríbenos</p>
              <a href={`mailto:${studio.email}`} className="mt-2 inline-block underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {studio.email}
              </a>
            </div>
          </address>
        </div>
      </div>

      {!reduce && (
        <>
          <motion.div className="velvet pointer-events-none absolute inset-y-0 left-0 z-10 w-[50.5%] origin-left shadow-[inset_-30px_0_40px_-20px_rgba(0,0,0,0.9)]" style={{ scaleX: panel }} aria-hidden="true" />
          <motion.div className="velvet pointer-events-none absolute inset-y-0 right-0 z-10 w-[50.5%] origin-right shadow-[inset_30px_0_40px_-20px_rgba(0,0,0,0.9)]" style={{ scaleX: panel }} aria-hidden="true" />
          <motion.div className="pointer-events-none absolute inset-x-0 top-[6svh] z-20 flex flex-col items-center px-5 text-center" style={{ opacity: callOpacity }} aria-hidden="true">
            <span className="text-tutu">
              <Bell key={aviso} ringing={aviso > 0} />
            </span>
            <p className="display mt-3 text-[clamp(2rem,5vw,3.6rem)] italic">{aviso === 0 ? "Silencio en la sala" : AVISOS[aviso - 1]}</p>
            <p className="mt-4 flex gap-2.5">
              {AVISOS.map((item, i) => (
                <span
                  key={item}
                  className={`h-2.5 w-2.5 rounded-full transition-[background-color,box-shadow] duration-500 ${aviso > i ? "bg-tutu shadow-[0_0_12px_3px_rgba(191,225,248,0.7)]" : "bg-white/20"}`}
                />
              ))}
            </p>
            <p className="hand mt-4 text-xl text-white/60">{aviso === 3 ? "empieza la función" : "sigue bajando"}</p>
          </motion.div>
        </>
      )}
    </section>
  );
}
