"use client";

import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { Fragment, useRef } from "react";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("shrink-0", className)} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

type RowProps = { items: string[]; speed: number; className: string; sparkleClassName: string };

/** Fila infinita que acelera con la velocidad del scroll y cambia de sentido al subir. */
function Row({ items, speed, className, sparkleClassName }: RowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 60, stiffness: 120 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-1.2, 0, 1.2]);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(speed < 0 ? -1 : 1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    const b = boost.get();
    if (b < 0) direction.current = speed < 0 ? 1 : -1;
    else if (b > 0) direction.current = speed < 0 ? -1 : 1;
    const move = direction.current * Math.abs(speed) * (delta / 1000);
    base.set(base.get() + move + move * Math.abs(b));
  });

  const sequence = (
    <>
      {items.map((item) => (
        <Fragment key={item}>
          <span className={className}>{item}</span>
          <Sparkle className={sparkleClassName} />
        </Fragment>
      ))}
    </>
  );

  return (
    <div ref={ref} className="flex overflow-hidden whitespace-nowrap" aria-hidden="true">
      <motion.div className="flex shrink-0 items-center" style={{ x }}>
        <div className="flex shrink-0 items-center">{sequence}</div>
        <div className="flex shrink-0 items-center">{sequence}</div>
        <div className="flex shrink-0 items-center">{sequence}</div>
        <div className="flex shrink-0 items-center">{sequence}</div>
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-noche py-8 sm:py-12" aria-label="Disciplinas de Coppelia">
      <p className="sr-only">Ballet clásico, danza contemporánea, Ballet Fitness y Pilates aplicado a la danza.</p>
      <Row
        items={["Ballet clásico", "Danza contemporánea", "Ballet Fitness", "Pilates aplicado a la danza"]}
        speed={0.45}
        className="display px-[0.35em] text-[clamp(3.6rem,10vw,9rem)] italic leading-[1.1]"
        sparkleClassName="h-6 w-6 text-tutu sm:h-9 sm:w-9"
      />
      <Row
        items={["primera clase gratis", "matrícula gratis", "desde 1986", "Tomares, Sevilla", "de 3 años a adultos"]}
        speed={-0.6}
        className="hand px-6 text-[clamp(1.6rem,3.6vw,2.6rem)] text-tutu"
        sparkleClassName="h-4 w-4 text-white/60"
      />
    </section>
  );
}
