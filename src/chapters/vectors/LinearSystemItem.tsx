// LinearSystemItem.tsx — Sistema lineal 2×2:
// Tab Explorar: vectores OA, OB y OC arrastrables. Resuelve OC = x·OA + y·OB
//               usando producto vectorial (Cramer). Muestra la descomposición
//               x·OA + y·OB = OC con los componentes punteados.
// Tab Fórmula: Cramer algebraico + interpretación vectorial.
// Tab SVG: intersección de dos rectas con código moderno.

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { ghostBtn } from '../../components/AppShell';
import type { Lang } from '../../lib/data';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25;

// Default positions (SVG absolute coords)
const INIT = {
  O: { x: 160, y: 210 },
  A: { x: 360, y: 110 },  // OA = (200, -100) in SVG
  B: { x: 360, y: 310 },  // OB = (200,  100) in SVG
  C: { x: 510, y: 210 },  // OC = (350,   0) in SVG
};

const STR = {
  es: {
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    hint: 'Arrastra A, B y C. El sistema se resuelve en tiempo real.',
    xCoef: 'Escalar x', yCoef: 'Escalar y',
    det: 'Determinante',
    solution: 'Solución',
    noSolution: '∞ soluciones o ninguna (OA ∥ OB)',
    check: 'Verificación: x·OA + y·OB = OC',
    formula: {
      title: 'Sistema lineal con producto vectorial',
      body: 'Resolver OC = x·OA + y·OB equivale a resolver un sistema 2×2. El producto vectorial (determinante) da la solución de Cramer directamente.',
    },
    derivation: [
      'Queremos OC = x·OA + y·OB con OA, OB, OC conocidos.',
      'Hacemos el producto vectorial a ambos lados con OB: OC∧OB = x·OA∧OB (ya que OB∧OB=0).',
      'Despejando: x = (OC∧OB) / (OA∧OB), siempre que OA∧OB ≠ 0.',
      'Análogamente: y = (OA∧OC) / (OA∧OB).',
      'En componentes: OA∧OB = OAx·OBy − OAy·OBx = determinante.',
      'Es la regla de Cramer: x = det(C,B)/det(A,B), y = det(A,C)/det(A,B).',
      'Si det = 0, OA y OB son paralelos → sin solución única.',
    ],
    intersection: {
      title: 'Aplicación: Intersección de rectas',
      desc: 'Arrastra A, B, C, D. M es la intersección de las rectas AB y CD.',
      parallel: 'Las rectas son paralelas — sin intersección.',
    },
  },
  en: {
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    hint: 'Drag A, B and C. The system is solved in real time.',
    xCoef: 'Scalar x', yCoef: 'Scalar y',
    det: 'Determinant',
    solution: 'Solution',
    noSolution: '∞ solutions or none (OA ∥ OB)',
    check: 'Check: x·OA + y·OB = OC',
    formula: {
      title: 'Linear system with cross product',
      body: 'Solving OC = x·OA + y·OB is equivalent to a 2×2 system. The cross product (determinant) gives the Cramer solution directly.',
    },
    derivation: [
      'We want OC = x·OA + y·OB with OA, OB, OC known.',
      'Cross both sides with OB: OC∧OB = x·OA∧OB (since OB∧OB=0).',
      'Solving: x = (OC∧OB) / (OA∧OB), provided OA∧OB ≠ 0.',
      'Similarly: y = (OA∧OC) / (OA∧OB).',
      'In components: OA∧OB = OAx·OBy − OAy·OBx = determinant.',
      'This is Cramer\'s rule: x = det(C,B)/det(A,B), y = det(A,C)/det(A,B).',
      'If det = 0, OA and OB are parallel → no unique solution.',
    ],
    intersection: {
      title: 'Application: Line intersection',
      desc: 'Drag A, B, C, D. M is the intersection of lines AB and CD.',
      parallel: 'Lines are parallel — no intersection.',
    },
  },
};

// 2D cross product (z-component)
const cross2 = (ax: number, ay: number, bx: number, by: number) => ax * by - ay * bx;

export const LinearSystemItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);

  const [o, setO] = useState<Vec2>({ ...INIT.O });
  const [a, setA] = useState<Vec2>({ ...INIT.A });
  const [b, setB] = useState<Vec2>({ ...INIT.B });
  const [c, setC] = useState<Vec2>({ ...INIT.C });

  // Vectors from O (SVG coords, y down — flip y for math display)
  const OA = { x: a.x - o.x, y: a.y - o.y };
  const OB = { x: b.x - o.x, y: b.y - o.y };
  const OC = { x: c.x - o.x, y: c.y - o.y };

  const det  = cross2(OA.x, OA.y, OB.x, OB.y);
  const detX = cross2(OC.x, OC.y, OB.x, OB.y);
  const detY = cross2(OA.x, OA.y, OC.x, OC.y);

  const hasUnique = Math.abs(det) > 0.5;
  const x = hasUnique ? detX / det : NaN;
  const y = hasUnique ? detY / det : NaN;

  // Check: x·OA + y·OB should ≈ OC
  const checkX = hasUnique ? x * OA.x + y * OB.x : NaN;
  const checkY = hasUnique ? x * OA.y + y * OB.y : NaN;
  const checkOk = hasUnique && Math.abs(checkX - OC.x) < 0.5 && Math.abs(checkY - OC.y) < 0.5;

  const fmt = (n: number) => Number.isFinite(n) ? n.toFixed(2) : '—';

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
          <>
            <SystemFigure o={o} a={a} b={b} c={c}
              setO={setO} setA={setA} setB={setB} setC={setC}
              x={x} y={y} hasUnique={hasUnique} />
            {!hasUnique && (
              <div style={{ padding: '8px 20px', borderTop: '1px solid var(--hairline)', background: 'var(--highlight-soft)', color: 'var(--handle)', fontSize: 13, fontWeight: 600 }}>
                {s.noSolution}
              </div>
            )}
          </>
        )}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <IntersectionPane lang={lang} />}
      </div>

      {/* Inspector */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'start',
        }}>
          <InspCell label={s.det} color={hasUnique ? 'var(--fg-2)' : 'var(--handle)'}
            main={det.toFixed(1)}
            sub="OAx·OBy − OAy·OBx" />
          <InspCell label={s.xCoef} color="var(--accent)"
            main={`x = ${fmt(x)}`}
            sub={`det(C,B)/det = ${fmt(detX)}/${det.toFixed(1)}`} />
          <InspCell label={s.yCoef} color="var(--formula)"
            main={`y = ${fmt(y)}`}
            sub={`det(A,C)/det = ${fmt(detY)}/${det.toFixed(1)}`} />
          <InspCell label={s.check}
            color={checkOk ? 'var(--accent)' : 'var(--fg-3)'}
            main={checkOk ? '✓ OC = x·OA + y·OB' : hasUnique ? '≈ check' : '—'}
            sub={hasUnique ? `(${checkX.toFixed(1)}, ${checkY.toFixed(1)})` : ''} />
          <button onClick={() => { setO({...INIT.O}); setA({...INIT.A}); setB({...INIT.B}); setC({...INIT.C}); }}
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
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 600, marginBottom: 2 }}>{main}</div>
    {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{sub}</div>}
  </div>
);

// ── System figure ──────────────────────────────────────────────────
const SystemFigure = ({ o, a, b, c, setO, setA, setB, setC, x, y, hasUnique }: {
  o: Vec2; a: Vec2; b: Vec2; c: Vec2;
  setO: (p: Vec2) => void; setA: (p: Vec2) => void;
  setB: (p: Vec2) => void; setC: (p: Vec2) => void;
  x: number; y: number; hasUnique: boolean;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'O' | 'A' | 'B' | 'C' | null>(null);
  const W = 720, H = 420;

  const snap = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, Math.round(v / STEP) * STEP));

  const onPointerDown = (which: 'O' | 'A' | 'B' | 'C') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = snap((e.clientX - r.left) * (W / r.width), STEP, W - STEP);
    const sy = snap((e.clientY - r.top)  * (H / r.height), STEP, H - STEP);
    const p: Vec2 = { x: sx, y: sy };
    if (drag.current === 'O') setO(p);
    if (drag.current === 'A') setA(p);
    if (drag.current === 'B') setB(p);
    if (drag.current === 'C') setC(p);
  };

  // Vectors from O
  const OA = { x: a.x - o.x, y: a.y - o.y };
  const OB = { x: b.x - o.x, y: b.y - o.y };

  // Arrow tip helper
  const tip = (from: Vec2, to: Vec2, off = 12): Vec2 => {
    const len = Math.hypot(to.x - from.x, to.y - from.y);
    if (len < 1) return to;
    return {
      x: to.x - (to.x - from.x) / len * off,
      y: to.y - (to.y - from.y) / len * off,
    };
  };

  // x·OA component tip (from O)
  const xOA_end = hasUnique ? { x: o.x + x * OA.x, y: o.y + x * OA.y } : o;
  // y·OB endpoint (from xOA_end)
  const xOA_plus_yOB = hasUnique ? { x: xOA_end.x + y * OB.x, y: xOA_end.y + y * OB.y } : o;

  const pts = [
    { pt: o, color: 'var(--fg-2)',    which: 'O' as const, label: 'O', dx: -20, dy: -8 },
    { pt: a, color: 'var(--accent)',  which: 'A' as const, label: 'A', dx:  14, dy: -8 },
    { pt: b, color: 'var(--formula)', which: 'B' as const, label: 'B', dx:  14, dy:  6 },
    { pt: c, color: 'var(--handle)',  which: 'C' as const, label: 'C', dx:  14, dy: -8 },
  ];

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}>
      <defs>
        <pattern id="lsgrid"  width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="lsgridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#lsgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        {[
          { id: 'lsArrA', color: 'var(--accent)' },
          { id: 'lsArrB', color: 'var(--formula)' },
          { id: 'lsArrC', color: 'var(--handle)' },
          { id: 'lsArrX', color: 'var(--accent)', opacity: 0.6 },
          { id: 'lsArrY', color: 'var(--formula)', opacity: 0.6 },
        ].map(({ id, color }) => (
          <marker key={id} id={id} viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
            <path d="M-12 -5 L 0 0 L -12 5 z" fill={color}/>
          </marker>
        ))}
      </defs>

      <rect width={W} height={H} fill="url(#lsgridB)"/>

      {/* ── Decomposition: x·OA + y·OB = OC (dashed) ── */}
      {hasUnique && (
        <>
          {/* x·OA */}
          <line x1={o.x} y1={o.y}
            x2={tip(o, xOA_end).x} y2={tip(o, xOA_end).y}
            stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 3"
            markerEnd="url(#lsArrX)" strokeOpacity="0.7"/>
          {/* y·OB from xOA_end */}
          <line x1={xOA_end.x} y1={xOA_end.y}
            x2={tip(xOA_end, xOA_plus_yOB).x} y2={tip(xOA_end, xOA_plus_yOB).y}
            stroke="var(--formula)" strokeWidth="2" strokeDasharray="6 3"
            markerEnd="url(#lsArrY)" strokeOpacity="0.7"/>
          {/* Parallelogram fill */}
          <polygon
            points={`${o.x},${o.y} ${xOA_end.x},${xOA_end.y} ${c.x},${c.y} ${o.x + y*OB.x},${o.y + y*OB.y}`}
            fill="var(--handle)" fillOpacity="0.07"
            stroke="var(--fg-4)" strokeWidth="0.5" strokeDasharray="3 3"/>
        </>
      )}

      {/* OA vector */}
      <line x1={o.x} y1={o.y} x2={tip(o,a).x} y2={tip(o,a).y}
        stroke="var(--accent)" strokeWidth="3" markerEnd="url(#lsArrA)"/>

      {/* OB vector */}
      <line x1={o.x} y1={o.y} x2={tip(o,b).x} y2={tip(o,b).y}
        stroke="var(--formula)" strokeWidth="3" markerEnd="url(#lsArrB)"/>

      {/* OC vector */}
      <line x1={o.x} y1={o.y} x2={tip(o,c).x} y2={tip(o,c).y}
        stroke="var(--handle)" strokeWidth="3" markerEnd="url(#lsArrC)"/>

      {/* Drag handles + labels */}
      {pts.map(({ pt, color, which, label, dx, dy }) => (
        <g key={which}>
          <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown(which)}>
            <circle cx={pt.x} cy={pt.y} r="13" fill={color} fillOpacity="0.12"/>
            <circle cx={pt.x} cy={pt.y} r="6"  fill={color} stroke="white" strokeWidth="2"/>
          </g>
          <text x={pt.x + dx} y={pt.y + dy}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill={color}>
            {label}
          </text>
        </g>
      ))}

      {/* Vector labels */}
      <text x={(o.x+a.x)/2 + 12} y={(o.y+a.y)/2 - 8}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="15" fill="var(--accent)">OA</text>
      <text x={(o.x+b.x)/2 + 12} y={(o.y+b.y)/2 + 16}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="15" fill="var(--formula)">OB</text>
      <text x={(o.x+c.x)/2} y={(o.y+c.y)/2 - 14}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="15" fill="var(--handle)" textAnchor="middle">OC</text>

      {/* Readout overlay */}
      <rect x="8" y="8" width="290" height="82" rx="5"
        fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        OA=({OA.x},{OA.y})  OB=({OB.x},{OB.y})
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        OC=({(c.x-o.x)},{(c.y-o.y)})
      </text>
      <text x="16" y="58" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        det = OAx·OBy−OAy·OBx = {cross2(OA.x,OA.y,OB.x,OB.y).toFixed(0)}
      </text>
      {hasUnique ? (
        <>
          <text x="16" y="74" fontFamily="var(--font-mono)" fontSize="12" fill="var(--accent)" fontWeight="600">
            x = {x.toFixed(3)}
          </text>
          <text x="100" y="74" fontFamily="var(--font-mono)" fontSize="12" fill="var(--formula)" fontWeight="600">
            y = {y.toFixed(3)}
          </text>
          <text x="16" y="88" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
            OC = {x.toFixed(2)}·OA + {y.toFixed(2)}·OB
          </text>
        </>
      ) : (
        <text x="16" y="74" fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)">
          OA ∥ OB → sin solución única
        </text>
      )}
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
        {/* Vector form */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Forma vectorial' : 'Vector form'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 19, lineHeight: 2, color: 'var(--fg-1)' }}>
            <div>
              <i style={{ color: 'var(--accent)' }}>x</i> = (
              <i style={{ color: 'var(--handle)' }}>OC</i>∧<i style={{ color: 'var(--formula)' }}>OB</i>) / (
              <i style={{ color: 'var(--accent)' }}>OA</i>∧<i style={{ color: 'var(--formula)' }}>OB</i>)
            </div>
            <div>
              <i style={{ color: 'var(--formula)' }}>y</i> = (
              <i style={{ color: 'var(--accent)' }}>OA</i>∧<i style={{ color: 'var(--handle)' }}>OC</i>) / (
              <i style={{ color: 'var(--accent)' }}>OA</i>∧<i style={{ color: 'var(--formula)' }}>OB</i>)
            </div>
          </div>
        </div>

        {/* Cramer algebraic */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Regla de Cramer' : "Cramer's rule"}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 2 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', marginBottom: 4 }}>
              ax + by = c<br/>a′x + b′y = c′
            </div>
            <div>det = a·b′ − a′·b</div>
            <div><i style={{ color: 'var(--accent)' }}>x</i> = (c·b′ − c′·b) / det</div>
            <div><i style={{ color: 'var(--formula)' }}>y</i> = (a·c′ − a′·c) / det</div>
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { cond: 'det ≠ 0', desc: lang === 'es' ? 'Solución única' : 'Unique solution', color: 'var(--formula)' },
          { cond: 'det = 0, OC ∦ OA', desc: lang === 'es' ? 'Sin solución' : 'No solution', color: 'var(--handle)' },
          { cond: 'det = 0, OC ∥ OA', desc: lang === 'es' ? 'Infinitas soluciones' : 'Infinite solutions', color: 'var(--fg-3)' },
        ].map(({ cond, desc, color }) => (
          <div key={cond} style={{
            padding: '10px 14px', background: 'var(--surface-2)',
            border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
            borderLeft: `3px solid ${color}`,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color, fontWeight: 600, marginBottom: 4 }}>{cond}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Line intersection pane ─────────────────────────────────────────
const IntersectionPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].intersection;
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<number | null>(null);
  const W = 720, H = 420;

  const [pts, setPts] = useState([
    { x: 120, y: 100 }, // A
    { x: 580, y: 350 }, // B
    { x: 100, y: 320 }, // C
    { x: 600, y: 130 }, // D
  ]);

  const [A, B, C, D] = pts;

  // Line AB: direction (B-A), normal n1 = (-(By-Ay), Bx-Ax)
  // Line equation: n1·(P - A) = 0 → n1x*(x-Ax) + n1y*(y-Ay) = 0
  // u1*x + v1*y + w1 = 0 where u1=n1x, v1=n1y, w1=-(n1x*Ax+n1y*Ay)
  const lineCoeffs = (p1: Vec2, p2: Vec2) => {
    const u = -(p2.y - p1.y);
    const v =   p2.x - p1.x;
    const w = -(u * p1.x + v * p1.y);
    return { u, v, w };
  };

  const L1 = lineCoeffs(A, B);
  const L2 = lineCoeffs(C, D);
  const det = L1.u * L2.v - L2.u * L1.v;
  const isParallel = Math.abs(det) < 0.5;
  const M: Vec2 | null = isParallel ? null : {
    x: (L1.v * L2.w - L2.v * L1.w) / det,   // Cramer: x = (v1*w2 - v2*w1) / det ... wait sign
    y: (L2.u * L1.w - L1.u * L2.w) / det,
  };

  // Actually the correct Cramer for u*x + v*y = -w:
  // det = u1*v2 - u2*v1
  // x = (-w1*v2 - (-w2)*v1) / det = (v1*w2 - v2*w1) / det ... let me recalculate inline
  const detC = L1.u * L2.v - L2.u * L1.v;
  const mx = !isParallel ? (-L1.w * L2.v - (-L2.w) * L1.v) / detC : NaN;
  const my = !isParallel ? (L1.u * (-L2.w) - L2.u * (-L1.w)) / detC : NaN;

  const onPointerDown = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = i;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current === null || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(10, Math.min(W - 10, (e.clientX - r.left) * (W / r.width)));
    const sy = Math.max(10, Math.min(H - 10, (e.clientY - r.top)  * (H / r.height)));
    setPts(prev => prev.map((p, i) => i === drag.current ? { x: sx, y: sy } : p));
  };

  const LABELS = ['A', 'B', 'C', 'D'];
  const COLORS = ['var(--accent)', 'var(--accent)', 'var(--formula)', 'var(--formula)'];

  // Extend lines to canvas edges for display
  const extendLine = (p1: Vec2, p2: Vec2): [Vec2, Vec2] => {
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    if (len < 1) return [p1, p2];
    const t1 = Math.max(
      -p1.x / dx, -p1.y / dy, (W - p1.x) / dx, (H - p1.y) / dy
    );
    const t0 = Math.min(
      -p1.x / dx, -p1.y / dy, (W - p1.x) / dx, (H - p1.y) / dy
    );
    return [
      { x: p1.x + t0 * dx, y: p1.y + t0 * dy },
      { x: p1.x + t1 * dx, y: p1.y + t1 * dy },
    ];
  };

  const [eA0, eA1] = extendLine(A, B);
  const [eC0, eC1] = extendLine(C, D);

  return (
    <div>
      <div style={{
        padding: '8px 20px', borderBottom: '1px solid var(--hairline)',
        fontSize: 13, fontWeight: 600, color: 'var(--fg-2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>{s.title}</span>
        {isParallel && (
          <span style={{ color: 'var(--handle)', fontWeight: 600, fontSize: 12 }}>{s.parallel}</span>
        )}
        {!isParallel && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--handle)', fontWeight: 700 }}>
            M = ({mx.toFixed(1)}, {my.toFixed(1)})
          </span>
        )}
      </div>

      <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
        onPointerMove={onPointerMove}
        onPointerUp={() => { drag.current = null; }}
        onPointerLeave={() => { drag.current = null; }}>
        <defs>
          <pattern id="intgrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#intgrid)"/>

        {/* Extended lines */}
        <line x1={eA0.x} y1={eA0.y} x2={eA1.x} y2={eA1.y}
          stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="8 4" strokeOpacity="0.5"/>
        <line x1={eC0.x} y1={eC0.y} x2={eC1.x} y2={eC1.y}
          stroke="var(--formula)" strokeWidth="1.5" strokeDasharray="8 4" strokeOpacity="0.5"/>

        {/* Segments AB and CD */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
          stroke="var(--accent)" strokeWidth="2.5"/>
        <line x1={C.x} y1={C.y} x2={D.x} y2={D.y}
          stroke="var(--formula)" strokeWidth="2.5"/>

        {/* Intersection M */}
        {!isParallel && Number.isFinite(mx) && Number.isFinite(my) && (
          <>
            <circle cx={mx} cy={my} r="8" fill="var(--handle)" stroke="white" strokeWidth="2"/>
            <text x={mx + 14} y={my - 8}
              fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--handle)">M</text>
          </>
        )}

        {/* Drag handles */}
        {pts.map((p, i) => (
          <g key={i} style={{ cursor: 'grab' }} onPointerDown={onPointerDown(i)}>
            <circle cx={p.x} cy={p.y} r="12" fill={COLORS[i]} fillOpacity="0.12"/>
            <circle cx={p.x} cy={p.y} r="6"  fill={COLORS[i]} stroke="white" strokeWidth="2"/>
            <text x={p.x + (i % 2 === 0 ? -18 : 14)} y={p.y - 6}
              fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill={COLORS[i]}>
              {LABELS[i]}
            </text>
          </g>
        ))}

        {/* Code overlay */}
        <rect x="8" y="8" width="260" height="68" rx="5"
          fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
        <text x="16" y="22" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
          det = u₁·v₂ − u₂·v₁ = {detC.toFixed(0)}
        </text>
        <text x="16" y="36" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
          xM = (v₁·w₂ − v₂·w₁) / det
        </text>
        <text x="16" y="50" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
          yM = (u₂·w₁ − u₁·w₂) / det
        </text>
        {!isParallel ? (
          <text x="16" y="68" fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" fontWeight="600">
            M = ({mx.toFixed(1)}, {my.toFixed(1)})
          </text>
        ) : (
          <text x="16" y="68" fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" fontWeight="600">
            det = 0 → ∥ paralelas
          </text>
        )}
      </svg>

      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--hairline)', fontSize: 12.5, color: 'var(--fg-3)' }}>
        {s.desc}
      </div>
    </div>
  );
};
