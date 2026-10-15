(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MapGeometry = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function derive(scores, center) {
    if (!scores || !center) return null;
    const { N, E, S, W } = scores;
    const [x, y] = center;
    const c = [clamp(x, -W / 4, E / 4), clamp(y, -S / 4, N / 4)];
    return [[c[0], N / 4], mix(c, [E / 4, N / 4], scores.NE / 4),
      [E / 4, c[1]], mix(c, [E / 4, -S / 4], scores.SE / 4),
      [c[0], -S / 4], mix(c, [-W / 4, -S / 4], scores.SW / 4),
      [-W / 4, c[1]], mix(c, [-W / 4, N / 4], scores.NW / 4)];
  }
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  function contains(polygon, p) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[j], b = polygon[i];
      if (Math.abs(cross(a, b, p)) < 1e-8 && p[0] >= Math.min(a[0], b[0]) - 1e-8 && p[0] <= Math.max(a[0], b[0]) + 1e-8 && p[1] >= Math.min(a[1], b[1]) - 1e-8 && p[1] <= Math.max(a[1], b[1]) + 1e-8) return true;
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }
  function contour(vertices, project = p => p) {
    // Zero joint reach can create A→B→A: a zero-area spike, not an envelope.
    // Remove the retraced edge before rounding, without inventing extra reach.
    const same = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1]) < 1e-9;
    const polygon = vertices.map(p=>[...p]);
    let changed=true;
    while(changed && polygon.length>2) {
      changed=false;
      for(let i=0;i<polygon.length;i++) {
        const prev=polygon[(i+polygon.length-1)%polygon.length],next=polygon[(i+1)%polygon.length];
        if(same(polygon[i],next)||same(prev,next)){polygon.splice(i,1);changed=true;break;}
      }
    }
    if (!polygon.length) return { path: `M ${project(vertices[0]).join(' ')} Z`, samples: vertices };
    const corners = polygon.map((b, i) => {
      const a = polygon[(i + polygon.length - 1) % polygon.length], d = polygon[(i + 1) % polygon.length];
      const incoming = mix(b, a, 0.18), outgoing = mix(b, d, 0.18);
      const samples = Array.from({ length: 17 }, (_, n) => {
        const t = n / 16;
        return [0, 1].map(k => (1 - t) ** 2 * incoming[k] + 2 * (1 - t) * t * b[k] + t ** 2 * outgoing[k]);
      });
      return samples.every(p => contains(polygon, p)) ? { incoming, outgoing, control: b, samples } : { incoming: b, outgoing: b, control: null, samples: [b] };
    });
    const fmt = p => project(p).map(v => Number(v.toFixed(4))).join(' ');
    let path = `M ${fmt(corners[0].incoming)}`;
    for (const c of corners) {
      path += ` L ${fmt(c.incoming)}`;
      if (c.control) path += ` Q ${fmt(c.control)} ${fmt(c.outgoing)}`;
    }
    return { path: path + ' Z', samples: corners.flatMap(c => c.samples) };
  }
  function selfIntersects(points) {
    for (let i = 0; i < points.length; i++) for (let j = i + 2; j < points.length; j++) {
      if (i === 0 && j === points.length - 1) continue;
      const a = points[i], b = points[(i + 1) % points.length], c = points[j], d = points[(j + 1) % points.length];
      if (cross(a, b, c) * cross(a, b, d) < -1e-12 && cross(c, d, a) * cross(c, d, b) < -1e-12) return true;
    }
    return false;
  }
  return { directions, derive, contains, contour, selfIntersects, mix };
});
