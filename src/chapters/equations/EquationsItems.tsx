// EquationsItems.tsx — Interactive equation components

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { type Lang } from '../../lib/data';

interface Vec2 { x: number; y: number; }

// ── Strings for linear equation ───────────────────────────────────
const LINEAR_STR = {
  es: {
    formula: {
      title: 'Forma pendiente-intercepto',
      body:  'Toda recta no vertical puede escribirse como y = mx + b, donde m es la pendiente y b es el intercepto con el eje Y.',
    },
    derivation: [
      'Una ecuación lineal tiene la forma y = mx + b.',
      'Dados dos puntos A = (x₁, y₁) y B = (x₂, y₂), la pendiente es m = (y₂ − y₁) / (x₂ − x₁).',
      'El intercepto b se obtiene sustituyendo un punto: b = y₁ − m · x₁.',
      'La longitud del segmento AB es |AB| = √((x₂−x₁)² + (y₂−y₁)²).',
      'Para cualquier punto (x, y) en la recta se cumple: y − y₁ = m(x − x₁).',
    ],
    tabs: { formula: 'Fórmula', explore: 'Explorar' },
    step: 'Paso', of: 'de',
    derivationTitle: 'Derivación',
    coefficients: 'Coeficientes',
    slope: 'Pendiente',
    intercept: 'Intercepto',
    length: 'Longitud',
  },
  en: {
    formula: {
      title: 'Slope-intercept form',
      body:  'Any non-vertical line can be written as y = mx + b, where m is the slope and b is the y-intercept.',
    },
    derivation: [
      'A linear equation has the form y = mx + b.',
      'Given two points A = (x₁, y₁) and B = (x₂, y₂), the slope is m = (y₂ − y₁) / (x₂ − x₁).',
      'The y-intercept b is found by substituting a point: b = y₁ − m · x₁.',
      'The length of segment AB is |AB| = √((x₂−x₁)² + (y₂−y₁)²).',
      'For any point (x, y) on the line: y − y₁ = m(x − x₁).',
    ],
    tabs: { formula: 'Formula', explore: 'Explore' },
    step: 'Step', of: 'of',
    derivationTitle: 'Derivation',
    coefficients: 'Coefficients',
    slope: 'Slope',
    intercept: 'Intercept',
    length: 'Length',
  },
};

// Points stored in math-pixel space — same convention as CartesianItem.
// STEP=25px per display unit. A=(-5,2), B=(3,-4) in display units.
const LIN_STEP = 25;
const DEFAULT_LA: Vec2 = { x: -5 * LIN_STEP, y:  2 * LIN_STEP };
const DEFAULT_LB: Vec2 = { x:  3 * LIN_STEP, y: -4 * LIN_STEP };

// Linear Equation (Degree 1)
export const Degree1EquationItem = ({ lang }: { lang: Lang }) => {
  const s = LINEAR_STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore'>('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>(DEFAULT_LA);
  const [b, setB] = useState<Vec2>(DEFAULT_LB);

  const stepBtn: React.CSSProperties = {
    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-xs)', padding: 4, cursor: 'pointer',
    color: 'var(--fg-2)', display: 'inline-flex',
  };

  // Derived — kept here so sliders can read them
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const isVertical = Math.abs(vx) < 0.5;
  const mDisp  = isVertical ? Infinity : vy / vx;
  const bDisp  = isVertical ? NaN : a.y / LIN_STEP - mDisp * (a.x / LIN_STEP);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tabs */}
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start',
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-sm)', padding: 3, gap: 2,
      }}>
        {(['formula', 'explore'] as const).map(id => (
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
        {tab === 'explore' && <LinearFigure a={a} b={b} setA={setA} setB={setB} lang={lang} />}
        {tab === 'formula' && <LinearFormulaPane lang={lang} />}
      </div>

      {/* Coefficient sliders — only in explore tab */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {s.coefficients}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* m slider */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 16, color: 'var(--accent)', minWidth: 12 }}>m</span>
                <input type="range" min="-5" max="5" step="0.1"
                  value={isVertical ? 0 : +mDisp.toFixed(2)}
                  onChange={(e) => {
                    const newM = parseFloat(e.target.value);
                    setB({ x: b.x, y: a.y + newM * (b.x - a.x) });
                  }}
                  disabled={isVertical}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', minWidth: 40 }}>
                  {isVertical ? '∞' : mDisp.toFixed(1)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{s.slope}</div>
            </div>
            {/* b slider */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 16, color: 'var(--formula)', minWidth: 12 }}>b</span>
                <input type="range" min="-8" max="8" step="0.1"
                  value={isVertical ? 0 : +Math.max(-8, Math.min(8, bDisp)).toFixed(2)}
                  onChange={(e) => {
                    const newBDisp = parseFloat(e.target.value);
                    const delta = (newBDisp - bDisp) * LIN_STEP;
                    setA({ ...a, y: a.y + delta });
                    setB({ ...b, y: b.y + delta });
                  }}
                  disabled={isVertical}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', minWidth: 40 }}>
                  {isVertical ? 'N/A' : Math.max(-8, Math.min(8, bDisp)).toFixed(1)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{s.intercept}</div>
            </div>
          </div>
        </div>
      )}

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
              <span>{txt}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

// ── Interactive figure ────────────────────────────────────────────
const LinearFigure = ({ a, b, setA, setB, lang }: {
  a: Vec2; b: Vec2;
  setA: (p: Vec2) => void;
  setB: (p: Vec2) => void;
  lang: Lang;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | null>(null);
  const s    = LINEAR_STR[lang];

  const W = 720, H = 460;
  const ox = W / 2, oy = H / 2;

  const toSvg    = (p: Vec2) => ({ x: ox + p.x, y: oy - p.y });
  const toLabel  = (px: number) => (px / LIN_STEP).toFixed(0);
  const aS = toSvg(a), bS = toSvg(b);

  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const isVertical = Math.abs(vx) < 0.5;
  const mDisp = isVertical ? Infinity : vy / vx;
  const bDisp = isVertical ? NaN : a.y / LIN_STEP - mDisp * (a.x / LIN_STEP);
  const lenStr = (Math.hypot(vx, vy) / LIN_STEP).toFixed(2);

  const fmtEq = () => {
    if (isVertical) return `x = ${toLabel(a.x)}`;
    const sign = bDisp >= 0 ? '+' : '';
    return `y = ${mDisp.toFixed(2)}x ${sign}${bDisp.toFixed(2)}`;
  };

  // Extended line: find where it crosses SVG x=0 and x=W
  const extY = (svgX: number) =>
    aS.y + (svgX - aS.x) * (bS.y - aS.y) / (bS.x - aS.x);

  const onPointerDown = (which: 'A' | 'B') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    const mx = Math.round((sx - ox) / LIN_STEP) * LIN_STEP;
    const my = Math.round((oy - sy) / LIN_STEP) * LIN_STEP;
    const p: Vec2 = { x: mx, y: my };
    if (drag.current === 'A') setA(p);
    if (drag.current === 'B') setB(p);
  };

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
        <pattern id="lingrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="lingridBold" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#lingrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="linAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
      </defs>

      <rect width={W} height={H} fill="url(#lingridBold)"/>

      {/* Axes */}
      <line x1={10} y1={oy} x2={W - 10} y2={oy} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#linAxis)"/>
      <line x1={ox} y1={H - 10} x2={ox} y2={10} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#linAxis)"/>

      {/* Axis labels */}
      <text x={W - 18} y={oy - 10} fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--fg-2)">x</text>
      <text x={ox + 10} y={20}     fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--fg-2)">y</text>
      <text x={ox - 18} y={oy + 18} fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">0</text>

      {/* Tick labels — every 5 units = 125px */}
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

      {/* Extended dashed line */}
      {!isVertical && (
        <line x1={0} y1={extY(0)} x2={W} y2={extY(W)}
              stroke="var(--accent)" strokeWidth="1" strokeDasharray="6 4" opacity="0.45"/>
      )}
      {isVertical && (
        <line x1={aS.x} y1={0} x2={aS.x} y2={H}
              stroke="var(--accent)" strokeWidth="1" strokeDasharray="6 4" opacity="0.45"/>
      )}

      {/* Segment A–B */}
      <line x1={aS.x} y1={aS.y} x2={bS.x} y2={bS.y}
            stroke="var(--accent)" strokeWidth="3"/>

      {/* Origin dot */}
      <circle cx={ox} cy={oy} r="3.5" fill="var(--fg-1)"/>

      {/* Drag handles */}
      <LinearDragHandle x={aS.x} y={aS.y} label="A" color="var(--handle)"  onPointerDown={onPointerDown('A')}/>
      <LinearDragHandle x={bS.x} y={bS.y} label="B" color="var(--accent)" onPointerDown={onPointerDown('B')}/>

      {/* Info overlay (top-left) */}
      <rect x="8" y="8" width="230" height={isVertical ? 44 : 84} rx="6"
        fill="var(--surface)" fillOpacity="0.92"
        stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="18" y="28" fontFamily="var(--font-mono)" fontSize="12" fill="var(--accent)" fontWeight="600">
        {fmtEq()}
      </text>
      {!isVertical && (
        <>
          <text x="18" y="46" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
            A: ({toLabel(a.x)}, {toLabel(a.y)})  B: ({toLabel(b.x)}, {toLabel(b.y)})
          </text>
          <text x="18" y="62" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
            m = {mDisp.toFixed(2)}  ·  b = {bDisp.toFixed(2)}
          </text>
          <text x="18" y="78" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-4)">
            {s.length}: {lenStr}
          </text>
        </>
      )}
      {isVertical && (
        <text x="18" y="44" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
          A: ({toLabel(a.x)}, {toLabel(a.y)})
        </text>
      )}
    </svg>
  );
};

// ── Drag handle ───────────────────────────────────────────────────
const LinearDragHandle = ({ x, y, label, color, onPointerDown }: {
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
const LinearFormulaPane = ({ lang }: { lang: Lang }) => {
  const s = LINEAR_STR[lang].formula;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{s.title}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560, lineHeight: 1.6 }}>{s.body}</p>

      <div style={{
        marginTop: 24, padding: 24, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Forma general' : 'General form'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 24, lineHeight: 2 }}>
            <div><i>y</i> = <i style={{ color: 'var(--accent)' }}>m</i><i>x</i> + <i style={{ color: 'var(--formula)' }}>b</i></div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Pendiente e intercepto' : 'Slope & intercept'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 20, lineHeight: 2.2 }}>
            <div>
              <i style={{ color: 'var(--accent)' }}>m</i> = (y<sub>B</sub> − y<sub>A</sub>) / (x<sub>B</sub> − x<sub>A</sub>)
            </div>
            <div>
              <i style={{ color: 'var(--formula)' }}>b</i> = y<sub>A</sub> − <i style={{ color: 'var(--accent)' }}>m</i> · x<sub>A</sub>
            </div>
          </div>
        </div>
      </div>

      {/* Mini diagram */}
      <div style={{ marginTop: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 160 140" style={{ width: 160, flexShrink: 0 }}>
          <line x1="10" y1="70"  x2="150" y2="70"  stroke="var(--fg-3)" strokeWidth="1.2"/>
          <line x1="80" y1="130" x2="80"  y2="10"  stroke="var(--fg-3)" strokeWidth="1.2"/>
          <line x1="10" y1="100" x2="150" y2="30"  stroke="var(--accent)" strokeWidth="2"/>
          <circle cx="80" cy="70" r="3" fill="var(--fg-1)"/>
          <circle cx="80" cy="55" r="5" fill="var(--formula)" stroke="white" strokeWidth="1.5"/>
          <text x="87" y="54" fontFamily="var(--font-math)" fontStyle="italic" fontSize="12" fill="var(--formula)">b</text>
          <line x1="100" y1="62" x2="130" y2="62" stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="3 2"/>
          <line x1="130" y1="62" x2="130" y2="47" stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="3 2"/>
          <text x="113" y="73"  fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-3)" textAnchor="middle">Δx</text>
          <text x="136" y="57"  fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-3)">Δy</text>
          <text x="94"  y="41"  fontFamily="var(--font-math)" fontStyle="italic" fontSize="11" fill="var(--accent)">m=Δy/Δx</text>
        </svg>
        <p style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          {lang === 'es'
            ? 'La pendiente m indica cuánto sube (o baja) y por cada unidad que avanza x. El intercepto b es donde la recta cruza el eje Y.'
            : 'The slope m shows how much y rises (or falls) per unit of x. The intercept b is where the line crosses the Y-axis.'}
        </p>
      </div>
    </div>
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

// ── Shared curve figure helpers ───────────────────────────────────
const CURVE_W = 720, CURVE_H = 460;
const CURVE_SCALE = Math.min(CURVE_W, CURVE_H) / 20; // 23px per display unit

const CurveAxes = () => {
  const ox = CURVE_W / 2, oy = CURVE_H / 2;
  const sc = CURVE_SCALE;
  return (
    <>
      <line x1={0} y1={oy} x2={CURVE_W} y2={oy} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={ox} y1={0} x2={ox} y2={CURVE_H} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={CURVE_W - 14} y={oy - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={ox + 8} y={14} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>
      {[-8, -6, -4, -2, 2, 4, 6, 8].map(t => (
        <g key={t}>
          <line x1={ox + t * sc} y1={oy - 4} x2={ox + t * sc} y2={oy + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox + t * sc} y={oy + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}
      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={ox - 4} y1={oy - t * sc} x2={ox + 4} y2={oy - t * sc} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox - 8} y={oy - t * sc + 3} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="end">{t}</text>
        </g>
      ))}
    </>
  );
};

// Cubic Figure Component
export const CubicFigure = ({ a, b, c, d, setD }: {
  a: number; b: number; c: number; d: number;
  setD: (v: number) => void;
}) => {
  const svgRef  = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const roots = calculateCubicRoots(a, b, c, d);
  const ox = CURVE_W / 2, oy = CURVE_H / 2;
  const sc = CURVE_SCALE;

  const points: string[] = [];
  for (let x = -8; x <= 8; x += 0.05) {
    const y  = a * x * x * x + b * x * x + c * x + d;
    const px = ox + x * sc, py = oy - y * sc;
    if (py >= 0 && py <= CURVE_H)
      points.push(`${points.length === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`);
  }

  const handleSvgY = oy - d * sc;
  const handleVisible = handleSvgY > 10 && handleSvgY < CURVE_H - 10;

  const onHandleDown = (e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    isDragging.current = true;
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const sy = (e.clientY - r.top) * (CURVE_H / r.height);
    setD(Math.round((oy - sy) / sc * 2) / 2);
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { isDragging.current = false; }}
      onPointerLeave={() => { isDragging.current = false; }}>
      <defs>
        <pattern id="cubic-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="cubic-grid-bold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#cubic-grid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={CURVE_W} height={CURVE_H} fill="url(#cubic-grid-bold)"/>
      <CurveAxes />
      <path d={points.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Root markers */}
      {roots.map((root, i) => {
        const px = ox + root * sc;
        return (
          <g key={i}>
            <circle cx={px} cy={oy} r="7" fill="var(--handle)" stroke="white" strokeWidth="2"/>
            <text x={px} y={oy + 22} fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" textAnchor="middle">
              x={root.toFixed(2)}
            </text>
          </g>
        );
      })}

      <circle cx={ox} cy={oy} r="3" fill="var(--fg-1)"/>

      {/* Y-intercept drag handle (changes d) */}
      {handleVisible && (
        <g style={{ cursor: 'ns-resize' }} onPointerDown={onHandleDown}>
          <circle cx={ox} cy={handleSvgY} r="14" fill="var(--construction)" fillOpacity="0.15"/>
          <circle cx={ox} cy={handleSvgY} r="6"  fill="var(--construction)" stroke="white" strokeWidth="2"/>
          <text x={ox + 16} y={handleSvgY + 4} fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--construction)">d</text>
        </g>
      )}
    </svg>
  );
};

// Quartic Figure Component
export const QuarticFigure = ({ a, b, c, d, e, setE }: {
  a: number; b: number; c: number; d: number; e: number;
  setE: (v: number) => void;
}) => {
  const svgRef  = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const roots = calculateQuarticRoots(a, b, c, d, e);
  const ox = CURVE_W / 2, oy = CURVE_H / 2;
  const sc = CURVE_SCALE;

  const points: string[] = [];
  for (let x = -8; x <= 8; x += 0.05) {
    const y  = a * x * x * x * x + b * x * x * x + c * x * x + d * x + e;
    const px = ox + x * sc, py = oy - y * sc;
    if (py >= 0 && py <= CURVE_H)
      points.push(`${points.length === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`);
  }

  const handleSvgY = oy - e * sc;
  const handleVisible = handleSvgY > 10 && handleSvgY < CURVE_H - 10;

  const onHandleDown = (e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    isDragging.current = true;
  };
  const onPointerMove = (ev: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const sy = (ev.clientY - r.top) * (CURVE_H / r.height);
    setE(Math.round((oy - sy) / sc * 2) / 2);
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { isDragging.current = false; }}
      onPointerLeave={() => { isDragging.current = false; }}>
      <defs>
        <pattern id="quartic-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="quartic-grid-bold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#quartic-grid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={CURVE_W} height={CURVE_H} fill="url(#quartic-grid-bold)"/>
      <CurveAxes />
      <path d={points.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Root markers */}
      {roots.map((root, i) => {
        const px = ox + root * sc;
        return (
          <g key={i}>
            <circle cx={px} cy={oy} r="7" fill="var(--handle)" stroke="white" strokeWidth="2"/>
            <text x={px} y={oy + 22} fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" textAnchor="middle">
              x={root.toFixed(2)}
            </text>
          </g>
        );
      })}

      <circle cx={ox} cy={oy} r="3" fill="var(--fg-1)"/>

      {/* Y-intercept drag handle (changes e) */}
      {handleVisible && (
        <g style={{ cursor: 'ns-resize' }} onPointerDown={onHandleDown}>
          <circle cx={ox} cy={handleSvgY} r="14" fill="var(--construction)" fillOpacity="0.15"/>
          <circle cx={ox} cy={handleSvgY} r="6"  fill="var(--construction)" stroke="white" strokeWidth="2"/>
          <text x={ox + 16} y={handleSvgY + 4} fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--construction)">e</text>
        </g>
      )}
    </svg>
  );
};
