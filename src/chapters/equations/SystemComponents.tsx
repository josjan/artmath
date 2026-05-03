// SystemComponents.tsx — Interactive system of equations components

import { type Lang } from '../../lib/data';

// Solve 2x2 system using Cramer's rule
export const solve2x2System = (a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) => {
  const det = a1 * b2 - a2 * b1;
  
  if (Math.abs(det) < 0.0001) {
    return { hasSolution: false, solution: null, type: 'no_unique_solution' };
  }
  
  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;
  
  return { hasSolution: true, solution: { x, y }, type: 'unique_solution' };
};

// Solve 3x3 system using Cramer's rule (simplified)
export const solve3x3System = (a1: number, b1: number, c1: number, d1: number,
                                a2: number, b2: number, c2: number, d2: number,
                                a3: number, b3: number, c3: number, d3: number) => {
  // Calculate determinant of coefficient matrix
  const det = a1 * (b2 * c3 - b3 * c2) - b1 * (a2 * c3 - a3 * c2) + c1 * (a2 * b3 - a3 * b2);
  
  if (Math.abs(det) < 0.0001) {
    return { hasSolution: false, solution: null, type: 'no_unique_solution' };
  }
  
  // Calculate determinants for Cramer's rule
  const detX = d1 * (b2 * c3 - b3 * c2) - b1 * (d2 * c3 - d3 * c2) + c1 * (d2 * b3 - d3 * b2);
  const detY = a1 * (d2 * c3 - d3 * c2) - d1 * (a2 * c3 - a3 * c2) + c1 * (a2 * d3 - a3 * d2);
  const detZ = a1 * (b2 * d3 - b3 * d2) - b1 * (a2 * d3 - a3 * d2) + d1 * (a2 * b3 - a3 * b2);
  
  const x = detX / det;
  const y = detY / det;
  const z = detZ / det;
  
  return { hasSolution: true, solution: { x, y, z }, type: 'unique_solution' };
};

// 2x2 System Figure Component
export const System2Figure = ({ a1, b1, c1, a2, b2, c2 }: {
  a1: number; b1: number; c1: number;
  a2: number; b2: number; c2: number;
}) => {
  const result = solve2x2System(a1, b1, c1, a2, b2, c2);
  const W = 720, H = 460;
  const ox = W / 2, oy = H / 2;
  const scale = Math.min(W, H) / 20; // Equal scale for both axes
  
  // Generate lines for visualization
  const generateLinePoints = (a: number, b: number, c: number, color: string) => {
    const points: string[] = [];
    
    if (Math.abs(b) > 0.0001) {
      // y = (-a*x + c) / b
      for (let x = -8; x <= 8; x += 0.1) {
        const y = (-a * x + c) / b;
        const px = ox + x * scale;
        const py = oy - y * scale;
        if (py >= 0 && py <= H) {
          points.push(`${points.length === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`);
        }
      }
    } else if (Math.abs(a) > 0.0001) {
      // x = c/a (vertical line)
      const x = c / a;
      const px = ox + x * scale;
      points.push(`M${px.toFixed(1)} 0 L${px.toFixed(1)} ${H}`);
    }
    
    return { path: points.join(' '), color };
  };
  
  const line1 = generateLinePoints(a1, b1, c1, 'var(--accent)');
  const line2 = generateLinePoints(a2, b2, c2, 'var(--construction)');

  return (
    <svg width="100%" height="600" viewBox="0 0 720 460" style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--surface)' }}>
      <defs>
        <pattern id="sysgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="sysgridBold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#sysgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#sysgridBold)"/>

      <line x1={0} y1={oy} x2={W} y2={oy} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={ox} y1={0} x2={ox} y2={H} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={W - 14} y={oy - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={ox + 8}  y={14}    fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {/* X-axis labels */}
      {[-8, -6, -4, -2, 2, 4, 6, 8].map(t => (
        <g key={t}>
          <line x1={ox + t * scale} y1={oy - 4} x2={ox + t * scale} y2={oy + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox + t * scale} y={oy + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}
      
      {/* Y-axis labels */}
      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={ox - 4} y1={oy - t * scale} x2={ox + 4} y2={oy - t * scale} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox - 8} y={oy - t * scale + 3} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="end">{t}</text>
        </g>
      ))}

      <path d={line1.path} fill="none" stroke={line1.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      <path d={line2.path} fill="none" stroke={line2.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Intersection point */}
      {result.hasSolution && result.solution && (
        <g>
          <circle cx={ox + result.solution.x * scale} cy={oy - result.solution.y * scale} r="8" fill="var(--handle)" stroke="white" strokeWidth="2"/>
          <text x={ox + result.solution.x * scale} y={oy - result.solution.y * scale + 25} fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" textAnchor="middle">
            ({result.solution.x.toFixed(2)}, {result.solution.y.toFixed(2)})
          </text>
        </g>
      )}

      <circle cx={ox} cy={oy} r="3" fill="var(--fg-1)"/>
    </svg>
  );
};

// 3x3 System Figure Component
export const System3Figure = ({ coefficients, lang }: {
  coefficients: number[][];
  lang: Lang;
}) => {
  const [a1, b1, c1, d1] = coefficients[0];
  const [a2, b2, c2, d2] = coefficients[1];
  const [a3, b3, c3, d3] = coefficients[2];
  
  const result = solve3x3System(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3);

  return (
    <div style={{ padding: '32px 40px', minHeight: 600, fontFamily: 'var(--font-sans)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 20 }}>
        {lang === 'es' ? 'Sistema 3×3' : '3×3 System'}
      </h3>
      
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
        background: 'var(--surface-2)', padding: 24, borderRadius: 'var(--r-md)'
      }}>
        {/* System equations */}
        <div>
          <h4 style={{ fontSize: 16, marginBottom: 12, color: 'var(--fg-2)' }}>
            {lang === 'es' ? 'Ecuaciones:' : 'Equations:'}
          </h4>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 2 }}>
            <div>{a1}x + {b1}y + {c1}z = {d1}</div>
            <div>{a2}x + {b2}y + {c2}z = {d2}</div>
            <div>{a3}x + {b3}y + {c3}z = {d3}</div>
          </div>
        </div>

        {/* Solution */}
        <div>
          <h4 style={{ fontSize: 16, marginBottom: 12, color: 'var(--fg-2)' }}>
            {lang === 'es' ? 'Solución:' : 'Solution:'}
          </h4>
          {result.hasSolution && result.solution ? (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 1.8 }}>
              <div>x = {result.solution.x.toFixed(3)}</div>
              <div>y = {result.solution.y.toFixed(3)}</div>
              <div>z = {result.solution.z.toFixed(3)}</div>
            </div>
          ) : (
            <div style={{ color: 'var(--fg-3)', fontSize: 14 }}>
              {lang === 'es' ? 'Sin solución única' : 'No unique solution'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
