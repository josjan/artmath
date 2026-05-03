// VectorAdditionItem.tsx — Suma de vectores: dos vectores arrastrables u y v,
// resultado w = u + v, visualización del paralelogramo y coordenadas en tiempo real.
// Formato idéntico a CartesianItem + inspector panel de LinearSystemItem.

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { ghostBtn } from '../../components/AppShell';
import { type Lang } from '../../lib/data';
import { type Route } from '../../components/AppShell';

interface Vec2 { x: number; y: number; }

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

// ── Strings locales ───────────────────────────────────────────────
const STR = {
  es: {
    title:   'Suma de vectores',
    blurb:   'Suma geométrica y analítica de vectores en el plano ℝ².',
    formula: {
      title: 'Suma de vectores',
      body:  'La suma de dos vectores u y v se define componente a componente: w = u + v = (u₁+v₁, u₂+v₂). Geométricamente, el vector resultante es la diagonal del paralelogramo formado por u y v.',
    },
    inspector: {
      vectorU:   'Vector u',
      vectorV:   'Vector v',
      vectorW:   'Suma w = u+v',
      length:    'Módulo',
      angle:     'Ángulo',
      hint:      'Arrastra los puntos para recalcular la suma.',
    },
    derivation: [
      'Sean u = (u₁, u₂) y v = (v₁, v₂) dos vectores en ℝ².',
      'La suma w = u + v se define componente a componente.',
      'w = (u₁ + v₁, u₂ + v₂)',
      'Geométricamente, w es la diagonal del paralelogramo construido sobre u y v.',
      'La longitud de w es |w| = √((u₁+v₁)² + (u₂+v₂)²).',
      'El ángulo con el eje X es θ = atan2(u₂+v₂, u₁+v₁) en grados.',
    ],
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
  },
  en: {
    title:   'Sum of vectors',
    blurb:   'Geometric and analytical sum of vectors in the ℝ² plane.',
    formula: {
      title: 'Sum of vectors',
      body:  'The sum of two vectors u and v is defined component-wise: w = u + v = (u₁+v₁, u₂+v₂). Geometrically, the resulting vector is the diagonal of the parallelogram formed by u and v.',
    },
    inspector: {
      vectorU:   'Vector u',
      vectorV:   'Vector v',
      vectorW:   'Sum w = u+v',
      length:    'Length',
      angle:     'Angle',
      hint:      'Drag the points to recalculate the sum.',
    },
    derivation: [
      'Let u = (u₁, u₂) and v = (v₁, v₂) be two vectors in ℝ².',
      'The sum w = u + v is defined component-wise.',
      'w = (u₁ + v₁, u₂ + v₂)',
      'Geometrically, w is the diagonal of the parallelogram built on u and v.',
      'The length of w is |w| = √((u₁+v₁)² + (u₂+v₂)²).',
      'The angle with the X-axis is θ = atan2(u₂+v₂, u₁+v₁) in degrees.',
    ],
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
  },
};

const STEP = 25; // px per math unit

// Vectores iniciales en coordenadas matemáticas (y positivo = arriba)
const DEFAULT_U: Vec2 = { x:  7 * STEP, y:  1 * STEP };  // u = (7, 1)
const DEFAULT_V: Vec2 = { x:  1 * STEP, y:  5 * STEP };  // v = (1, 5)

export const VectorAdditionItem = ({ lang }: Props) => {
  const s = STR[lang];

  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [u, setU] = useState<Vec2>(DEFAULT_U);
  const [v, setV] = useState<Vec2>(DEFAULT_V);

  const w: Vec2 = { x: u.x + v.x, y: u.y + v.y };

  const lenU = (Math.hypot(u.x, u.y) / STEP).toFixed(2);
  const lenV = (Math.hypot(v.x, v.y) / STEP).toFixed(2);
  const lenW = (Math.hypot(w.x, w.y) / STEP).toFixed(2);
  const angU = (Math.atan2(u.y, u.x) * 180 / Math.PI).toFixed(1);
  const angV = (Math.atan2(v.y, v.x) * 180 / Math.PI).toFixed(1);
  const angW = (Math.atan2(w.y, w.x) * 180 / Math.PI).toFixed(1);
  const toComp = (p: Vec2) => `(${Math.round(p.x / STEP)}, ${Math.round(p.y / STEP)})`;

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
        {tab === 'explore' && <VectorAdditionFigure u={u} v={v} setU={setU} setV={setV} />}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <SvgPane />}
      </div>

      {/* Inspector — solo en Explorar */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto',
          gap: 16, alignItems: 'start',
        }}>
          <InspCell
            label={s.inspector.vectorU}
            color="var(--accent)"
            main={`u = ${toComp(u)}`}
            sub={`|u| = ${lenU}  ·  θ = ${angU}°`}
          />
          <InspCell
            label={s.inspector.vectorV}
            color="var(--formula)"
            main={`v = ${toComp(v)}`}
            sub={`|v| = ${lenV}  ·  θ = ${angV}°`}
          />
          <InspCell
            label={s.inspector.vectorW}
            color="var(--handle)"
            main={`w = ${toComp(w)}`}
            sub={`|w| = ${lenW}  ·  θ = ${angW}°`}
          />
          <button
            onClick={() => { setU(DEFAULT_U); setV(DEFAULT_V); }}
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
              <span dangerouslySetInnerHTML={{ __html: txt.replace(/\b([uvw])\b/g, '<i class="math" style="color:var(--accent)">$1</i>') }} />
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

// ── Figura interactiva ────────────────────────────────────────────
const VectorAdditionFigure = ({ u, v, setU, setV }: {
  u: Vec2; v: Vec2;
  setU: (p: Vec2) => void;
  setV: (p: Vec2) => void;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'u' | 'v' | null>(null);

  const W = 720, H = 460;
  const ox = W / 2, oy = H / 2;  // origin in SVG coords

  // Math coords (y up) → SVG coords (y down)
  const toSvg = (p: Vec2) => ({ x: ox + p.x, y: oy - p.y });
  const uS = toSvg(u), vS = toSvg(v);
  const w: Vec2 = { x: u.x + v.x, y: u.y + v.y };
  const wS = toSvg(w);

  // Axis tick label helper (pixels → integer math units)
  const toLabel = (px: number) => String(Math.round(px / STEP));

  const onPointerDown = (which: 'u' | 'v') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    // Snap to 1-unit grid; y up = positive (math convention)
    const mx = Math.round((sx - ox) / STEP) * STEP;
    const my = Math.round((oy - sy) / STEP) * STEP;
    const p: Vec2 = { x: mx, y: my };
    if (drag.current === 'u') setU(p);
    if (drag.current === 'v') setV(p);
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
        <pattern id="vgrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="vgridBold" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#vgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="varrU" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id="varrV" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
        </marker>
        <marker id="varrW" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--handle)"/>
        </marker>
        <marker id="varrAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
      </defs>

      {/* Background grid */}
      <rect width={W} height={H} fill="url(#vgridBold)"/>

      {/* Axes */}
      <line x1={10} y1={oy} x2={W - 10} y2={oy} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#varrAxis)"/>
      <line x1={ox} y1={H - 10} x2={ox} y2={10} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#varrAxis)"/>

      {/* Axis labels */}
      <text x={W - 18} y={oy - 10} fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--fg-2)">x</text>
      <text x={ox + 10} y={20}     fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--fg-2)">y</text>
      <text x={ox - 18} y={oy + 18} fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">0</text>

      {/* Tick labels — every 5 units = 125px (matching CartesianItem) */}
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

      {/* ── Parallelogram (filled) ─────────────────────────────── */}
      <path d={`M ${ox} ${oy} L ${uS.x} ${uS.y} L ${wS.x} ${wS.y} L ${vS.x} ${vS.y} Z`}
        fill="var(--highlight-soft)" fillOpacity="0.3"
        stroke="var(--fg-4)" strokeDasharray="4 3" strokeWidth="1"/>

      {/* ── Vector u (from origin) ─────────────────────────────── */}
      <line x1={ox} y1={oy} x2={uS.x} y2={uS.y} stroke="var(--accent)" strokeWidth="2.5" markerEnd="url(#varrU)"/>
      <text
        x={(ox + uS.x) / 2 + 12} y={(oy + uS.y) / 2 - 8}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--accent)">
        u
      </text>

      {/* ── Vector v (from origin) ─────────────────────────────── */}
      <line x1={ox} y1={oy} x2={vS.x} y2={vS.y} stroke="var(--formula)" strokeWidth="2.5" markerEnd="url(#varrV)"/>
      <text
        x={(ox + vS.x) / 2 + 12} y={(oy + vS.y) / 2 + 20}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--formula)">
        v
      </text>

      {/* ── Vector w = u + v (result) ──────────────────────────── */}
      <line x1={ox} y1={oy} x2={wS.x} y2={wS.y} stroke="var(--handle)" strokeWidth="3" markerEnd="url(#varrW)"/>
      <text
        x={(ox + wS.x) / 2 + 16} y={(oy + wS.y) / 2 - 6}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--handle)">
        u + v
      </text>

      {/* ── Construction lines (dashed) ───────────────────────── */}
      <line x1={uS.x} y1={uS.y} x2={wS.x} y2={wS.y} stroke="var(--formula)" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#varrV)"/>
      <line x1={vS.x} y1={vS.y} x2={wS.x} y2={wS.y} stroke="var(--accent)"  strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#varrU)"/>

      {/* ── Origin dot ───────────────────────────────────── */}
      <circle cx={ox} cy={oy} r="3.5" fill="var(--fg-1)"/>

      {/* ── Drag handles ─────────────────────────────────── */}
      <DragHandle x={uS.x} y={uS.y} label="u" color="var(--accent)"   onPointerDown={onPointerDown('u')}/>
      <DragHandle x={vS.x} y={vS.y} label="v" color="var(--formula)"  onPointerDown={onPointerDown('v')}/>

      {/* ── Compact coordinate readout (top-left) — matching CartesianItem ── */}
      <rect x="8" y="8" width="200" height="74" rx="6"
        fill="var(--surface)" fillOpacity="0.92"
        stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="18" y="26" fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--accent)">
        u = ({toLabel(u.x)}, {toLabel(u.y)})
      </text>
      <text x="18" y="44" fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--formula)">
        v = ({toLabel(v.x)}, {toLabel(v.y)})
      </text>
      <text x="18" y="62" fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--handle)">
        w = ({toLabel(w.x)}, {toLabel(w.y)})
      </text>
      <text x="18" y="76" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        w = u + v  (regla del paralelogramo)
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
      x={x + (label === 'u' ? -14 : 14)} y={y - 10}
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

      {/* Component-wise formula */}
      <div style={{
        marginTop: 24, padding: 24, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Suma componente a componente' : 'Component-wise sum'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 22, lineHeight: 2 }}>
            <div>
              <i style={{ color: 'var(--handle)' }}>w</i><sub style={{ fontSize: 14 }}>1</sub>
              {' '}={' '}
              <i style={{ color: 'var(--accent)' }}>u</i><sub style={{ fontSize: 14 }}>1</sub>
              {' '}+{' '}
              <i style={{ color: 'var(--formula)' }}>v</i><sub style={{ fontSize: 14 }}>1</sub>
            </div>
            <div>
              <i style={{ color: 'var(--handle)' }}>w</i><sub style={{ fontSize: 14 }}>2</sub>
              {' '}={' '}
              <i style={{ color: 'var(--accent)' }}>u</i><sub style={{ fontSize: 14 }}>2</sub>
              {' '}+{' '}
              <i style={{ color: 'var(--formula)' }}>v</i><sub style={{ fontSize: 14 }}>2</sub>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {lang === 'es' ? 'Módulo y ángulo' : 'Length & angle'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 20, lineHeight: 2.2 }}>
            <div>
              |<i style={{ color: 'var(--handle)' }}>w</i>| = √(<i style={{ color: 'var(--handle)' }}>w</i><sub style={{ fontSize: 14 }}>1</sub>² + <i style={{ color: 'var(--handle)' }}>w</i><sub style={{ fontSize: 14 }}>2</sub>²)
            </div>
            <div>
              <i>θ</i> = atan2(<i style={{ color: 'var(--handle)' }}>w</i><sub style={{ fontSize: 14 }}>2</sub>, <i style={{ color: 'var(--handle)' }}>w</i><sub style={{ fontSize: 14 }}>1</sub>)
            </div>
          </div>
        </div>
      </div>

      {/* Geometric interpretation */}
      <div style={{ marginTop: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
        <svg viewBox="0 0 200 160" style={{ width: 200, flexShrink: 0 }}>
          <line x1="100" y1="140" x2="100" y2="20" stroke="var(--fg-3)" strokeWidth="1.2"/>
          <line x1="20"  y1="80"  x2="180" y2="80" stroke="var(--fg-3)" strokeWidth="1.2"/>
          <path d="M 100 80 L 140 50 L 180 90 L 140 120 Z" fill="var(--highlight-soft)" fillOpacity="0.4" stroke="var(--fg-4)" strokeDasharray="3 2"/>
          <line x1="100" y1="80" x2="140" y2="50"  stroke="var(--accent)"  strokeWidth="2.5"/>
          <line x1="100" y1="80" x2="140" y2="120" stroke="var(--formula)" strokeWidth="2.5"/>
          <line x1="100" y1="80" x2="180" y2="90"  stroke="var(--handle)"  strokeWidth="3"/>
          <circle cx="100" cy="80" r="3" fill="var(--fg-1)"/>
          <text x="115" y="68"  fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--accent)">u</text>
          <text x="115" y="108" fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--formula)">v</text>
          <text x="135" y="78"  fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--handle)">w</text>
        </svg>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            {lang === 'es' ? 'Regla del paralelogramo' : 'Parallelogram rule'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>
            {lang === 'es'
              ? 'El vector suma w = u + v es la diagonal del paralelogramo construido sobre u y v. Las líneas punteadas muestran la construcción de suma encadenada.'
              : 'The sum vector w = u + v is the diagonal of the parallelogram built on u and v. The dashed lines show the chained addition construction.'}
          </p>
        </div>
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
{`// Suma de vectores — SVG snippet
// Coordenadas matemáticas: y positivo = arriba (se invierte para SVG)
const ox = svgWidth / 2, oy = svgHeight / 2;

function toSvg(mx, my) {
  return { x: ox + mx * scale, y: oy - my * scale };
}

// Calcular suma de vectores
const w = { x: u.x + v.x, y: u.y + v.y };
const length = Math.hypot(w.x, w.y);
const angle  = Math.atan2(w.y, w.x) * 180 / Math.PI;

// Paralelogramo de construcción
const uS = toSvg(u.x, u.y);
const vS = toSvg(v.x, v.y);
const wS = toSvg(w.x, w.y);

parallelogram.setAttribute("d",
  \`M \${ox} \${oy} L \${uS.x} \${uS.y} L \${wS.x} \${wS.y} L \${vS.x} \${vS.y} Z\`);

// Moderno: D3-drag + Motion One
import { drag } from "d3-drag";
import { animate } from "motion";

drag().on("drag", (e, d) => {
  // Snap to grid in math coords
  d.x = Math.round(e.x / scale) * scale;
  d.y = Math.round(e.y / scale) * scale;
  updateVectorSum();
});`}
  </pre>
);
