// CartesianItem.tsx — Sistema cartesiano: dos puntos arrastrables A y B,
// proyecciones en ejes, vector AB, coordenadas y módulo en tiempo real.
// Mismo formato que DragFigure en VectorsModule.

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { STRINGS, type Lang } from '../../lib/data';
import { type Route } from '../../components/AppShell';

interface Vec2 { x: number; y: number; }

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

// ── Strings locales ───────────────────────────────────────────────
const STR = {
  es: {
    title:   'Sistema cartesiano',
    blurb:   'Representación de puntos y vectores en el plano ℝ².',
    formula: {
      title: 'Coordenadas cartesianas',
      body:  'Un punto en el plano se define por sus coordenadas (x, y), que indican su distancia al origen a lo largo de cada eje. El vector AB tiene componentes Vx = xB − xA y Vy = yB − yA.',
    },
    inspector: {
      pointA:    'Punto A',
      pointB:    'Punto B',
      vector:    'Vector AB',
      length:    'Longitud',
      angle:     'Ángulo',
      hint:      'Arrastra los puntos rojos para recalcular.',
      projX:     'Proy. X',
      projY:     'Proy. Y',
    },
    derivation: [
      'Sea A = (xA, yA) un punto del plano cartesiano.',
      'Sea B = (xB, yB) otro punto del plano.',
      'El vector AB tiene componentes Vx = xB − xA y Vy = yB − yA.',
      'La longitud del vector es |AB| = √(Vx² + Vy²) — teorema de Pitágoras.',
      'El ángulo con el eje X es θ = atan2(Vy, Vx) expresado en grados.',
    ],
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
  },
  en: {
    title:   'Cartesian system',
    blurb:   'Representing points and vectors in the ℝ² plane.',
    formula: {
      title: 'Cartesian coordinates',
      body:  'A point in the plane is defined by its coordinates (x, y), indicating its distance from the origin along each axis. Vector AB has components Vx = xB − xA and Vy = yB − yA.',
    },
    inspector: {
      pointA:    'Point A',
      pointB:    'Point B',
      vector:    'Vector AB',
      length:    'Length',
      angle:     'Angle',
      hint:      'Drag the red points to recompute.',
      projX:     'X Proj.',
      projY:     'Y Proj.',
    },
    derivation: [
      'Let A = (xA, yA) be a point in the cartesian plane.',
      'Let B = (xB, yB) be another point in the plane.',
      'Vector AB has components Vx = xB − xA and Vy = yB − yA.',
      'The vector length is |AB| = √(Vx² + Vy²) — Pythagorean theorem.',
      'The angle with the X-axis is θ = atan2(Vy, Vx) expressed in degrees.',
    ],
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
  },
};

// Puntos iniciales en coordenadas matemáticas (y hacia arriba)
const DEFAULT_A: Vec2 = { x: -100, y: -80 };
const DEFAULT_B: Vec2 = { x: 140, y: 100 };

export const CartesianItem = ({ lang }: Props) => {
  const s = STR[lang];
  // const C = STRINGS[lang].chapter;

  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>(DEFAULT_A);
  const [b, setB] = useState<Vec2>(DEFAULT_B);

  // Derived values
  // const vx  = b.x - a.x;
  // const vy  = b.y - a.y;
  // const len = Math.hypot(vx, vy);
  // const deg = (Math.atan2(vy, vx) * 180 / Math.PI).toFixed(1);
  // const fmt = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(1);

  const stepBtn: React.CSSProperties = {
    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-xs)', padding: 4, cursor: 'pointer',
    color: 'var(--fg-2)', display: 'inline-flex',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tabs */}
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start',
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-sm)', padding: 3, gap: 2,
      }}>
        {(['formula', 'explore', 'svg'] as const).map(id => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              padding: '7px 14px', borderRadius: 'var(--r-xs)',
              background: tab === id ? 'var(--surface-3)' : 'transparent',
              color: tab === id ? 'var(--fg-1)' : 'var(--fg-3)',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}>
            {s.tabs[id]}
          </button>
        ))}
      </div>

      {/* Figure */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden',
      }}>
        {tab === 'explore' && <CartesianFigure a={a} b={b} setA={setA} setB={setB} />}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <SvgPane />}
      </div>

      {/* Derivation */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)', padding: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>{s.derivationTitle}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-3)', fontSize: 12 }}>
            <button onClick={() => setStep(Math.max(0, step - 1))} style={stepBtn}><Icon name="ChevronLeft" size={14}/></button>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              {s.step} {step + 1} {s.of} {s.derivation.length}
            </span>
            <button onClick={() => setStep(Math.min(s.derivation.length - 1, step + 1))} style={stepBtn}><Icon name="ChevronRight" size={14}/></button>
          </div>
        </div>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {s.derivation.map((txt, i) => (
            <li key={i} style={{
              display: 'flex', gap: 12, padding: '8px 12px',
              background: i === step ? 'var(--highlight-soft)' : 'transparent',
              borderLeft: i === step ? '3px solid var(--highlight)' : '3px solid transparent',
              borderRadius: 'var(--r-xs)',
              color: i === step ? 'var(--fg-1)' : 'var(--fg-3)',
              fontSize: 14, lineHeight: 1.5,
              transition: 'background var(--dur-fast) var(--ease-out)',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-4)', fontSize: 12 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span dangerouslySetInnerHTML={{ __html: txt.replace(/\b([AB])\b/g, '<i class="math" style="color:var(--accent)">$1</i>') }} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

// ── Figura interactiva ────────────────────────────────────────────
const CartesianFigure = ({ a, b, setA, setB }: {
  a: Vec2; b: Vec2;
  setA: (p: Vec2) => void;
  setB: (p: Vec2) => void;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | null>(null);

  const W = 720, H = 460;
  const ox = W / 2, oy = H / 2;  // origin in SVG coords
  //const SCALE = 2;                 // px per unit (each unit = 2px → grid lines every 50px = 25 units)

  // Math coords → SVG coords
  const toSvg = (p: Vec2) => ({ x: ox + p.x, y: oy - p.y });
  const aS = toSvg(a), bS = toSvg(b);

  // Derived
  const vx   = b.x - a.x;
  const vy   = b.y - a.y;
  //const len  = Math.hypot(vx, vy).toFixed(2);
  const deg  = (Math.atan2(vy, vx) * 180 / Math.PI).toFixed(1);
  //const fmtC = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(0);

  const onPointerDown = (which: 'A' | 'B') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    // Snap to grid (25px = 1 unit in our display)
    const SNAP = 25;
    const mx = Math.round((sx - ox) / SNAP) * SNAP;
    const my = Math.round((oy - sy) / SNAP) * SNAP;
    const p: Vec2 = { x: mx, y: my };
    if (drag.current === 'A') setA(p);
    if (drag.current === 'B') setB(p);
  };

  // Grid ticks — every 25px = 1 display unit
  const STEP = 25;
  const ticksX: number[] = [];
  const ticksY: number[] = [];
  for (let x = STEP; x < W / 2; x += STEP) { ticksX.push(x); ticksX.push(-x); }
  for (let y = STEP; y < H / 2; y += STEP) { ticksY.push(y); ticksY.push(-y); }

  // Convert math coords to display label (each 25px = 1 unit)
  const toLabel = (px: number) => (px / STEP).toFixed(0);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}
    >
      <defs>
        {/* Grid */}
        <pattern id="cgrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="cgridBold" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#cgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        {/* Arrowheads */}
        <marker id="carrAB" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id="carrProjX" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
        </marker>
        <marker id="carrProjY" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--construction)"/>
        </marker>
        <marker id="carrAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
      </defs>

      {/* Background grid */}
      <rect width={W} height={H} fill="url(#cgridBold)"/>

      {/* Axes */}
      <line x1={10} y1={oy} x2={W - 10} y2={oy} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#carrAxis)"/>
      <line x1={ox} y1={H - 10} x2={ox} y2={10} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#carrAxis)"/>

      {/* Axis labels */}
      <text x={W - 18} y={oy - 10} fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--fg-2)">x</text>
      <text x={ox + 10} y={20}     fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--fg-2)">y</text>
      <text x={ox - 18} y={oy + 18} fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">0</text>

      {/* Tick labels — only major ticks (every 5 units = 125px) */}
      {[-4, -3, -2, -1, 1, 2, 3, 4].map(t => (
        <g key={`tx${t}`}>
          <line x1={ox + t * 125 / 5} y1={oy - 4} x2={ox + t * 125 / 5} y2={oy + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox + t * 125 / 5} y={oy + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t * 5}</text>
        </g>
      ))}
      {[-3, -2, -1, 1, 2, 3].map(t => (
        <g key={`ty${t}`}>
          <line x1={ox - 4} y1={oy - t * 125 / 5} x2={ox + 4} y2={oy - t * 125 / 5} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox - 8} y={oy - t * 125 / 5 + 4} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="end">{t * 5}</text>
        </g>
      ))}

      {/*
        Geometría del triángulo rectángulo:
          A  = (aS.x, aS.y)        — punto origen del vector
          B  = (bS.x, bS.y)        — punto destino
          C  = (bS.x, aS.y)        — esquina del ángulo recto (mismo x que B, mismo y que A)

          Vx: A → C  (horizontal)
          Vy: C → B  (vertical)
          AB: A → B  (hipotenusa = vector)
      */}

      {/* ── Proyecciones punteadas A y B a los ejes ──────── */}
      <line x1={aS.x} y1={aS.y} x2={aS.x} y2={oy} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4 3"/>
      <line x1={aS.x} y1={aS.y} x2={ox}   y2={aS.y} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4 3"/>
      <line x1={bS.x} y1={bS.y} x2={bS.x} y2={oy} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4 3"/>
      <line x1={bS.x} y1={bS.y} x2={ox}   y2={bS.y} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4 3"/>

      {/* ── Vx: A → C = (bS.x, aS.y), horizontal ────────── */}
      {vx !== 0 && (
        <>
          <line
            x1={aS.x} y1={aS.y}
            x2={bS.x + (vx > 0 ? -12 : 12)} y2={aS.y}
            stroke="var(--formula)" strokeWidth="2" markerEnd="url(#carrProjX)"/>
          <text
            x={(aS.x + bS.x) / 2}
            y={aS.y + (vy >= 0 ? 20 : -10)}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="14"
            fill="var(--formula)" textAnchor="middle">
            Vx
          </text>
        </>
      )}

      {/* ── Vy: C → B = (bS.x, aS.y) → (bS.x, bS.y), vertical ── */}
      {vy !== 0 && (
        <>
          <line
            x1={bS.x} y1={aS.y}
            x2={bS.x} y2={bS.y + (vy > 0 ? 12 : -12)}
            stroke="var(--construction)" strokeWidth="2" markerEnd="url(#carrProjY)"/>
          <text
            x={bS.x + (vx >= 0 ? 16 : -16)}
            y={(aS.y + bS.y) / 2 + 5}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="14"
            fill="var(--construction)" textAnchor="middle">
            Vy
          </text>
        </>
      )}

      {/* ── Ángulo recto en la esquina C = (bS.x, aS.y) ─── */}
      {vx !== 0 && vy !== 0 && (
        <rect
          x={bS.x + (vx > 0 ? -8 : 0)}
          y={aS.y + (vy > 0 ? 0 : -8)}
          width="8" height="8"
          fill="none" stroke="var(--fg-4)" strokeWidth="0.8"/>
      )}

      {/* ── Vector AB (hipotenusa): A → B ────────────────── */}
      {(() => {
        // Calcular el punto final de la línea retrasado para que la punta de flecha llegue a B
        const len = Math.hypot(vx, vy);
        if (len < 1) return null;
        const ARROW = 12;
        const ux = vx / len, uy = -vy / len; // dirección en SVG (y invertido)
        return (
          <line
            x1={aS.x} y1={aS.y}
            x2={bS.x - ux * ARROW} y2={bS.y - uy * ARROW}
            stroke="var(--accent)" strokeWidth="2.5" markerEnd="url(#carrAB)"/>
        );
      })()}

      {/* ── Origin dot ───────────────────────────────────── */}
      <circle cx={ox} cy={oy} r="3.5" fill="var(--fg-1)"/>

      {/* ── Drag handles ─────────────────────────────────── */}
      <DragHandle
        x={aS.x} y={aS.y}
        label="A" color="var(--handle)"
        onPointerDown={onPointerDown('A')}
      />
      <DragHandle
        x={bS.x} y={bS.y}
        label="B" color="var(--accent)"
        onPointerDown={onPointerDown('B')}
      />

      {/* ── Coordinate readout overlay (top-left) ────────── */}
      <rect x="8" y="8" width="200" height="74" rx="6"
        fill="var(--surface)" fillOpacity="0.92"
        stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="18" y="26" fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--fg-3)">
        A = ({toLabel(a.x)}, {toLabel(a.y)})
      </text>
      <text x="18" y="44" fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--fg-3)">
        B = ({toLabel(b.x)}, {toLabel(b.y)})
      </text>
      <text x="18" y="62" fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--fg-3)">
        Vx = {toLabel(vx)}  ·  Vy = {toLabel(vy)}
      </text>
      <text x="18" y="76" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-4)">
        |AB| = {(Math.hypot(vx, vy) / STEP).toFixed(2)}  ·  θ = {deg}°
      </text>
    </svg>
  );
};

// ── Drag handle ───────────────────────────────────────────────────
const DragHandle = ({ x, y, label, color, onPointerDown }: {
  x: number; y: number; label: string; color: string;
  onPointerDown: (e: React.PointerEvent) => void;
}) => (
  <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
    <circle cx={x} cy={y} r="14" fill={color} fillOpacity="0.12"/>
    <circle cx={x} cy={y} r="6"  fill={color} stroke="white" strokeWidth="2"/>
    <text
      x={x + (label === 'A' ? -14 : 14)} y={y - 10}
      fontFamily="var(--font-math)" fontStyle="italic" fontSize="16"
      fill={color} textAnchor="middle">
      {label}
    </text>
  </g>
);

// ── Formula pane ──────────────────────────────────────────────────
const FormulaPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].formula;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{s.title}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560, lineHeight: 1.6 }}>{s.body}</p>

      {/* Coordinate formula */}
      <div style={{
        marginTop: 24, padding: 24, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Componentes del vector' : 'Vector components'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 22, lineHeight: 2 }}>
            <div><i style={{ color: 'var(--formula)' }}>Vx</i> = <i>x</i><sub>B</sub> − <i>x</i><sub>A</sub></div>
            <div><i style={{ color: 'var(--construction)' }}>Vy</i> = <i>y</i><sub>B</sub> − <i>y</i><sub>A</sub></div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Módulo y ángulo' : 'Length & angle'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 20, lineHeight: 2.2 }}>
            <div>
              |<i style={{ color: 'var(--accent)' }}>AB</i>| = √(<i style={{ color: 'var(--formula)' }}>Vx</i>² + <i style={{ color: 'var(--construction)' }}>Vy</i>²)
            </div>
            <div>
              <i>θ</i> = atan2(<i style={{ color: 'var(--construction)' }}>Vy</i>, <i style={{ color: 'var(--formula)' }}>Vx</i>)
            </div>
          </div>
        </div>
      </div>

      {/* Quadrant diagram */}
      <div style={{ marginTop: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 160 140" style={{ width: 160, flexShrink: 0 }}>
          <line x1="80" y1="130" x2="80" y2="10"  stroke="var(--fg-3)" strokeWidth="1.2"/>
          <line x1="10" y1="70"  x2="150" y2="70" stroke="var(--fg-3)" strokeWidth="1.2"/>
          <line x1="80" y1="70" x2="130" y2="30" stroke="var(--accent)" strokeWidth="2"/>
          <line x1="80" y1="70" x2="130" y2="70" stroke="var(--formula)" strokeWidth="1.5" strokeDasharray="3 2"/>
          <line x1="130" y1="70" x2="130" y2="30" stroke="var(--construction)" strokeWidth="1.5" strokeDasharray="3 2"/>
          <circle cx="80" cy="70" r="3" fill="var(--fg-1)"/>
          <circle cx="130" cy="30" r="5" fill="var(--accent)" stroke="white" strokeWidth="1.5"/>
          <text x="83" y="68" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">O</text>
          <text x="134" y="28" fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--accent)">B</text>
          <text x="105" y="82" fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--formula)">Vx</text>
          <text x="134" y="54" fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--construction)">Vy</text>
          <path d="M 92 70 A 12 12 0 0 1 88 60" fill="none" stroke="var(--fg-3)" strokeWidth="1"/>
          <text x="96" y="64" fontFamily="var(--font-math)" fontStyle="italic" fontSize="11" fill="var(--fg-3)">θ</text>
        </svg>
        <p style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          {lang === 'es'
            ? 'El ángulo θ se mide desde el eje X positivo en sentido antihorario. Los cuatro cuadrantes determinan el signo de las componentes.'
            : 'Angle θ is measured from the positive X-axis counterclockwise. The four quadrants determine the sign of each component.'}
        </p>
      </div>
    </div>
  );
};

// ── SVG code pane ─────────────────────────────────────────────────
const SvgPane = () => (
  <pre style={{
    margin: 0, padding: 24, fontSize: 12.5, lineHeight: 1.6, minHeight: 460,
    overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)',
  }}>
{`// Coordenadas cartesianas — SVG snippet
// Convierte coords matemáticas (y↑) a coords SVG (y↓)
const ox = svgWidth / 2, oy = svgHeight / 2;

function toSvg(x, y) {
  return { x: ox + x * scale, y: oy - y * scale };
}

// Calcular componentes del vector AB
const vx = B.x - A.x;
const vy = B.y - A.y;
const length = Math.sqrt(vx * vx + vy * vy);
const angle  = Math.atan2(vy, vx) * 180 / Math.PI;

// Líneas de proyección (dashed)
projX.setAttribute("x1", toSvg(A.x, 0).x);
projX.setAttribute("x2", toSvg(B.x, 0).x);
projY.setAttribute("y1", toSvg(0, A.y).y);
projY.setAttribute("y2", toSvg(0, B.y).y);

// Vector AB
const aS = toSvg(A.x, A.y);
const bS = toSvg(B.x, B.y);
vectorLine.setAttribute("x1", aS.x);
vectorLine.setAttribute("y1", aS.y);
vectorLine.setAttribute("x2", bS.x);
vectorLine.setAttribute("y2", bS.y);

// Moderno: D3-drag + Motion One
import { drag } from "d3-drag";
import { animate } from "motion";

drag().on("drag", (e, d) => {
  d.x = Math.round(e.x / gridSnap) * gridSnap;
  d.y = Math.round(e.y / gridSnap) * gridSnap;
  updateAll();
});`}
  </pre>
);
