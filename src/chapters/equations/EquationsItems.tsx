// EquationsItems.tsx — Interactive equation components

import { useState } from 'react';
import { type Lang } from '../../lib/data';

// Reusable DragPoint component
const DragPoint = ({ x, y, onChange }: { 
  x: number; 
  y: number; 
  onChange: (x: number, y: number) => void;
}) => {
  const [drag, setDrag] = useState(false);
  
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDrag(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const svg = e.currentTarget as SVGElement;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onChange(x, y);
  };

  const onPointerUp = () => setDrag(false);

  return (
    <circle
      cx={x}
      cy={y}
      r="8"
      fill="var(--accent)"
      stroke="white"
      strokeWidth="2"
      style={{ cursor: drag ? 'grabbing' : 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
};

// Reusable EquationItem component
const EquationItem = ({ title, formulaPath, svgPath, exploreContent, lang }: {
  title: string;
  formulaPath: string;
  svgPath: string;
  exploreContent: React.ReactNode;
  lang: Lang;
}) => {
  const [tab, setTab] = useState('explore');
  const C = lang === 'es' ? {
    tabFormula: 'Fórmula',
    tabExplore: 'Explorar',
    tabSvg: 'SVG'
  } : {
    tabFormula: 'Formula',
    tabExplore: 'Explore',
    tabSvg: 'SVG'
  };

  return (
    <div>
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start',
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-sm)', padding: 3, gap: 2, marginBottom: 16,
      }}>
        {([
          { id: 'formula', label: C.tabFormula },
          { id: 'explore', label: C.tabExplore },
          { id: 'svg',     label: C.tabSvg },
        ] as const).map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{
              padding: '7px 14px', borderRadius: 'var(--r-xs)',
              background: tab === tb.id ? 'var(--surface-3)' : 'transparent',
              color: tab === tb.id ? 'var(--fg-1)' : 'var(--fg-3)',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}>
            {tb.label}
          </button>
        ))}
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden',
      }}>
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <img src={`/antiguos/formula/${formulaPath}`} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
        {tab === 'explore' && (
          <div style={{ padding: '20px' }}>
            {exploreContent}
          </div>
        )}
        {tab === 'svg' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <img src={`/antiguos/explore/${svgPath}`} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </div>
    </div>
  );
};

// Linear Equation (Degree 1)
export const Degree1EquationItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Ecuación Lineal' : 'Linear Equation';
  const [pointA, setPointA] = useState({ x: 100, y: 200 });
  const [pointB, setPointB] = useState({ x: 400, y: 100 });

  // Calculate line equation: y = mx + b
  const calculateLineEquation = () => {
    const deltaX = pointB.x - pointA.x;
    const deltaY = pointB.y - pointA.y;
    
    // Handle vertical line (deltaX = 0)
    if (Math.abs(deltaX) < 0.001) {
      return { m: Infinity, b: Infinity, isVertical: true };
    }
    
    const m = deltaY / deltaX;
    const b = pointA.y - m * pointA.x;
    return { m, b, isVertical: false };
  };

  const { m, b, isVertical } = calculateLineEquation();

  // Calculate x-intercept (where y = 0)
  const xIntercept = (!isVertical && m !== 0 && m !== Infinity) ? -b / m : null;
  // Calculate y-intercept (where x = 0)
  const yIntercept = (!isVertical && b !== Infinity) ? b : null;

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Ecuación Lineal Interactiva' : 'Interactive Linear Equation'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los dos puntos para ver cómo cambia la ecuación de la recta en tiempo real.' 
        : 'Drag the two points to see how the line equation changes in real time.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-linear" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-linear)" />
          
          {/* Axes */}
          <line x1="0" y1="200" x2="500" y2="200" stroke="var(--fg-2)" strokeWidth="1.2"/>
          <line x1="250" y1="0" x2="250" y2="400" stroke="var(--fg-2)" strokeWidth="1.2"/>
          
          {/* Line */}
          <line x1={pointA.x} y1={pointA.y} x2={pointB.x} y2={pointB.y} 
                stroke="var(--accent)" strokeWidth="3"/>
          
          {/* Extended line across the canvas */}
          {!isVertical && (
            <line x1="0" y1={b} x2="500" y2={m * 500 + b} 
                  stroke="var(--accent)" strokeWidth="1" strokeDasharray="5,5" opacity="0.5"/>
          )}
          {isVertical && (
            <line x1={pointA.x} y1="0" x2={pointA.x} y2="400" 
                  stroke="var(--accent)" strokeWidth="1" strokeDasharray="5,5" opacity="0.5"/>
          )}
          
          {/* Draggable points */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointB.x} y={pointB.y} onChange={(x, y) => setPointB({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointB.x + 10} y={pointB.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          
          {/* Intercepts */}
          {xIntercept !== null && xIntercept >= 0 && xIntercept <= 500 && (
            <>
              <circle cx={xIntercept} cy={200} r="4" fill="var(--handle)" />
              <text x={xIntercept} y={220} fontSize="10" fill="var(--handle)" textAnchor="middle">
                x-intercept
              </text>
            </>
          )}
          {yIntercept !== null && yIntercept >= 0 && yIntercept <= 400 && (
            <>
              <circle cx={250} cy={yIntercept} r="4" fill="var(--construction)" />
              <text x={270} y={yIntercept} fontSize="10" fill="var(--construction)">
                y-intercept
              </text>
            </>
          )}
          
          {/* Equation display */}
          <text x="250" y="30" fontSize="16" fill="var(--fg-1)" textAnchor="middle" fontFamily="var(--font-math)" fontStyle="italic">
            {isVertical 
              ? `x = ${pointA.x.toFixed(2)}` 
              : `y = ${m.toFixed(2)}x ${b >= 0 ? '+' : ''} ${b.toFixed(2)}`
            }
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>B: ({pointB.x}, {pointB.y})</div>
            <div style={{ marginTop: 10 }}>
              <div>{lang === 'es' ? 'Pendiente (m):' : 'Slope (m):'} {isVertical ? '∞' : m.toFixed(3)}</div>
              <div>{lang === 'es' ? 'Intercepto (b):' : 'Intercept (b):'} {isVertical ? 'N/A' : b.toFixed(3)}</div>
            </div>
            <div style={{ marginTop: 10 }}>
              {xIntercept !== null && (
                <div>{lang === 'es' ? 'Intercepto X:' : 'X-intercept:'} {xIntercept.toFixed(3)}</div>
              )}
              {yIntercept !== null && (
                <div>{lang === 'es' ? 'Intercepto Y:' : 'Y-intercept:'} {yIntercept.toFixed(3)}</div>
              )}
              {isVertical && (
                <div>{lang === 'es' ? 'Tipo:' : 'Type:'} {lang === 'es' ? 'Línea vertical' : 'Vertical line'}</div>
              )}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {isVertical 
                ? (lang === 'es' ? 'Fórmula: x = constante' : 'Formula: x = constant')
                : (lang === 'es' ? 'Fórmula: y = mx + b' : 'Formula: y = mx + b')
              }
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {isVertical 
                ? (lang === 'es' ? 'Línea vertical (x₁ = x₂)' : 'Vertical line (x₁ = x₂)')
                : (lang === 'es' ? 'm = (y₂-y₁)/(x₂-x₁)' : 'm = (y₂-y₁)/(x₂-x₁)')
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EquationItem 
      title={title}
      formulaPath="eqdegre1.svg"
      svgPath="eqdegre1.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const calculateCubicRoots = (a: number, b: number, c: number, d: number) => {
  const f = (x: number) => a * x * x * x + b * x * x + c * x + d;
  const roots: number[] = [];

  const testPoints = [-10, -5, -2, -1, -0.5, 0, 0.5, 1, 2, 5, 10];

  for (let i = 0; i < testPoints.length - 1; i++) {
    const x1 = testPoints[i];
    const x2 = testPoints[i + 1];
    const y1 = f(x1);
    const y2 = f(x2);

    if (y1 === 0) {
      roots.push(x1);
    } else if (y1 * y2 < 0) {
      let left = x1, right = x2;
      for (let j = 0; j < 10; j++) {
        const mid = (left + right) / 2;
        const ymid = f(mid);
        if (ymid === 0) {
          roots.push(mid);
          break;
        }
        if (y1 * ymid < 0) {
          right = mid;
        } else {
          left = mid;
        }
      }
      roots.push((left + right) / 2);
    }
  }

  return roots.slice(0, 3);
};

export const calculateQuarticRoots = (a: number, b: number, c: number, d: number, e: number) => {
  const f = (x: number) => a * x * x * x * x + b * x * x * x + c * x * x + d * x + e;
  const roots: number[] = [];

  const testPoints = [-10, -5, -2, -1, -0.5, 0, 0.5, 1, 2, 5, 10];

  for (let i = 0; i < testPoints.length - 1; i++) {
    const x1 = testPoints[i];
    const x2 = testPoints[i + 1];
    const y1 = f(x1);
    const y2 = f(x2);

    if (y1 === 0) {
      roots.push(x1);
    } else if (y1 * y2 < 0) {
      let left = x1, right = x2;
      for (let j = 0; j < 10; j++) {
        const mid = (left + right) / 2;
        const ymid = f(mid);
        if (ymid === 0) {
          roots.push(mid);
          break;
        }
        if (y1 * ymid < 0) {
          right = mid;
        } else {
          left = mid;
        }
      }
      roots.push((left + right) / 2);
    }
  }

  return roots.slice(0, 4);
};

// Cubic Figure Component
export const CubicFigure = ({ a, b, c, d }: { a: number; b: number; c: number; d: number }) => {
  const roots = calculateCubicRoots(a, b, c, d);

  // Generate curve points
  const generateCurvePoints = () => {
    const points: string[] = [];
    const xMin = -5, xMax = 5;
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = a * x * x * x + b * x * x + c * x + d;
      const px = 360 + x * 40;
      const py = 230 - y * 20;
      if (py >= 0 && py <= 460) {
        points.push(`${points.length === 0 ? 'M' : 'L'}${px} ${py}`);
      }
    }
    return points.join(' ');
  };

  const curvePath = generateCurvePoints();

  return (
    <svg width="720" height="460" style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--surface)' }}>
      <defs>
        <pattern id="eqgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="eqgridBold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#eqgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={720} height={460} fill="url(#eqgridBold)"/>

      <line x1={0} y1={230} x2={720} y2={230} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={360} y1={0} x2={360} y2={460} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={720 - 14} y={230 - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={360 + 8}  y={14}    fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={360 + t * 40} y1={230 - 4} x2={360 + t * 40} y2={230 + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={360 + t * 40} y={230 + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}

      <path d={curvePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Roots */}
      {roots.map((root, i) => {
        const px = 360 + root * 40;
        const py = 230; // y = 0
        return (
          <g key={i}>
            <circle cx={px} cy={py} r="7" fill="var(--handle)" stroke="white" strokeWidth="2"/>
            <text x={px} y={py + 22} fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" textAnchor="middle">
              x={root.toFixed(2)}
            </text>
          </g>
        );
      })}

      <circle cx={360} cy={230} r="3" fill="var(--fg-1)"/>
    </svg>
  );
};

// Quartic Figure Component
export const QuarticFigure = ({ a, b, c, d, e }: { a: number; b: number; c: number; d: number; e: number }) => {
  const roots = calculateQuarticRoots(a, b, c, d, e);

  // Generate curve points
  const generateCurvePoints = () => {
    const points: string[] = [];
    const xMin = -5, xMax = 5;
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = a * x * x * x * x + b * x * x * x + c * x * x + d * x + e;
      const px = 360 + x * 40;
      const py = 230 - y * 20;
      if (py >= 0 && py <= 460) {
        points.push(`${points.length === 0 ? 'M' : 'L'}${px} ${py}`);
      }
    }
    return points.join(' ');
  };

  const curvePath = generateCurvePoints();

  return (
    <svg width="720" height="460" style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--surface)' }}>
      <defs>
        <pattern id="eqgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="eqgridBold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#eqgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={720} height={460} fill="url(#eqgridBold)"/>

      <line x1={0} y1={230} x2={720} y2={230} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={360} y1={0} x2={360} y2={460} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={720 - 14} y={230 - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={360 + 8}  y={14}    fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={360 + t * 40} y1={230 - 4} x2={360 + t * 40} y2={230 + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={360 + t * 40} y={230 + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}

      <path d={curvePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Roots */}
      {roots.map((root, i) => {
        const px = 360 + root * 40;
        const py = 230; // y = 0
        return (
          <g key={i}>
            <circle cx={px} cy={py} r="7" fill="var(--handle)" stroke="white" strokeWidth="2"/>
            <text x={px} y={py + 22} fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" textAnchor="middle">
              x={root.toFixed(2)}
            </text>
          </g>
        );
      })}

      <circle cx={360} cy={230} r="3" fill="var(--fg-1)"/>
    </svg>
  );
};

