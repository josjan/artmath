// LineABItem.tsx — Recta por 2 puntos:
// Tab Explorar: A y B arrastrables, recta extendida al viewport, ecuación ax+by+c=0 en tiempo real.
// Tab Fórmula: derivación de la ecuación implícita desde producto vectorial nulo.
// Tab SVG: algoritmo de clipping de recta al viewport (el svg.lineAB original).

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { ghostBtn } from '../../components/AppShell';
import type { Lang } from '../../lib/data';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25;
const INIT_A: Vec2 = { x: 175, y: 125 };
const INIT_B: Vec2 = { x: 525, y: 295 };

const STR = {
  es: {
    title: 'Recta por 2 puntos',
    blurb: 'Ecuación implícita, pendiente e intersección con los ejes.',
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    hint: 'Arrastra A y B.',
    equation: 'Ecuación',
    slopeForm: 'Forma pendiente',
    direction: 'Vector director',
    normal: 'Vector normal',
    formula: {
      title: 'Ecuación de la recta (AB)',
      body: 'Un punto M(x, y) pertenece a la recta (AB) si y solo si los vectores AM y AB son colineales, es decir, su producto vectorial es nulo.',
    },
    derivation: [
      'Sean A = (xA, yA) y B = (xB, yB) dos puntos del plano.',
      'El vector director de la recta es U = AB = (Ux, Uy) = (xB−xA, yB−yA).',
      'Un punto M(x, y) ∈ (AB) ↔ AM ∧ AB = 0 (producto vectorial nulo).',
      '(x−xA)·Uy − (y−yA)·Ux = 0.',
      'Desarrollando: Uy·x − Ux·y + (xA·Uy − yA·Ux) → pendiente a = Uy/Ux.',
      'Forma implícita: Uy·x − Ux·y + c = 0, con c = yA·Ux − xA·Uy.',
      'Si Ux ≠ 0, forma pendiente: y = (Uy/Ux)·x + (yA − (Uy/Ux)·xA).',
    ],
    svgTitle: 'Clipping de la recta al viewport',
    svgDesc: 'La recta es infinita — hay que recortarla al rectángulo del canvas intersectando con sus 4 lados.',
  },
  en: {
    title: 'Line by 2 points',
    blurb: 'Implicit equation, slope and axis intercepts.',
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    hint: 'Drag A and B.',
    equation: 'Equation',
    slopeForm: 'Slope form',
    direction: 'Direction vector',
    normal: 'Normal vector',
    formula: {
      title: 'Line equation (AB)',
      body: 'A point M(x, y) lies on line (AB) if and only if vectors AM and AB are collinear, i.e. their cross product is zero.',
    },
    derivation: [
      'Let A = (xA, yA) and B = (xB, yB) be two points in the plane.',
      'The direction vector of the line is U = AB = (Ux, Uy) = (xB−xA, yB−yA).',
      'A point M(x, y) ∈ (AB) ↔ AM ∧ AB = 0 (zero cross product).',
      '(x−xA)·Uy − (y−yA)·Ux = 0.',
      'Expanding: Uy·x − Ux·y + (xA·Uy − yA·Ux) → slope a = Uy/Ux.',
      'Implicit form: Uy·x − Ux·y + c = 0, with c = yA·Ux − xA·Uy.',
      'If Ux ≠ 0, slope form: y = (Uy/Ux)·x + (yA − (Uy/Ux)·xA).',
    ],
    svgTitle: 'Clipping the line to the viewport',
    svgDesc: 'The line is infinite — we must clip it to the canvas rectangle by intersecting with its 4 sides.',
  },
};

// ── Clip an infinite line to a rect ──────────────────────────────
// Line: u·x + v·y + w = 0
// Returns null if line is outside [x0,x1]×[y0,y1]
function clipLine(
  u: number, v: number, w: number,
  x0: number, y0: number, x1: number, y1: number
): [Vec2, Vec2] | null {
  const pts: Vec2[] = [];
  const tryAdd = (px: number, py: number) => {
    if (px >= x0 - 0.5 && px <= x1 + 0.5 && py >= y0 - 0.5 && py <= y1 + 0.5)
      if (!pts.some(p => Math.abs(p.x - px) < 0.5 && Math.abs(p.y - py) < 0.5))
        pts.push({ x: px, y: py });
  };

  if (Math.abs(v) < 1e-9) {
    // Vertical line: x = -w/u
    if (Math.abs(u) < 1e-9) return null;
    const x = -w / u;
    tryAdd(x, y0); tryAdd(x, y1);
  } else if (Math.abs(u) < 1e-9) {
    // Horizontal line: y = -w/v
    const y = -w / v;
    tryAdd(x0, y); tryAdd(x1, y);
  } else {
    // General: intersect with all 4 sides
    const xAtY0 = (-v * y0 - w) / u;
    const xAtY1 = (-v * y1 - w) / u;
    const yAtX0 = (-u * x0 - w) / v;
    const yAtX1 = (-u * x1 - w) / v;
    tryAdd(xAtY0, y0);
    tryAdd(xAtY1, y1);
    tryAdd(x0, yAtX0);
    tryAdd(x1, yAtX1);
  }
  if (pts.length < 2) return null;
  return [pts[0], pts[1]];
}

export const LineABItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ ...INIT_A });
  const [b, setB] = useState<Vec2>({ ...INIT_B });

  // Grid origin for coordinate display
  const GRID_OX = 360, GRID_OY = 210;
  const toU = (sv: number, axis: 'x' | 'y') =>
    axis === 'x' ? ((sv - GRID_OX) / STEP) : ((GRID_OY - sv) / STEP);

  // Direction vector in math coords (y flipped)
  const Ux = (b.x - a.x) / STEP;   // SVG x difference → math x
  const Uy = -(b.y - a.y) / STEP;  // SVG y difference → math y (flip)

  // Implicit equation: Uy·x - Ux·y + c = 0
  const xA = toU(a.x, 'x'), yA = toU(a.y, 'y');
  const c = yA * Ux - xA * Uy;

  // Slope form
  const hasSlope = Math.abs(Ux) > 0.01;
  const slope = hasSlope ? Uy / Ux : Infinity;
  const intercept = hasSlope ? yA - slope * xA : NaN;

  const fmtCoef = (n: number) => {
    const r = Math.round(n * 100) / 100;
    return r === 0 ? '0' : String(r);
  };

  const eqStr = `${fmtCoef(Uy)}·x ${Ux >= 0 ? '−' : '+'} ${fmtCoef(Math.abs(Ux))}·y + ${fmtCoef(c)} = 0`;
  const slopeStr = hasSlope
    ? `y = ${fmtCoef(slope)}·x + ${fmtCoef(intercept)}`
    : `x = ${fmtCoef(xA)} (vertical)`;

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
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '7px 14px', borderRadius: 'var(--r-xs)',
            background: tab === id ? 'var(--surface-3)' : 'transparent',
            color: tab === id ? 'var(--fg-1)' : 'var(--fg-3)',
            border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>{s.tabs[id]}</button>
        ))}
      </div>

      {/* Figure */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden',
      }}>
        {tab === 'explore' && <LineFigure a={a} b={b} setA={setA} setB={setB} lang={lang} />}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <SvgPane lang={lang} />}
      </div>

      {/* Inspector */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'start',
        }}>
          <InspCell label={s.direction} color="var(--accent)"
            main={`(${fmtCoef(Ux)}, ${fmtCoef(Uy)})`} />
          <InspCell label={s.equation} color="var(--formula)"
            main={eqStr} />
          <InspCell label={s.slopeForm} color="var(--construction)"
            main={slopeStr} />
          <InspCell label={s.normal} color="var(--fg-2)"
            main={`(${fmtCoef(Uy)}, ${fmtCoef(-Ux)})`} />
          <button onClick={() => { setA({ ...INIT_A }); setB({ ...INIT_B }); }}
            style={{ ...ghostBtn, alignSelf: 'center', whiteSpace: 'nowrap' }}>
            <Icon name="RotateCcw" size={13}/> {s.reset}
          </button>
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
            <span style={{ fontFamily: 'var(--font-mono)' }}>{s.step} {step + 1} {s.of} {s.derivation.length}</span>
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

// ── Inspector cell ─────────────────────────────────────────────────
const InspCell = ({ label, color, main }: { label: string; color: string; main: string }) => (
  <div>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, fontWeight: 600, wordBreak: 'break-all' }}>{main}</div>
  </div>
);

// ── Line figure ────────────────────────────────────────────────────
const LineFigure = ({ a, b, setA, setB, lang }: {
  a: Vec2; b: Vec2;
  setA: (p: Vec2) => void; setB: (p: Vec2) => void;
  lang: Lang;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | null>(null);
  const W = 720, H = 420;
  const MARGIN = 4; // clip margin inside SVG

  // Line equation in SVG coords: Uy_svg*x - Ux_svg*y + c_svg = 0
  // where direction in SVG: (b.x-a.x, b.y-a.y)
  const ux_svg = b.x - a.x;
  const uy_svg = b.y - a.y;
  const c_svg  = a.y * ux_svg - a.x * uy_svg;

  // Normal vector (perpendicular to line direction)
  const clipped = clipLine(uy_svg, -ux_svg, c_svg, MARGIN, MARGIN, W - MARGIN, H - MARGIN);

  const onPointerDown = (which: 'A' | 'B') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(STEP, Math.min(W - STEP, Math.round(((e.clientX - r.left) * (W / r.width)) / STEP) * STEP));
    const sy = Math.max(STEP, Math.min(H - STEP, Math.round(((e.clientY - r.top)  * (H / r.height)) / STEP) * STEP));
    if (drag.current === 'A') setA({ x: sx, y: sy });
    if (drag.current === 'B') setB({ x: sx, y: sy });
  };

  // Grid origin
  const ox = 360, oy = 210;

  // Math coords for readout
  const xA = ((a.x - ox) / STEP).toFixed(1);
  const yA = ((oy - a.y) / STEP).toFixed(1);
  const xB = ((b.x - ox) / STEP).toFixed(1);
  const yB = ((oy - b.y) / STEP).toFixed(1);
  const Ux = ((b.x - a.x) / STEP).toFixed(1);
  const Uy = (-(b.y - a.y) / STEP).toFixed(1);

  // Implicit equation coefficients
  const U = { x: b.x - a.x, y: b.y - a.y }; // SVG direction
  const cCoef = (a.y * U.x - a.x * U.y) / STEP;
  const fmt = (n: number) => { const r = Math.round(n * 10) / 10; return r >= 0 ? `+${r}` : `${r}`; };

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}>
      <defs>
        <pattern id="lnGrid"  width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="lnGridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#lnGrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="lnAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
      </defs>

      <rect width={W} height={H} fill="url(#lnGridB)"/>

      {/* Axes */}
      <line x1={8} y1={oy} x2={W-8} y2={oy} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#lnAxis)"/>
      <line x1={ox} y1={H-8} x2={ox} y2={8} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#lnAxis)"/>
      <text x={W-18} y={oy-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">x</text>
      <text x={ox+8}  y={14}  fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>
      <text x={ox-16} y={oy+16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">0</text>

      {/* Tick marks */}
      {[-4,-3,-2,-1,1,2,3,4].map(t => (
        <g key={`ltx${t}`}>
          <line x1={ox+t*STEP*2} y1={oy-3} x2={ox+t*STEP*2} y2={oy+3} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox+t*STEP*2} y={oy+14} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="middle">{t*2}</text>
        </g>
      ))}
      {[-3,-2,-1,1,2,3].map(t => (
        <g key={`lty${t}`}>
          <line x1={ox-3} y1={oy-t*STEP*2} x2={ox+3} y2={oy-t*STEP*2} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox-6} y={oy-t*STEP*2+4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="end">{t*2}</text>
        </g>
      ))}

      {/* Clipped line */}
      {clipped && (
        <line x1={clipped[0].x} y1={clipped[0].y} x2={clipped[1].x} y2={clipped[1].y}
          stroke="var(--formula)" strokeWidth="2.5"/>
      )}

      {/* Normal vector from midpoint */}
      {(() => {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const len = Math.hypot(U.x, U.y);
        if (len < 5) return null;
        const nx = -U.y / len * 40, ny = U.x / len * 40;
        return (
          <>
            <line x1={mx} y1={my} x2={mx+nx} y2={my+ny}
              stroke="var(--construction)" strokeWidth="1.5" strokeDasharray="4 3"/>
            <text x={mx+nx+8} y={my+ny}
              fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--construction)">n</text>
          </>
        );
      })()}

      {/* Direction arrow A→B */}
      {Math.hypot(U.x, U.y) > 20 && (() => {
        const len = Math.hypot(U.x, U.y);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        return (
          <line x1={mx - U.x/len*20} y1={my - U.y/len*20}
            x2={mx + U.x/len*20 - U.x/len*12} y2={my + U.y/len*20 - U.y/len*12}
            stroke="var(--accent)" strokeWidth="2.5"
            markerEnd="url(#lnDirArr)"/>
        );
      })()}

      <defs>
        <marker id="lnDirArr" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
      </defs>

      {/* Points A and B */}
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('A')}>
        <circle cx={a.x} cy={a.y} r="13" fill="var(--accent)" fillOpacity="0.12"/>
        <circle cx={a.x} cy={a.y} r="6"  fill="var(--accent)" stroke="white" strokeWidth="2"/>
      </g>
      <text x={a.x-18} y={a.y-8}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--accent)">A</text>

      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('B')}>
        <circle cx={b.x} cy={b.y} r="13" fill="var(--formula)" fillOpacity="0.12"/>
        <circle cx={b.x} cy={b.y} r="6"  fill="var(--formula)" stroke="white" strokeWidth="2"/>
      </g>
      <text x={b.x+10} y={b.y-8}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--formula)">B</text>

      {/* Readout overlay */}
      <rect x="8" y="8" width="300" height="80" rx="5"
        fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        A = ({xA}, {yA})   B = ({xB}, {yB})
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        U = ({Ux}, {Uy})   n = ({Uy}, {String(-parseFloat(Ux))})
      </text>
      <text x="16" y="58" fontFamily="var(--font-mono)" fontSize="12" fill="var(--formula)" fontWeight="600">
        {parseFloat(Uy).toFixed(1)}·x − {parseFloat(Ux).toFixed(1)}·y {fmt(cCoef)} = 0
      </text>
      <text x="16" y="74" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        {Math.abs(parseFloat(Ux)) > 0.01
          ? `y = ${(parseFloat(Uy)/parseFloat(Ux)).toFixed(2)}·x + ${(parseFloat(yA) - (parseFloat(Uy)/parseFloat(Ux))*parseFloat(xA)).toFixed(2)}`
          : `x = ${xA} (vertical)`}
      </text>
      <text x="16" y="86" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        {lang === 'es' ? 'recta extendida al viewport' : 'line clipped to viewport'}
      </text>
    </svg>
  );
};

// ── Formula pane ───────────────────────────────────────────────────
const FormulaPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].formula;
  return (
    <div style={{ padding: '32px 40px', minHeight: 360 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{s.title}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 600, lineHeight: 1.6, marginBottom: 24 }}>{s.body}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Implicit form */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Forma implícita' : 'Implicit form'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 19, lineHeight: 2, color: 'var(--fg-1)' }}>
            <div>
              <i style={{ color: 'var(--accent)' }}>Uy</i>·<i>x</i> − <i style={{ color: 'var(--accent)' }}>Ux</i>·<i>y</i> + <i>c</i> = 0
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', fontFamily: 'var(--font-sans)', marginTop: 4 }}>
              c = yA·Ux − xA·Uy
            </div>
          </div>
        </div>

        {/* Slope form */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Forma pendiente' : 'Slope form'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 19, lineHeight: 2 }}>
            <div><i>y</i> = <i style={{ color: 'var(--formula)' }}>a</i>·<i>x</i> + <i>b</i></div>
            <div style={{ fontSize: 14, color: 'var(--fg-3)' }}>
              <i style={{ color: 'var(--formula)' }}>a</i> = Uy/Ux,  <i>b</i> = yA − a·xA
            </div>
          </div>
        </div>

        {/* Condition for M on line */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Condición de pertenencia' : 'Membership condition'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 17, lineHeight: 2 }}>
            <div>M(x,y) ∈ (AB) ↔ AM⃗ ∧ AB⃗ = 0</div>
            <div style={{ fontSize: 14 }}>(x−xA)·Uy − (y−yA)·Ux = 0</div>
          </div>
        </div>

        {/* Parallel / perpendicular */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Paralela / Perpendicular' : 'Parallel / Perpendicular'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 2 }}>
            <div>{lang === 'es' ? 'Paralelas: ' : 'Parallel: '}<i>a</i> = <i>a′</i></div>
            <div>{lang === 'es' ? 'Perpendiculares: ' : 'Perpendicular: '}<i>a</i>·<i>a′</i> = −1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SVG clipping pane (split code + live demo) ─────────────────────
const SvgPane = ({ lang }: { lang: Lang }) => {
  //const s = STR[lang];
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | null>(null);
  const [a, setA] = useState<Vec2>({ x: 80,  y: 50  });
  const [b, setB] = useState<Vec2>({ x: 280, y: 160 });

  const W = 360, H = 220;
  const MARGIN = 4;

  const ux = b.x - a.x, uy = b.y - a.y;
  const c  = a.y * ux - a.x * uy;
  const clipped = clipLine(uy, -ux, c, MARGIN, MARGIN, W - MARGIN, H - MARGIN);

  const onPD = (which: 'A' | 'B') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };
  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(5, Math.min(W-5, (e.clientX - r.left) * (W / r.width)));
    const sy = Math.max(5, Math.min(H-5, (e.clientY - r.top)  * (H / r.height)));
    if (drag.current === 'A') setA({ x: sx, y: sy });
    if (drag.current === 'B') setB({ x: sx, y: sy });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 360 }}>
      {/* Code */}
      <pre style={{
        margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7,
        overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)',
        borderRight: '1px solid var(--hairline)',
      }}>
{`// Clip line to viewport [x0,y0]→[x1,y1]
// Line equation: u·x + v·y + w = 0

function clipLine(u, v, w, x0, y0, x1, y1) {
  const pts = [];

  if (v === 0) {
    // Vertical: x = -w/u
    const x = -w / u;
    pts.push([x, y0], [x, y1]);
  } else if (u === 0) {
    // Horizontal: y = -w/v
    const y = -w / v;
    pts.push([x0, y], [x1, y]);
  } else {
    // General: intersect 4 sides
    const tryAdd = (px, py) => {
      if (px >= x0 && px <= x1 &&
          py >= y0 && py <= y1)
        pts.push([px, py]);
    };
    tryAdd((-v*y0-w)/u, y0);
    tryAdd((-v*y1-w)/u, y1);
    tryAdd(x0, (-u*x0-w)/v);
    tryAdd(x1, (-u*x1-w)/v);
  }

  if (pts.length < 2) return null;
  return [pts[0], pts[1]];
}

// Line from A and B:
const u = -(B.y - A.y);  // normal x
const v =   B.x - A.x;  // normal y
const w = -(u*A.x + v*A.y);
const [p1, p2] = clipLine(u,v,w,...);
line.setAttribute("x1", p1[0]);
line.setAttribute("y1", p1[1]);
line.setAttribute("x2", p2[0]);
line.setAttribute("y2", p2[1]);`}
      </pre>

      {/* Live demo */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid var(--hairline)',
          fontSize: 11, fontWeight: 600, color: 'var(--fg-3)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {lang === 'es' ? 'Demo — arrastra A y B' : 'Demo — drag A and B'}
        </div>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
          style={{ flex: 1, display: 'block', touchAction: 'none', background: 'var(--surface)' }}
          onPointerMove={onPM}
          onPointerUp={() => { drag.current = null; }}
          onPointerLeave={() => { drag.current = null; }}>
          <defs>
            <pattern id="svgClipGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#svgClipGrid)"/>

          {/* Viewport border */}
          <rect x={MARGIN} y={MARGIN} width={W-2*MARGIN} height={H-2*MARGIN}
            fill="none" stroke="var(--fg-4)" strokeWidth="1.5" strokeDasharray="4 3"/>

          {/* Clipped line */}
          {clipped && (
            <line x1={clipped[0].x} y1={clipped[0].y} x2={clipped[1].x} y2={clipped[1].y}
              stroke="var(--formula)" strokeWidth="2"/>
          )}

          {/* Handles */}
          {([{ pt: a, which: 'A' as const, color: 'var(--accent)' },
             { pt: b, which: 'B' as const, color: 'var(--formula)' }]).map(({ pt, which, color }) => (
            <g key={which} style={{ cursor: 'grab' }} onPointerDown={onPD(which)}>
              <circle cx={pt.x} cy={pt.y} r="10" fill={color} fillOpacity="0.12"/>
              <circle cx={pt.x} cy={pt.y} r="5"  fill={color} stroke="white" strokeWidth="1.5"/>
              <text x={pt.x + (which === 'A' ? -14 : 10)} y={pt.y - 6}
                fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill={color}>
                {which}
              </text>
            </g>
          ))}

          {/* Equation overlay */}
          <rect x="4" y="4" width="200" height="28" rx="4"
            fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.7"/>
          <text x="10" y="18" fontFamily="var(--font-mono)" fontSize="10" fill="var(--formula)" fontWeight="600">
            {uy.toFixed(0)}·x − {ux.toFixed(0)}·y + {c.toFixed(0)} = 0
          </text>
          <text x="10" y="28" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)">
            {clipped ? 'clipped ✓' : 'outside viewport'}
          </text>
        </svg>
      </div>
    </div>
  );
};
