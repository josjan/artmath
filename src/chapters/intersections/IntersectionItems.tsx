// IntersectionItems.tsx — Ítems del capítulo Intersecciones
// Basado en los archivos SVG de antiguos/explore/ y fórmulas de antiguos/formula/
// Exporta: IntersegmentsItem, LineinterItem, InterlinecircleItem, IntersegmentquadraItem,
//          IntersegmentcubicItem, IntercirclesItem, InterdisksItem, InterpolygonsItem, UnionpolygonsItem

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import type { Lang } from '../../lib/data';

// ── Shared components ─────────────────────────────────--

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

// ── Intersection Item Component Template ─────────────────────────────────--

const IntersectionItem = ({ 
  title, 
  svgPath, 
  exploreContent, 
  lang 
}: {
  title: string;
  svgPath: string;
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
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
        }}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 1.6 }}>
            {lang === 'es' ? (
              <div>
                <h3 style={{ marginBottom: 16 }}>Fórmula de intersección</h3>
                <p>Las fórmulas específicas para cada tipo de intersección se implementan usando:</p>
                <ul style={{ textAlign: 'left', maxWidth: 500, margin: '20px auto' }}>
                  <li>Ecuaciones paramétricas para rectas y segmentos</li>
                  <li>Ecuaciones cuadráticas y cúbicas para curvas</li>
                  <li>Ecuaciones de círculos: (x-h)² + (y-k)² = r²</li>
                  <li>Algoritmos de clipping para polígonos</li>
                </ul>
              </div>
            ) : (
              <div>
                <h3 style={{ marginBottom: 16 }}>Intersection formula</h3>
                <p>Specific formulas for each intersection type use:</p>
                <ul style={{ textAlign: 'left', maxWidth: 500, margin: '20px auto' }}>
                  <li>Parametric equations for lines and segments</li>
                  <li>Quadratic and cubic equations for curves</li>
                  <li>Circle equations: (x-h)² + (y-k)² = r²</li>
                  <li>Clipping algorithms for polygons</li>
                </ul>
              </div>
            )}
          </div>
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

      {tab === 'svg' && (
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--hairline)', 
          borderRadius: 'var(--r-md)', 
          padding: 24,
          minHeight: 400
        }}>
          <img 
            src={`/antiguos/explore/${svgPath}`} 
            alt={`${title} interactive`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

// ── Interactive Explore Components ─────────────────────────────────--

const IntersegmentsExplore = ({ lang }: { lang: Lang }) => {
  const [pointA, setPointA] = useState({ x: 100, y: 100 });
  const [pointB, setPointB] = useState({ x: 300, y: 200 });
  const [pointC, setPointC] = useState({ x: 150, y: 250 });
  const [pointD, setPointD] = useState({ x: 350, y: 150 });

  // Calculate intersection point
  const calculateIntersection = () => {
    const x1 = pointA.x, y1 = pointA.y;
    const x2 = pointB.x, y2 = pointB.y;
    const x3 = pointC.x, y3 = pointC.y;
    const x4 = pointD.x, y4 = pointD.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.001) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
      };
    }
    return null;
  };

  const intersection = calculateIntersection();

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección de Segmentos' : 'Segment Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos rojos para mover los segmentos y ver su intersección.' 
        : 'Drag the red points to move segments and see their intersection.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid)" />
          
          {/* Segment AB */}
          <line x1={pointA.x} y1={pointA.y} x2={pointB.x} y2={pointB.y} 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Segment CD */}
          <line x1={pointC.x} y1={pointC.y} x2={pointD.x} y2={pointD.y} 
                stroke="var(--formula)" strokeWidth="2" />
          
          {/* Intersection point */}
          {intersection && (
            <>
              <circle cx={intersection.x} cy={intersection.y} r="6" fill="var(--handle)" />
              <text x={intersection.x + 10} y={intersection.y - 10} 
                    fontSize="12" fill="var(--fg-1)">E</text>
            </>
          )}
          
          {/* Draggable points */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointB.x} y={pointB.y} onChange={(x, y) => setPointB({ x, y })} />
          <DragPoint x={pointC.x} y={pointC.y} onChange={(x, y) => setPointC({ x, y })} />
          <DragPoint x={pointD.x} y={pointD.y} onChange={(x, y) => setPointD({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointB.x + 10} y={pointB.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={pointC.x - 15} y={pointC.y + 15} fontSize="12" fill="var(--fg-1)">C</text>
          <text x={pointD.x + 10} y={pointD.y + 15} fontSize="12" fill="var(--fg-1)">D</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Coordenadas' : 'Coordinates'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>B: ({pointB.x}, {pointB.y})</div>
            <div>C: ({pointC.x}, {pointC.y})</div>
            <div>D: ({pointD.x}, {pointD.y})</div>
            {intersection && (
              <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
                E: ({intersection.x.toFixed(1)}, {intersection.y.toFixed(1)})
              </div>
            )}
            {!intersection && (
              <div style={{ marginTop: 10, color: 'var(--fg-3)' }}>
                {lang === 'es' ? 'Sin intersección' : 'No intersection'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple draggable point component
const DragPoint = ({ x, y, onChange }: { x: number; y: number; onChange: (x: number, y: number) => void }) => {
  const [dragging, setDragging] = useState(false);

  return (
    <circle
      cx={x}
      cy={y}
      r={dragging ? 8 : 6}
      fill="var(--accent)"
      stroke="white"
      strokeWidth="2"
      style={{ cursor: 'grab' }}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onMouseMove={(e) => {
        if (dragging) {
          const svg = e.currentTarget.ownerSVGElement;
          if (svg) {
            const rect = svg.getBoundingClientRect();
            const newX = e.clientX - rect.left;
            const newY = e.clientY - rect.top;
            onChange(Math.max(0, Math.min(500, newX)), Math.max(0, Math.min(400, newY)));
          }
        }
      }}
    />
  );
};

const LineinterExplore = ({ lang }: { lang: Lang }) => {
  const [point1, setPoint1] = useState({ x: 100, y: 300 });
  const [point2, setPoint2] = useState({ x: 400, y: 100 });
  const [point3, setPoint3] = useState({ x: 150, y: 100 });
  const [point4, setPoint4] = useState({ x: 350, y: 350 });

  // Calculate line intersection (infinite lines)
  const calculateLineIntersection = () => {
    const x1 = point1.x, y1 = point1.y;
    const x2 = point2.x, y2 = point2.y;
    const x3 = point3.x, y3 = point3.y;
    const x4 = point4.x, y4 = point4.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.001) return null;

    const intersectX = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
    const intersectY = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

    return { x: intersectX, y: intersectY };
  };

  const intersection = calculateLineIntersection();

  // Extend lines to canvas edges
  const extendLine = (p1: typeof point1, p2: typeof point1) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const extendFactor = 1000 / length;
    
    return {
      start: {
        x: p1.x - dx * extendFactor,
        y: p1.y - dy * extendFactor
      },
      end: {
        x: p2.x + dx * extendFactor,
        y: p2.y + dy * extendFactor
      }
    };
  };

  const line1 = extendLine(point1, point2);
  const line2 = extendLine(point3, point4);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección de Rectas' : 'Line Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos para mover las rectas infinitas y ver su intersección.' 
        : 'Drag the points to move the infinite lines and see their intersection.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid4" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid4)" />
          
          {/* Extended Line 1 */}
          <line x1={line1.start.x} y1={line1.start.y} x2={line1.end.x} y2={line1.end.y} 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Extended Line 2 */}
          <line x1={line2.start.x} y1={line2.start.y} x2={line2.end.x} y2={line2.end.y} 
                stroke="var(--formula)" strokeWidth="2" />
          
          {/* Original segments (lighter) */}
          <line x1={point1.x} y1={point1.y} x2={point2.x} y2={point2.y} 
                stroke="var(--accent)" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
          <line x1={point3.x} y1={point3.y} x2={point4.x} y2={point4.y} 
                stroke="var(--formula)" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
          
          {/* Intersection point */}
          {intersection && intersection.x >= 0 && intersection.x <= 500 && intersection.y >= 0 && intersection.y <= 400 && (
            <>
              <circle cx={intersection.x} cy={intersection.y} r="6" fill="var(--handle)" />
              <text x={intersection.x + 10} y={intersection.y - 10} 
                    fontSize="12" fill="var(--fg-1)">E</text>
            </>
          )}
          
          {/* Draggable points */}
          <DragPoint x={point1.x} y={point1.y} onChange={(x, y) => setPoint1({ x, y })} />
          <DragPoint x={point2.x} y={point2.y} onChange={(x, y) => setPoint2({ x, y })} />
          <DragPoint x={point3.x} y={point3.y} onChange={(x, y) => setPoint3({ x, y })} />
          <DragPoint x={point4.x} y={point4.y} onChange={(x, y) => setPoint4({ x, y })} />
          
          {/* Labels */}
          <text x={point1.x - 15} y={point1.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={point2.x + 10} y={point2.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={point3.x - 15} y={point3.y - 5} fontSize="12" fill="var(--fg-1)">C</text>
          <text x={point4.x + 10} y={point4.y - 5} fontSize="12" fill="var(--fg-1)">D</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Coordenadas' : 'Coordinates'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({point1.x}, {point1.y})</div>
            <div>B: ({point2.x}, {point2.y})</div>
            <div>C: ({point3.x}, {point3.y})</div>
            <div>D: ({point4.x}, {point4.y})</div>
            {intersection && (
              <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
                E: ({intersection.x.toFixed(1)}, {intersection.y.toFixed(1)})
              </div>
            )}
            {!intersection && (
              <div style={{ marginTop: 10, color: 'var(--fg-3)' }}>
                {lang === 'es' ? 'Rectas paralelas' : 'Parallel lines'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InterlinecircleExplore = ({ lang }: { lang: Lang }) => {
  const [linePoint1, setLinePoint1] = useState({ x: 50, y: 200 });
  const [linePoint2, setLinePoint2] = useState({ x: 350, y: 100 });
  const [circleCenter, setCircleCenter] = useState({ x: 200, y: 200 });
  const [radius, setRadius] = useState(80);

  // Calculate line-circle intersection
  const calculateLineCircleIntersection = () => {
    const x1 = linePoint1.x, y1 = linePoint1.y;
    const x2 = linePoint2.x, y2 = linePoint2.y;
    const cx = circleCenter.x, cy = circleCenter.y;
    const r = radius;

    // Line equation: (x2-x1)(y-y1) = (y2-y1)(x-x1)
    const dx = x2 - x1;
    const dy = y2 - y1;
    const fx = x1 - cx;
    const fy = y1 - cy;

    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = (fx * fx + fy * fy) - r * r;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0 || Math.abs(a) < 0.001) return [];

    const sqrt_discriminant = Math.sqrt(discriminant);
    const t1 = (-b - sqrt_discriminant) / (2 * a);
    const t2 = (-b + sqrt_discriminant) / (2 * a);

    const intersections: { x: number; y: number }[] = [];
    if (t1 >= 0 && t1 <= 1) {
      intersections.push({
        x: x1 + t1 * dx,
        y: y1 + t1 * dy
      });
    }
    if (t2 >= 0 && t2 <= 1 && Math.abs(t2 - t1) > 0.001) {
      intersections.push({
        x: x1 + t2 * dx,
        y: y1 + t2 * dy
      });
    }

    return intersections;
  };

  const intersections = calculateLineCircleIntersection();

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección Recta-Círculo' : 'Line-Circle Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos para mover la línea y el círculo.' 
        : 'Drag the points to move the line and circle.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid2)" />
          
          {/* Line */}
          <line x1={linePoint1.x} y1={linePoint1.y} x2={linePoint2.x} y2={linePoint2.y} 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Circle */}
          <circle cx={circleCenter.x} cy={circleCenter.y} r={radius} 
                  fill="var(--formula)" fillOpacity="0.2" stroke="var(--formula)" strokeWidth="2" />
          
          {/* Intersection points */}
          {intersections.map((point, i) => (
            <g key={i}>
              <circle cx={point.x} cy={point.y} r="6" fill="var(--handle)" />
              <text x={point.x + 10} y={point.y - 10} 
                    fontSize="12" fill="var(--fg-1)">{i === 0 ? 'E' : 'F'}</text>
            </g>
          ))}
          
          {/* Draggable points */}
          <DragPoint x={linePoint1.x} y={linePoint1.y} onChange={(x, y) => setLinePoint1({ x, y })} />
          <DragPoint x={linePoint2.x} y={linePoint2.y} onChange={(x, y) => setLinePoint2({ x, y })} />
          <DragPoint x={circleCenter.x} y={circleCenter.y} onChange={(x, y) => setCircleCenter({ x, y })} />
          
          {/* Labels */}
          <text x={linePoint1.x - 15} y={linePoint1.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={linePoint2.x + 10} y={linePoint2.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={circleCenter.x - 15} y={circleCenter.y - 5} fontSize="12" fill="var(--fg-1)">C</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({linePoint1.x}, {linePoint1.y})</div>
            <div>B: ({linePoint2.x}, {linePoint2.y})</div>
            <div>C: ({circleCenter.x}, {circleCenter.y})</div>
            <div>Radio: {radius}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio:' : 'Radius:'}</label>
              <input 
                type="range" 
                min="20" 
                max="150" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {lang === 'es' ? 'Intersecciones:' : 'Intersections:'}
              {intersections.length === 0 && (
                <div style={{ color: 'var(--fg-3)' }}>
                  {lang === 'es' ? 'Ninguna' : 'None'}
                </div>
              )}
              {intersections.map((point, i) => (
                <div key={i} style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                  {i === 0 ? 'E' : 'F'}: ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntersegmentquadraExplore = ({ lang }: { lang: Lang }) => {
  const [pointA, setPointA] = useState({ x: 100, y: 300 });
  const [pointB, setPointB] = useState({ x: 400, y: 150 });
  const [controlPoint, setControlPoint] = useState({ x: 250, y: 100 });

  // Calculate quadratic curve points (parabola)
  const getQuadraticPoint = (t: number) => {
    const x = (1 - t) * (1 - t) * pointA.x + 2 * (1 - t) * t * controlPoint.x + t * t * pointB.x;
    const y = (1 - t) * (1 - t) * pointA.y + 2 * (1 - t) * t * controlPoint.y + t * t * pointB.y;
    return { x, y };
  };

  // Calculate segment-quadratic intersection
  const calculateSegmentQuadraticIntersection = () => {
    const intersections: { x: number; y: number }[] = [];
    const steps = 100;
    
    for (let i = 0; i <= steps; i++) {
      const t1 = i / steps;
      const t2 = (i + 1) / steps;
      
      const p1 = getQuadraticPoint(t1);
      const p2 = getQuadraticPoint(t2);
      
      // Check if segment AB intersects with curve segment p1-p2
      const intersection = calculateSegmentIntersection(
        pointA.x, pointA.y, pointB.x, pointB.y,
        p1.x, p1.y, p2.x, p2.y
      );
      
      if (intersection) {
        intersections.push(intersection);
      }
    }
    
    // Remove duplicates (very close points)
    const filtered: { x: number; y: number }[] = [];
    for (const point of intersections) {
      const isDuplicate = filtered.some(p => 
        Math.abs(p.x - point.x) < 5 && Math.abs(p.y - point.y) < 5
      );
      if (!isDuplicate) {
        filtered.push(point);
      }
    }
    
    return filtered;
  };

  const calculateSegmentIntersection = (x1: number, y1: number, x2: number, y2: number, 
                                        x3: number, y3: number, x4: number, y4: number) => {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.001) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
      };
    }
    return null;
  };

  const intersections = calculateSegmentQuadraticIntersection();

  // Generate quadratic curve path
  const curvePath = `M ${pointA.x} ${pointA.y} Q ${controlPoint.x} ${controlPoint.y} ${pointB.x} ${pointB.y}`;

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección Segmento-Cuadrática' : 'Segment-Quadratic Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos para mover el segmento y la curva cuadrática.' 
        : 'Drag the points to move the segment and quadratic curve.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid5" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid5)" />
          
          {/* Segment AB */}
          <line x1={pointA.x} y1={pointA.y} x2={pointB.x} y2={pointB.y} 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Quadratic curve */}
          <path d={curvePath} fill="none" stroke="var(--formula)" strokeWidth="2" />
          
          {/* Control lines (dashed) */}
          <line x1={pointA.x} y1={pointA.y} x2={controlPoint.x} y2={controlPoint.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={pointB.x} y1={pointB.y} x2={controlPoint.x} y2={controlPoint.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Intersection points */}
          {intersections.map((point, i) => (
            <g key={i}>
              <circle cx={point.x} cy={point.y} r="6" fill="var(--handle)" />
              <text x={point.x + 10} y={point.y - 10} 
                    fontSize="12" fill="var(--fg-1)">{i === 0 ? 'F' : 'G'}</text>
            </g>
          ))}
          
          {/* Draggable points */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointB.x} y={pointB.y} onChange={(x, y) => setPointB({ x, y })} />
          <DragPoint x={controlPoint.x} y={controlPoint.y} onChange={(x, y) => setControlPoint({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointB.x + 10} y={pointB.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={controlPoint.x - 15} y={controlPoint.y - 5} fontSize="12" fill="var(--fg-1)">E</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>B: ({pointB.x}, {pointB.y})</div>
            <div>E (control): ({controlPoint.x}, {controlPoint.y})</div>
            <div style={{ marginTop: 10 }}>
              {lang === 'es' ? 'Intersecciones:' : 'Intersections:'}
              {intersections.length === 0 && (
                <div style={{ color: 'var(--fg-3)' }}>
                  {lang === 'es' ? 'Ninguna' : 'None'}
                </div>
              )}
              {intersections.map((point, i) => (
                <div key={i} style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                  {i === 0 ? 'F' : 'G'}: ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntersegmentcubicExplore = ({ lang }: { lang: Lang }) => {
  const [pointA, setPointA] = useState({ x: 100, y: 300 });
  const [pointB, setPointB] = useState({ x: 400, y: 150 });
  const [controlPoint1, setControlPoint1] = useState({ x: 200, y: 50 });
  const [controlPoint2, setControlPoint2] = useState({ x: 350, y: 350 });

  // Calculate cubic curve points
  const getCubicPoint = (t: number) => {
    const x = Math.pow(1 - t, 3) * pointA.x + 
              3 * Math.pow(1 - t, 2) * t * controlPoint1.x + 
              3 * (1 - t) * Math.pow(t, 2) * controlPoint2.x + 
              Math.pow(t, 3) * pointB.x;
    const y = Math.pow(1 - t, 3) * pointA.y + 
              3 * Math.pow(1 - t, 2) * t * controlPoint1.y + 
              3 * (1 - t) * Math.pow(t, 2) * controlPoint2.y + 
              Math.pow(t, 3) * pointB.y;
    return { x, y };
  };

  // Calculate segment-cubic intersection
  const calculateSegmentCubicIntersection = () => {
    const intersections: {x: number, y: number}[] = [];
    const steps = 100;
    
    for (let i = 0; i <= steps; i++) {
      const t1 = i / steps;
      const t2 = (i + 1) / steps;
      
      const p1 = getCubicPoint(t1);
      const p2 = getCubicPoint(t2);
      
      // Check if segment AB intersects with curve segment p1-p2
      const intersection = calculateSegmentIntersection(
        pointA.x, pointA.y, pointB.x, pointB.y,
        p1.x, p1.y, p2.x, p2.y
      );
      
      if (intersection) {
        intersections.push(intersection);
      }
    }
    
    // Remove duplicates (very close points)
    const filtered: {x: number, y: number}[] = [];
    for (const point of intersections) {
      const isDuplicate = filtered.some(p => 
        Math.abs(p.x - point.x) < 5 && Math.abs(p.y - point.y) < 5
      );
      if (!isDuplicate) {
        filtered.push(point);
      }
    }
    
    return filtered;
  };

  const calculateSegmentIntersection = (x1: number, y1: number, x2: number, y2: number, 
                                        x3: number, y3: number, x4: number, y4: number) => {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.001) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
      };
    }
    return null;
  };

  const intersections = calculateSegmentCubicIntersection();

  // Generate cubic curve path
  const curvePath = `M ${pointA.x} ${pointA.y} C ${controlPoint1.x} ${controlPoint1.y} ${controlPoint2.x} ${controlPoint2.y} ${pointB.x} ${pointB.y}`;

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección Segmento-Cúbica' : 'Segment-Cubic Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los puntos para mover el segmento y la curva cúbica.' 
        : 'Drag the points to move the segment and cubic curve.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid6" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid6)" />
          
          {/* Segment AB */}
          <line x1={pointA.x} y1={pointA.y} x2={pointB.x} y2={pointB.y} 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Cubic curve */}
          <path d={curvePath} fill="none" stroke="var(--formula)" strokeWidth="2" />
          
          {/* Control lines (dashed) */}
          <line x1={pointA.x} y1={pointA.y} x2={controlPoint1.x} y2={controlPoint1.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={pointB.x} y1={pointB.y} x2={controlPoint2.x} y2={controlPoint2.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={controlPoint1.x} y1={controlPoint1.y} x2={controlPoint2.x} y2={controlPoint2.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Intersection points */}
          {intersections.map((point, i) => (
            <g key={i}>
              <circle cx={point.x} cy={point.y} r="6" fill="var(--handle)" />
              <text x={point.x + 10} y={point.y - 10} 
                    fontSize="12" fill="var(--fg-1)">{['M', 'N', 'P'][i] || `${i+1}`}</text>
            </g>
          ))}
          
          {/* Draggable points */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointB.x} y={pointB.y} onChange={(x, y) => setPointB({ x, y })} />
          <DragPoint x={controlPoint1.x} y={controlPoint1.y} onChange={(x, y) => setControlPoint1({ x, y })} />
          <DragPoint x={controlPoint2.x} y={controlPoint2.y} onChange={(x, y) => setControlPoint2({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointB.x + 10} y={pointB.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={controlPoint1.x - 15} y={controlPoint1.y - 5} fontSize="12" fill="var(--fg-1)">E</text>
          <text x={controlPoint2.x + 10} y={controlPoint2.y - 5} fontSize="12" fill="var(--fg-1)">F</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>B: ({pointB.x}, {pointB.y})</div>
            <div>E (control1): ({controlPoint1.x}, {controlPoint1.y})</div>
            <div>F (control2): ({controlPoint2.x}, {controlPoint2.y})</div>
            <div style={{ marginTop: 10 }}>
              {lang === 'es' ? 'Intersecciones:' : 'Intersections:'}
              {intersections.length === 0 && (
                <div style={{ color: 'var(--fg-3)' }}>
                  {lang === 'es' ? 'Ninguna' : 'None'}
                </div>
              )}
              {intersections.map((point, i) => (
                <div key={i} style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                  {['M', 'N', 'P'][i] || `${i+1}`}: ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntercirclesExplore = ({ lang }: { lang: Lang }) => {
  const [center1, setCenter1] = useState({ x: 150, y: 200 });
  const [center2, setCenter2] = useState({ x: 300, y: 200 });
  const [radius1, setRadius1] = useState(80);
  const [radius2, setRadius2] = useState(60);

  // Calculate circle-circle intersection
  const calculateCircleCircleIntersection = () => {
    const x1 = center1.x, y1 = center1.y, r1 = radius1;
    const x2 = center2.x, y2 = center2.y, r2 = radius2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(dx * dx + dy * dy);

    // No intersection or one circle contains the other
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return [];

    // Calculate intersection points
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);

    const px = x1 + (a * dx) / d;
    const py = y1 + (a * dy) / d;

    const intersections: { x: number; y: number }[] = [];
    
    // First intersection point
    intersections.push({
      x: px + (h * dy) / d,
      y: py - (h * dx) / d
    });

    // Second intersection point (if distinct)
    if (h > 0.001) {
      intersections.push({
        x: px - (h * dy) / d,
        y: py + (h * dx) / d
      });
    }

    return intersections;
  };

  const intersections = calculateCircleCircleIntersection();

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección de Círculos' : 'Circle-Circle Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los centros y ajusta los radios para ver las intersecciones.' 
        : 'Drag the centers and adjust radii to see intersections.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid3)" />
          
          {/* Circle 1 */}
          <circle cx={center1.x} cy={center1.y} r={radius1} 
                  fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Circle 2 */}
          <circle cx={center2.x} cy={center2.y} r={radius2} 
                  fill="var(--formula)" fillOpacity="0.2" stroke="var(--formula)" strokeWidth="2" />
          
          {/* Intersection points */}
          {intersections.map((point, i) => (
            <g key={i}>
              <circle cx={point.x} cy={point.y} r="6" fill="var(--handle)" />
              <text x={point.x + 10} y={point.y - 10} 
                    fontSize="12" fill="var(--fg-1)">{i === 0 ? 'E' : 'F'}</text>
            </g>
          ))}
          
          {/* Draggable centers */}
          <DragPoint x={center1.x} y={center1.y} onChange={(x, y) => setCenter1({ x, y })} />
          <DragPoint x={center2.x} y={center2.y} onChange={(x, y) => setCenter2({ x, y })} />
          
          {/* Labels */}
          <text x={center1.x - 15} y={center1.y - 5} fontSize="12" fill="var(--fg-1)">W</text>
          <text x={center2.x - 15} y={center2.y - 5} fontSize="12" fill="var(--fg-1)">W'</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>W: ({center1.x}, {center1.y})</div>
            <div>W': ({center2.x}, {center2.y})</div>
            <div>Radio 1: {radius1}</div>
            <div>Radio 2: {radius2}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio 1:' : 'Radius 1:'}</label>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={radius1} 
                onChange={(e) => setRadius1(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio 2:' : 'Radius 2:'}</label>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={radius2} 
                onChange={(e) => setRadius2(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {lang === 'es' ? 'Intersecciones:' : 'Intersections:'}
              {intersections.length === 0 && (
                <div style={{ color: 'var(--fg-3)' }}>
                  {lang === 'es' ? 'Ninguna' : 'None'}
                </div>
              )}
              {intersections.map((point, i) => (
                <div key={i} style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                  {i === 0 ? 'E' : 'F'}: ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InterdisksExplore = ({ lang }: { lang: Lang }) => {
  const [center1, setCenter1] = useState({ x: 150, y: 200 });
  const [center2, setCenter2] = useState({ x: 300, y: 200 });
  const [radius1, setRadius1] = useState(80);
  const [radius2, setRadius2] = useState(60);

  // Calculate disk intersection area
  const calculateDiskIntersectionArea = () => {
    const x1 = center1.x, y1 = center1.y, r1 = radius1;
    const x2 = center2.x, y2 = center2.y, r2 = radius2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(dx * dx + dy * dy);

    // No intersection
    if (d > r1 + r2) return 0;
    
    // One disk completely contains the other
    if (d < Math.abs(r1 - r2)) {
      return Math.PI * Math.min(r1, r2) * Math.min(r1, r2);
    }

    // Partial intersection - use lens formula
    const part1 = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
    const part2 = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
    const part3 = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
    
    return part1 + part2 - part3;
  };

  const intersectionArea = calculateDiskIntersectionArea();

  // Generate intersection path (lens shape)
  const generateIntersectionPath = () => {
    const x1 = center1.x, y1 = center1.y, r1 = radius1;
    const x2 = center2.x, y2 = center2.y, r2 = radius2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > r1 + r2 || d < Math.abs(r1 - r2)) return '';

    // Calculate intersection points
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);

    const px = x1 + (a * dx) / d;
    const py = y1 + (a * dy) / d;

    const intersection1X = px + (h * dy) / d;
    const intersection1Y = py - (h * dx) / d;
    const intersection2X = px - (h * dy) / d;
    const intersection2Y = py + (h * dx) / d;

    // Create lens path
    const largeArc1 = h > 0.001 ? 0 : 1;
    const largeArc2 = h > 0.001 ? 0 : 1;

    return `M ${intersection1X} ${intersection1Y} 
            A ${r1} ${r1} 0 ${largeArc1} 1 ${intersection2X} ${intersection2Y}
            A ${r2} ${r2} 0 ${largeArc2} 0 ${intersection1X} ${intersection1Y} Z`;
  };

  const intersectionPath = generateIntersectionPath();

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección de Discos' : 'Disk Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los centros y ajusta los radios para ver el área de superposición.' 
        : 'Drag the centers and adjust radii to see the overlap area.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid7" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid7)" />
          
          {/* Disk 1 */}
          <circle cx={center1.x} cy={center1.y} r={radius1} 
                  fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Disk 2 */}
          <circle cx={center2.x} cy={center2.y} r={radius2} 
                  fill="var(--formula)" fillOpacity="0.3" stroke="var(--formula)" strokeWidth="2" />
          
          {/* Intersection area (lens) */}
          {intersectionPath && (
            <path d={intersectionPath} fill="var(--handle)" fillOpacity="0.5" />
          )}
          
          {/* Draggable centers */}
          <DragPoint x={center1.x} y={center1.y} onChange={(x, y) => setCenter1({ x, y })} />
          <DragPoint x={center2.x} y={center2.y} onChange={(x, y) => setCenter2({ x, y })} />
          
          {/* Labels */}
          <text x={center1.x - 15} y={center1.y - 5} fontSize="12" fill="var(--fg-1)">W</text>
          <text x={center2.x - 15} y={center2.y - 5} fontSize="12" fill="var(--fg-1)">W'</text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Parámetros' : 'Parameters'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>W: ({center1.x}, {center1.y})</div>
            <div>W': ({center2.x}, {center2.y})</div>
            <div>Radio 1: {radius1}</div>
            <div>Radio 2: {radius2}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio 1:' : 'Radius 1:'}</label>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={radius1} 
                onChange={(e) => setRadius1(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio 2:' : 'Radius 2:'}</label>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={radius2} 
                onChange={(e) => setRadius2(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {lang === 'es' ? 'Área de intersección:' : 'Intersection area:'}
              <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                {intersectionArea.toFixed(1)} unidades²
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InterpolygonsExplore = ({ lang }: { lang: Lang }) => {
  const [polygon1, setPolygon1] = useState([
    { x: 150, y: 150 },
    { x: 250, y: 100 },
    { x: 350, y: 150 },
    { x: 350, y: 250 },
    { x: 250, y: 300 },
    { x: 150, y: 250 }
  ]);
  const [polygon2, setPolygon2] = useState([
    { x: 200, y: 120 },
    { x: 320, y: 180 },
    { x: 280, y: 280 },
    { x: 160, y: 220 }
  ]);

  // Simple polygon intersection visualization (showing overlap area)
  const generatePolygonPath = (points: typeof polygon1) => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  };

  const polygon1Path = generatePolygonPath(polygon1);
  const polygon2Path = generatePolygonPath(polygon2);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Intersección de Polígonos' : 'Polygon Intersection'}</h3>
      <p>{lang === 'es' 
        ? 'Observa la superposición entre dos polígonos.' 
        : 'Observe the overlap between two polygons.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid8" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid8)" />
          
          {/* Polygon 1 */}
          <path d={polygon1Path} 
                fill="var(--accent)" fillOpacity="0.3" 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Polygon 2 */}
          <path d={polygon2Path} 
                fill="var(--formula)" fillOpacity="0.3" 
                stroke="var(--formula)" strokeWidth="2" />
          
          {/* Vertices */}
          {polygon1.map((point, i) => (
            <DragPoint 
              key={`p1-${i}`} 
              x={point.x} y={point.y} 
              onChange={(x, y) => {
                const newPolygon = [...polygon1];
                newPolygon[i] = { x, y };
                setPolygon1(newPolygon);
              }} 
            />
          ))}
          
          {polygon2.map((point, i) => (
            <DragPoint 
              key={`p2-${i}`} 
              x={point.x} y={point.y} 
              onChange={(x, y) => {
                const newPolygon = [...polygon2];
                newPolygon[i] = { x, y };
                setPolygon2(newPolygon);
              }} 
            />
          ))}
          
          {/* Labels */}
          <text x={200} y={80} fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Polígono 1' : 'Polygon 1'}
          </text>
          <text x={300} y={320} fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Polígono 2' : 'Polygon 2'}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>{lang === 'es' ? 'Polígono 1:' : 'Polygon 1:'} {polygon1.length} {lang === 'es' ? 'vértices' : 'vertices'}</div>
            <div>{lang === 'es' ? 'Polígono 2:' : 'Polygon 2:'} {polygon2.length} {lang === 'es' ? 'vértices' : 'vertices'}</div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' 
                ? 'Arrastra los vértices para modificar los polígonos.' 
                : 'Drag vertices to modify the polygons.'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' 
                ? 'El área de superposición se muestra en la intersección visual.' 
                : 'The overlap area is shown in the visual intersection.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UnionpolygonsExplore = ({ lang }: { lang: Lang }) => {
  const [polygon1, setPolygon1] = useState([
    { x: 120, y: 180 },
    { x: 180, y: 120 },
    { x: 280, y: 120 },
    { x: 340, y: 180 },
    { x: 340, y: 260 },
    { x: 280, y: 320 },
    { x: 180, y: 320 },
    { x: 120, y: 260 }
  ]);
  const [polygon2, setPolygon2] = useState([
    { x: 200, y: 160 },
    { x: 380, y: 200 },
    { x: 340, y: 340 },
    { x: 160, y: 300 }
  ]);

  // Simple polygon union visualization
  const generatePolygonPath = (points: typeof polygon1) => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  };

  const polygon1Path = generatePolygonPath(polygon1);
  const polygon2Path = generatePolygonPath(polygon2);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Unión de Polígonos' : 'Polygon Union'}</h3>
      <p>{lang === 'es' 
        ? 'Observa el área combinada cubierta por ambos polígonos.' 
        : 'Observe the combined area covered by both polygons.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid9" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid9)" />
          
          {/* Polygon 1 */}
          <path d={polygon1Path} 
                fill="var(--accent)" fillOpacity="0.4" 
                stroke="var(--accent)" strokeWidth="2" />
          
          {/* Polygon 2 */}
          <path d={polygon2Path} 
                fill="var(--formula)" fillOpacity="0.4" 
                stroke="var(--formula)" strokeWidth="2" />
          
          {/* Vertices */}
          {polygon1.map((point, i) => (
            <DragPoint 
              key={`p1-${i}`} 
              x={point.x} y={point.y} 
              onChange={(x, y) => {
                const newPolygon = [...polygon1];
                newPolygon[i] = { x, y };
                setPolygon1(newPolygon);
              }} 
            />
          ))}
          
          {polygon2.map((point, i) => (
            <DragPoint 
              key={`p2-${i}`} 
              x={point.x} y={point.y} 
              onChange={(x, y) => {
                const newPolygon = [...polygon2];
                newPolygon[i] = { x, y };
                setPolygon2(newPolygon);
              }} 
            />
          ))}
          
          {/* Labels */}
          <text x={230} y={90} fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Unión de Polígonos' : 'Polygon Union'}
          </text>
          <text x={100} y={380} fontSize="12" fill="var(--accent)">
            {lang === 'es' ? 'Polígono 1' : 'Polygon 1'}
          </text>
          <text x={350} y="380" fontSize="12" fill="var(--formula)">
            {lang === 'es' ? 'Polígono 2' : 'Polygon 2'}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>{lang === 'es' ? 'Polígono 1:' : 'Polygon 1:'} {polygon1.length} {lang === 'es' ? 'vértices' : 'vertices'}</div>
            <div>{lang === 'es' ? 'Polígono 2:' : 'Polygon 2:'} {polygon2.length} {lang === 'es' ? 'vértices' : 'vertices'}</div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' 
                ? 'Arrastra los vértices para modificar los polígonos.' 
                : 'Drag vertices to modify the polygons.'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' 
                ? 'El área total cubierta se muestra visualmente.' 
                : 'The total covered area is shown visually.'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--accent)' }}>
              {lang === 'es' 
                ? 'La unión incluye todas las áreas de ambos polígonos.' 
                : 'The union includes all areas of both polygons.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Export Components ─────────────────────────────────--

export const IntersegmentsItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección de Segmentos' : 'Segment Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="intersegments.svg"
      exploreContent={<IntersegmentsExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const LineinterItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección de Rectas' : 'Line Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="lineinter.svg"
      exploreContent={<LineinterExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const InterlinecircleItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección Recta-Círculo' : 'Line-Circle Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="interlinecircle.svg"
      exploreContent={<InterlinecircleExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const IntersegmentquadraItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección Segmento-Cuadrática' : 'Segment-Quadratic Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="intersegmentquadra.svg"
      exploreContent={<IntersegmentquadraExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const IntersegmentcubicItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección Segmento-Cúbica' : 'Segment-Cubic Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="intersegmentcubic.svg"
      exploreContent={<IntersegmentcubicExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const IntercirclesItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección de Círculos' : 'Circle-Circle Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="intercircles.svg"
      exploreContent={<IntercirclesExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const InterdisksItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección de Discos' : 'Disk Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="interdisks.svg"
      exploreContent={<InterdisksExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const InterpolygonsItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Intersección de Polígonos' : 'Polygon Intersection';
  return (
    <IntersectionItem 
      title={title}
      svgPath="interpolygons.svg"
      exploreContent={<InterpolygonsExplore lang={lang} />}
      lang={lang}
    />
  );
};

export const UnionpolygonsItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Unión de Polígonos' : 'Polygon Union';
  return (
    <IntersectionItem 
      title={title}
      svgPath="unionpolygons.svg"
      exploreContent={<UnionpolygonsExplore lang={lang} />}
      lang={lang}
    />
  );
};
