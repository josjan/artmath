// InterpolationItems.tsx — Ítems del capítulo Interpolación
// Todos siguen el mismo patrón: tabs Fórmula / Explorar / SVG
// Exporta: LinearInterpoItem, HermiteInterpoItem, CompareInterpoItem, CardinalInterpoItem

import { useState } from 'react';
import type { Lang } from '../../lib/data';

// ── Shared components ─────────────────────────────────--

const safe = (v: number) => (isFinite(v) ? v : 0);

// ── Formula helpers ────────────────────────────────────────────────────────────

const FLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8, marginTop: 20 }}>{children}</div>
);

const FCode = ({ children }: { children: string }) => (
  <pre style={{ background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' as const }}>{children}</pre>
);

const FEq = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 16, color: 'var(--formula)', lineHeight: 1.9, paddingLeft: 16 }}>{children}</div>
);

const FAttr = ({ name, desc }: { name: string; desc: string }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2, color: 'var(--fg-2)' }}>
    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{name}</span>
    <span style={{ color: 'var(--fg-4)' }}> — </span>
    <span style={{ fontFamily: 'var(--font-sans)' }}>{desc}</span>
  </div>
);

const formulaBox: React.CSSProperties = { fontFamily: 'var(--font-sans)', maxWidth: 620 };

// Draggable point with halo + pointer capture for reliable dragging
const DragPoint = ({ x, y, onChange }: { x: number; y: number; onChange: (x: number, y: number) => void }) => (
  <g style={{ cursor: 'grab' }}
    onPointerDown={(e) => {
      e.preventDefault();
      (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
    }}
    onPointerMove={(e) => {
      if (e.buttons !== 1) return;
      const svg = e.currentTarget.closest('svg') as SVGSVGElement | null;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const nx = Math.max(0, Math.min(500, e.clientX - rect.left));
      const ny = Math.max(0, Math.min(400, e.clientY - rect.top));
      if (!isFinite(nx) || !isFinite(ny)) return;
      onChange(nx, ny);
    }}
  >
    <circle cx={isFinite(x) ? x : 0} cy={isFinite(y) ? y : 0} r={16} fill="var(--accent)" fillOpacity={0.15} />
    <circle cx={isFinite(x) ? x : 0} cy={isFinite(y) ? y : 0} r={6}  fill="var(--accent)" stroke="white" strokeWidth={2} />
  </g>
);

const TabBar = ({ tab, setTab, lang }: {
  tab: string; setTab: (t: any) => void; lang: Lang;
}) => {
  const tabs = lang === 'es'
    ? [['formula','Fórmula'],['explore','Explorar']]
    : [['formula','Formula'],['explore','Explore']];
  return (
    <div style={{
      display: 'inline-flex', alignSelf: 'flex-start',
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 'var(--r-sm)', padding: 3, gap: 2,
    }}>
      {tabs.map(([id, label]) => (
        <button key={id} onClick={() => setTab(id)} style={{
          padding: '7px 14px', borderRadius: 'var(--r-xs)',
          background: tab === id ? 'var(--surface-3)' : 'transparent',
          color: tab === id ? 'var(--fg-1)' : 'var(--fg-3)',
          border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}>{label}</button>
      ))}
    </div>
  );
};

// ── Interpolation Item Component Template ─────────────────────────────────--

const InterpolationItem = ({
  title,
  formulaContent,
  svgPath,
  exploreContent,
  lang
}: {
  title: string;
  formulaContent: React.ReactNode;
  svgPath?: string;
  exploreContent: React.ReactNode;
  lang: Lang;
}) => {
  const [tab, setTab] = useState('explore');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{title}</h2>
        <TabBar tab={tab} setTab={setTab} lang={lang} />
      </div>

      {tab === 'formula' && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)',
          padding: 32,
          minHeight: 420,
        }}>
          {formulaContent}
        </div>
      )}

      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)',
          padding: 24,
          minHeight: 400
        }}>
          {exploreContent}
        </div>
      )}

      {tab === 'svg' && svgPath && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)',
          padding: 24,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          minHeight: 420,
        }}>
          <img
            src={`/antiguos/svg/${svgPath}`}
            alt={`${title} SVG example`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

// ── Individual Interpolation Items ─────────────────────────────────--

export const LinearInterpoItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Interpolación Lineal' : 'Linear Interpolation';
  const [pointP0, setPointP0] = useState({ x: 100, y: 300 });
  const [pointP1, setPointP1] = useState({ x: 400, y: 100 });
  const [t, setT] = useState(0.5);

  // Calculate interpolated point
  const interpolated = {
    x: pointP0.x + (pointP1.x - pointP0.x) * t,
    y: pointP0.y + (pointP1.y - pointP0.y) * t
  };

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Interpolación Lineal Interactiva' : 'Interactive Linear Interpolation'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos P₀ y P₁ y ajusta el parámetro t para ver la interpolación.' 
        : 'Drag points P₀ and P₁ and adjust parameter t to see interpolation.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-linear" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-linear)" />
          
          {/* Line segment */}
          <line x1={pointP0.x} y1={pointP0.y} x2={pointP1.x} y2={pointP1.y} 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Interpolated point */}
          <circle cx={safe(interpolated.x)} cy={safe(interpolated.y)} r="6" fill="var(--handle)" />
          <text x={safe(interpolated.x) + 10} y={safe(interpolated.y) - 10} 
                fontSize="12" fill="var(--fg-1)">P(t)</text>
          
          {/* Draggable points */}
          <DragPoint x={pointP0.x} y={pointP0.y} onChange={(x, y) => setPointP0({ x, y })} />
          <DragPoint x={pointP1.x} y={pointP1.y} onChange={(x, y) => setPointP1({ x, y })} />
          
          {/* Labels */}
          <text x={pointP0.x - 15} y={pointP0.y - 5} fontSize="12" fill="var(--fg-1)">P₀</text>
          <text x={pointP1.x + 10} y={pointP1.y - 5} fontSize="12" fill="var(--fg-1)">P₁</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>P₀: ({pointP0.x}, {pointP0.y})</div>
            <div>P₁: ({pointP1.x}, {pointP1.y})</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Parámetro t:' : 'Parameter t:'} {t.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={t} 
                onChange={(e) => setT(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              P(t): ({interpolated.x.toFixed(1)}, {interpolated.y.toFixed(1)})
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              P(t) = P₀ + (P₁ - P₀) × t
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>Formula</FLabel>
      <FEq>P(t) = (1 − t) · P₀  +  t · P₁</FEq>
      <FEq>P(t) = P₀  +  t · (P₁ − P₀),  t ∈ [0, 1]</FEq>
      <FLabel>Points</FLabel>
      <FAttr name="P₀" desc={lang === 'es' ? 'Punto de inicio (t = 0)' : 'Start point (t = 0)'}/>
      <FAttr name="P₁" desc={lang === 'es' ? 'Punto final (t = 1)' : 'End point (t = 1)'}/>
      <FAttr name="t" desc={lang === 'es' ? 'Parámetro de interpolación ∈ [0, 1]' : 'Interpolation parameter ∈ [0, 1]'}/>
      <FLabel>{lang === 'es' ? 'Propiedades' : 'Properties'}</FLabel>
      <FCode>{lang === 'es'
        ? 't = 0 → P₀  |  t = 0.5 → punto medio  |  t = 1 → P₁'
        : 't = 0 → P₀  |  t = 0.5 → midpoint  |  t = 1 → P₁'}</FCode>
    </div>
  );

  return (
    <InterpolationItem
      title={title}
      formulaContent={formulaContent}
      svgPath="linearInterpo.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const HermiteInterpoItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Interpolación Hermite' : 'Hermite Interpolation';
  const [pointP0, setPointP0] = useState({ x: 100, y: 300 });
  const [pointP1, setPointP1] = useState({ x: 400, y: 100 });
  const [tangentM0, setTangentM0] = useState({ x: 150, y: 250 });
  const [tangentM1, setTangentM1] = useState({ x: 350, y: 150 });
  const [t, setT] = useState(0.5);

  // Calculate tangents
  const m0 = { x: (tangentM0.x - pointP0.x) * 3, y: (tangentM0.y - pointP0.y) * 3 };
  const m1 = { x: (tangentM1.x - pointP1.x) * 3, y: (tangentM1.y - pointP1.y) * 3 };
  
  const hermiteInterpolate = (t: number) => {
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    
    return {
      x: h00 * pointP0.x + h10 * m0.x + h01 * pointP1.x + h11 * m1.x,
      y: h00 * pointP0.y + h10 * m0.y + h01 * pointP1.y + h11 * m1.y
    };
  };

  const interpolated = hermiteInterpolate(t);
  const curvePath = `M ${pointP0.x} ${pointP0.y} C ${tangentM0.x} ${tangentM0.y} ${tangentM1.x} ${tangentM1.y} ${pointP1.x} ${pointP1.y}`;

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Interpolación Hermite Interactiva' : 'Interactive Hermite Interpolation'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos P₀, P₁ y los puntos de tangente para ajustar la curva Hermite.' 
        : 'Drag points P₀, P₁ and tangent points to adjust the Hermite curve.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-hermite" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-hermite)" />
          
          {/* Hermite curve */}
          <path d={curvePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Tangent lines */}
          <line x1={pointP0.x} y1={pointP0.y} x2={tangentM0.x} y2={tangentM0.y} 
                stroke="var(--formula)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={pointP1.x} y1={pointP1.y} x2={tangentM1.x} y2={tangentM1.y} 
                stroke="var(--formula)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Interpolated point */}
          <circle cx={safe(interpolated.x)} cy={safe(interpolated.y)} r="6" fill="var(--handle)" />
          <text x={safe(interpolated.x) + 10} y={safe(interpolated.y) - 10} 
                fontSize="12" fill="var(--fg-1)">P(t)</text>
          
          {/* Draggable points */}
          <DragPoint x={pointP0.x} y={pointP0.y} onChange={(x, y) => setPointP0({ x, y })} />
          <DragPoint x={pointP1.x} y={pointP1.y} onChange={(x, y) => setPointP1({ x, y })} />
          <DragPoint x={tangentM0.x} y={tangentM0.y} onChange={(x, y) => setTangentM0({ x, y })} />
          <DragPoint x={tangentM1.x} y={tangentM1.y} onChange={(x, y) => setTangentM1({ x, y })} />
          
          {/* Labels */}
          <text x={pointP0.x - 15} y={pointP0.y - 5} fontSize="12" fill="var(--fg-1)">P₀</text>
          <text x={pointP1.x + 10} y={pointP1.y - 5} fontSize="12" fill="var(--fg-1)">P₁</text>
          <text x={tangentM0.x - 15} y={tangentM0.y - 5} fontSize="12" fill="var(--fg-1)">T₀</text>
          <text x={tangentM1.x + 10} y={tangentM1.y - 5} fontSize="12" fill="var(--fg-1)">T₁</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>P₀: ({pointP0.x}, {pointP0.y})</div>
            <div>P₁: ({pointP1.x}, {pointP1.y})</div>
            <div>T₀: ({tangentM0.x}, {tangentM0.y})</div>
            <div>T₁: ({tangentM1.x}, {tangentM1.y})</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Parámetro t:' : 'Parameter t:'} {t.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={t} 
                onChange={(e) => setT(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              P(t): ({interpolated.x.toFixed(1)}, {interpolated.y.toFixed(1)})
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              P(t) = h₀₀(t)P₀ + h₁₀(t)m₀ + h₀₁(t)P₁ + h₁₁(t)m₁
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>Formula</FLabel>
      <FEq>P(t) = h₀₀(t)·P₀  +  h₁₀(t)·m₀  +  h₀₁(t)·P₁  +  h₁₁(t)·m₁</FEq>
      <FLabel>{lang === 'es' ? 'Funciones de base de Hermite' : 'Hermite basis functions'}</FLabel>
      <FEq>h₀₀(t) = 2t³ − 3t² + 1</FEq>
      <FEq>h₁₀(t) = t³ − 2t² + t</FEq>
      <FEq>h₀₁(t) = −2t³ + 3t²</FEq>
      <FEq>h₁₁(t) = t³ − t²</FEq>
      <FLabel>Points &amp; tangents</FLabel>
      <FAttr name="P₀, P₁" desc={lang === 'es' ? 'Puntos de inicio y fin' : 'Start and end points'}/>
      <FAttr name="m₀, m₁" desc={lang === 'es' ? 'Vectores tangentes en P₀ y P₁' : 'Tangent vectors at P₀ and P₁'}/>
      <FAttr name="t" desc={lang === 'es' ? 'Parámetro ∈ [0, 1]' : 'Parameter ∈ [0, 1]'}/>
    </div>
  );

  return (
    <InterpolationItem
      title={title}
      formulaContent={formulaContent}
      svgPath="hermiteInterpo.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const CompareInterpoItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Comparación Interpolaciones' : 'Compare Interpolations';
  const [pointP0, setPointP0] = useState({ x: 100, y: 300 });
  const [pointP1, setPointP1] = useState({ x: 400, y: 100 });
  const [controlPoint, setControlPoint] = useState({ x: 250, y: 50 });
  const [t, setT] = useState(0.5);

  // Calculate different interpolation methods
  const linearPoint = {
    x: pointP0.x + (pointP1.x - pointP0.x) * t,
    y: pointP0.y + (pointP1.y - pointP0.y) * t
  };

  const quadraticPoint = {
    x: (1-t)*(1-t)*pointP0.x + 2*(1-t)*t*controlPoint.x + t*t*pointP1.x,
    y: (1-t)*(1-t)*pointP0.y + 2*(1-t)*t*controlPoint.y + t*t*pointP1.y
  };

  const cubicPoint = {
    x: Math.pow(1-t, 3) * pointP0.x + 3 * Math.pow(1-t, 2) * t * controlPoint.x + 
       3 * (1-t) * Math.pow(t, 2) * controlPoint.x + Math.pow(t, 3) * pointP1.x,
    y: Math.pow(1-t, 3) * pointP0.y + 3 * Math.pow(1-t, 2) * t * controlPoint.y + 
       3 * (1-t) * Math.pow(t, 2) * controlPoint.y + Math.pow(t, 3) * pointP1.y
  };

  const quadraticPath = `M ${pointP0.x} ${pointP0.y} Q ${controlPoint.x} ${controlPoint.y} ${pointP1.x} ${pointP1.y}`;

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Comparación Interactiva de Interpolaciones' : 'Interactive Interpolation Comparison'}</h3>
      <p>{lang === 'es' 
        ? 'Compara diferentes métodos de interpolación arrastrando los puntos de control.' 
        : 'Compare different interpolation methods by dragging control points.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-compare" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-compare)" />
          
          {/* Linear interpolation */}
          <line x1={pointP0.x} y1={pointP0.y} x2={pointP1.x} y2={pointP1.y} 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Quadratic curve */}
          <path d={quadraticPath} fill="none" stroke="var(--formula)" strokeWidth="2" />
          
          {/* Control lines */}
          <line x1={pointP0.x} y1={pointP0.y} x2={controlPoint.x} y2={controlPoint.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={pointP1.x} y1={pointP1.y} x2={controlPoint.x} y2={controlPoint.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Interpolated points */}
          <circle cx={safe(linearPoint.x)} cy={safe(linearPoint.y)} r="5" fill="var(--accent)" />
          <text x={safe(linearPoint.x) + 8} y={safe(linearPoint.y) - 8} 
                fontSize="10" fill="var(--accent)">Linear</text>
          
          <circle cx={safe(quadraticPoint.x)} cy={safe(quadraticPoint.y)} r="5" fill="var(--formula)" />
          <text x={safe(quadraticPoint.x) + 8} y={safe(quadraticPoint.y) + 12} 
                fontSize="10" fill="var(--formula)">Quadratic</text>
          
          <circle cx={safe(cubicPoint.x)} cy={safe(cubicPoint.y)} r="5" fill="var(--handle)" />
          <text x={safe(cubicPoint.x) + 8} y={safe(cubicPoint.y) - 8} 
                fontSize="10" fill="var(--handle)">Cubic</text>
          
          {/* Draggable points */}
          <DragPoint x={pointP0.x} y={pointP0.y} onChange={(x, y) => setPointP0({ x, y })} />
          <DragPoint x={pointP1.x} y={pointP1.y} onChange={(x, y) => setPointP1({ x, y })} />
          <DragPoint x={controlPoint.x} y={controlPoint.y} onChange={(x, y) => setControlPoint({ x, y })} />
          
          {/* Labels */}
          <text x={pointP0.x - 15} y={pointP0.y - 5} fontSize="12" fill="var(--fg-1)">P₀</text>
          <text x={pointP1.x + 10} y={pointP1.y - 5} fontSize="12" fill="var(--fg-1)">P₁</text>
          <text x={controlPoint.x - 15} y={controlPoint.y - 5} fontSize="12" fill="var(--fg-1)">C</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Comparación' : 'Comparison'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Parámetro t:' : 'Parameter t:'} {t.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={t} 
                onChange={(e) => setT(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            
            <div style={{ marginTop: 15 }}>
              <div style={{ color: 'var(--accent)' }}>
                <strong>Linear:</strong> ({linearPoint.x.toFixed(1)}, {linearPoint.y.toFixed(1)})
              </div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>
                P(t) = P₀ + (P₁ - P₀) × t
              </div>
            </div>
            
            <div style={{ marginTop: 10 }}>
              <div style={{ color: 'var(--formula)' }}>
                <strong>Quadratic:</strong> ({quadraticPoint.x.toFixed(1)}, {quadraticPoint.y.toFixed(1)})
              </div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>
                P(t) = (1-t)²P₀ + 2(1-t)tC + t²P₁
              </div>
            </div>
            
            <div style={{ marginTop: 10 }}>
              <div style={{ color: 'var(--handle)' }}>
                <strong>Cubic:</strong> ({cubicPoint.x.toFixed(1)}, {cubicPoint.y.toFixed(1)})
              </div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>
                P(t) = (1-t)³P₀ + 3(1-t)²tC + 3(1-t)t²C + t³P₁
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>{lang === 'es' ? 'Interpolación lineal (grado 1)' : 'Linear interpolation (degree 1)'}</FLabel>
      <FEq>P(t) = (1−t)·P₀  +  t·P₁</FEq>
      <FLabel>{lang === 'es' ? 'Interpolación cuadrática (grado 2)' : 'Quadratic interpolation (degree 2)'}</FLabel>
      <FEq>P(t) = (1−t)²·P₀  +  2(1−t)t·C  +  t²·P₁</FEq>
      <FLabel>{lang === 'es' ? 'Interpolación cúbica (grado 3)' : 'Cubic interpolation (degree 3)'}</FLabel>
      <FEq>P(t) = (1−t)³·P₀  +  3(1−t)²t·C₁  +  3(1−t)t²·C₂  +  t³·P₁</FEq>
      <FLabel>{lang === 'es' ? 'Parámetros' : 'Parameters'}</FLabel>
      <FAttr name="P₀, P₁" desc={lang === 'es' ? 'Puntos de inicio y fin' : 'Start and end points'}/>
      <FAttr name="C / C₁, C₂" desc={lang === 'es' ? 'Punto(s) de control' : 'Control point(s)'}/>
      <FAttr name="t" desc={lang === 'es' ? 'Parámetro ∈ [0, 1]' : 'Parameter ∈ [0, 1]'}/>
    </div>
  );

  return (
    <InterpolationItem
      title={title}
      formulaContent={formulaContent}
      svgPath="compareInterpo.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const CardinalInterpoItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Interpolación Cardinal' : 'Cardinal Interpolation';
  const [pointP0, setPointP0] = useState({ x: 100, y: 300 });
  const [pointP1, setPointP1] = useState({ x: 200, y: 150 });
  const [pointP2, setPointP2] = useState({ x: 300, y: 250 });
  const [pointP3, setPointP3] = useState({ x: 400, y: 100 });
  const [t, setT] = useState(0.5);
  const [tension, setTension] = useState(0.5);
  
  const cardinalInterpolate = (t: number, p0: any, p1: any, p2: any, p3: any, tension: number) => {
    const t2 = t * t;
    const t3 = t2 * t;
    
    const s = (1 - tension) / 2;
    
    const a = { x: 2 * p1.x - 2 * p2.x + s * p3.x - s * p0.x, y: 2 * p1.y - 2 * p2.y + s * p3.y - s * p0.y };
    const b = { x: -3 * p1.x + 3 * p2.x - 2 * s * p3.x + s * p0.x, y: -3 * p1.y + 3 * p2.y - 2 * s * p3.y + s * p0.y };
    const c = { x: s * p3.x - s * p0.x, y: s * p3.y - s * p0.y };
    const d = p1;
    
    return {
      x: a.x * t3 + b.x * t2 + c.x * t + d.x,
      y: a.y * t3 + b.y * t2 + c.y * t + d.y
    };
  };

  const interpolated = cardinalInterpolate(t, pointP0, pointP1, pointP2, pointP3, tension);

  // Generate cardinal spline path
  const generateCardinalPath = () => {
    const steps = 20;
    let path = `M ${pointP0.x} ${pointP0.y}`;
    
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const point = cardinalInterpolate(t, pointP0, pointP1, pointP2, pointP3, tension);
      path += ` L ${point.x} ${point.y}`;
    }
    
    return path;
  };

  const splinePath = generateCardinalPath();

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Interpolación Cardinal Interactiva' : 'Interactive Cardinal Interpolation'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos de control y ajusta la tensión para modificar la curva Cardinal.' 
        : 'Drag control points and adjust tension to modify the Cardinal curve.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-cardinal" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-cardinal)" />
          
          {/* Cardinal spline curve */}
          <path d={splinePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Control polygon */}
          <path d={`M ${pointP0.x} ${pointP0.y} L ${pointP1.x} ${pointP1.y} L ${pointP2.x} ${pointP2.y} L ${pointP3.x} ${pointP3.y}`} 
                fill="none" stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Interpolated point */}
          <circle cx={safe(interpolated.x)} cy={safe(interpolated.y)} r="6" fill="var(--handle)" />
          <text x={safe(interpolated.x) + 10} y={safe(interpolated.y) - 10} 
                fontSize="12" fill="var(--fg-1)">P(t)</text>
          
          {/* Draggable points */}
          <DragPoint x={pointP0.x} y={pointP0.y} onChange={(x, y) => setPointP0({ x, y })} />
          <DragPoint x={pointP1.x} y={pointP1.y} onChange={(x, y) => setPointP1({ x, y })} />
          <DragPoint x={pointP2.x} y={pointP2.y} onChange={(x, y) => setPointP2({ x, y })} />
          <DragPoint x={pointP3.x} y={pointP3.y} onChange={(x, y) => setPointP3({ x, y })} />
          
          {/* Labels */}
          <text x={pointP0.x - 15} y={pointP0.y - 5} fontSize="12" fill="var(--fg-1)">P₀</text>
          <text x={pointP1.x - 15} y={pointP1.y - 5} fontSize="12" fill="var(--fg-1)">P₁</text>
          <text x={pointP2.x - 15} y={pointP2.y - 5} fontSize="12" fill="var(--fg-1)">P₂</text>
          <text x={pointP3.x + 10} y={pointP3.y - 5} fontSize="12" fill="var(--fg-1)">P₃</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>P₀: ({pointP0.x}, {pointP0.y})</div>
            <div>P₁: ({pointP1.x}, {pointP1.y})</div>
            <div>P₂: ({pointP2.x}, {pointP2.y})</div>
            <div>P₃: ({pointP3.x}, {pointP3.y})</div>
            
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Parámetro t:' : 'Parameter t:'} {t.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={t} 
                onChange={(e) => setT(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Tensión:' : 'Tension:'} {tension.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={tension} 
                onChange={(e) => setTension(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              P(t): ({interpolated.x.toFixed(1)}, {interpolated.y.toFixed(1)})
            </div>
            
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Curva Cardinal con 4 puntos de control' : 'Cardinal curve with 4 control points'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>{lang === 'es' ? 'Tangentes automáticas (parámetro de tensión τ)' : 'Automatic tangents (tension parameter τ)'}</FLabel>
      <FEq>m₀ = (1−τ) / 2 · (P₁ − P₋₁)</FEq>
      <FEq>m₁ = (1−τ) / 2 · (P₂ − P₀)</FEq>
      <FLabel>{lang === 'es' ? 'Interpolación entre P₀ y P₁ (Hermite)' : 'Interpolation between P₀ and P₁ (Hermite)'}</FLabel>
      <FEq>P(t) = h₀₀(t)·P₀  +  h₁₀(t)·m₀  +  h₀₁(t)·P₁  +  h₁₁(t)·m₁</FEq>
      <FLabel>{lang === 'es' ? 'Parámetros' : 'Parameters'}</FLabel>
      <FAttr name="τ (tension)" desc={lang === 'es' ? '0 = Catmull-Rom,  1 = tangentes nulas' : '0 = Catmull-Rom spline,  1 = zero tangents'}/>
      <FAttr name="P₋₁, P₀, P₁, P₂" desc={lang === 'es' ? 'Cuatro puntos de control consecutivos' : 'Four consecutive control points'}/>
      <FAttr name="t" desc={lang === 'es' ? 'Parámetro ∈ [0, 1] en el segmento P₀→P₁' : 'Parameter ∈ [0, 1] along segment P₀→P₁'}/>
    </div>
  );

  return (
    <InterpolationItem
      title={title}
      formulaContent={formulaContent}
      svgPath="cardinalInterpo.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};
