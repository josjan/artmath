// MidpointItem.tsx — Punto medio:
// Tab Explorar: puntos A y B arrastrables + punto O libre, se dibuja el paralelograma
//               OA-M-OB con sus diagonales que se cortan en M.
// Tab Fórmula: fórmula xM=(xA+xB)/2, yM=(yA+yB)/2 + interpretación vectorial.
// Tab SVG: snippet de código con A y B arrastrables en un mini canvas.

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { ghostBtn } from '../../components/AppShell';
import type { Lang } from '../../lib/data';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25;

// Default positions in SVG coords (absolute, not relative to origin)
const INIT = {
  A: { x: 200, y: 310 },
  B: { x: 500, y: 110 },
  O: { x:  80, y: 200 },
};

const STR = {
  es: {
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    hint: 'Arrastra A, B y O.',
    coordA: 'Punto A', coordB: 'Punto B', coordM: 'Punto medio M', coordO: 'Origen libre O',
    paraNote: 'Las diagonales del paralelograma se cortan en M.',
    formula: {
      title: 'Punto medio',
      body: 'El punto medio M del segmento AB tiene como coordenadas la media aritmética de las coordenadas de A y B. Geométricamente, si desde cualquier punto O construimos el paralelograma con vectores OA y OB, las diagonales se cortan exactamente en M.',
    },
    derivation: [
      'Sean A = (xA, yA) y B = (xB, yB) dos puntos del plano.',
      'El punto medio M del segmento AB tiene coordenadas xM = (xA + xB) / 2, yM = (yA + yB) / 2.',
      'Vectorialmente: OM = (OA + OB) / 2 para cualquier punto O.',
      'Esto equivale a decir que M es el punto equidistante de A y B: |MA| = |MB|.',
      'El paralelograma formado por OA y OB tiene sus diagonales cortándose en M.',
    ],
  },
  en: {
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    hint: 'Drag A, B and O.',
    coordA: 'Point A', coordB: 'Point B', coordM: 'Midpoint M', coordO: 'Free origin O',
    paraNote: 'The parallelogram diagonals intersect at M.',
    formula: {
      title: 'Midpoint',
      body: 'The midpoint M of segment AB has coordinates equal to the arithmetic mean of the coordinates of A and B. Geometrically, if from any point O we build the parallelogram with vectors OA and OB, the diagonals intersect exactly at M.',
    },
    derivation: [
      'Let A = (xA, yA) and B = (xB, yB) be two points in the plane.',
      'The midpoint M of segment AB has coordinates xM = (xA + xB) / 2, yM = (yA + yB) / 2.',
      'Vectorially: OM = (OA + OB) / 2 for any point O.',
      'This means M is equidistant from A and B: |MA| = |MB|.',
      'The parallelogram formed by OA and OB has its diagonals crossing at M.',
    ],
  },
};

export const MidpointItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ ...INIT.A });
  const [b, setB] = useState<Vec2>({ ...INIT.B });
  const [o, setO] = useState<Vec2>({ ...INIT.O });

  // M = midpoint of AB (in SVG coords)
  const m: Vec2 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };

  // 4th vertex of parallelogram from O: D = O + OA + OB = a + b - o
  const d: Vec2 = { x: a.x + b.x - o.x, y: a.y + b.y - o.y };

  const toLabel = (svgX: number, svgY: number, ox: number, oy: number) => {
    // Convert SVG abs coords to math units relative to a grid origin
    const gx = Math.round((svgX - ox) / STEP);
    const gy = Math.round((oy - svgY) / STEP);
    return `(${gx}, ${gy})`;
  };

  // Use center of figure as grid origin for display labels
  const gridO = { x: 360, y: 210 };

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
          <MidpointFigure a={a} b={b} o={o} m={m} d={d}
            setA={setA} setB={setB} setO={setO} />
        )}
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
          <InspCell label={s.coordA} color="var(--accent)"
            main={toLabel(a.x, a.y, gridO.x, gridO.y)} />
          <InspCell label={s.coordB} color="var(--formula)"
            main={toLabel(b.x, b.y, gridO.x, gridO.y)} />
          <InspCell label={s.coordM} color="var(--handle)"
            main={toLabel(m.x, m.y, gridO.x, gridO.y)}
            sub="(xA+xB)/2, (yA+yB)/2" />
          <InspCell label={s.coordO} color="var(--fg-3)"
            main={toLabel(o.x, o.y, gridO.x, gridO.y)} />
          <button onClick={() => { setA({...INIT.A}); setB({...INIT.B}); setO({...INIT.O}); }}
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
                {String(i + 1).padStart(2, '00')}
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
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color, fontWeight: 600, marginBottom: 2 }}>{main}</div>
    {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{sub}</div>}
  </div>
);

// ── Midpoint figure ────────────────────────────────────────────────
const MidpointFigure = ({ a, b, o, m, d, setA, setB, setO }: {
  a: Vec2; b: Vec2; o: Vec2; m: Vec2; d: Vec2;
  setA: (p: Vec2) => void;
  setB: (p: Vec2) => void;
  setO: (p: Vec2) => void;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | 'O' | null>(null);
  const W = 720, H = 420;

  const snap = (v: number) => Math.round(v / STEP) * STEP;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const onPointerDown = (which: 'A' | 'B' | 'O') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = clamp(snap((e.clientX - r.left) * (W / r.width)), STEP, W - STEP);
    const sy = clamp(snap((e.clientY - r.top)  * (H / r.height)), STEP, H - STEP);
    const p: Vec2 = { x: sx, y: sy };
    if (drag.current === 'A') setA(p);
    if (drag.current === 'B') setB(p);
    if (drag.current === 'O') setO(p);
  };

  // Distance for equal-length tick marks on AB at midpoint
  const lenAB = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = lenAB > 0 ? (b.x - a.x) / lenAB : 1;
  const uy = lenAB > 0 ? (b.y - a.y) / lenAB : 0;
  const TICK = 8;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}>
      <defs>
        <pattern id="mpgrid"  width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="mpgridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#mpgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="mpArrA" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id="mpArrB" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
        </marker>
        <marker id="mpArrG" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-4)"/>
        </marker>
      </defs>

      <rect width={W} height={H} fill="url(#mpgridB)"/>

      {/* ── Parallelogram from O ─────────────────────────── */}
      {/* Fill */}
      <polygon
        points={`${o.x},${o.y} ${a.x},${a.y} ${d.x},${d.y} ${b.x},${b.y}`}
        fill="var(--formula)" fillOpacity="0.08"
        stroke="var(--formula)" strokeWidth="1.2" strokeDasharray="6 3"/>

      {/* Diagonals: O↔D and A↔B — both pass through M */}
      <line x1={o.x} y1={o.y} x2={d.x} y2={d.y}
        stroke="var(--formula)" strokeWidth="1.2" strokeDasharray="4 3"/>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke="var(--fg-3)" strokeWidth="1.5" strokeDasharray="4 3"/>

      {/* Vectors OA and OB — arrow tip offset along their own direction */}
      {(() => {
        const ARROW = 12;
        const lenOA = Math.hypot(a.x - o.x, a.y - o.y);
        const lenOB = Math.hypot(b.x - o.x, b.y - o.y);
        const uOAx = lenOA > 0 ? (a.x - o.x) / lenOA : 0;
        const uOAy = lenOA > 0 ? (a.y - o.y) / lenOA : 0;
        const uOBx = lenOB > 0 ? (b.x - o.x) / lenOB : 0;
        const uOBy = lenOB > 0 ? (b.y - o.y) / lenOB : 0;
        return (
          <>
            <line x1={o.x} y1={o.y}
              x2={a.x - uOAx * ARROW} y2={a.y - uOAy * ARROW}
              stroke="var(--accent)" strokeWidth="2" markerEnd="url(#mpArrA)"/>
            <line x1={o.x} y1={o.y}
              x2={b.x - uOBx * ARROW} y2={b.y - uOBy * ARROW}
              stroke="var(--formula)" strokeWidth="2" markerEnd="url(#mpArrB)"/>
          </>
        );
      })()}

      {/* Segment AB (the main segment) */}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke="var(--fg-1)" strokeWidth="3"/>

      {/* Equal-length tick marks on AM and MB */}
      {lenAB > 20 && (() => {
        const mx = m.x, my = m.y;
        const px = -uy * TICK, py = ux * TICK; // perpendicular
        // Tick on AM midpoint
        const t1x = (a.x + mx) / 2;
        const t1y = (a.y + my) / 2;
        // Tick on MB midpoint
        const t2x = (mx + b.x) / 2;
        const t2y = (my + b.y) / 2;
        return (
          <>
            <line x1={t1x - px/2} y1={t1y - py/2} x2={t1x + px/2} y2={t1y + py/2}
              stroke="var(--handle)" strokeWidth="2"/>
            <line x1={t2x - px/2} y1={t2y - py/2} x2={t2x + px/2} y2={t2y + py/2}
              stroke="var(--handle)" strokeWidth="2"/>
          </>
        );
      })()}

      {/* OM vector */}
      <line x1={o.x} y1={o.y}
        x2={m.x - (m.x-o.x)/Math.max(1,Math.hypot(m.x-o.x,m.y-o.y))*10}
        y2={m.y - (m.y-o.y)/Math.max(1,Math.hypot(m.x-o.x,m.y-o.y))*10}
        stroke="var(--handle)" strokeWidth="2" strokeDasharray="none" markerEnd="url(#mpArrG)"/>

      {/* Labels */}
      <text x={a.x - 22} y={a.y + 6}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--accent)">A</text>
      <text x={b.x + 10} y={b.y - 8}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--formula)">B</text>
      <text x={m.x + 10} y={m.y - 10}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--handle)">M</text>
      <text x={o.x - 20} y={o.y - 8}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--fg-3)">O</text>
      <text x={d.x + 8} y={d.y + 6}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-4)">D</text>

      {/* Drag handles */}
      {([
        { pt: a, color: 'var(--accent)',  which: 'A' as const },
        { pt: b, color: 'var(--formula)', which: 'B' as const },
        { pt: o, color: 'var(--fg-3)',    which: 'O' as const },
      ]).map(({ pt, color, which }) => (
        <g key={which} style={{ cursor: 'grab' }} onPointerDown={onPointerDown(which)}>
          <circle cx={pt.x} cy={pt.y} r="13" fill={color} fillOpacity="0.12"/>
          <circle cx={pt.x} cy={pt.y} r="6"  fill={color} stroke="white" strokeWidth="2"/>
        </g>
      ))}

      {/* M point (computed, not draggable) */}
      <circle cx={m.x} cy={m.y} r="6" fill="var(--handle)" stroke="white" strokeWidth="2"/>

      {/* D point (4th vertex) */}
      <circle cx={d.x} cy={d.y} r="4" fill="var(--fg-4)" stroke="white" strokeWidth="1.5"/>

      {/* Readout overlay */}
      <rect x="8" y="8" width="270" height="68" rx="5"
        fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        A = ({Math.round((a.x-360)/STEP)}, {Math.round((210-a.y)/STEP)})
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        B = ({Math.round((b.x-360)/STEP)}, {Math.round((210-b.y)/STEP)})
      </text>
      <text x="16" y="58" fontFamily="var(--font-mono)" fontSize="12" fill="var(--handle)" fontWeight="600">
        M = ({((a.x+b.x)/2-360)/STEP>=0?'+':''}{(((a.x+b.x)/2-360)/STEP).toFixed(1)}, {((210-(a.y+b.y)/2)/STEP).toFixed(1)})
      </text>
      <text x="16" y="72" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        xM=(xA+xB)/2  yM=(yA+yB)/2
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

      {/* Main formula */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16,
      }}>
        <div style={{ padding: 24, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 16 }}>
            {lang === 'es' ? 'Fórmula' : 'Formula'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 22, lineHeight: 2.1 }}>
            <div>
              <i>x</i><sub style={{ fontSize: 13 }}>M</sub> = (
              <i style={{ color: 'var(--accent)' }}>x</i><sub style={{ fontSize: 13, color: 'var(--accent)' }}>A</sub> +
              <i style={{ color: 'var(--formula)' }}>x</i><sub style={{ fontSize: 13, color: 'var(--formula)' }}>B</sub>
              ) / 2
            </div>
            <div>
              <i>y</i><sub style={{ fontSize: 13 }}>M</sub> = (
              <i style={{ color: 'var(--accent)' }}>y</i><sub style={{ fontSize: 13, color: 'var(--accent)' }}>A</sub> +
              <i style={{ color: 'var(--formula)' }}>y</i><sub style={{ fontSize: 13, color: 'var(--formula)' }}>B</sub>
              ) / 2
            </div>
          </div>
        </div>

        <div style={{ padding: 24, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 16 }}>
            {lang === 'es' ? 'Forma vectorial' : 'Vector form'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 22, lineHeight: 2.1 }}>
            <div>
              <i style={{ color: 'var(--handle)' }}>OM</i> = (
              <i style={{ color: 'var(--accent)' }}>OA</i> +
              <i style={{ color: 'var(--formula)' }}>OB</i>
              ) / 2
            </div>
            <div style={{ fontSize: 16, color: 'var(--fg-3)', marginTop: 4 }}>
              {lang === 'es' ? '∀ punto O del plano' : '∀ point O in the plane'}
            </div>
          </div>
        </div>
      </div>

      {/* Parallelogram property */}
      <div style={{
        padding: 18, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)', borderLeft: '3px solid var(--handle)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--handle)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {lang === 'es' ? 'Propiedad del paralelograma' : 'Parallelogram property'}
        </div>
        <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6, margin: 0 }}>
          {lang === 'es'
            ? 'Desde cualquier punto O, el paralelograma definido por los vectores OA y OB tiene sus dos diagonales cortándose en el punto medio M del segmento AB. Esta es la demostración geométrica más elegante de la fórmula.'
            : 'From any point O, the parallelogram defined by vectors OA and OB has both diagonals crossing at the midpoint M of segment AB. This is the most elegant geometric proof of the formula.'}
        </p>
      </div>
    </div>
  );
};

// ── SVG code pane (interactive) ────────────────────────────────────
const SvgPane = ({ lang }: { lang: Lang }) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | null>(null);
  const [a, setA] = useState<Vec2>({ x: 120, y: 50  });
  const [b, setB] = useState<Vec2>({ x: 280, y: 160 });

  const W = 400, H = 220;
  const m: Vec2 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };

  const onPointerDown = (which: 'A' | 'B') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(10, Math.min(W-10, (e.clientX - r.left) * (W / r.width)));
    const sy = Math.max(10, Math.min(H-10, (e.clientY - r.top)  * (H / r.height)));
    if (drag.current === 'A') setA({ x: sx, y: sy });
    if (drag.current === 'B') setB({ x: sx, y: sy });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 360 }}>

      {/* Left: code */}
      <pre style={{
        margin: 0, padding: 24, fontSize: 12, lineHeight: 1.65,
        overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)',
        borderRight: '1px solid var(--hairline)',
      }}>
{`// Midpoint in SVG
// A and B are draggable points

const xM = (xA + xB) / 2;
const yM = (yA + yB) / 2;

// Place the midpoint circle
midpoint.setAttribute("cx", xM);
midpoint.setAttribute("cy", yM);

// Place the label
label.setAttribute("x", xM + 10);
label.setAttribute("y", yM - 8);
label.textContent = "M";

// Using modern D3-drag:
import { drag } from "d3-drag";

drag().on("drag", (e, d) => {
  d.x = e.x;
  d.y = e.y;
  // midpoint auto-updates
  updateMidpoint();
});`}
      </pre>

      {/* Right: live mini demo */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid var(--hairline)',
          fontSize: 11, fontWeight: 600, color: 'var(--fg-3)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {lang === 'es' ? 'Demo en vivo — arrastra A y B' : 'Live demo — drag A and B'}
        </div>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
          style={{ flex: 1, display: 'block', touchAction: 'none', background: 'var(--surface)' }}
          onPointerMove={onPointerMove}
          onPointerUp={() => { drag.current = null; }}
          onPointerLeave={() => { drag.current = null; }}>
          <defs>
            <pattern id="mpsgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#mpsgrid)"/>

          {/* Segment AB */}
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="var(--fg-1)" strokeWidth="2.5"/>

          {/* AM = MB tick marks */}
          {(() => {
            const len = Math.hypot(b.x-a.x, b.y-a.y);
            if (len < 10) return null;
            const ux = (b.x-a.x)/len, uy = (b.y-a.y)/len;
            const px = -uy*6, py = ux*6;
            const t1 = { x: (a.x+m.x)/2, y: (a.y+m.y)/2 };
            const t2 = { x: (m.x+b.x)/2, y: (m.y+b.y)/2 };
            return (
              <>
                <line x1={t1.x-px} y1={t1.y-py} x2={t1.x+px} y2={t1.y+py}
                  stroke="var(--handle)" strokeWidth="1.5"/>
                <line x1={t2.x-px} y1={t2.y-py} x2={t2.x+px} y2={t2.y+py}
                  stroke="var(--handle)" strokeWidth="1.5"/>
              </>
            );
          })()}

          {/* Midpoint M */}
          <circle cx={m.x} cy={m.y} r="6" fill="var(--handle)" stroke="white" strokeWidth="2"/>
          <text x={m.x+10} y={m.y-6}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--handle)">M</text>

          {/* A handle */}
          <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('A')}>
            <circle cx={a.x} cy={a.y} r="12" fill="var(--accent)" fillOpacity="0.12"/>
            <circle cx={a.x} cy={a.y} r="6"  fill="var(--accent)" stroke="white" strokeWidth="2"/>
          </g>
          <text x={a.x-18} y={a.y+5}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--accent)">A</text>

          {/* B handle */}
          <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('B')}>
            <circle cx={b.x} cy={b.y} r="12" fill="var(--formula)" fillOpacity="0.12"/>
            <circle cx={b.x} cy={b.y} r="6"  fill="var(--formula)" stroke="white" strokeWidth="2"/>
          </g>
          <text x={b.x+10} y={b.y+5}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--formula)">B</text>

          {/* Readout */}
          <rect x="4" y="4" width="190" height="36" rx="4"
            fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.7"/>
          <text x="10" y="18" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">
            A=({a.x.toFixed(0)},{a.y.toFixed(0)})  B=({b.x.toFixed(0)},{b.y.toFixed(0)})
          </text>
          <text x="10" y="34" fontFamily="var(--font-mono)" fontSize="10" fill="var(--handle)" fontWeight="600">
            M=({m.x.toFixed(1)},{m.y.toFixed(1)})
          </text>
        </svg>
      </div>
    </div>
  );
};
