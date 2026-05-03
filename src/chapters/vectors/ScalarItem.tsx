// ScalarItem.tsx — Producto por escalar: vector V arrastrable + slider k,
// vector W = k·V en tiempo real. Tab SVG: construcción de Bézier cuadrático.

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { type Lang } from '../../lib/data';
import { ghostBtn } from '../../components/AppShell';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25; // px por unidad

const STR = {
  es: {
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    scalar: 'Escalar k',
    vectorV: 'Vector V (original)',
    vectorW: 'Vector W = k·V',
    length: 'Longitud',
    hint: 'Arrastra el extremo de V. Ajusta k con el deslizador.',
    formula: {
      title: 'Producto por escalar',
      body: 'Multiplicar un vector V por un escalar k produce un vector W en la misma dirección (o dirección opuesta si k < 0), con longitud escalada por |k|.',
    },
    derivation: [
      'Sea V = (Vx, Vy) un vector y k un número real (escalar).',
      'El producto escalar W = k·V tiene componentes Wx = k·Vx, Wy = k·Vy.',
      'Si k > 1: W es más largo que V en la misma dirección.',
      'Si 0 < k < 1: W es más corto que V en la misma dirección.',
      'Si k < 0: W apunta en dirección opuesta a V.',
      'La longitud escala: |W| = |k| · |V|. El ángulo de W es igual al de V (o +180° si k < 0).',
    ],
    bezierTitle: 'Aplicación: Bézier cuadrático',
    bezierDesc: 'Mueve m sobre AC para cambiar k y ver cómo M traza la curva.',
  },
  en: {
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    scalar: 'Scalar k',
    vectorV: 'Vector V (original)',
    vectorW: 'Vector W = k·V',
    length: 'Length',
    hint: 'Drag the tip of V. Adjust k with the slider.',
    formula: {
      title: 'Scalar multiplication',
      body: 'Multiplying vector V by a scalar k produces vector W in the same direction (or opposite if k < 0), with length scaled by |k|.',
    },
    derivation: [
      'Let V = (Vx, Vy) be a vector and k a real number (scalar).',
      'The product W = k·V has components Wx = k·Vx, Wy = k·Vy.',
      'If k > 1: W is longer than V in the same direction.',
      'If 0 < k < 1: W is shorter than V in the same direction.',
      'If k < 0: W points in the opposite direction to V.',
      'Length scales: |W| = |k|·|V|. The angle of W equals that of V (or +180° if k < 0).',
    ],
    bezierTitle: 'Application: Quadratic Bézier',
    bezierDesc: 'Move m along AC to change k and see how M traces the curve.',
  },
};

const DEFAULT_V: Vec2 = { x: 125, y: 75 }; // math coords (y↑), px

export const ScalarItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Vec2>(DEFAULT_V);
  const [k, setK] = useState(-2);

  const w: Vec2 = { x: k * v.x, y: k * v.y };
  const mag = (p: Vec2) => (Math.hypot(p.x, p.y) / STEP).toFixed(2);

  const kColor = k > 0 ? 'var(--formula)' : k < 0 ? 'var(--handle)' : 'var(--fg-3)';

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
        {tab === 'explore' && <ScalarFigure v={v} setV={setV} k={k} w={w} />}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <BezierPane lang={lang} />}
      </div>

      {/* k Slider + inspector */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 20, alignItems: 'start',
        }}>
          {/* k slider */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 18, color: kColor }}>k</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: kColor, fontWeight: 600 }}>{k}</span>
            </span>
            <input type="range" min={-4} max={4} step={0.5} value={k}
              onChange={e => setK(parseFloat(e.target.value))}
              style={{ accentColor: 'var(--accent)', width: '100%' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)' }}>
              <span>−4</span><span>0</span><span>+4</span>
            </div>
          </label>

          {/* V readout */}
          <InspRow color="var(--accent)" name="V" hint={s.vectorV}
            vx={v.x / STEP} vy={v.y / STEP} len={mag(v)} />

          {/* W readout */}
          <InspRow color="var(--handle)" name="W" hint={s.vectorW}
            vx={w.x / STEP} vy={w.y / STEP} len={mag(w)} />

          <button onClick={() => { setV(DEFAULT_V); setK(-2); }}
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

// ── Inspector row ─────────────────────────────────────────────────
const InspRow = ({ color, name, hint, vx, vy, len }: {
  color: string; name: string; hint: string; vx: number; vy: number; len: string;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)' }}>{hint}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: color, flexShrink: 0 }}/>
      <span style={{ fontFamily: 'var(--font-math)', fontStyle: 'italic', color, fontSize: 16 }}>{name}</span>
    </div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>
      ({vx.toFixed(1)}, {vy.toFixed(1)})
    </div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)' }}>
      |{name}| = {len}
    </div>
  </div>
);

// ── Scalar figure ─────────────────────────────────────────────────
const ScalarFigure = ({ v, setV, k, w }: {
  v: Vec2; setV: (p: Vec2) => void; k: number; w: Vec2;
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const W = 720, H = 420;
  const ox = W / 2, oy = H / 2;

  // math → SVG
  const toS = (mx: number, my: number) => ({ x: ox + mx, y: oy - my });
  const vS = toS(v.x, v.y);
  const wS = toS(w.x, w.y);

  const vLen = Math.hypot(v.x, v.y);
  const wLen = Math.hypot(w.x, w.y);

  // Arrow endpoint offset (so the marker tip lands exactly on the handle)
  const arrowOffset = (dx: number, dy: number, len: number, off: number) =>
    len < 1 ? { x: ox, y: oy } : {
      x: ox + dx - (dx / len) * off,
      y: oy - dy + (dy / len) * off,
    };

  const vTip = arrowOffset(v.x, v.y, vLen, 12);
  const wTip = arrowOffset(w.x, w.y, wLen, 12);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragging.current = true;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    const snap = STEP;
    let mx = Math.round((sx - ox) / snap) * snap;
    let my = Math.round((oy - sy) / snap) * snap;
    if (mx === 0 && my === 0) mx = snap;
    mx = Math.max(-ox + snap, Math.min(ox - snap, mx));
    my = Math.max(-(oy - snap), Math.min(oy - snap, my));
    setV({ x: mx, y: my });
  };

  const kColor = k > 0 ? 'var(--formula)' : k < 0 ? 'var(--handle)' : 'var(--fg-3)';

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { dragging.current = false; }}
      onPointerLeave={() => { dragging.current = false; }}>
      <defs>
        <pattern id="sgrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="sgridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#sgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="sArrV" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id="sArrW" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--handle)"/>
        </marker>
        <marker id="sArrAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
      </defs>

      <rect width={W} height={H} fill="url(#sgridB)"/>

      {/* Axes */}
      <line x1={8} y1={oy} x2={W - 8} y2={oy} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#sArrAxis)"/>
      <line x1={ox} y1={H - 8} x2={ox} y2={8} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#sArrAxis)"/>
      <text x={W - 18} y={oy - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">x</text>
      <text x={ox + 8} y={14}     fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {/* Tick marks */}
      {[-4,-3,-2,-1,1,2,3,4].map(t => (
        <g key={`stx${t}`}>
          <line x1={ox + t*STEP*2} y1={oy-3} x2={ox + t*STEP*2} y2={oy+3} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox + t*STEP*2} y={oy+14} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="middle">{t*2}</text>
        </g>
      ))}
      {[-3,-2,-1,1,2,3].map(t => (
        <g key={`sty${t}`}>
          <line x1={ox-3} y1={oy - t*STEP*2} x2={ox+3} y2={oy - t*STEP*2} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox-6} y={oy - t*STEP*2 + 4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="end">{t*2}</text>
        </g>
      ))}

      {/* Origin */}
      <circle cx={ox} cy={oy} r="3.5" fill="var(--fg-1)"/>
      <text x={ox-14} y={oy+16} fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">O</text>

      {/* W = k·V — draw first (behind V) */}
      {wLen > 2 && (
        <>
          <line x1={ox} y1={oy} x2={wTip.x} y2={wTip.y}
            stroke="var(--handle)" strokeWidth="2.5" markerEnd="url(#sArrW)"
            strokeDasharray={k === 0 ? '0' : undefined}/>
          {/* W label near midpoint */}
          <text
            x={(ox + wS.x) / 2 + (w.y / wLen) * 16}
            y={(oy + wS.y) / 2 - (w.x / wLen) * 16}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18"
            fill="var(--handle)" textAnchor="middle">
            W
          </text>
        </>
      )}

      {/* V — original vector */}
      {vLen > 2 && (
        <>
          <line x1={ox} y1={oy} x2={vTip.x} y2={vTip.y}
            stroke="var(--accent)" strokeWidth="3" markerEnd="url(#sArrV)"/>
          {/* V label */}
          <text
            x={(ox + vS.x) / 2 + (v.y / vLen) * 16}
            y={(oy + vS.y) / 2 - (v.x / vLen) * 16}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18"
            fill="var(--accent)" textAnchor="middle">
            V
          </text>
        </>
      )}

      {/* k label near the midpoint between V and W tips */}
      <text x={ox + 20} y={oy - 20}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="16"
        fill={kColor}>
        k = {k}
      </text>

      {/* Drag handle on V tip */}
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
        <circle cx={vS.x} cy={vS.y} r="14" fill="var(--accent)" fillOpacity="0.12"/>
        <circle cx={vS.x} cy={vS.y} r="6"  fill="var(--accent)" stroke="white" strokeWidth="2"/>
      </g>

      {/* W tip indicator (read-only) */}
      {wLen > 2 && (
        <circle cx={wS.x} cy={wS.y} r="5" fill="var(--handle)" stroke="white" strokeWidth="1.5"/>
      )}

      {/* Overlay readout */}
      <rect x="8" y="8" width="220" height="72" rx="5"
        fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="26" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        V = ({(v.x/STEP).toFixed(1)}, {(v.y/STEP).toFixed(1)})  |V| = {(vLen/STEP).toFixed(2)}
      </text>
      <text x="16" y="44" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        k = {k}
      </text>
      <text x="16" y="62" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        W = ({(w.x/STEP).toFixed(1)}, {(w.y/STEP).toFixed(1)})  |W| = {(wLen/STEP).toFixed(2)}
      </text>
      <text x="16" y="76" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        |W| = |k|·|V| = {Math.abs(k)}·{(vLen/STEP).toFixed(2)} = {(wLen/STEP).toFixed(2)}
      </text>
    </svg>
  );
};

// ── Formula pane ──────────────────────────────────────────────────
const FormulaPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].formula;
  return (
    <div style={{ padding: '32px 40px', minHeight: 380 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{s.title}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560, lineHeight: 1.6, marginBottom: 24 }}>{s.body}</p>

      {/* Main formula */}
      <div style={{
        padding: 24, background: 'var(--surface-2)', borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)', marginBottom: 16,
        fontFamily: 'var(--font-math)', fontSize: 26, textAlign: 'center', lineHeight: 1.8,
      }}>
        <div>
          <i style={{ color: 'var(--handle)' }}>W</i> = <i style={{ color: 'var(--formula)' }}>k</i> · <i style={{ color: 'var(--accent)' }}>V</i>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Components */}
        <div style={{ padding: 18, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Componentes' : 'Components'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 19, lineHeight: 2.1 }}>
            <div><i style={{ color: 'var(--handle)' }}>Wx</i> = <i style={{ color: 'var(--formula)' }}>k</i> · <i style={{ color: 'var(--accent)' }}>Vx</i></div>
            <div><i style={{ color: 'var(--handle)' }}>Wy</i> = <i style={{ color: 'var(--formula)' }}>k</i> · <i style={{ color: 'var(--accent)' }}>Vy</i></div>
          </div>
        </div>
        {/* Length */}
        <div style={{ padding: 18, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Longitud' : 'Length'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 19, lineHeight: 2.1 }}>
            <div>|<i style={{ color: 'var(--handle)' }}>W</i>| = |<i style={{ color: 'var(--formula)' }}>k</i>| · |<i style={{ color: 'var(--accent)' }}>V</i>|</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8, lineHeight: 1.5 }}>
            {lang === 'es'
              ? 'El ángulo se conserva. Si k < 0, la dirección se invierte.'
              : 'Angle is preserved. If k < 0, direction is reversed.'}
          </div>
        </div>

        {/* k cases */}
        <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { cond: 'k > 1', desc: lang === 'es' ? 'Misma dirección, más largo' : 'Same direction, longer', color: 'var(--formula)' },
            { cond: '0 < k < 1', desc: lang === 'es' ? 'Misma dirección, más corto' : 'Same direction, shorter', color: 'var(--formula)' },
            { cond: 'k < 0', desc: lang === 'es' ? 'Dirección opuesta' : 'Opposite direction', color: 'var(--handle)' },
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
    </div>
  );
};

// ── Bézier quadratic interactive pane ─────────────────────────────
const BezierPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang];
  const [k, setK] = useState(0.33);
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  // Control points (fixed, SVG coords)
  const A = { x: 80,  y: 340 };
  const B = { x: 180, y: 80  };
  const C = { x: 580, y: 340 };

  // P = A + k*(B-A)
  const P = { x: A.x + k * (B.x - A.x), y: A.y + k * (B.y - A.y) };
  // Q = B + k*(C-B)
  const Q = { x: B.x + k * (C.x - B.x), y: B.y + k * (C.y - B.y) };
  // M = P + k*(Q-P)
  const M = { x: P.x + k * (Q.x - P.x), y: P.y + k * (Q.y - P.y) };

  // m = A + k*(C-A) — draggable point on baseline
  const mX = A.x + k * (C.x - A.x);
  const mY = A.y; // always on baseline

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

        {/* Bézier curve */}
        <path d={`M${A.x} ${A.y} Q${B.x},${B.y} ${C.x},${C.y}`}
          fill="none" stroke="var(--accent)" strokeWidth="2.5"/>

        {/* Control polygon */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--formula)" strokeWidth="1" strokeDasharray="8 4"/>
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="var(--formula)" strokeWidth="1" strokeDasharray="8 4"/>

        {/* Baseline AC */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="var(--fg-4)" strokeWidth="1"/>

        {/* Construction lines */}
        <line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} stroke="var(--handle)" strokeWidth="1.5" strokeDasharray="5 3"/>

        {/* Vectors from A: AB (control) */}
        <line x1={A.x} y1={A.y} x2={P.x} y2={P.y} stroke="var(--formula)" strokeWidth="2"/>
        <line x1={B.x} y1={B.y} x2={Q.x} y2={Q.y} stroke="var(--formula)" strokeWidth="2"/>
        <line x1={P.x} y1={P.y} x2={M.x} y2={M.y} stroke="var(--handle)" strokeWidth="2"/>

        {/* Points */}
        {[
          { pt: A, label: 'A', color: 'var(--accent)', dx: -15, dy: 0 },
          { pt: B, label: 'B', color: 'var(--accent)', dx: -15, dy: 0 },
          { pt: C, label: 'C', color: 'var(--accent)', dx: 10, dy: 0 },
          { pt: P, label: 'P', color: 'var(--formula)', dx: -15, dy: 0 },
          { pt: Q, label: 'Q', color: 'var(--formula)', dx: 10, dy: 0 },
          { pt: M, label: 'M', color: 'var(--handle)', dx: -15, dy: -8 },
        ].map(({ pt, label, color, dx, dy }) => (
          <g key={label}>
            <circle cx={pt.x} cy={pt.y} r="5" fill={color} stroke="white" strokeWidth="1.5"/>
            <text x={pt.x + dx} y={pt.y + dy}
              fontFamily="var(--font-math)" fontStyle="italic" fontSize="15" fill={color}>{label}</text>
          </g>
        ))}

        {/* Draggable m on baseline */}
        <g style={{ cursor: 'ew-resize' }} onPointerDown={onPointerDown}>
          <circle cx={mX} cy={mY} r="14" fill="var(--construction)" fillOpacity="0.15"/>
          <circle cx={mX} cy={mY} r="6"  fill="var(--construction)" stroke="white" strokeWidth="2"/>
        </g>
        <text x={mX} y={mY + 20} fontFamily="var(--font-math)" fontStyle="italic"
          fontSize="14" fill="var(--construction)" textAnchor="middle">m</text>

        {/* k readout */}
        <rect x="8" y="8" width="160" height="40" rx="5"
          fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.8"/>
        <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
          k = {k.toFixed(2)}
        </text>
        <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
          AP = k·AB, BQ = k·BC
        </text>
      </svg>

      {/* Description strip */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid var(--hairline)',
        fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.5,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ color: 'var(--construction)', fontSize: 16, marginTop: 1 }}>⟵</span>
        <span>{s.bezierDesc}</span>
      </div>
    </div>
  );
};
