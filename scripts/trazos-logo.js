// Divide el logo vectorizado en trazos ordenados (primero el niño, luego la bailarina) para la intro.
// Uso: node scripts/trazos-logo.js "$PWD" <carpeta-temporal>
const fs = require("fs"), path = require("path");
const [P, S] = process.argv.slice(2);
const svg = fs.readFileSync(path.join(S, "logo_trace.svg"), "utf8");
const d = svg.match(/ d="([^"]+)"/)[1];
const round = (s) => s.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n))));
let compact = round(d).replace(/\s*,\s*/g, ",").replace(/\s+/g, " ").replace(/ ?([MCLZ]) ?/g, "$1").trim();
// split into subpaths
const subs = compact.split(/(?=M)/).filter(Boolean);
const info = subs.map((p) => {
  const nums = p.match(/-?\d+/g).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  return { p, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, area: (maxX - minX) * (maxY - minY), minX };
});
// drop specks, draw big shapes first within each figure: boy (left) then girl (right)
const figures = info.filter((s) => s.area > 300);
figures.sort((a, b) => (a.cx < 690) - (b.cx < 690) || b.area - a.area);
figures.reverse();
const boy = figures.filter((s) => s.cx < 690).sort((a, b) => b.area - a.area);
const girl = figures.filter((s) => s.cx >= 690).sort((a, b) => b.area - a.area);
const ordered = [...boy, ...girl].map((s) => s.p);
const full = ordered.join("");
console.log("subpaths", subs.length, "kept", ordered.length, "bytes", full.length);
const ts = `// Traced from the studio's original line-art logo (coppelia_transp_bl.png). Boy first, then the ballerina.
export const LOGO_VIEWBOX = "0 0 1384 1328";

export const LOGO_PATHS = ${JSON.stringify(ordered, null, 0).replace(/","/g, '",\n  "').replace("[", "[\n  ").replace(/"]$/, '",\n]')};

export const LOGO_D = LOGO_PATHS.join("");
`;
fs.writeFileSync(path.join(P, "src/lib/logo-paths.ts"), ts);
const mk = (fill, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1384 1328">${bg ? `<rect width="1384" height="1328" fill="${bg}"/>` : ""}<path fill="${fill}" fill-rule="evenodd" d="${full}"/></svg>`;
fs.writeFileSync(path.join(P, "public/media/logo-coppelia.svg"), mk("#000"));
fs.writeFileSync(path.join(P, "public/media/logo-coppelia-white.svg"), mk("#fff"));
fs.writeFileSync(path.join(S, "logo_check.svg"), mk("#000", "#fff"));
