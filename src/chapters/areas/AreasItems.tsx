// AreasItems.tsx — Ítems del capítulo Áreas
// Todos siguen el mismo patrón: tabs Fórmula / Explorar / SVG
// Exporta: TriangleAreaItem, ParallelogramAreaItem, RectangleAreaItem, TrapezeAreaItem, CircleAreaItem, EllipseAreaItem, RegularPolygonAreaItem, PolygonAreaItem

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import type { Lang } from '../../lib/data';

// ── Shared components ─────────────────────────────────--

// Simple draggable point component (copied from intersections)
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

// ── Area Item Component Template ─────────────────────────────────--

const AreaItem = ({ 
  title, 
  formulaPath, 
  svgPath, 
  exploreContent, 
  lang 
}: {
  title: string;
  formulaPath: string;
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
          <img 
            src={`/antiguos/formula/${formulaPath}`} 
            alt={`${title} formula`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
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

// ── Individual Area Items ─────────────────────────────────--

export const TriangleAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Triángulo' : 'Triangle Area';
  const [pointA, setPointA] = useState({ x: 250, y: 100 });
  const [pointB, setPointB] = useState({ x: 150, y: 300 });
  const [pointC, setPointC] = useState({ x: 350, y: 300 });

  // Calculate triangle area using cross product
  const calculateTriangleArea = () => {
    const AB = { x: pointB.x - pointA.x, y: pointB.y - pointA.y };
    const AC = { x: pointC.x - pointA.x, y: pointC.y - pointA.y };
    const crossProduct = Math.abs(AB.x * AC.y - AB.y * AC.x);
    return crossProduct / 2;
  };

  const area = calculateTriangleArea();

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Triángulo Interactiva' : 'Interactive Triangle Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los vértices del triángulo para ver cómo cambia el área en tiempo real.' 
        : 'Drag the triangle vertices to see how the area changes in real time.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-triangle" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-triangle)" />
          
          {/* Triangle */}
          <path d={`M ${pointA.x} ${pointA.y} L ${pointB.x} ${pointB.y} L ${pointC.x} ${pointC.y} Z`} 
                fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Draggable vertices */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointB.x} y={pointB.y} onChange={(x, y) => setPointB({ x, y })} />
          <DragPoint x={pointC.x} y={pointC.y} onChange={(x, y) => setPointC({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointB.x - 15} y={pointB.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={pointC.x + 10} y={pointC.y - 5} fontSize="12" fill="var(--fg-1)">C</text>
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>B: ({pointB.x}, {pointB.y})</div>
            <div>C: ({pointC.x}, {pointC.y})</div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Fórmula: Área = |(B-A) × (C-A)| / 2' : 'Formula: Area = |(B-A) × (C-A)| / 2'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="triangleArea.svg"
      svgPath="triangleArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const RectangleAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Rectángulo' : 'Rectangle Area';
  const [pointA, setPointA] = useState({ x: 150, y: 150 });
  const [pointC, setPointC] = useState({ x: 350, y: 250 });

  // Calculate rectangle area
  const calculateRectangleArea = () => {
    const width = Math.abs(pointC.x - pointA.x);
    const height = Math.abs(pointC.y - pointA.y);
    return width * height;
  };

  const area = calculateRectangleArea();
  const width = Math.abs(pointC.x - pointA.x);
  const height = Math.abs(pointC.y - pointA.y);

  // Calculate other corners
  const pointB = { x: pointC.x, y: pointA.y };
  const pointD = { x: pointA.x, y: pointC.y };

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Rectángulo Interactiva' : 'Interactive Rectangle Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra las esquinas opuestas del rectángulo para ver cómo cambia el área en tiempo real.' 
        : 'Drag opposite corners of the rectangle to see how the area changes in real time.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-rectangle" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-rectangle)" />
          
          {/* Rectangle */}
          <rect x={Math.min(pointA.x, pointC.x)} y={Math.min(pointA.y, pointC.y)} 
                width={width} height={height}
                fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Draggable corners */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointC.x} y={pointC.y} onChange={(x, y) => setPointC({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointC.x + 10} y={pointC.y - 5} fontSize="12" fill="var(--fg-1)">C</text>
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>C: ({pointC.x}, {pointC.y})</div>
            <div>{lang === 'es' ? 'Ancho:' : 'Width:'} {width.toFixed(1)}</div>
            <div>{lang === 'es' ? 'Altura:' : 'Height:'} {height.toFixed(1)}</div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Fórmula: Área = ancho × altura' : 'Formula: Area = width × height'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="rectangleArea.svg"
      svgPath="rectangleArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const CircleAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Círculo' : 'Circle Area';
  const [center, setCenter] = useState({ x: 250, y: 200 });
  const [radius, setRadius] = useState(80);

  const area = Math.PI * radius * radius;

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Círculo Interactiva' : 'Interactive Circle Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra el centro del círculo y ajusta el radio para ver cómo cambia el área.' 
        : 'Drag the circle center and adjust the radius to see how the area changes.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-circle" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-circle)" />
          
          {/* Circle */}
          <circle cx={center.x} cy={center.y} r={radius} 
                  fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Draggable center */}
          <DragPoint x={center.x} y={center.y} onChange={(x, y) => setCenter({ x, y })} />
          
          {/* Label */}
          <text x={center.x - 15} y={center.y - 5} fontSize="12" fill="var(--fg-1)">O</text>
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>O: ({center.x}, {center.y})</div>
            <div>{lang === 'es' ? 'Radio:' : 'Radius:'} {radius}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio:' : 'Radius:'}</label>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Fórmula: Área = π × r²' : 'Formula: Area = π × r²'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="circleArea.svg"
      svgPath="circleArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const EllipseAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Elipse' : 'Ellipse Area';
  const [center, setCenter] = useState({ x: 250, y: 200 });
  const [radiusX, setRadiusX] = useState(100);
  const [radiusY, setRadiusY] = useState(60);

  const area = Math.PI * radiusX * radiusY;

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Elipse Interactiva' : 'Interactive Ellipse Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra el centro de la elipse y ajusta los radios para ver cómo cambia el área.' 
        : 'Drag the ellipse center and adjust the radii to see how the area changes.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-ellipse" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-ellipse)" />
          
          {/* Ellipse */}
          <ellipse cx={center.x} cy={center.y} rx={radiusX} ry={radiusY} 
                   fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Draggable center */}
          <DragPoint x={center.x} y={center.y} onChange={(x, y) => setCenter({ x, y })} />
          
          {/* Label */}
          <text x={center.x - 15} y={center.y - 5} fontSize="12" fill="var(--fg-1)">O</text>
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>O: ({center.x}, {center.y})</div>
            <div>{lang === 'es' ? 'Radio X:' : 'Radius X:'} {radiusX}</div>
            <div>{lang === 'es' ? 'Radio Y:' : 'Radius Y:'} {radiusY}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio X:' : 'Radius X:'}</label>
              <input 
                type="range" 
                min="20" 
                max="150" 
                value={radiusX} 
                onChange={(e) => setRadiusX(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio Y:' : 'Radius Y:'}</label>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={radiusY} 
                onChange={(e) => setRadiusY(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Fórmula: Área = π × rx × ry' : 'Formula: Area = π × rx × ry'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="ellipseArea.svg"
      svgPath="ellipseArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const ParallelogramAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Paralelogramo' : 'Parallelogram Area';
  const [pointA, setPointA] = useState({ x: 150, y: 150 });
  const [pointB, setPointB] = useState({ x: 350, y: 150 });
  const [pointD, setPointD] = useState({ x: 120, y: 250 });

  // Calculate point C to complete the parallelogram (AB parallel to DC)
  const pointC = { x: pointB.x + (pointD.x - pointA.x), y: pointB.y + (pointD.y - pointA.y) };

  // Calculate parallelogram area using cross product
  const calculateParallelogramArea = () => {
    const AB = { x: pointB.x - pointA.x, y: pointB.y - pointA.y };
    const AD = { x: pointD.x - pointA.x, y: pointD.y - pointA.y };
    const crossProduct = Math.abs(AB.x * AD.y - AB.y * AD.x);
    return crossProduct;
  };

  const area = calculateParallelogramArea();

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Paralelogramo Interactiva' : 'Interactive Parallelogram Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra tres vértices del paralelogramo para ver cómo cambia el área en tiempo real.' 
        : 'Drag three vertices of the parallelogram to see how the area changes in real time.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-parallelogram" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-parallelogram)" />
          
          {/* Parallelogram */}
          <path d={`M ${pointA.x} ${pointA.y} L ${pointB.x} ${pointB.y} L ${pointC.x} ${pointC.y} L ${pointD.x} ${pointD.y} Z`} 
                fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Diagonals (dashed) */}
          <line x1={pointA.x} y1={pointA.y} x2={pointC.x} y2={pointC.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={pointB.x} y1={pointB.y} x2={pointD.x} y2={pointD.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Draggable vertices */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointB.x} y={pointB.y} onChange={(x, y) => setPointB({ x, y })} />
          <DragPoint x={pointD.x} y={pointD.y} onChange={(x, y) => setPointD({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointB.x + 10} y={pointB.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={pointC.x + 10} y={pointC.y - 5} fontSize="12" fill="var(--fg-1)">C</text>
          <text x={pointD.x - 15} y={pointD.y - 5} fontSize="12" fill="var(--fg-1)">D</text>
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>B: ({pointB.x}, {pointB.y})</div>
            <div>C: ({pointC.x.toFixed(1)}, {pointC.y.toFixed(1)})</div>
            <div>D: ({pointD.x}, {pointD.y})</div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Fórmula: Área = |AB × AD|' : 'Formula: Area = |AB × AD|'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Punto C se calcula como: C = B + (D-A)' : 'Point C is calculated as: C = B + (D-A)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="parallelogramArea.svg"
      svgPath="parallelogramArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const TrapezeAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Trapecio' : 'Trapeze Area';
  const [pointA, setPointA] = useState({ x: 120, y: 150 });
  const [pointB, setPointB] = useState({ x: 380, y: 150 });
  const [pointC, setPointC] = useState({ x: 320, y: 280 });
  const [pointD, setPointD] = useState({ x: 180, y: 280 });

  // Calculate trapeze area using Shoelace formula
  const calculateTrapezeArea = () => {
    const points = [pointA, pointB, pointC, pointD];
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
  };

  const area = calculateTrapezeArea();

  // Calculate bases and height
  const base1 = Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
  const base2 = Math.sqrt(Math.pow(pointC.x - pointD.x, 2) + Math.pow(pointC.y - pointD.y, 2));

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Trapecio Interactiva' : 'Interactive Trapeze Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los cuatro vértices del trapecio para ver cómo cambia el área en tiempo real.' 
        : 'Drag the four vertices of the trapeze to see how the area changes in real time.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-trapeze" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-trapeze)" />
          
          {/* Trapeze */}
          <path d={`M ${pointA.x} ${pointA.y} L ${pointB.x} ${pointB.y} L ${pointC.x} ${pointC.y} L ${pointD.x} ${pointD.y} Z`} 
                fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Height line (perpendicular to base1) */}
          <line x1={pointD.x} y1={pointD.y} x2={pointD.x} y2={pointA.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Diagonals (dashed) */}
          <line x1={pointA.x} y1={pointA.y} x2={pointC.x} y2={pointC.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={pointB.x} y1={pointB.y} x2={pointD.x} y2={pointD.y} 
                stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Draggable vertices */}
          <DragPoint x={pointA.x} y={pointA.y} onChange={(x, y) => setPointA({ x, y })} />
          <DragPoint x={pointB.x} y={pointB.y} onChange={(x, y) => setPointB({ x, y })} />
          <DragPoint x={pointC.x} y={pointC.y} onChange={(x, y) => setPointC({ x, y })} />
          <DragPoint x={pointD.x} y={pointD.y} onChange={(x, y) => setPointD({ x, y })} />
          
          {/* Labels */}
          <text x={pointA.x - 15} y={pointA.y - 5} fontSize="12" fill="var(--fg-1)">A</text>
          <text x={pointB.x + 10} y={pointB.y - 5} fontSize="12" fill="var(--fg-1)">B</text>
          <text x={pointC.x + 10} y={pointC.y - 5} fontSize="12" fill="var(--fg-1)">C</text>
          <text x={pointD.x - 15} y={pointD.y - 5} fontSize="12" fill="var(--fg-1)">D</text>
          
          {/* Base labels */}
          <text x={(pointA.x + pointB.x) / 2} y={pointA.y - 10} fontSize="10" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Base 1' : 'Base 1'}
          </text>
          <text x={(pointD.x + pointC.x) / 2} y={pointC.y + 20} fontSize="10" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Base 2' : 'Base 2'}
          </text>
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>A: ({pointA.x}, {pointA.y})</div>
            <div>B: ({pointB.x}, {pointB.y})</div>
            <div>C: ({pointC.x}, {pointC.y})</div>
            <div>D: ({pointD.x}, {pointD.y})</div>
            <div style={{ marginTop: 10 }}>
              <div>{lang === 'es' ? 'Base 1:' : 'Base 1:'} {base1.toFixed(1)}</div>
              <div>{lang === 'es' ? 'Base 2:' : 'Base 2:'} {base2.toFixed(1)}</div>
            </div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Fórmula: Área = (Base1 + Base2) × Altura / 2' : 'Formula: Area = (Base1 + Base2) × Height / 2'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Método: Shoelace (calculador de polígonos)' : 'Method: Shoelace (polygon calculator)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="trapezeArea.svg"
      svgPath="trapezeArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};


export const RegularPolygonAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Polígono Regular' : 'Regular Polygon Area';
  const [center, setCenter] = useState({ x: 250, y: 200 });
  const [sides, setSides] = useState(6);
  const [radius, setRadius] = useState(80);

  // Calculate regular polygon area
  const calculateRegularPolygonArea = () => {
    return (sides * radius * radius * Math.sin(2 * Math.PI / sides)) / 2;
  };

  const area = calculateRegularPolygonArea();

  // Generate polygon vertices
  const generatePolygonVertices = () => {
    const vertices = [];
    for (let i = 0; i < sides; i++) {
      const angle = (2 * Math.PI * i) / sides - Math.PI / 2; // Start from top
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      vertices.push({ x, y });
    }
    return vertices;
  };

  const vertices = generatePolygonVertices();
  const polygonPath = vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`).join(' ') + ' Z';

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Polígono Regular Interactiva' : 'Interactive Regular Polygon Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra el centro del polígono y ajusta el número de lados y radio para ver cómo cambia el área.' 
        : 'Drag the polygon center and adjust the number of sides and radius to see how the area changes.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-regular" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-regular)" />
          
          {/* Regular polygon */}
          <path d={polygonPath} fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Radius lines to vertices */}
          {vertices.map((vertex, i) => (
            <line key={i} x1={center.x} y1={center.y} x2={vertex.x} y2={vertex.y} 
                  stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="2,2" />
          ))}
          
          {/* Draggable center */}
          <DragPoint x={center.x} y={center.y} onChange={(x, y) => setCenter({ x, y })} />
          
          {/* Labels */}
          <text x={center.x - 15} y={center.y - 5} fontSize="12" fill="var(--fg-1)">O</text>
          
          {/* Vertex labels */}
          {vertices.map((vertex, i) => (
            <text key={i} x={vertex.x + 10} y={vertex.y - 5} fontSize="10" fill="var(--fg-3)">
              V{i + 1}
            </text>
          ))}
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>O: ({center.x}, {center.y})</div>
            <div>{lang === 'es' ? 'Lados:' : 'Sides:'} {sides}</div>
            <div>{lang === 'es' ? 'Radio:' : 'Radius:'} {radius}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Lados:' : 'Sides:'}</label>
              <input 
                type="range" 
                min="3" 
                max="12" 
                value={sides} 
                onChange={(e) => setSides(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11 }}>{lang === 'es' ? 'Radio:' : 'Radius:'}</label>
              <input 
                type="range" 
                min="30" 
                max="120" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{ width: '100%', marginTop: 5 }}
              />
            </div>
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Fórmula: Área = (n × r² × sin(2π/n)) / 2' : 'Formula: Area = (n × r² × sin(2π/n)) / 2'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="regularPolygonArea.svg"
      svgPath="regularPolygonArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const PolygonAreaItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Área Polígono' : 'Polygon Area';
  const [points, setPoints] = useState([
    { x: 150, y: 100 },
    { x: 350, y: 80 },
    { x: 380, y: 200 },
    { x: 280, y: 320 },
    { x: 120, y: 280 }
  ]);

  // Calculate polygon area using Shoelace formula
  const calculatePolygonArea = () => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
  };

  const area = calculatePolygonArea();

  // Generate polygon path
  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <h3>{lang === 'es' ? 'Área Polígono Interactiva' : 'Interactive Polygon Area'}</h3>
      <p>{lang === 'es' 
        ? 'Arrastra los vértices del polígono para ver cómo cambia el área en tiempo real. Puedes agregar o quitar vértices.' 
        : 'Drag the polygon vertices to see how the area changes in real time. You can add or remove vertices.'}</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <svg width="500" height="400" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)' }}>
          <defs>
            <pattern id="grid-polygon" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="400" fill="url(#grid-polygon)" />
          
          {/* Polygon */}
          <path d={polygonPath} fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="2" />
          
          {/* Diagonals from first vertex */}
          {points.slice(1).map((point, i) => (
            <line key={i} x1={points[0].x} y1={points[0].y} x2={point.x} y2={point.y} 
                  stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="2,2" />
          ))}
          
          {/* Draggable vertices */}
          {points.map((point, i) => (
            <DragPoint key={i} x={point.x} y={point.y} onChange={(x, y) => {
              const newPoints = [...points];
              newPoints[i] = { x, y };
              setPoints(newPoints);
            }} />
          ))}
          
          {/* Labels */}
          {points.map((point, i) => (
            <text key={i} x={point.x - 15} y={point.y - 5} fontSize="12" fill="var(--fg-1)">
              {String.fromCharCode(65 + i)}
            </text>
          ))}
          
          {/* Area display */}
          <text x="250" y="50" fontSize="14" fill="var(--fg-1)" textAnchor="middle">
            {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)}
          </text>
        </svg>
        
        <div style={{ flex: 1 }}>
          <h4>{lang === 'es' ? 'Información' : 'Information'}</h4>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            <div>{lang === 'es' ? 'Vértices:' : 'Vertices:'} {points.length}</div>
            {points.map((point, i) => (
              <div key={i}>{String.fromCharCode(65 + i)}: ({point.x}, {point.y})</div>
            ))}
            <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent)' }}>
              {lang === 'es' ? 'Área:' : 'Area:'} {area.toFixed(1)} unidades²
            </div>
            <div style={{ marginTop: 10 }}>
              <button onClick={() => setPoints(points.slice(0, -1))} 
                      disabled={points.length <= 3}
                      style={{ fontSize: 11, padding: '4px 8px', marginRight: '5px', cursor: 'pointer' }}>
                {lang === 'es' ? 'Quitar vértice' : 'Remove vertex'}
              </button>
              <button onClick={() => setPoints([...points, { x: 250, y: 200 }])} 
                      style={{ fontSize: 11, padding: '4px 8px', cursor: 'pointer' }}>
                {lang === 'es' ? 'Agregar vértice' : 'Add vertex'}
              </button>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Método: Shoelace (calculador de polígonos)' : 'Method: Shoelace (polygon calculator)'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)' }}>
              {lang === 'es' ? 'Mínimo 3 vértices para formar un polígono' : 'Minimum 3 vertices to form a polygon'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AreaItem 
      title={title}
      formulaPath="polygonArea.svg"
      svgPath="polygonArea.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};
