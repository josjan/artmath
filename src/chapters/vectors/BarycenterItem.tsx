// BarycenterItem.tsx — Baricentro:
// Tab Explorar: dos puntos A y B en una línea, sliders de pesos kA y kB,
//               "palancas" verticales proporcionales al peso, G se mueve.
//               Bonus: triángulo con 3 puntos — baricentro = centroide con k=1,1,1.
// Tab Fórmula: fórmula general con n puntos, propiedad vectorial.
// Tab SVG: construcción Bézier cuadrático con baricentros.

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { ghostBtn } from '../../components/AppShell';
import type { Lang } from '../../lib/data';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25;

const STR = {
  es: {
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    modeLabel: 'Modo',
    mode2: '2 puntos (A, B)',
    mode3: '3 puntos (A, B, C)',
    weightA: 'Peso kA', weightB: 'Peso kB', weightC: 'Peso kC',
    bary: 'Baricentro G',
    sumWeights: 'Suma pesos',
    hint2: 'Arrastra A y B. Ajusta los pesos con los sliders.',
    hint3: 'Arrastra A, B y C. Ajusta los tres pesos.',
    midpointHint: 'kA = kB → G es el punto medio',
    centroidHint: 'kA = kB = kC → G es el centroide del triángulo',
    formula: {
      title: 'Baricentro',
      body: 'El baricentro G de un conjunto de puntos con pesos es el punto que "equilibra" el sistema. La coordenada de G es la media ponderada de las coordenadas de los puntos.',
    },
    derivation: [
      'Sean A y B dos puntos con pesos kA y kB respectivamente.',
      'El baricentro G verifica: kA·GA⃗ + kB·GB⃗ = 0⃗.',
      'Tomando el origen O: (kA+kB)·OG⃗ = kA·OA⃗ + kB·OB⃗.',
      'Las coordenadas son xG = (kA·xA + kB·xB)/(kA+kB), igual para y.',
      'Si kA = kB, el baricentro es el punto medio del segmento AB.',
      'Con n puntos: xG = Σ(ki·xi) / Σki, yG = Σ(ki·yi) / Σki.',
      'Los pesos pueden ser negativos, pero Σki ≠ 0.',
    ],
    bezier: {
      title: 'Aplicación: Bézier cuadrático con baricentros',
      desc: 'Mueve m sobre AC. P es el baricentro de A(1−k) y B(k). Q el de B(1−k) y C(k). M el de P(1−k) y Q(k).',
    },
  },
  en: {
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    modeLabel: 'Mode',
    mode2: '2 points (A, B)',
    mode3: '3 points (A, B, C)',
    weightA: 'Weight kA', weightB: 'Weight kB', weightC: 'Weight kC',
    bary: 'Barycenter G',
    sumWeights: 'Sum of weights',
    hint2: 'Drag A and B. Adjust weights with sliders.',
    hint3: 'Drag A, B and C. Adjust all three weights.',
    midpointHint: 'kA = kB → G is the midpoint',
    centroidHint: 'kA = kB = kC → G is the triangle centroid',
    formula: {
      title: 'Barycenter',
      body: 'The barycenter G of a set of weighted points is the point that "balances" the system. The coordinate of G is the weighted mean of the point coordinates.',
    },
    derivation: [
      'Let A and B be two points with weights kA and kB respectively.',
      'The barycenter G satisfies: kA·GA⃗ + kB·GB⃗ = 0⃗.',
      'Taking origin O: (kA+kB)·OG⃗ = kA·OA⃗ + kB·OB⃗.',
      'Coordinates: xG = (kA·xA + kB·xB)/(kA+kB), same for y.',
      'If kA = kB, the barycenter is the midpoint of segment AB.',
      'With n points: xG = Σ(ki·xi) / Σki, yG = Σ(ki·yi) / Σki.',
      'Weights can be negative, but Σki ≠ 0.',
    ],
    bezier: {
      title: 'Application: Quadratic Bézier with barycenters',
      desc: 'Move m along AC. P is barycenter of A(1−k) and B(k). Q of B(1−k) and C(k). M of P(1−k) and Q(k).',
    },
  },
};

export const BarycenterItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<2 | 3>(2);

  // 2-point mode
  const [a2, setA2] = useState<Vec2>({ x: 170, y: 210 });
  const [b2, setB2] = useState<Vec2>({ x: 520, y: 210 });
  const [kA2, setKA2] = useState(2);
  const [kB2, setKB2] = useState(3);

  // 3-point mode
  const [a3, setA3] = useState<Vec2>({ x: 150, y: 320 });
  const [b3, setB3] = useState<Vec2>({ x: 500, y: 320 });
  const [c3, setC3] = useState<Vec2>({ x: 330, y: 100 });
  const [kA3, setKA3] = useState(1);
  const [kB3, setKB3] = useState(1);
  const [kC3, setKC3] = useState(1);

  // Computed barycenters
  const sum2 = kA2 + kB2;
  const g2: Vec2 = sum2 !== 0
    ? { x: (kA2 * a2.x + kB2 * b2.x) / sum2, y: (kA2 * a2.y + kB2 * b2.y) / sum2 }
    : { x: (a2.x + b2.x) / 2, y: (a2.y + b2.y) / 2 };

  const sum3 = kA3 + kB3 + kC3;
  const g3: Vec2 = sum3 !== 0
    ? { x: (kA3 * a3.x + kB3 * b3.x + kC3 * c3.x) / sum3, y: (kA3 * a3.y + kB3 * b3.y + kC3 * c3.y) / sum3 }
    : { x: (a3.x + b3.x + c3.x) / 3, y: (a3.y + b3.y + c3.y) / 3 };

  const isMidpoint = Math.abs(kA2 - kB2) < 0.01;
  const isCentroid = Math.abs(kA3 - kB3) < 0.01 && Math.abs(kB3 - kC3) < 0.01;

  const GRID_OX = 360, GRID_OY = 210;
  const toU = (sv: number, axis: 'x' | 'y') =>
    axis === 'x' ? ((sv - GRID_OX) / STEP).toFixed(1) : ((GRID_OY - sv) / STEP).toFixed(1);

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

      {/* Mode toggle (only in Explore) */}
      {tab === 'explore' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-3)' }}>{s.modeLabel}</span>
          {([2, 3] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: '5px 14px', borderRadius: 'var(--r-sm)',
              background: mode === m ? 'var(--accent)' : 'var(--surface)',
              color: mode === m ? 'var(--on-accent)' : 'var(--fg-2)',
              border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--hairline)'}`,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>{m === 2 ? s.mode2 : s.mode3}</button>
          ))}
        </div>
      )}

      {/* Figure */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden',
      }}>
        {tab === 'explore' && mode === 2 && (
          <>
            <BaryFigure2 a={a2} b={b2} kA={kA2} kB={kB2} g={g2} setA={setA2} setB={setB2} />
            {isMidpoint && (
              <div style={{ padding: '7px 20px', borderTop: '1px solid var(--hairline)', background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
                {s.midpointHint}
              </div>
            )}
          </>
        )}
        {tab === 'explore' && mode === 3 && (
          <>
            <BaryFigure3 a={a3} b={b3} c={c3} kA={kA3} kB={kB3} kC={kC3} g={g3}
              setA={setA3} setB={setB3} setC={setC3} />
            {isCentroid && (
              <div style={{ padding: '7px 20px', borderTop: '1px solid var(--hairline)', background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
                {s.centroidHint}
              </div>
            )}
          </>
        )}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <BezierPane lang={lang} />}
      </div>

      {/* Inspector + sliders */}
      {tab === 'explore' && mode === 2 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 20, alignItems: 'start',
        }}>
          <WeightSlider label={s.weightA} value={kA2} setValue={setKA2} color="var(--accent)" />
          <WeightSlider label={s.weightB} value={kB2} setValue={setKB2} color="var(--formula)" />
          <InspCell label={s.bary} color="var(--handle)"
            main={`(${toU(g2.x,'x')}, ${toU(g2.y,'y')})`}
            sub={`Σk = ${(kA2+kB2).toFixed(1)}`} />
          <InspCell label={s.sumWeights} color="var(--fg-2)"
            main={`kA + kB = ${(kA2+kB2).toFixed(1)}`}
            sub={`kA/Σk = ${(kA2/(kA2+kB2)).toFixed(2)}`} />
          <button onClick={() => { setA2({x:170,y:210}); setB2({x:520,y:210}); setKA2(2); setKB2(3); }}
            style={{ ...ghostBtn, alignSelf: 'center', whiteSpace: 'nowrap' }}>
            <Icon name="RotateCcw" size={13}/> {s.reset}
          </button>
        </div>
      )}
      {tab === 'explore' && mode === 3 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 20, alignItems: 'start',
        }}>
          <WeightSlider label={s.weightA} value={kA3} setValue={setKA3} color="var(--accent)" />
          <WeightSlider label={s.weightB} value={kB3} setValue={setKB3} color="var(--formula)" />
          <WeightSlider label={s.weightC} value={kC3} setValue={setKC3} color="var(--construction)" />
          <InspCell label={s.bary} color="var(--handle)"
            main={`(${toU(g3.x,'x')}, ${toU(g3.y,'y')})`}
            sub={`Σk = ${(kA3+kB3+kC3).toFixed(1)}`} />
          <button onClick={() => { setA3({x:150,y:320}); setB3({x:500,y:320}); setC3({x:330,y:100}); setKA3(1); setKB3(1); setKC3(1); }}
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

// ── Shared sub-components ─────────────────────────────────────────

const WeightSlider = ({ label, value, setValue, color }: {
  label: string; value: number; setValue: (v: number) => void; color: string;
}) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 600 }}>{value}</span>
    </span>
    <input type="range" min={-4} max={6} step={0.5} value={value}
      onChange={e => setValue(parseFloat(e.target.value))}
      style={{ accentColor: color, width: '100%' }}/>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)' }}>
      <span>−4</span><span>0</span><span>+6</span>
    </div>
  </label>
);

const InspCell = ({ label, color, main, sub }: {
  label: string; color: string; main: string; sub?: string;
}) => (
  <div>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 600, marginBottom: 2 }}>{main}</div>
    {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{sub}</div>}
  </div>
);

// ── 2-point barycenter figure ─────────────────────────────────────
const BaryFigure2 = ({ a, b, kA, kB, g, setA, setB }: {
  a: Vec2; b: Vec2; kA: number; kB: number; g: Vec2;
  setA: (p: Vec2) => void; setB: (p: Vec2) => void;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | null>(null);
  const W = 720, H = 300;

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

  // Lever heights proportional to weights (capped for display)
  const LEVER_SCALE = 20;
  const leverA = kA * LEVER_SCALE;
  const leverB = kB * LEVER_SCALE;

  // Projection of G onto AB line for the "balance point"
  const lenAB = Math.hypot(b.x - a.x, b.y - a.y);
  const uABx  = lenAB > 0 ? (b.x - a.x) / lenAB : 1;
  const uABy  = lenAB > 0 ? (b.y - a.y) / lenAB : 0;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}>
      <defs>
        <pattern id="bygrid"  width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="bygridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#bygrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#bygridB)"/>

      {/* Segment AB */}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke="var(--fg-2)" strokeWidth="3"/>

      {/* Lever at A — proportional to kA, perpendicular to AB */}
      <line x1={a.x} y1={a.y}
        x2={a.x - uABy * leverA} y2={a.y + uABx * leverA}
        stroke="var(--accent)" strokeWidth="2.5"/>
      <circle cx={a.x - uABy * leverA} cy={a.y + uABx * leverA} r="5"
        fill="var(--accent)" stroke="white" strokeWidth="1.5"/>
      <text x={a.x - uABy * leverA - 22} y={a.y + uABx * leverA}
        fontFamily="var(--font-mono)" fontSize="12" fill="var(--accent)" textAnchor="middle">
        k={kA}
      </text>

      {/* Lever at B — proportional to kB */}
      <line x1={b.x} y1={b.y}
        x2={b.x - uABy * leverB} y2={b.y + uABx * leverB}
        stroke="var(--formula)" strokeWidth="2.5"/>
      <circle cx={b.x - uABy * leverB} cy={b.y + uABx * leverB} r="5"
        fill="var(--formula)" stroke="white" strokeWidth="1.5"/>
      <text x={b.x - uABy * leverB + 22} y={b.y + uABx * leverB}
        fontFamily="var(--font-mono)" fontSize="12" fill="var(--formula)" textAnchor="middle">
        k={kB}
      </text>

      {/* Dashed line from G perpendicular to AB (balance point indicator) */}
      <line x1={g.x} y1={g.y}
        x2={g.x + uABx * 0 - uABy * 30} y2={g.y + uABy * 0 + uABx * 30}
        stroke="var(--handle)" strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1={g.x} y1={g.y}
        x2={g.x - uABx * 0 + uABy * 30} y2={g.y - uABy * 0 - uABx * 30}
        stroke="var(--handle)" strokeWidth="1.5" strokeDasharray="4 3"/>

      {/* Labels A, B */}
      <text x={a.x - 18} y={a.y - 10}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--accent)">A</text>
      <text x={b.x + 10} y={b.y - 10}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--formula)">B</text>
      <text x={g.x} y={g.y - 14}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--handle)" textAnchor="middle">G</text>

      {/* Drag handles A, B */}
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('A')}>
        <circle cx={a.x} cy={a.y} r="12" fill="var(--accent)" fillOpacity="0.12"/>
        <circle cx={a.x} cy={a.y} r="6"  fill="var(--accent)" stroke="white" strokeWidth="2"/>
      </g>
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('B')}>
        <circle cx={b.x} cy={b.y} r="12" fill="var(--formula)" fillOpacity="0.12"/>
        <circle cx={b.x} cy={b.y} r="6"  fill="var(--formula)" stroke="white" strokeWidth="2"/>
      </g>

      {/* G point */}
      <circle cx={g.x} cy={g.y} r="7" fill="var(--handle)" stroke="white" strokeWidth="2"/>

      {/* Readout */}
      <rect x="8" y="8" width="280" height="52" rx="5"
        fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        xG = (kA·xA + kB·xB) / (kA+kB)
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="12" fill="var(--handle)" fontWeight="600">
        G = ({((g.x-360)/STEP).toFixed(2)}, {((210-g.y)/STEP).toFixed(2)})
      </text>
      <text x="16" y="54" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        kA={kA}  kB={kB}  Σk={kA+kB}
      </text>
    </svg>
  );
};

// ── 3-point barycenter figure (triangle) ──────────────────────────
const BaryFigure3 = ({ a, b, c, kA, kB, kC, g, setA, setB, setC }: {
  a: Vec2; b: Vec2; c: Vec2;
  kA: number; kB: number; kC: number;
  g: Vec2;
  setA: (p: Vec2) => void; setB: (p: Vec2) => void; setC: (p: Vec2) => void;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'A' | 'B' | 'C' | null>(null);
  const W = 720, H = 420;

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
    const p: Vec2 = { x: sx, y: sy };
    if (drag.current === 'A') setA(p);
    if (drag.current === 'B') setB(p);
    if (drag.current === 'C') setC(p);
  };

  const sum = kA + kB + kC;

  const pts = [
    { pt: a, color: 'var(--accent)',       k: kA, which: 'A' as const, label: 'A' },
    { pt: b, color: 'var(--formula)',      k: kB, which: 'B' as const, label: 'B' },
    { pt: c, color: 'var(--construction)', k: kC, which: 'C' as const, label: 'C' },
  ];

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}>
      <defs>
        <pattern id="by3grid"  width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="by3gridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#by3grid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#by3gridB)"/>

      {/* Triangle fill */}
      <polygon points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`}
        fill="var(--formula)" fillOpacity="0.07"
        stroke="var(--fg-2)" strokeWidth="2"/>

      {/* Lines from G to each vertex */}
      {pts.map(({ pt, color }) => (
        <line key={color} x1={g.x} y1={g.y} x2={pt.x} y2={pt.y}
          stroke={color} strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.6"/>
      ))}

      {/* Weight circles — radius proportional to |k| */}
      {pts.map(({ pt, color, k }) => {
        const r = Math.max(6, Math.min(30, Math.abs(k) * 8));
        return (
          <circle key={color + 'w'} cx={pt.x} cy={pt.y} r={r}
            fill={color} fillOpacity={k >= 0 ? 0.18 : 0.08}
            stroke={color} strokeWidth={k >= 0 ? 0 : 1.5}
            strokeDasharray={k >= 0 ? '0' : '3 2'}/>
        );
      })}

      {/* Drag handles + labels */}
      {pts.map(({ pt, color, k, which, label }) => (
        <g key={which}>
          <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown(which)}>
            <circle cx={pt.x} cy={pt.y} r="8" fill={color} stroke="white" strokeWidth="2"/>
          </g>
          <text x={pt.x} y={pt.y - 18}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill={color} textAnchor="middle">
            {label}
          </text>
          <text x={pt.x} y={pt.y + 32}
            fontFamily="var(--font-mono)" fontSize="11" fill={color} textAnchor="middle">
            k={k}
          </text>
        </g>
      ))}

      {/* G point */}
      <circle cx={g.x} cy={g.y} r="8" fill="var(--handle)" stroke="white" strokeWidth="2"/>
      <text x={g.x + 14} y={g.y - 10}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--handle)">G</text>

      {/* Readout */}
      <rect x="8" y="8" width="300" height="66" rx="5"
        fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        G = (kA·xA + kB·xB + kC·xC) / Σk
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="12" fill="var(--handle)" fontWeight="600">
        G = ({((g.x-360)/STEP).toFixed(2)}, {((210-g.y)/STEP).toFixed(2)})
      </text>
      <text x="16" y="56" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        kA={kA}  kB={kB}  kC={kC}  Σk={sum.toFixed(1)}
      </text>
      {Math.abs(kA - kB) < 0.01 && Math.abs(kB - kC) < 0.01 && (
        <text x="16" y="70" fontFamily="var(--font-mono)" fontSize="10" fill="var(--accent)" fontWeight="600">
          ← centroide del triángulo
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
        {/* 2-point */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? '2 puntos' : '2 points'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
            <div><i style={{ color: 'var(--handle)' }}>xG</i> = (<i style={{ color: 'var(--accent)' }}>k₁</i>·<i>xA</i> + <i style={{ color: 'var(--formula)' }}>k₂</i>·<i>xB</i>) / (<i style={{ color: 'var(--accent)' }}>k₁</i>+<i style={{ color: 'var(--formula)' }}>k₂</i>)</div>
            <div><i style={{ color: 'var(--handle)' }}>yG</i> = (<i style={{ color: 'var(--accent)' }}>k₁</i>·<i>yA</i> + <i style={{ color: 'var(--formula)' }}>k₂</i>·<i>yB</i>) / (<i style={{ color: 'var(--accent)' }}>k₁</i>+<i style={{ color: 'var(--formula)' }}>k₂</i>)</div>
          </div>
        </div>
        {/* n points */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'n puntos' : 'n points'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
            <div><i style={{ color: 'var(--handle)' }}>xG</i> = Σ(<i>kᵢ</i>·<i>xᵢ</i>) / Σ<i>kᵢ</i></div>
            <div><i style={{ color: 'var(--handle)' }}>yG</i> = Σ(<i>kᵢ</i>·<i>yᵢ</i>) / Σ<i>kᵢ</i></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { cond: lang === 'es' ? 'kA = kB' : 'kA = kB', desc: lang === 'es' ? '→ G es el punto medio de AB' : '→ G is the midpoint of AB', color: 'var(--accent)' },
          { cond: 'kA = kB = kC', desc: lang === 'es' ? '→ G es el centroide del triángulo' : '→ G is the triangle centroid', color: 'var(--formula)' },
          { cond: 'k < 0', desc: lang === 'es' ? 'Pesos negativos permitidos (Σk ≠ 0)' : 'Negative weights allowed (Σk ≠ 0)', color: 'var(--handle)' },
          { cond: lang === 'es' ? 'Prop. vectorial' : 'Vector prop.', desc: 'k₁·G⃗A + k₂·G⃗B = 0⃗', color: 'var(--fg-3)' },
        ].map(({ cond, desc, color }) => (
          <div key={cond} style={{
            padding: '10px 14px', background: 'var(--surface-2)',
            border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
            borderLeft: `3px solid ${color}`,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, fontWeight: 600, marginBottom: 4 }}>{cond}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Bézier quadratic via barycenters ──────────────────────────────
const BezierPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].bezier;
  const [k, setK] = useState(0.33);
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const A = { x: 80,  y: 340 };
  const B = { x: 200, y: 80  };
  const C = { x: 580, y: 340 };

  // Barycenters: P = A(1-k) + B(k), Q = B(1-k) + C(k), M = P(1-k) + Q(k)
  const bary = (p1: Vec2, p2: Vec2, t: number): Vec2 => ({
    x: (1-t)*p1.x + t*p2.x,
    y: (1-t)*p1.y + t*p2.y,
  });
  const P = bary(A, B, k);
  const Q = bary(B, C, k);
  const M = bary(P, Q, k);
  const mX = A.x + k * (C.x - A.x); // draggable m on AC

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragging.current = true;
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (660 / r.width);
    const newK = Math.max(0, Math.min(1, (sx - A.x) / (C.x - A.x)));
    setK(Math.round(newK * 100) / 100);
  };

  return (
    <div>
      <svg ref={ref} viewBox="0 0 660 400"
        style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
        onPointerMove={onPointerMove}
        onPointerUp={() => { dragging.current = false; }}
        onPointerLeave={() => { dragging.current = false; }}>
        <defs>
          <pattern id="bezgrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="660" height="400" fill="url(#bezgrid)"/>

        {/* Bézier curve */}
        <path d={`M${A.x} ${A.y} Q${B.x},${B.y} ${C.x},${C.y}`}
          fill="none" stroke="var(--accent)" strokeWidth="2.5"/>

        {/* Control polygon */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--formula)" strokeWidth="1" strokeDasharray="8 4"/>
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="var(--formula)" strokeWidth="1" strokeDasharray="8 4"/>

        {/* Baseline AC */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="var(--fg-4)" strokeWidth="1"/>

        {/* AP and BQ construction */}
        <line x1={A.x} y1={A.y} x2={P.x} y2={P.y} stroke="var(--formula)" strokeWidth="2"/>
        <line x1={B.x} y1={B.y} x2={Q.x} y2={Q.y} stroke="var(--formula)" strokeWidth="2"/>

        {/* Tangent line PQ */}
        <line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} stroke="var(--handle)" strokeWidth="1.5" strokeDasharray="5 3"/>

        {/* Points */}
        {[
          { pt: A, label: 'A', color: 'var(--accent)', dx: -16, dy: 0 },
          { pt: B, label: 'B', color: 'var(--accent)', dx: -16, dy: 0 },
          { pt: C, label: 'C', color: 'var(--accent)', dx: 10, dy: 0 },
          { pt: P, label: 'P', color: 'var(--formula)', dx: -16, dy: 0 },
          { pt: Q, label: 'Q', color: 'var(--formula)', dx: 10, dy: 0 },
          { pt: M, label: 'M', color: 'var(--handle)', dx: -16, dy: -8 },
        ].map(({ pt, label, color, dx, dy }) => (
          <g key={label}>
            <circle cx={pt.x} cy={pt.y} r="5" fill={color} stroke="white" strokeWidth="1.5"/>
            <text x={pt.x+dx} y={pt.y+dy}
              fontFamily="var(--font-math)" fontStyle="italic" fontSize="15" fill={color}>{label}</text>
          </g>
        ))}

        {/* Draggable m on baseline */}
        <g style={{ cursor: 'ew-resize' }} onPointerDown={onPointerDown}>
          <circle cx={mX} cy={A.y} r="13" fill="var(--construction)" fillOpacity="0.15"/>
          <circle cx={mX} cy={A.y} r="6"  fill="var(--construction)" stroke="white" strokeWidth="2"/>
        </g>
        <text x={mX} y={A.y+20} fontFamily="var(--font-math)" fontStyle="italic"
          fontSize="13" fill="var(--construction)" textAnchor="middle">m</text>

        {/* k labels */}
        <rect x="8" y="8" width="230" height="52" rx="5"
          fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.8"/>
        <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
          k = {k.toFixed(2)}  (1−k) = {(1-k).toFixed(2)}
        </text>
        <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
          P = A(1−k)+B(k)  Q = B(1−k)+C(k)
        </text>
        <text x="16" y="54" fontFamily="var(--font-mono)" fontSize="10" fill="var(--handle)" fontWeight="600">
          M = P(1−k)+Q(k)  [baricentro de P y Q]
        </text>
      </svg>

      <div style={{
        padding: '10px 20px', borderTop: '1px solid var(--hairline)',
        fontSize: 12.5, color: 'var(--fg-3)', lineHeight: 1.5,
      }}>
        {s.desc}
      </div>
    </div>
  );
};
