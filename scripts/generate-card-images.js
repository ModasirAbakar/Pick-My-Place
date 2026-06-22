const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "images", "cards");
fs.mkdirSync(dir, { recursive: true });

function cardSvg(seed) {
  const h1 = (seed * 37) % 360;
  const h2 = (h1 + 40 + (seed % 80)) % 360;
  const c1 = `hsl(${h1} 45% 38%)`;
  const c2 = `hsl(${h2} 55% 28%)`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" aria-hidden="true">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <circle cx="1050" cy="120" r="180" fill="rgba(255,255,255,0.08)"/>
  <circle cx="200" cy="680" r="240" fill="rgba(255,255,255,0.06)"/>
</svg>`;
}

for (let i = 29; i <= 61; i += 1) {
  fs.writeFileSync(path.join(dir, `pmp-${i}.svg`), cardSvg(i));
}
fs.writeFileSync(path.join(dir, "pmp-default.svg"), cardSvg(0));
console.log(`Wrote ${fs.readdirSync(dir).length} card images to images/cards/`);
