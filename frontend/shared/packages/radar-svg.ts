/**
 * Pure-math radar SVG generator — no D3 dependency.
 * Produces a complete <svg> string suitable for embedding in satori
 * (as a data:image/svg+xml;base64 src) or direct rendering.
 */

interface RepoAttributes {
  stars: number;
  new_stars: number;
  pushes: number;
  contributors: number;
  issues_closed: number;
  forks: number;
}

const LABELS = ["Stars", "New Stars", "Forks", "Contributors", "Pushes", "Issues Closed"];
const KEYS: (keyof RepoAttributes)[] = ["stars", "new_stars", "forks", "contributors", "pushes", "issues_closed"];

// Seeded PRNG so the wobble is deterministic.
function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

/**
 * Generate a wobbly SVG path string for a closed polygon.
 */
function sketchyPolygonPath(
  points: [number, number][],
  jitter: number,
  rng: () => number,
  closed = true
): string {
  if (points.length < 2) return "";

  const segments: string[] = [];
  const len = closed ? points.length : points.length - 1;

  for (let i = 0; i < len; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];

    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / (dist || 1);
    const ny = dx / (dist || 1);

    const steps = Math.max(Math.round(dist / 8), 3);

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const px = x0 + dx * t;
      const py = y0 + dy * t;
      const wobbleScale = Math.sin(t * Math.PI);
      const offset = (rng() - 0.5) * 2 * jitter * wobbleScale;
      const fx = px + nx * offset;
      const fy = py + ny * offset;

      if (i === 0 && s === 0) {
        segments.push(`M ${fx.toFixed(1)},${fy.toFixed(1)}`);
      } else {
        segments.push(`L ${fx.toFixed(1)},${fy.toFixed(1)}`);
      }
    }
  }

  if (closed) segments.push("Z");
  return segments.join(" ");
}

export function renderRadarSvg(attributes: RepoAttributes, size = 400): string {
  const margin = 50;
  const radius = (size - margin * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const numAxes = LABELS.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const rng = createRng(42);

  const scaleR = (value: number) => (value / 99) * radius;

  const polygonPoints = (r: number): [number, number][] =>
    Array.from({ length: numAxes }, (_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      return [Math.cos(angle) * r, Math.sin(angle) * r] as [number, number];
    });

  const parts: string[] = [];

  // SVG open
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="font-family:xkcd,cursive;background:transparent">`
  );

  // Translate group to center
  parts.push(`<g transform="translate(${cx},${cy})">`);

  // Concentric level polygons (dashed)
  const levels = [25, 50, 75];
  for (const level of levels) {
    const pts = polygonPoints(scaleR(level));
    parts.push(
      `<path d="${sketchyPolygonPath(pts, 1.5, rng)}" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="6,4"/>`
    );
  }

  // Outer ring
  const outerPts = polygonPoints(radius);
  parts.push(
    `<path d="${sketchyPolygonPath(outerPts, 2, rng)}" fill="none" stroke="#999" stroke-width="1.5" stroke-dasharray="8,5"/>`
  );

  // Axis lines
  for (let i = 0; i < numAxes; i++) {
    const angle = angleSlice * i - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    parts.push(
      `<path d="${sketchyPolygonPath([[0, 0], [x, y]], 1.5, rng, false)}" fill="none" stroke="#bbb" stroke-width="1"/>`
    );
  }

  // Data polygon
  const dataColor = "#16a34a";
  const dataPts: [number, number][] = KEYS.map((key, i) => {
    const value = attributes[key];
    const angle = angleSlice * i - Math.PI / 2;
    const r = scaleR(value);
    return [Math.cos(angle) * r, Math.sin(angle) * r];
  });

  parts.push(
    `<path d="${sketchyPolygonPath(dataPts, 3, rng)}" fill="${dataColor}" fill-opacity="0.15" stroke="${dataColor}" stroke-width="3.5" stroke-linejoin="round"/>`
  );

  // Data dots
  for (const [x, y] of dataPts) {
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${dataColor}" stroke="white" stroke-width="2"/>`
    );
  }

  // Level number labels
  for (const level of levels) {
    const r = scaleR(level);
    parts.push(
      `<text x="4" y="${(-r - 2).toFixed(1)}" font-size="9" fill="#999" stroke="none">${level}</text>`
    );
  }

  // Axis labels
  for (let i = 0; i < numAxes; i++) {
    const angle = angleSlice * i - Math.PI / 2;
    const labelRadius = radius + 28;
    const x = Math.cos(angle) * labelRadius;
    const y = Math.sin(angle) * labelRadius;
    parts.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="14" fill="#555" stroke="none">${LABELS[i]}</text>`
    );
  }

  parts.push(`</g>`);
  parts.push(`</svg>`);

  return parts.join("");
}
