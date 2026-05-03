// CrossItem.tsx — Producto vectorial (cross product) en 2D:
// Tab Explorar: dos vectores V y U arrastrables, paralelograma verde, Wz = Vx·Uy − Vy·Ux,
//               arco del ángulo, indicador colineal.
// Tab Fórmula: fórmula algebraica y geométrica, área del paralelograma.
// Tab SVG: calculadora de área de polígono por triangulación con producto vectorial.

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { ghostBtn } from '../../components/AppShell';
import type { Lang } from '../../lib/data';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25;
const DEFAULT_V: Vec2 = { x: 175, y: -50  };
const DEFAULT_U: Vec2 = { x: 75,  y:  125 };

const STR = {
  es: {
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    hint: 'Arrastra los extremos de V y U.',
    wzLabel: 'Producto vectorial Wz',
    areaLabel: 'Área paralelograma',
    angleLabel: 'Ángulo',
    colinear: '⚠ Vectores colineales — Wz = 0',
    formula: {
      title: 'Producto vectorial (en 2D)',
      body: 'En 2D, el producto vectorial V × U produce un escalar Wz — la componente Z del vector resultante en 3D. Su valor absoluto es el área del paralelograma formado por V y U.',
    },
    derivation: [
      'Sean V = (Vx, Vy) y U = (Ux, Uy) dos vectores en el plano.',
      'El producto vectorial en 2D es el escalar Wz = Vx·Uy − Vy·Ux.',
      'Geométricamente: Wz = |V|·|U|·sin(θ), donde θ es el ángulo entre V y U.',
      '|Wz| es el área del paralelograma formado por V y U.',
      'Si Wz > 0, U está a la izquierda de V (giro antihorario). Si Wz < 0, a la derecha.',
      'Si Wz = 0, los vectores son colineales (paralelos o antiparalelos).',
    ],
    polygon: {
      title: 'Aplicación: Área de polígono',
      desc: 'Arrastra los vértices. El área se calcula triangulando desde M usando el producto vectorial.',
      area: 'Área',
      triangles: 'Triángulos',
      cw: 'Horario (−)',
      ccw: 'Antihorario (+)',
    },
  },
  en: {
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    hint: 'Drag the tips of V and U.',
    wzLabel: 'Cross product Wz',
    areaLabel: 'Parallelogram area',
    angleLabel: 'Angle',
    colinear: '⚠ Colinear vectors — Wz = 0',
    formula: {
      title: 'Cross product (in 2D)',
      body: 'In 2D, the cross product V × U produces a scalar Wz — the Z component of the 3D result vector. Its absolute value is the area of the parallelogram formed by V and U.',
    },
    derivation: [
      'Let V = (Vx, Vy) and U = (Ux, Uy) be two vectors in the plane.',
      'The 2D cross product is the scalar Wz = Vx·Uy − Vy·Ux.',
      'Geometrically: Wz = |V|·|U|·sin(θ), where θ is the angle between V and U.',
      '|Wz| is the area of the parallelogram formed by V and U.',
      'If Wz > 0, U is to the left of V (counterclockwise). If Wz < 0, to the right.',
      'If Wz = 0, the vectors are colinear (parallel or antiparallel).',
    ],
    polygon: {
      title: 'Application: Polygon area',
      desc: 'Drag vertices. Area is computed by triangulating from M using the cross product.',
      area: 'Area',
      triangles: 'Triangles',
      cw: 'Clockwise (−)',
      ccw: 'Counterclockwise (+)',
    },
  },
};

export const CrossItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Vec2>(DEFAULT_V);
  const [u, setU] = useState<Vec2>(DEFAULT_U);

  // Cross product Wz = Vx·Uy − Vy·Ux (in px², divide by STEP² for display)
  const wzPx  = v.x * u.y - v.y * u.x;
  const wz    = wzPx / (STEP * STEP);
  const lenV  = Math.hypot(v.x, v.y);
  const lenU  = Math.hypot(u.x, u.y);
  const sinA  = lenV > 0 && lenU > 0 ? wzPx / (lenV * lenU) : 0;
  const angle = Math.asin(Math.max(-1, Math.min(1, sinA))) * 180 / Math.PI;
  const isColinear = Math.abs(wzPx) < STEP * STEP * 0.1;

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
            <CrossFigure v={v} u={u} setV={setV} setU={setU} wz={wzPx} />
            {isColinear && (
              <div style={{
                padding: '8px 20px', borderTop: '1px solid var(--hairline)',
                background: 'var(--highlight-soft)', color: 'var(--handle)',
                fontSize: 13, fontWeight: 600,
              }}>{s.colinear}</div>
            )}
          </>
        )}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <PolygonPane lang={lang} />}
      </div>

      {/* Inspector */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'start',
        }}>
          <InspCell label="V" color="var(--accent)"
            main={`(${(v.x/STEP).toFixed(1)}, ${(v.y/STEP).toFixed(1)})`}
            sub={`|V| = ${(lenV/STEP).toFixed(2)}`} />
          <InspCell label="U" color="var(--formula)"
            main={`(${(u.x/STEP).toFixed(1)}, ${(u.y/STEP).toFixed(1)})`}
            sub={`|U| = ${(lenU/STEP).toFixed(2)}`} />
          <InspCell label={s.wzLabel}
            color={wz > 0 ? 'var(--construction)' : wz < 0 ? 'var(--handle)' : 'var(--fg-3)'}
            main={`Wz = ${wz.toFixed(2)}`}
            sub={`Vx·Uy − Vy·Ux`} />
          <InspCell label={s.areaLabel} color="var(--formula)"
            main={`${Math.abs(wz).toFixed(2)}`}
            sub={`${s.angleLabel}: ${Math.abs(angle).toFixed(1)}°`} />
          <button onClick={() => { setV(DEFAULT_V); setU(DEFAULT_U); }}
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
  label: string; color: string; main: string; sub: string;
}) => (
  <div>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color, fontWeight: 600, marginBottom: 2 }}>{main}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{sub}</div>
  </div>
);

// ── Cross product figure ───────────────────────────────────────────
const CrossFigure = ({ v, u, setV, setU, wz }: {
  v: Vec2; u: Vec2;
  setV: (p: Vec2) => void;
  setU: (p: Vec2) => void;
  wz: number; // in px²
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'v' | 'u' | null>(null);

  const W = 720, H = 420;
  const ox = W / 2, oy = H / 2;

  const toS = (mx: number, my: number) => ({ x: ox + mx, y: oy - my });
  const vS  = toS(v.x, v.y);
  const uS  = toS(u.x, u.y);
  // Parallelogram 4th vertex = V + U
  const pS  = toS(v.x + u.x, v.y + u.y);

  const lenV = Math.hypot(v.x, v.y);
  const lenU = Math.hypot(u.x, u.y);

  // Angle arc
  const angleV = Math.atan2(-v.y, v.x);
  const angleU = Math.atan2(-u.y, u.x);
  const ARC_R  = Math.min(lenV, lenU, 70) * 0.4;
  let angleDiff = angleU - angleV;
  if (angleDiff >  Math.PI) angleDiff -= 2 * Math.PI;
  if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  const sweep = angleDiff > 0 ? 1 : 0;
  const large = Math.abs(angleDiff) > Math.PI ? 1 : 0;
  const arcSX = ox + ARC_R * Math.cos(angleV);
  const arcSY = oy + ARC_R * Math.sin(angleV);
  const arcEX = ox + ARC_R * Math.cos(angleU);
  const arcEY = oy + ARC_R * Math.sin(angleU);

  // Arrow-tip offset helper
  const tip = (dx: number, dy: number, len: number) =>
    len < 1 ? { x: ox, y: oy } : {
      x: ox + dx - (dx / len) * 12,
      y: oy - dy + (dy / len) * 12,
    };
  const vTip = tip(v.x, v.y, lenV);
  const uTip = tip(u.x, u.y, lenU);

  // Wz sign color
  const wzColor = wz > 0 ? 'var(--construction)' : wz < 0 ? 'var(--handle)' : 'var(--fg-3)';

  const onPointerDown = (which: 'v' | 'u') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    let mx = Math.round((sx - ox) / STEP) * STEP;
    let my = Math.round((oy - sy) / STEP) * STEP;
    if (mx === 0 && my === 0) mx = STEP;
    mx = Math.max(-(W/2 - STEP), Math.min(W/2 - STEP, mx));
    my = Math.max(-(H/2 - STEP), Math.min(H/2 - STEP, my));
    if (drag.current === 'v') setV({ x: mx, y: my });
    if (drag.current === 'u') setU({ x: mx, y: my });
  };

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}>
      <defs>
        <pattern id="crgrid"  width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="crgridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#crgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="crArrV" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id="crArrU" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
        </marker>
        <marker id="crArrAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
        <marker id="crArrAngle" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-3)"/>
        </marker>
      </defs>

      <rect width={W} height={H} fill="url(#crgridB)"/>

      {/* Axes */}
      <line x1={8} y1={oy} x2={W-8} y2={oy} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#crArrAxis)"/>
      <line x1={ox} y1={H-8} x2={ox} y2={8} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#crArrAxis)"/>
      <text x={W-18} y={oy-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">x</text>
      <text x={ox+8}  y={14}  fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {/* Tick marks */}
      {[-4,-3,-2,-1,1,2,3,4].map(t => (
        <g key={`ctx${t}`}>
          <line x1={ox+t*STEP*2} y1={oy-3} x2={ox+t*STEP*2} y2={oy+3} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox+t*STEP*2} y={oy+14} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="middle">{t*2}</text>
        </g>
      ))}
      {[-3,-2,-1,1,2,3].map(t => (
        <g key={`cty${t}`}>
          <line x1={ox-3} y1={oy-t*STEP*2} x2={ox+3} y2={oy-t*STEP*2} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox-6} y={oy-t*STEP*2+4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="end">{t*2}</text>
        </g>
      ))}

      {/* ── Parallelogram fill ─────────────────────────────── */}
      <polygon
        points={`${ox},${oy} ${vS.x},${vS.y} ${pS.x},${pS.y} ${uS.x},${uS.y}`}
        fill={wz > 0 ? 'var(--formula)' : wz < 0 ? 'var(--handle)' : 'var(--fg-4)'}
        fillOpacity="0.15"
        stroke={wz > 0 ? 'var(--formula)' : 'var(--handle)'}
        strokeWidth="1" strokeDasharray="4 3"/>

      {/* Dashed completion lines of parallelogram */}
      <line x1={vS.x} y1={vS.y} x2={pS.x} y2={pS.y}
        stroke="var(--fg-4)" strokeWidth="1.5" strokeDasharray="5 3"/>
      <line x1={uS.x} y1={uS.y} x2={pS.x} y2={pS.y}
        stroke="var(--fg-4)" strokeWidth="1.5" strokeDasharray="5 3"/>

      {/* Area label inside parallelogram */}
      <text
        x={(ox + vS.x + uS.x + pS.x) / 4}
        y={(oy + vS.y + uS.y + pS.y) / 4}
        fontFamily="var(--font-mono)" fontSize="12" fill={wzColor}
        textAnchor="middle" dominantBaseline="middle">
        {Math.abs(wz / (STEP * STEP)).toFixed(1)}
      </text>

      {/* Angle arc between V and U */}
      {lenV > 20 && lenU > 20 && ARC_R > 5 && (
        <>
          <path
            d={`M ${arcSX} ${arcSY} A ${ARC_R} ${ARC_R} 0 ${large} ${sweep} ${arcEX} ${arcEY}`}
            fill="none" stroke="var(--fg-3)" strokeWidth="1.5"
            markerEnd="url(#crArrAngle)"/>
          <text
            x={ox + (ARC_R + 14) * Math.cos((angleV + angleU) / 2)}
            y={oy + (ARC_R + 14) * Math.sin((angleV + angleU) / 2)}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="13"
            fill="var(--fg-3)" textAnchor="middle">θ</text>
        </>
      )}

      {/* Wz indicator: vertical double arrow on the side */}
      {Math.abs(wz) > STEP * STEP * 0.5 && (
        <g transform={`translate(${W - 60}, ${oy})`}>
          <line x1={0} y1={0} x2={0} y2={-wz / (STEP * 4)}
            stroke={wzColor} strokeWidth="3"/>
          <text x={8} y={-wz / (STEP * 8)}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="13"
            fill={wzColor}>Wz</text>
          <text x={8} y={-wz / (STEP * 8) + 16}
            fontFamily="var(--font-mono)" fontSize="11"
            fill={wzColor}>{(wz / (STEP * STEP)).toFixed(1)}</text>
        </g>
      )}

      {/* Origin */}
      <circle cx={ox} cy={oy} r="3.5" fill="var(--fg-1)"/>
      <text x={ox-14} y={oy+16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">O</text>

      {/* V vector */}
      {lenV > 2 && (
        <>
          <line x1={ox} y1={oy} x2={vTip.x} y2={vTip.y}
            stroke="var(--accent)" strokeWidth="3" markerEnd="url(#crArrV)"/>
          <text
            x={(ox + vS.x) / 2 + (v.y / lenV) * 18}
            y={(oy + vS.y) / 2 - (v.x / lenV) * 18}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18"
            fill="var(--accent)" textAnchor="middle">V</text>
        </>
      )}

      {/* U vector */}
      {lenU > 2 && (
        <>
          <line x1={ox} y1={oy} x2={uTip.x} y2={uTip.y}
            stroke="var(--formula)" strokeWidth="3" markerEnd="url(#crArrU)"/>
          <text
            x={(ox + uS.x) / 2 + (u.y / lenU) * 18}
            y={(oy + uS.y) / 2 - (u.x / lenU) * 18}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18"
            fill="var(--formula)" textAnchor="middle">U</text>
        </>
      )}

      {/* Drag handles */}
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('v')}>
        <circle cx={vS.x} cy={vS.y} r="13" fill="var(--accent)"  fillOpacity="0.12"/>
        <circle cx={vS.x} cy={vS.y} r="6"  fill="var(--accent)"  stroke="white" strokeWidth="2"/>
      </g>
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('u')}>
        <circle cx={uS.x} cy={uS.y} r="13" fill="var(--formula)" fillOpacity="0.12"/>
        <circle cx={uS.x} cy={uS.y} r="6"  fill="var(--formula)" stroke="white" strokeWidth="2"/>
      </g>

      {/* Readout overlay */}
      <rect x="8" y="8" width="240" height="82" rx="5"
        fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        V = ({(v.x/STEP).toFixed(1)}, {(v.y/STEP).toFixed(1)})  |V|={(lenV/STEP).toFixed(2)}
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        U = ({(u.x/STEP).toFixed(1)}, {(u.y/STEP).toFixed(1)})  |U|={(lenU/STEP).toFixed(2)}
      </text>
      <text x="16" y="58" fontFamily="var(--font-mono)" fontSize="11" fill={wzColor}>
        Wz = Vx·Uy−Vy·Ux = {(wz/(STEP*STEP)).toFixed(2)}
      </text>
      <text x="16" y="74" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        área = |Wz| = {Math.abs(wz/(STEP*STEP)).toFixed(2)}
      </text>
      <text x="16" y="88" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        {(() => {
          const sinA2 = lenV > 0 && lenU > 0 ? wz / (lenV * lenU) : 0;
          const angle2 = Math.asin(Math.max(-1, Math.min(1, sinA2))) * 180 / Math.PI;
          return `θ = ${Math.abs(angle2).toFixed(1)}°  sin(θ) = ${sinA2.toFixed(3)}`;
        })()}
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
      <p style={{ color: 'var(--fg-2)', maxWidth: 600, lineHeight: 1.6, marginBottom: 24 }}>{s.body}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Algebraic */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Definición algebraica' : 'Algebraic definition'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 21, lineHeight: 1.9, textAlign: 'center' }}>
            <i style={{ color: 'var(--construction)' }}>Wz</i> = <i style={{ color: 'var(--accent)' }}>Vx</i>·<i style={{ color: 'var(--formula)' }}>Uy</i> − <i style={{ color: 'var(--accent)' }}>Vy</i>·<i style={{ color: 'var(--formula)' }}>Ux</i>
          </div>
        </div>
        {/* Geometric */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Definición geométrica' : 'Geometric definition'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 21, lineHeight: 1.9, textAlign: 'center' }}>
            <i style={{ color: 'var(--construction)' }}>Wz</i> = |<i>V</i>|·|<i>U</i>|·sin(<i style={{ color: 'var(--fg-3)' }}>θ</i>)
          </div>
        </div>
      </div>

      {/* Area + sign cases */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { cond: 'Wz > 0', desc: lang === 'es' ? 'U a la izquierda de V (antihorario)' : 'U is left of V (CCW)', color: 'var(--construction)' },
          { cond: 'Wz = 0', desc: lang === 'es' ? 'Vectores colineales' : 'Colinear vectors', color: 'var(--fg-3)' },
          { cond: 'Wz < 0', desc: lang === 'es' ? 'U a la derecha de V (horario)' : 'U is right of V (CW)', color: 'var(--handle)' },
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

      {/* Area highlight */}
      <div style={{
        padding: 16, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)', borderLeft: '3px solid var(--formula)',
        fontFamily: 'var(--font-math)', fontSize: 19,
      }}>
        {lang === 'es' ? 'Área paralelograma' : 'Parallelogram area'} = |<i style={{ color: 'var(--construction)' }}>Wz</i>| = |<i>V</i>|·|<i>U</i>|·|sin(<i>θ</i>)|
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>
          {lang === 'es'
            ? '→ Área triángulo = |Wz| / 2'
            : '→ Triangle area = |Wz| / 2'}
        </div>
      </div>
    </div>
  );
};

// ── Polygon area calculator ────────────────────────────────────────
// Default polygon vertices (fixed in SVG coords, draggable)
const INIT_POLY = [
  { x: 100, y: 250 },
  { x: 125, y: 175 },
  { x: 200, y: 150 },
  { x: 275, y: 150 },
  { x: 325, y: 225 },
  { x: 275, y: 300 },
  { x: 250, y: 225 },
  { x: 150, y: 275 },
];
const M_INIT = { x: 225, y: 350 };

const PolygonPane = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].polygon;
  const [poly, setPoly] = useState(INIT_POLY.map(p => ({ ...p })));
  const [m, setM] = useState({ ...M_INIT });
  const [dragging, setDragging] = useState<number | 'M' | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const W = 720, H = 480;

  // Cross product of vectors MA→MB for each edge (A=poly[i], B=poly[i+1])
  const cross2 = (ax: number, ay: number, bx: number, by: number) =>
    ax * by - ay * bx;

  const triangles = poly.map((p, i) => {
    const next = poly[(i + 1) % poly.length];
    // Vectors from M
    const ax = p.x - m.x,    ay = p.y - m.y;
    const bx = next.x - m.x, by = next.y - m.y;
    const area2 = cross2(ax, ay, bx, by); // twice the signed area
    return { p, next, area2, area: area2 / 2 };
  });

  const totalArea = Math.abs(triangles.reduce((s, t) => s + t.area, 0));

  const onPointerDown = (idx: number | 'M') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(idx);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.round(((e.clientX - r.left) * (W / r.width)) / 12.5) * 12.5;
    const sy = Math.round(((e.clientY - r.top)  * (H / r.height)) / 12.5) * 12.5;
    if (dragging === 'M') {
      setM({ x: sx, y: sy });
    } else {
      setPoly(prev => prev.map((p, i) => i === dragging ? { x: sx, y: sy } : p));
    }
  };

  const polyStr = poly.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div>
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid var(--hairline)',
        fontSize: 13, color: 'var(--fg-2)', fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>{s.title}</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--construction)', fontWeight: 700 }}>
            {s.area} = {totalArea.toFixed(2)} u²
          </span>
          <button onClick={() => { setPoly(INIT_POLY.map(p => ({...p}))); setM({...M_INIT}); }}
            style={{ ...ghostBtn, padding: '4px 10px', fontSize: 12 }}>
            <Icon name="RotateCcw" size={12}/>
          </button>
        </div>
      </div>

      <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface-2)' }}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}>
        <defs>
          <pattern id="pgrid2" width="25" height="25" patternUnits="userSpaceOnUse">
            <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#pgrid2)"/>

        {/* Triangles from M */}
        {triangles.map((t, i) => {
          const isPos = t.area2 > 0;
          return (
            <polygon key={i}
              points={`${m.x},${m.y} ${t.p.x},${t.p.y} ${t.next.x},${t.next.y}`}
              fill={isPos ? 'var(--construction)' : 'var(--handle)'}
              fillOpacity="0.25"
              stroke="var(--fg-4)" strokeWidth="0.5"/>
          );
        })}

        {/* Polygon outline */}
        <polygon points={polyStr}
          fill="none" stroke="var(--formula)" strokeWidth="2"/>

        {/* Triangle area labels */}
        {triangles.map((t, i) => {
          const cx = (m.x + t.p.x + t.next.x) / 3;
          const cy = (m.y + t.p.y + t.next.y) / 3;
          //const a = Math.abs(t.area).toFixed(1);
          return (
            <text key={i} x={cx} y={cy}
              fontFamily="var(--font-mono)" fontSize="10"
              fill={t.area2 > 0 ? 'var(--construction)' : 'var(--handle)'}
              textAnchor="middle" dominantBaseline="middle">
              {t.area2 > 0 ? '+' : ''}{(t.area).toFixed(1)}
            </text>
          );
        })}

        {/* M point */}
        <g style={{ cursor: 'move' }} onPointerDown={onPointerDown('M')}>
          <circle cx={m.x} cy={m.y} r="14" fill="var(--fg-1)" fillOpacity="0.1"/>
          <circle cx={m.x} cy={m.y} r="6" fill="var(--fg-1)" stroke="white" strokeWidth="2"/>
        </g>
        <text x={m.x + 10} y={m.y - 10}
          fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">M</text>

        {/* Polygon vertices */}
        {poly.map((p, i) => (
          <g key={i} style={{ cursor: 'grab' }} onPointerDown={onPointerDown(i)}>
            <circle cx={p.x} cy={p.y} r="12" fill="var(--formula)" fillOpacity="0.1"/>
            <circle cx={p.x} cy={p.y} r="5" fill="var(--formula)" stroke="white" strokeWidth="1.5"/>
            <text x={p.x + 8} y={p.y - 8}
              fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">P{i+1}</text>
          </g>
        ))}

        {/* Legend */}
        <rect x="8" y="8" width="230" height="50" rx="5"
          fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.8"/>
        <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
          {s.area} total = {totalArea.toFixed(2)} u²
        </text>
        <rect x="16"  y="32" width="10" height="10" fill="var(--construction)" fillOpacity="0.5"/>
        <text x="30" y="42" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">{s.ccw}</text>
        <rect x="110" y="32" width="10" height="10" fill="var(--handle)" fillOpacity="0.5"/>
        <text x="124" y="42" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">{s.cw}</text>
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
