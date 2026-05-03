// DotItem.tsx — Producto escalar (dot product):
// Tab Explorar: dos vectores V y U arrastrables desde el origen, proyección ortogonal de U sobre V,
//               arco del ángulo entre ellos, inspector con valor·cos·ángulo.
// Tab Fórmula: fórmulas algebraica y geométrica.
// Tab SVG: juego — haz clic en dos vectores perpendiculares (dot = 0).

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { STRINGS, type Lang } from '../../lib/data';
import { ghostBtn } from '../../components/AppShell';

interface Vec2 { x: number; y: number; }
interface Props { lang: Lang }

const STEP = 25;

// Default vectors in math coords (px, y↑)
const DEFAULT_V: Vec2 = { x: 200, y:  50 };
const DEFAULT_U: Vec2 = { x: 125, y: -75 };

const STR = {
  es: {
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    hint: 'Arrastra los extremos de V y U.',
    dotValue: 'Producto escalar',
    cosAngle: 'Coseno del ángulo',
    angleDeg: 'Ángulo',
    projLabel: 'Proy. de U sobre V',
    perpWarn: '⊥ Vectores perpendiculares — producto escalar = 0',
    formula: {
      title: 'Producto escalar',
      body: 'El producto escalar de dos vectores V y U es un número real. Tiene dos interpretaciones equivalentes: algebraica (suma de productos de componentes) y geométrica (producto de módulos por el coseno del ángulo entre ellos).',
    },
    derivation: [
      'Sean V = (Vx, Vy) y U = (Ux, Uy) dos vectores en ℝ².',
      'Definición algebraica: V·U = Vx·Ux + Vy·Uy.',
      'Definición geométrica: V·U = |V|·|U|·cos(θ), donde θ es el ángulo entre V y U.',
      'Si V·U = 0, los vectores son perpendiculares (θ = 90°).',
      'Si V·U > 0, el ángulo es agudo (θ < 90°). Si V·U < 0, es obtuso (θ > 90°).',
      'Caso especial: V·V = |V|², ya que cos(0) = 1.',
    ],
    game: {
      title: 'Juego: encuentra los perpendiculares',
      desc: 'Haz clic en dos vectores cuyo producto escalar sea 0.',
      win: '¡Correcto! Esos vectores son perpendiculares.',
      fail: 'No son perpendiculares. Producto escalar:',
      tryAgain: 'Intentar de nuevo',
      clicks: 'seleccionados',
    },
  },
  en: {
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    hint: 'Drag the tips of V and U.',
    dotValue: 'Dot product',
    cosAngle: 'Cosine of angle',
    angleDeg: 'Angle',
    projLabel: 'Proj. of U onto V',
    perpWarn: '⊥ Perpendicular vectors — dot product = 0',
    formula: {
      title: 'Dot product',
      body: 'The dot product of two vectors V and U is a real number. It has two equivalent interpretations: algebraic (sum of component products) and geometric (product of magnitudes times the cosine of the angle between them).',
    },
    derivation: [
      'Let V = (Vx, Vy) and U = (Ux, Uy) be two vectors in ℝ².',
      'Algebraic definition: V·U = Vx·Ux + Vy·Uy.',
      'Geometric definition: V·U = |V|·|U|·cos(θ), where θ is the angle between V and U.',
      'If V·U = 0, the vectors are perpendicular (θ = 90°).',
      'If V·U > 0, the angle is acute (θ < 90°). If V·U < 0, it is obtuse (θ > 90°).',
      'Special case: V·V = |V|², since cos(0) = 1.',
    ],
    game: {
      title: 'Game: find the perpendicular pair',
      desc: 'Click two vectors whose dot product is 0.',
      win: 'Correct! Those vectors are perpendicular.',
      fail: 'Not perpendicular. Dot product:',
      tryAgain: 'Try again',
      clicks: 'selected',
    },
  },
};

export const DotItem = ({ lang }: Props) => {
  const s = STR[lang];
  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Vec2>(DEFAULT_V);
  const [u, setU] = useState<Vec2>(DEFAULT_U);

  // Dot product and derived values
  const dot   = v.x * u.x + v.y * u.y; // in px² (both are px vectors)
  const lenV  = Math.hypot(v.x, v.y);
  const lenU  = Math.hypot(u.x, u.y);
  const cosA  = lenV > 0 && lenU > 0 ? dot / (lenV * lenU) : 0;
  const angle = Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI;

  // dot in display units (divide by STEP²)
  const dotDisplay = dot / (STEP * STEP);

  const isPerp = Math.abs(dot) < STEP * STEP * 0.1; // within ~0.1 unit²

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
            <DotFigure v={v} u={u} setV={setV} setU={setU} isPerp={isPerp} />
            {isPerp && (
              <div style={{
                padding: '8px 20px', borderTop: '1px solid var(--hairline)',
                background: 'var(--accent-soft)', color: 'var(--accent)',
                fontSize: 13, fontWeight: 600,
              }}>{s.perpWarn}</div>
            )}
          </>
        )}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {tab === 'svg'     && <PerpGame lang={lang} />}
      </div>

      {/* Inspector */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'start',
        }}>
          <InspCell label="V" color="var(--accent)"
            sub={`(${(v.x/STEP).toFixed(1)}, ${(v.y/STEP).toFixed(1)})`}
            detail={`|V| = ${(lenV/STEP).toFixed(2)}`} />
          <InspCell label="U" color="var(--formula)"
            sub={`(${(u.x/STEP).toFixed(1)}, ${(u.y/STEP).toFixed(1)})`}
            detail={`|U| = ${(lenU/STEP).toFixed(2)}`} />
          <InspCell label={s.dotValue} color={dotDisplay >= 0 ? 'var(--construction)' : 'var(--handle)'}
            sub={dotDisplay.toFixed(2)}
            detail={`Vx·Ux + Vy·Uy`} />
          <InspCell label={s.angleDeg} color="var(--fg-2)"
            sub={`${angle.toFixed(1)}°`}
            detail={`cos = ${cosA.toFixed(3)}`} />
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

// ── Inspector cell ────────────────────────────────────────────────
const InspCell = ({ label, color, sub, detail }: {
  label: string; color: string; sub: string; detail: string;
}) => (
  <div>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color, fontWeight: 600, marginBottom: 2 }}>{sub}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{detail}</div>
  </div>
);

// ── Dot product figure ────────────────────────────────────────────
const DotFigure = ({ v, u, setV, setU, isPerp }: {
  v: Vec2; u: Vec2;
  setV: (p: Vec2) => void;
  setU: (p: Vec2) => void;
  isPerp: boolean;
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const drag = useRef<'v' | 'u' | null>(null);

  const W = 720, H = 420;
  const ox = W / 2, oy = H / 2;

  const toS = (mx: number, my: number) => ({ x: ox + mx, y: oy - my });
  const vS = toS(v.x, v.y);
  const uS = toS(u.x, u.y);

  const lenV = Math.hypot(v.x, v.y);
  const lenU = Math.hypot(u.x, u.y);

  // Projection of U onto V: proj = (U·V / |V|²) * V
  const dot  = v.x * u.x + v.y * u.y;
  const proj = lenV > 0
    ? { x: (dot / (lenV * lenV)) * v.x, y: (dot / (lenV * lenV)) * v.y }
    : { x: 0, y: 0 };
  const projS = toS(proj.x, proj.y);

  // Angle between vectors
  const cosA  = lenV > 0 && lenU > 0 ? dot / (lenV * lenU) : 0;
  const theta = Math.acos(Math.max(-1, Math.min(1, cosA)));

  // Angle arc radius
  const ARC_R = Math.min(lenV, lenU, 70) * 0.45;

  // Angles in SVG coords (y flipped)
  const angleV = Math.atan2(-v.y, v.x); // SVG angle of V
  const angleU = Math.atan2(-u.y, u.x); // SVG angle of U

  // Arc from V toward U (shorter arc)
  const arcStartX = ox + ARC_R * Math.cos(angleV);
  const arcStartY = oy + ARC_R * Math.sin(angleV);
  const arcEndX   = ox + ARC_R * Math.cos(angleU);
  const arcEndY   = oy + ARC_R * Math.sin(angleU);

  // Sweep direction: go from V to U in the shorter direction
  let angleDiff = angleU - angleV;
  if (angleDiff > Math.PI)  angleDiff -= 2 * Math.PI;
  if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  const sweep = angleDiff > 0 ? 1 : 0;
  const large = Math.abs(angleDiff) > Math.PI ? 1 : 0;

  // Arrow offsets
  const arrOff = (dx: number, dy: number, len: number) =>
    len < 1 ? { x: ox, y: oy } : {
      x: ox + dx - (dx / len) * 12,
      y: oy - dy + (dy / len) * 12,
    };
  const vTip = arrOff(v.x, v.y, lenV);
  const uTip = arrOff(u.x, u.y, lenU);

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
        <pattern id="dgrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="dgridB" width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill="url(#dgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id="dArrV" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id="dArrU" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
        </marker>
        <marker id="dArrProj" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--construction)"/>
        </marker>
        <marker id="dArrAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
      </defs>

      <rect width={W} height={H} fill="url(#dgridB)"/>

      {/* Axes */}
      <line x1={8} y1={oy} x2={W-8} y2={oy} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#dArrAxis)"/>
      <line x1={ox} y1={H-8} x2={ox} y2={8} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#dArrAxis)"/>
      <text x={W-18} y={oy-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">x</text>
      <text x={ox+8}  y={14}  fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {/* Tick marks */}
      {[-4,-3,-2,-1,1,2,3,4].map(t => (
        <g key={`dtx${t}`}>
          <line x1={ox+t*STEP*2} y1={oy-3} x2={ox+t*STEP*2} y2={oy+3} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox+t*STEP*2} y={oy+14} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="middle">{t*2}</text>
        </g>
      ))}
      {[-3,-2,-1,1,2,3].map(t => (
        <g key={`dty${t}`}>
          <line x1={ox-3} y1={oy-t*STEP*2} x2={ox+3} y2={oy-t*STEP*2} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox-6} y={oy-t*STEP*2+4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="end">{t*2}</text>
        </g>
      ))}

      {/* Origin */}
      <circle cx={ox} cy={oy} r="3.5" fill="var(--fg-1)"/>

      {/* Projection line: from U tip down to V line (perpendicular) */}
      {lenV > 5 && lenU > 5 && !isPerp && (
        <>
          {/* Dashed line from U tip to projection foot */}
          <line
            x1={uS.x} y1={uS.y}
            x2={projS.x} y2={projS.y}
            stroke="var(--construction)" strokeWidth="1.5" strokeDasharray="5 3"/>
          {/* Projection vector O → proj foot */}
          {Math.hypot(proj.x, proj.y) > 5 && (
            <line
              x1={ox} y1={oy}
              x2={projS.x - (proj.x / Math.hypot(proj.x, proj.y)) * 10}
              y2={projS.y + (proj.y / Math.hypot(proj.x, proj.y)) * 10}
              stroke="var(--construction)" strokeWidth="2" markerEnd="url(#dArrProj)"/>
          )}
          {/* Right angle mark at projection foot */}
          {(() => {
            if (lenV < 5) return null;
            const uvx = v.x / lenV, uvy = v.y / lenV; // unit along V (math)
            const perpx = -uvy, perpy = uvx;            // perpendicular in math
            const S = 7;
            // foot in SVG
            const fx = projS.x, fy = projS.y;
            // along V in SVG: (uvx, -uvy)
            // perp to V in SVG: (perpy, -perpx) = (uvx, uvy) rotated
            const ax = uvx * S, ay = -uvy * S;
            const bx = -perpy * S, by = perpx * S; // perp (SVG y flip)
            return (
              <path
                d={`M${fx+ax} ${fy+ay} L${fx+ax+bx} ${fy+ay+by} L${fx+bx} ${fy+by}`}
                fill="none" stroke="var(--fg-4)" strokeWidth="0.8"/>
            );
          })()}
        </>
      )}

      {/* Angle arc */}
      {lenV > 20 && lenU > 20 && ARC_R > 5 && (
        <>
          <path
            d={`M ${arcStartX} ${arcStartY} A ${ARC_R} ${ARC_R} 0 ${large} ${sweep} ${arcEndX} ${arcEndY}`}
            fill={isPerp ? 'var(--accent-soft)' : 'none'}
            stroke="var(--formula)" strokeWidth="1.5" fillOpacity="0.5"/>
          {/* θ label */}
          <text
            x={ox + (ARC_R + 14) * Math.cos((angleV + angleU) / 2 + (angleDiff < 0 ? 0 : 0))}
            y={oy + (ARC_R + 14) * Math.sin((angleV + angleU) / 2)}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="14"
            fill="var(--formula)" textAnchor="middle">
            θ{isPerp ? '=90°' : ''}
          </text>
        </>
      )}

      {/* V vector */}
      {lenV > 2 && (
        <>
          <line x1={ox} y1={oy} x2={vTip.x} y2={vTip.y}
            stroke="var(--accent)" strokeWidth="3" markerEnd="url(#dArrV)"/>
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
            stroke="var(--formula)" strokeWidth="3" markerEnd="url(#dArrU)"/>
          <text
            x={(ox + uS.x) / 2 + (u.y / lenU) * 18}
            y={(oy + uS.y) / 2 - (u.x / lenU) * 18}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="18"
            fill="var(--formula)" textAnchor="middle">U</text>
        </>
      )}

      {/* Drag handles */}
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('v')}>
        <circle cx={vS.x} cy={vS.y} r="13" fill="var(--accent)" fillOpacity="0.12"/>
        <circle cx={vS.x} cy={vS.y} r="6"  fill="var(--accent)" stroke="white" strokeWidth="2"/>
      </g>
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown('u')}>
        <circle cx={uS.x} cy={uS.y} r="13" fill="var(--formula)" fillOpacity="0.12"/>
        <circle cx={uS.x} cy={uS.y} r="6"  fill="var(--formula)" stroke="white" strokeWidth="2"/>
      </g>

      {/* Readout overlay */}
      <rect x="8" y="8" width="230" height="82" rx="5"
        fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        V = ({(v.x/STEP).toFixed(1)}, {(v.y/STEP).toFixed(1)})  |V|={( lenV/STEP).toFixed(2)}
      </text>
      <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        U = ({(u.x/STEP).toFixed(1)}, {(u.y/STEP).toFixed(1)})  |U|={( lenU/STEP).toFixed(2)}
      </text>
      <text x="16" y="58" fontFamily="var(--font-mono)" fontSize="11"
        fill={isPerp ? 'var(--accent)' : 'var(--construction)'}>
        V·U = {(dot/(STEP*STEP)).toFixed(2)}
      </text>
      <text x="16" y="74" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
        θ = {(Math.acos(Math.max(-1,Math.min(1,cosA)))*180/Math.PI).toFixed(1)}°  cos = {cosA.toFixed(3)}
      </text>
      <text x="16" y="88" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        V·U = Vx·Ux + Vy·Uy = {(v.x/STEP).toFixed(1)}·{(u.x/STEP).toFixed(1)} + {(v.y/STEP).toFixed(1)}·{(u.y/STEP).toFixed(1)}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Algebraic */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Definición algebraica' : 'Algebraic definition'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 22, lineHeight: 1.8, textAlign: 'center' }}>
            <i style={{ color: 'var(--accent)' }}>V</i>·<i style={{ color: 'var(--formula)' }}>U</i> = <i>Vx</i>·<i>Ux</i> + <i>Vy</i>·<i>Uy</i>
          </div>
        </div>
        {/* Geometric */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Definición geométrica' : 'Geometric definition'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 22, lineHeight: 1.8, textAlign: 'center' }}>
            <i style={{ color: 'var(--accent)' }}>V</i>·<i style={{ color: 'var(--formula)' }}>U</i> = |<i>V</i>|·|<i>U</i>|·cos(<i style={{ color: 'var(--formula)' }}>θ</i>)
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { cond: 'V·U > 0', desc: lang === 'es' ? 'Ángulo agudo (θ < 90°)' : 'Acute angle (θ < 90°)', color: 'var(--formula)' },
          { cond: 'V·U = 0', desc: lang === 'es' ? 'Perpendiculares (θ = 90°)' : 'Perpendicular (θ = 90°)', color: 'var(--accent)' },
          { cond: 'V·U < 0', desc: lang === 'es' ? 'Ángulo obtuso (θ > 90°)' : 'Obtuse angle (θ > 90°)', color: 'var(--handle)' },
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

      {/* Special case V·V */}
      <div style={{
        padding: 16, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)',
        border: '1px solid var(--hairline)', borderLeft: '3px solid var(--highlight)',
      }}>
        <div style={{ fontFamily: 'var(--font-math)', fontSize: 20, color: 'var(--fg-2)' }}>
          <i style={{ color: 'var(--accent)' }}>V</i>·<i style={{ color: 'var(--accent)' }}>V</i> = |<i>V</i>|²
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-3)', marginLeft: 20 }}>
            {lang === 'es' ? '← cos(0°) = 1' : '← cos(0°) = 1'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Perpendicular game ────────────────────────────────────────────
// 14 vectors from the original SVG, pre-computed in math coords (y↑)
// Each pair index (i,j) that is perpendicular: dot = 0
const GAME_VECTORS = [
  { x:  50, y: -175 }, // 0
  { x: 150, y: -75  }, // 1
  { x:  75, y: -175 }, // 2  perp with 3: dot = 75*(-75)+(-175)*(-75) = -5625+13125 = 7500 nope
  { x: -75, y:  50  }, // 3
  { x:-150, y: -100 }, // 4
  { x:-180, y:   0  }, // 5  horizontal → perp with any vertical
  { x: -75, y: -125 }, // 6
  { x:  50, y: -75  }, // 7
  { x: 225, y:  -75 }, // 8
  { x: -75, y:  -75 }, // 9
  { x:  75, y:   50 }, // 10
  { x: -50, y: -175 }, // 11  note: originally x=-100,y varied
  { x: 100, y:  100 }, // 12
  { x:  50, y:  175 }, // 13
];

// Find which pairs are perpendicular (dot = 0, or very close)
const PERP_PAIRS: Set<string> = new Set();
for (let i = 0; i < GAME_VECTORS.length; i++) {
  for (let j = i + 1; j < GAME_VECTORS.length; j++) {
    const d = GAME_VECTORS[i].x * GAME_VECTORS[j].x + GAME_VECTORS[i].y * GAME_VECTORS[j].y;
    if (Math.abs(d) < 500) PERP_PAIRS.add(`${i}-${j}`);
  }
}

// Game vector positions in SVG (fixed layout, spread across canvas)
const POSITIONS = [
  { x: 80,  y: 380, anchor: { x: 80,  y: 380 } },
  { x: 130, y: 380, anchor: { x: 130, y: 380 } },
  { x: 110, y: 530, anchor: { x: 110, y: 530 } },
  { x: 210, y: 460, anchor: { x: 210, y: 460 } },
  { x: 440, y: 380, anchor: { x: 440, y: 380 } },
  { x: 720, y: 380, anchor: { x: 720, y: 380 } },
  { x: 270, y: 540, anchor: { x: 270, y: 540 } },
  { x: 320, y: 540, anchor: { x: 320, y: 540 } },
  { x: 330, y: 440, anchor: { x: 330, y: 440 } },
  { x: 500, y: 380, anchor: { x: 500, y: 380 } },
  { x: 680, y: 380, anchor: { x: 680, y: 380 } },
  { x: 580, y: 400, anchor: { x: 580, y: 400 } },
  { x: 610, y: 440, anchor: { x: 610, y: 440 } },
  { x: 580, y: 460, anchor: { x: 580, y: 460 } },
];

const PerpGame = ({ lang }: { lang: Lang }) => {
  const s = STR[lang].game;
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<'win' | 'fail' | null>(null);
  const [failDot, setFailDot] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());

  const handleClick = (i: number) => {
    if (result === 'win') return;
    if (selected.includes(i)) {
      setSelected(selected.filter(s => s !== i));
      return;
    }
    const next = [...selected, i];
    if (next.length === 2) {
      const [a, b] = next.sort((x, y) => x - y);
      const key = `${a}-${b}`;
      const dot = GAME_VECTORS[a].x * GAME_VECTORS[b].x + GAME_VECTORS[a].y * GAME_VECTORS[b].y;
      if (PERP_PAIRS.has(key)) {
        const newFound = new Set(found);
        newFound.add(key);
        setFound(newFound);
        setResult('win');
      } else {
        setFailDot(Math.round(dot / 100));
        setResult('fail');
      }
      setSelected([]);
    } else {
      setSelected(next);
      setResult(null);
    }
  };

  const reset = () => { setSelected([]); setResult(null); setFound(new Set()); };

  return (
    <div>
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid var(--hairline)',
        fontSize: 13, fontWeight: 600, color: 'var(--fg-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>{s.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)' }}>
            {selected.length} {s.clicks}
          </span>
          <button onClick={reset} style={{ ...ghostBtn, padding: '4px 10px', fontSize: 12 }}>
            <Icon name="RotateCcw" size={12}/> {s.tryAgain}
          </button>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div style={{
          padding: '8px 20px',
          background: result === 'win' ? 'var(--accent-soft)' : 'var(--highlight-soft)',
          color: result === 'win' ? 'var(--accent)' : 'var(--handle)',
          fontSize: 13, fontWeight: 600, borderBottom: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>{result === 'win' ? '✓' : '✗'}</span>
          <span>{result === 'win' ? s.win : `${s.fail} ${failDot}`}</span>
        </div>
      )}

      <svg viewBox="0 0 780 580"
        style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--surface-2)' }}>
        <defs>
          <pattern id="ggrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
          </pattern>
          <marker id="gArr" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
            <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
          </marker>
          <marker id="gArrSel" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
            <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
          </marker>
          <marker id="gArrFound" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
            <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--construction)"/>
          </marker>
        </defs>

        <rect width="780" height="580" fill="url(#ggrid)"/>

        {POSITIONS.map((pos, i) => {
          const vec = GAME_VECTORS[i];
          const isSel = selected.includes(i);
          const isFoundVec = [...found].some(k => k.split('-').map(Number).includes(i));
          const color = isFoundVec ? 'var(--construction)' : isSel ? 'var(--accent)' : 'var(--formula)';
          const marker = isFoundVec ? '#gArrFound' : isSel ? '#gArrSel' : '#gArr';
          const len = Math.hypot(vec.x, vec.y);
          const ex = pos.x + vec.x - (vec.x / len) * 12;
          const ey = pos.y - vec.y + (vec.y / len) * 12; // y flipped for SVG

          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => handleClick(i)}>
              {/* Hit area */}
              <line x1={pos.x} y1={pos.y} x2={pos.x + vec.x} y2={pos.y - vec.y}
                stroke="transparent" strokeWidth="20"/>
              {/* Vector */}
              <line x1={pos.x} y1={pos.y} x2={ex} y2={ey}
                stroke={color} strokeWidth={isSel ? 3 : 2.5}
                markerEnd={`url(${marker})`}/>
              {/* Selection ring */}
              {isSel && (
                <circle cx={pos.x} cy={pos.y} r="8" fill="var(--accent)" fillOpacity="0.15"
                  stroke="var(--accent)" strokeWidth="1.5"/>
              )}
              {isFoundVec && (
                <circle cx={pos.x} cy={pos.y} r="6" fill="var(--construction)" fillOpacity="0.2"/>
              )}
              {/* Index label (small) */}
              <text x={pos.x + 8} y={pos.y - 8}
                fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)">{i}</text>
            </g>
          );
        })}

        {/* Instruction */}
        <text x="390" y="30" textAnchor="middle"
          fontFamily="var(--font-sans)" fontSize="13" fill="var(--fg-3)">
          {s.desc}
        </text>
      </svg>
    </div>
  );
};
