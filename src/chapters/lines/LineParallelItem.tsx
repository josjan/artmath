// LineParallelItem.tsx — Recta paralela:
// Tab Explorar: A, B y C arrastrables. Recta (AB) en verde, paralela por C en azul.
//               Ecuaciones en tiempo real, distancia entre paralelas.
// Tab Fórmula: derivación — mismos coeficientes u,v, solo cambia w.
// Tab SVG: recta roja arrastrable que mantiene la dirección de (AB).

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { ghostBtn } from '../../components/AppShell';
import type { Lang } from '../../lib/data';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25;
const INIT = {
  A: { x: 160, y: 250 },
  B: { x: 560, y: 150 },
  C: { x: 360, y: 320 },
};

// ── Clip an infinite line to a rect ──────────────────────────────
function clipLine(
  u: number, v: number, w: number,
  x0: number, y0: number, x1: number, y1: number
): [Vec2, Vec2] | null {
  const pts: Vec2[] = [];
  const tryAdd = (px: number, py: number) => {
    if (px >= x0 - 0.5 && px <= x1 + 0.5 && py >= y0 - 0.5 && py <= y1 + 0.5)
      if (!pts.some(p => Math.abs(p.x - px) < 1 && Math.abs(p.y - py) < 1))
        pts.push({ x: px, y: py });
  };
  if (Math.abs(v) < 1e-9) {
    if (Math.abs(u) < 1e-9) return null;
    const x = -w / u;
    tryAdd(x, y0); tryAdd(x, y1);
  } else if (Math.abs(u) < 1e-9) {
    const y = -w / v;
    tryAdd(x0, y); tryAdd(x1, y);
  } else {
    tryAdd((-v * y0 - w) / u, y0);
    tryAdd((-v * y1 - w) / u, y1);
    tryAdd(x0, (-u * x0 - w) / v);
    tryAdd(x1, (-u * x1 - w) / v);
  }
  if (pts.length < 2) return null;
  return [pts[0], pts[1]];
}

const STR = {
  es: {
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    hint: 'Arrastra A, B y C.',
    eqAB: 'Ecuación (AB)',
    eqPar: 'Ecuación paralela',
    distance: 'Distancia',
    dirVector: 'Vector director',
    formula: {
      title: 'Recta paralela a (AB) por C',
      body: 'Una recta paralela a (AB) tiene el mismo vector director U = (Ux, Uy). Solo cambia el término independiente w, que se calcula para que C pertenezca a la nueva recta.',
    },
    derivation: [
      'La recta (AB) tiene ecuación u·x + v·y + w₁ = 0, con u=Uy, v=−Ux.',
      'Toda recta paralela a (AB) tiene la misma forma: u·x + v·y + w₂ = 0.',
      'Como C pertenece a la paralela: u·xC + v·yC + w₂ = 0.',
      'Despejando: w₂ = −u·xC − v·yC.',
      'Ecuación de la paralela: u·x + v·y − u·xC − v·yC = 0.',
      'La distancia entre ambas rectas es |w₁ − w₂| / √(u²+v²).',
    ],
    svgHint: 'Arrastra la recta roja — mantiene la dirección de (AB).',
  },
  en: {
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    hint: 'Drag A, B and C.',
    eqAB: 'Equation (AB)',
    eqPar: 'Parallel equation',
    distance: 'Distance',
    dirVector: 'Direction vector',
    formula: {
      title: 'Line parallel to (AB) through C',
      body: 'A line parallel to (AB) shares the same direction vector U = (Ux, Uy). Only the constant term w changes, computed so that C lies on the new line.',
    },
    derivation: [
      'Line (AB) has equation u·x + v·y + w₁ = 0, with u=Uy, v=−Ux.',
      'Any line parallel to (AB) has the same form: u·x + v·y + w₂ = 0.',
      'Since C lies on the parallel: u·xC + v·yC + w₂ = 0.',
      'Solving: w₂ = −u·xC − v·yC.',
      'Parallel equation: u·x + v·y − u·xC − v·yC = 0.',
      'Distance between the two lines is |w₁ − w₂| / √(u²+v²).',
    ],
    svgHint: 'Drag the red line — it keeps the direction of (AB).',
  },
};

export const LineParallelItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ ...INIT.A });
  const [b, setB] = useState<Vec2>({ ...INIT.B });
  const [c, setC] = useState<Vec2>({ ...INIT.C });

  // Grid origin
  const OX = 360, OY = 210;
  const toU = (sv: number, axis: 'x' | 'y') =>
    axis === 'x' ? (sv - OX) / STEP : (OY - sv) / STEP;

  // Direction vector (SVG space)
  const Ux_svg = b.x - a.x, Uy_svg = b.y - a.y;
  // Normal (u,v) = (Uy_svg, -Ux_svg) in SVG, which equals (−Uy_math, −Ux_math)
  // For display use math coords:
  const Ux_m = (b.x - a.x) / STEP;
  const Uy_m = -(b.y - a.y) / STEP;  // flip

  // Line AB implicit: u*x + v*y + w = 0 in SVG coords
  const u = Uy_svg, v = -Ux_svg;
  const w1 = -(u * a.x + v * a.y);
  const w2 = -(u * c.x + v * c.y);

  const norm = Math.sqrt(u * u + v * v);
  const dist = norm > 0 ? Math.abs(w1 - w2) / norm / STEP : 0;

  const fmtEq = (ww: number) => {
    const uu = Math.round(u * 10) / 10;
    const vv = Math.round(v * 10) / 10;
    const ww2 = Math.round(ww * 10) / 10;
    return `${uu}·x + ${vv}·y + ${ww2} = 0`;
  };

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
        {tab === 'explore' && (
          <ParallelFigure a={a} b={b} c={c} u={u} v={v} w1={w1} w2={w2}
            setA={setA} setB={setB} setC={setC} />
        )}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <SvgPane lang={lang} u={u} v={v} w1={w1} />}
      </div>

      {/* Inspector */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'start',
        }}>
          <InspCell label={s.dirVector} color="var(--fg-2)"
            main={`(${Ux_m.toFixed(1)}, ${Uy_m.toFixed(1)})`} />
          <InspCell label={s.eqAB} color="var(--formula)"
            main={fmtEq(w1)} />
          <InspCell label={s.eqPar} color="var(--accent)"
            main={fmtEq(w2)} />
          <InspCell label={s.distance} color="var(--construction)"
            main={`d = ${dist.toFixed(2)}`}
            sub="|w₁−w₂| / √(u²+v²)" />
          <button onClick={() => { setA({...INIT.A}); setB({...INIT.B}); setC({...INIT.C}); }}
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
const InspCell = ({ label, color, main, sub }: {
  label: string; color: string; main: string; sub?: string;
}) => (
  <div>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, fontWeight: 600, wordBreak: 'break-all', marginBottom: 2 }}>{main}</div>
    {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{sub}</div>}
  </div>
);

// ── Parallel figure ────────────────────────────────────────────────
const ParallelFigure = ({ a, b, c, u, v, w1, w2, setA, setB, setC }: {
  a: Vec2; b: Vec2; c: Vec2;
  u: number; v: number; w1: number; w2: number;
  setA: (p: Vec2) => void; setB: (p: Vec2) => void; setC: (p: Vec2) => void;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | 'C' | null>(null);
  const W = 720, H = 420, M = 4;
  const OX = 360, OY = 210;

  const line1 = clipLine(u, v, w1, M, M, W - M, H - M);
  const line2 = clipLine(u, v, w2, M, M, W - M, H - M);

  // Distance indicator: perpendicular segment from C to line AB
  const norm = Math.sqrt(u * u + v * v);
  const foot = norm > 0 ? {
    x: c.x - u * (u * c.x + v * c.y + w1) / (norm * norm),
    y: c.y - v * (u * c.x + v * c.y + w1) / (norm * norm),
  } : c;

  const onPointerDown = (which: 'A' | 'B' | 'C') => (e: React.PointerEvent) => {
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
    if (drag.current === 'C') setC({ x: sx, y: sy });
  };

  const dist = norm > 0 ? (Math.abs(w1 - w2) / norm / STEP).toFixed(2) : '0';

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}>
      <defs>
        <pattern id="plGrid"  width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="plGridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#plGrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="plAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
        <marker id="plDist" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--construction)"/>
        </marker>
      </defs>

      <rect width={W} height={H} fill="url(#plGridB)"/>

      {/* Axes */}
      <line x1={8} y1={OY} x2={W-8} y2={OY} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#plAxis)"/>
      <line x1={OX} y1={H-8} x2={OX} y2={8} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#plAxis)"/>
      <text x={W-18} y={OY-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">x</text>
      <text x={OX+8}  y={14}  fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>
      <text x={OX-16} y={OY+16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">0</text>

      {/* Tick marks */}
      {[-4,-3,-2,-1,1,2,3,4].map(t => (
        <g key={`ptx${t}`}>
          <line x1={OX+t*STEP*2} y1={OY-3} x2={OX+t*STEP*2} y2={OY+3} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={OX+t*STEP*2} y={OY+14} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="middle">{t*2}</text>
        </g>
      ))}
      {[-3,-2,-1,1,2,3].map(t => (
        <g key={`pty${t}`}>
          <line x1={OX-3} y1={OY-t*STEP*2} x2={OX+3} y2={OY-t*STEP*2} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={OX-6} y={OY-t*STEP*2+4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="end">{t*2}</text>
        </g>
      ))}

      {/* Distance perpendicular segment */}
      {norm > 5 && (
        <>
          <line x1={c.x} y1={c.y} x2={foot.x} y2={foot.y}
            stroke="var(--construction)" strokeWidth="1.5" strokeDasharray="4 3"
            markerEnd="url(#plDist)"/>
          {/* Right angle mark */}
          {(() => {
            const ux = u / norm, uy = v / norm;
            const px = -uy * 8, py = ux * 8;
            return (
              <path d={`M${foot.x + px} ${foot.y + py} L${foot.x + px + ux*8} ${foot.y + py + uy*8} L${foot.x + ux*8} ${foot.y + uy*8}`}
                fill="none" stroke="var(--fg-4)" strokeWidth="0.8"/>
            );
          })()}
          <text
            x={(c.x + foot.x) / 2 + 14}
            y={(c.y + foot.y) / 2}
            fontFamily="var(--font-mono)" fontSize="11" fill="var(--construction)">
            d={dist}
          </text>
        </>
      )}

      {/* Line AB (green) */}
      {line1 && (
        <line x1={line1[0].x} y1={line1[0].y} x2={line1[1].x} y2={line1[1].y}
          stroke="var(--formula)" strokeWidth="2.5"/>
      )}

      {/* Parallel by C (blue) */}
      {line2 && (
        <line x1={line2[0].x} y1={line2[0].y} x2={line2[1].x} y2={line2[1].y}
          stroke="var(--accent)" strokeWidth="2.5"/>
      )}

      {/* Drag handles */}
      {([
        { pt: a, which: 'A' as const, color: 'var(--formula)', label: 'A', dx: -20, dy: -8 },
        { pt: b, which: 'B' as const, color: 'var(--formula)', label: 'B', dx:  12, dy: -8 },
        { pt: c, which: 'C' as const, color: 'var(--accent)',  label: 'C', dx:  12, dy: -8 },
      ]).map(({ pt, which, color, label, dx, dy }) => (
        <g key={which}>
          <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown(which)}>
            <circle cx={pt.x} cy={pt.y} r="12" fill={color} fillOpacity="0.12"/>
            <circle cx={pt.x} cy={pt.y} r="6"  fill={color} stroke="white" strokeWidth="2"/>
          </g>
          <text x={pt.x + dx} y={pt.y + dy}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill={color}>{label}</text>
        </g>
      ))}

      {/* Readout */}
      <rect x="8" y="8" width="310" height="68" rx="5"
        fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        A=({((a.x-OX)/STEP).toFixed(1)},{((OY-a.y)/STEP).toFixed(1)})  B=({((b.x-OX)/STEP).toFixed(1)},{((OY-b.y)/STEP).toFixed(1)})
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="11" fill="var(--formula)" fontWeight="600">
        (AB): {Math.round(u*10)/10}·x + {Math.round(v*10)/10}·y + {Math.round(w1*10)/10} = 0
      </text>
      <text x="16" y="56" fontFamily="var(--font-mono)" fontSize="11" fill="var(--accent)" fontWeight="600">
        ∥ C: {Math.round(u*10)/10}·x + {Math.round(v*10)/10}·y + {Math.round(w2*10)/10} = 0
      </text>
      <text x="16" y="70" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        d = |w₁−w₂|/√(u²+v²) = {dist}  u,v iguales ✓
      </text>
    </svg>
  );
};

// ── Formula pane ───────────────────────────────────────────────────
const FormulaPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].formula;
  return (
    <div style={{ padding: '32px 40px', minHeight: 340 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{s.title}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 600, lineHeight: 1.6, marginBottom: 24 }}>{s.body}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Implicit parallel */}
        <div style={{ padding: 22, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 14 }}>
            {lang === 'es' ? 'Forma implícita' : 'Implicit form'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.2 }}>
            <div style={{ color: 'var(--formula)' }}>
              <i>u</i>·<i>x</i> + <i>v</i>·<i>y</i> + <i>w₁</i> = 0  <span style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-sans)' }}>(AB)</span>
            </div>
            <div style={{ color: 'var(--accent)' }}>
              <i>u</i>·<i>x</i> + <i>v</i>·<i>y</i> + <i>w₂</i> = 0  <span style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-sans)' }}>(∥ por C)</span>
            </div>
            <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 4 }}>
              w₂ = −u·xC − v·yC
            </div>
          </div>
        </div>

        {/* Slope form */}
        <div style={{ padding: 22, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 14 }}>
            {lang === 'es' ? 'Forma pendiente' : 'Slope form'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.2 }}>
            <div style={{ color: 'var(--formula)' }}>y = <i>a</i>·<i>x</i> + <i>b₁</i></div>
            <div style={{ color: 'var(--accent)' }}>y = <i>a</i>·<i>x</i> + <i>b₂</i></div>
            <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 4 }}>
              b₂ = yC − a·xC  {lang === 'es' ? '← misma pendiente' : '← same slope'}
            </div>
          </div>
        </div>
      </div>

      {/* Distance formula */}
      <div style={{
        padding: 18, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)', borderLeft: '3px solid var(--construction)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--construction)', marginBottom: 8 }}>
          {lang === 'es' ? 'Distancia entre paralelas' : 'Distance between parallel lines'}
        </div>
        <div style={{ fontFamily: 'var(--font-math)', fontSize: 20 }}>
          d = |w₁ − w₂| / √(<i>u</i>² + <i>v</i>²)
        </div>
      </div>
    </div>
  );
};

// ── SVG pane: draggable parallel line ──────────────────────────────
const SvgPane = ({ lang, u: uInit, v: vInit, w1: w1Init }: {
  lang: Lang; u: number; v: number; w1: number;
}) => {
  const s = STR[lang];
  const ref = useRef<SVGSVGElement>(null);
  const W = 720, H = 420, M = 4;

  // Fixed reference line (AB) — use initial u,v,w1 from parent
  const [w2, setW2] = useState(w1Init + 4000);

  const line1 = clipLine(uInit, vInit, w1Init, M, M, W - M, H - M);
  const line2 = clipLine(uInit, vInit, w2, M, M, W - M, H - M);

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    setW2(-(uInit * sx + vInit * sy));
  };

  const norm = Math.sqrt(uInit * uInit + vInit * vInit);
  const distPx = norm > 0 ? Math.abs(w1Init - w2) / norm : 0;
  const distU = (distPx / STEP).toFixed(2);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 360 }}>
      {/* Code */}
      <pre style={{
        margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7,
        overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)',
        borderRight: '1px solid var(--hairline)',
      }}>
{`// Move a line keeping its direction
// Line (AB): u·x + v·y + w = 0
// u and v are fixed (direction)
// Only w changes!

function onMouseMove(e) {
  const xm = e.clientX;
  const ym = e.clientY;

  // New w: make line pass
  // through mouse position
  const w_new = -(u * xm + v * ym);

  // Clip to viewport and redraw
  const [p1, p2] = clipLine(
    u, v, w_new,
    minX, minY, maxX, maxY
  );
  line.setAttribute("x1", p1[0]);
  line.setAttribute("y1", p1[1]);
  line.setAttribute("x2", p2[0]);
  line.setAttribute("y2", p2[1]);
}

// Key insight:
// Two parallel lines share u and v
// They only differ in w:
// d = |w₁ - w₂| / √(u² + v²)`}
      </pre>

      {/* Live demo */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid var(--hairline)',
          fontSize: 11, fontWeight: 600, color: 'var(--fg-3)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {s.svgHint}
        </div>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
          style={{ flex: 1, display: 'block', cursor: 'crosshair', touchAction: 'none', background: 'var(--surface)' }}
          onPointerMove={onPointerMove}>
          <defs>
            <pattern id="svgParGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#svgParGrid)"/>

          {/* Reference line AB (fixed, green) */}
          {line1 && (
            <line x1={line1[0].x} y1={line1[0].y} x2={line1[1].x} y2={line1[1].y}
              stroke="var(--formula)" strokeWidth="2"/>
          )}
          {/* Label */}
          {line1 && (
            <text x={line1[0].x + 12} y={line1[0].y - 8}
              fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--formula)">(AB)</text>
          )}

          {/* Moveable parallel (red/accent) */}
          {line2 && (
            <line x1={line2[0].x} y1={line2[0].y} x2={line2[1].x} y2={line2[1].y}
              stroke="var(--accent)" strokeWidth="2.5"/>
          )}

          {/* Distance readout */}
          <rect x="8" y="8" width="200" height="38" rx="4"
            fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.7"/>
          <text x="14" y="22" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">
            w₁ = {Math.round(w1Init)}  w₂ = {Math.round(w2)}
          </text>
          <text x="14" y="38" fontFamily="var(--font-mono)" fontSize="11" fill="var(--construction)" fontWeight="600">
            d = {distU}
          </text>
        </svg>
      </div>
    </div>
  );
};
