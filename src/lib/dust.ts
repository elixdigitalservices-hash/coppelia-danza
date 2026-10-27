// Polvo suspendido en el haz de un foco: cada mota solo brilla donde llega la luz.

type Mote = { x: number; y: number; vx: number; vy: number; r: number; tw: number; ph: number };

export type LightFn = (x: number, y: number) => number;

export function createDust(count: number) {
  const motes: Mote[] = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00006,
    vy: -(0.000025 + Math.random() * 0.00009),
    r: 0.5 + Math.random() * 1.5,
    tw: 0.4 + Math.random() * 1.6,
    ph: Math.random() * Math.PI * 2,
  }));

  return function draw(ctx: CanvasRenderingContext2D, width: number, height: number, now: number, dt: number, light: LightFn) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fff4dc";
    const step = Math.min(dt, 50);
    for (const m of motes) {
      m.vx = Math.max(-0.00008, Math.min(0.00008, m.vx + (Math.random() - 0.5) * 0.000003 * step));
      m.x += m.vx * step;
      m.y += m.vy * step;
      if (m.y < -0.02) {
        m.y = 1.02;
        m.x = Math.random();
      }
      if (m.x < -0.02) m.x = 1.02;
      if (m.x > 1.02) m.x = -0.02;

      const px = m.x * width;
      const py = m.y * height;
      const lit = light(px, py);
      if (lit <= 0.02) continue;
      ctx.globalAlpha = lit * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(now * 0.001 * m.tw + m.ph)));
      ctx.beginPath();
      ctx.arc(px, py, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

/** Lee una variable CSS en línea subiendo por los ancestros (las variables de foco viven en el contenedor). */
export function readVar(el: HTMLElement | null, name: string) {
  for (let node = el; node; node = node.parentElement) {
    const value = node.style.getPropertyValue(name);
    if (value) return value;
  }
  return "";
}

/** Radio del foco en px: el mismo min(max(36vw, 12rem), 25rem) que usa la máscara CSS. */
export const spotRadius = () => Math.min(Math.max(window.innerWidth * 0.36, 192), 400);
