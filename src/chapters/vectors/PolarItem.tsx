// PolarItem.tsx — Sistema polar: punto arrastrable, arco de ángulo,
// comparación plano matemático (y↑) vs plano SVG (y↓)

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { STRINGS, type Lang } from '../../lib/data';
import { ghostBtn } from '../../components/AppShell';

interface Vec2 { x: number; y: number; }

interface Props { lang: Lang }

const STEP = 25; // px por unidad de cuadrícula
const DEFAULT_P: Vec2 = { x: 150, y: 100 }; // coords matemáticas (y↑), en px

const STR = {
  es: {
    title: 'Sistema polar',
    blurb: 'Un punto en el plano definido por su radio r y su ángulo θ desde el eje X.',
    tabs: { formula: 'Fórmula', explore: 'Explorar', svg: '' },
    step: 'Paso', of: 'de', reset: 'Reiniciar',
    derivationTitle: 'Derivación',
    mathPlane: 'Plano matemático  (y ↑)',
    svgPlane:  'Plano SVG  (y ↓)',
    svgWarning: 'En SVG el eje Y apunta hacia abajo, por lo que el ángulo θ se invierte.',
    inspector: { r: 'Radio', angle: 'Ángulo', cartesian: 'Cartesianas', hint: 'Arrastra el punto para recalcular.' },
    formula: {
      title: 'Coordenadas polares',
      body: 'Un punto P en el plano se puede describir por su distancia al origen r (radio) y el ángulo θ que forma con el semieje X positivo. La conversión entre sistemas es inmediata.',
    },
    derivation: [
      'Sea P = (r, θ) un punto en coordenadas polares.',
      'El radio r = √(x² + y²) es la distancia al origen.',
      'El ángulo θ = atan2(y, x) se mide desde el eje X en sentido antihorario.',
      'La conversión a cartesianas: x = r·cos(θ), y = r·sin(θ).',
      'En el plano SVG, el eje Y apunta hacia abajo, por lo que θ_svg = −θ.',
    ],
  },
  en: {
    title: 'Polar system',
    blurb: 'A point in the plane defined by its radius r and angle θ from the X-axis.',
    tabs: { formula: 'Formula', explore: 'Explore', svg: 'Use with SVG' },
    step: 'Step', of: 'of', reset: 'Reset',
    derivationTitle: 'Derivation',
    mathPlane: 'Math plane  (y ↑)',
    svgPlane:  'SVG plane  (y ↓)',
    svgWarning: 'In SVG the Y-axis points downward, so angle θ is negated.',
    inspector: { r: 'Radius', angle: 'Angle', cartesian: 'Cartesian', hint: 'Drag the point to recompute.' },
    formula: {
      title: 'Polar coordinates',
      body: 'A point P in the plane can be described by its distance from the origin r (radius) and the angle θ it makes with the positive X semi-axis. Conversion between systems is straightforward.',
    },
    derivation: [
      'Let P = (r, θ) be a point in polar coordinates.',
      'The radius r = √(x² + y²) is the distance to the origin.',
      'The angle θ = atan2(y, x) is measured from the X-axis counterclockwise.',
      'Conversion to Cartesian: x = r·cos(θ), y = r·sin(θ).',
      'In SVG plane, the Y-axis points down, so θ_svg = −θ.',
    ],
  },
};

export const PolarItem = ({ lang }: Props) => {
  const s = STR[lang];
  //const C = STRINGS[lang].chapter;

  const [tab,  setTab]  = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Vec2>(DEFAULT_P);

  // Polar values (math coords)
  const r   = Math.hypot(p.x, p.y);
  const deg = Math.atan2(p.y, p.x) * 180 / Math.PI;
  const fmt = (n: number) => n.toFixed(2);
  const fmtD = (n: number) => n.toFixed(1) + '°';

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
          <div>
            {/* Dual panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {/* Math plane — y↑ */}
              <div>
                <div style={{
                  padding: '8px 16px', borderBottom: '1px solid var(--hairline)',
                  fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: 'var(--accent-soft)',
                }}>
                  {s.mathPlane}
                </div>
                <PolarFigure p={p} setP={setP} flipY={false} />
              </div>
              {/* SVG plane — y↓ */}
              <div style={{ borderLeft: '1px solid var(--hairline)' }}>
                <div style={{
                  padding: '8px 16px', borderBottom: '1px solid var(--hairline)',
                  fontSize: 12, fontWeight: 600, color: 'var(--handle)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: 'var(--highlight-soft)',
                }}>
                  {s.svgPlane}
                </div>
                <PolarFigure p={p} setP={setP} flipY={true} readOnly />
              </div>
            </div>
            {/* SVG warning strip */}
            <div style={{
              padding: '8px 16px', borderTop: '1px solid var(--hairline)',
              fontSize: 12.5, color: 'var(--handle)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>⚠</span>
              {s.svgWarning}
            </div>
          </div>
        )}
        {tab === 'formula' && <FormulaPane lang={lang} />}
        {/* {tab === 'svg'     && <SvgPane lang={lang} />} */}
      </div>

      {/* Inspector + Reset */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'center',
        }}>
          <InspectorCell label={s.inspector.r} value={fmt(r / STEP)} color="var(--accent)" unit="" />
          <InspectorCell label={s.inspector.angle} value={fmtD(deg)} color="var(--formula)" unit="" />
          <InspectorCell
            label={s.inspector.cartesian}
            value={`(${fmt(p.x / STEP)}, ${fmt(p.y / STEP)})`}
            color="var(--fg-2)" unit="" />
          <button
            onClick={() => setP(DEFAULT_P)}
            style={{ ...ghostBtn, whiteSpace: 'nowrap', alignSelf: 'center' }}>
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
const InspectorCell = ({ label, value, color, unit }: {
  label: string; value: string; color: string; unit: string;
}) => (
  <div>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)', marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color, fontWeight: 600 }}>
      {value}{unit}
    </div>
  </div>
);

// ── Polar figure (shared by both panels) ──────────────────────────
const PolarFigure = ({ p, setP, flipY, readOnly = false }: {
  p: Vec2;
  setP: (p: Vec2) => void;
  flipY: boolean;      // true = SVG plane (y axis down)
  readOnly?: boolean;  // right panel just mirrors, no drag
}) => {
  const ref  = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const W = 360, H = 300;
  const ox = W / 2, oy = H / 2;

  // Convert math coords (px, y↑) to SVG coords for this panel
  const toSvg = (mx: number, my: number) => ({
    x: ox + mx,
    y: flipY ? oy + my : oy - my,   // mirror Y for SVG plane
  });

  const pS = toSvg(p.x, p.y);
  const rPx = Math.hypot(p.x, p.y);

  // In math plane: angle is normal atan2
  // In SVG plane: angle is negated (y is flipped)
  const mathAngle = Math.atan2(p.y, p.x);          // radians, math convention
  const displayAngle = flipY ? -mathAngle : mathAngle; // what this panel shows
  const degDisplay = displayAngle * 180 / Math.PI;

  // Arc: draw from positive x-axis to the point
  const arcAngle = Math.abs(displayAngle);
  const ARC_R = Math.min(rPx * 0.5, 60, 40);

  // Arc SVG path: always sweep in the "correct" direction for each panel
  const arcEndX = ox + ARC_R * Math.cos(displayAngle);
  const arcEndY = flipY
    ? oy - ARC_R * Math.sin(displayAngle)   // SVG plane: invert sin
    : oy - ARC_R * Math.sin(displayAngle);  // same formula, displayAngle already negated for SVG

  // large-arc-flag and sweep-flag depend on quadrant
  const sweep = flipY ? (displayAngle < 0 ? 0 : 1) : (displayAngle > 0 ? 0 : 1);
  const large = arcAngle > Math.PI ? 1 : 0;

  const onPointerDown = (e: React.PointerEvent) => {
    if (readOnly) return;
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragging.current = true;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || readOnly || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (W / rect.width);
    const sy = (e.clientY - rect.top)  * (H / rect.height);
    // Convert SVG pos → math coords, snap to grid
    const snap = STEP;
    let mx = Math.round((sx - ox) / snap) * snap;
    let my = Math.round((oy - sy) / snap) * snap; // y↑
    // Keep point within bounds
    mx = Math.max(-ox + snap, Math.min(ox - snap, mx));
    my = Math.max(-(oy - snap), Math.min(oy - snap, my));
    // Don't allow origin
    if (mx === 0 && my === 0) mx = snap;
    setP({ x: mx, y: my });
  };

  // Tick labels (every 5 units)
  const tickUnit = 5 * STEP; // 125px = 5 units
  const xTicks = [-2, -1, 1, 2].map(t => t * tickUnit);
  const yTicks = [-2, -1, 1, 2].map(t => t * tickUnit);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { dragging.current = false; }}
      onPointerLeave={() => { dragging.current = false; }}
    >
      <defs>
        <pattern id={`pgrid${flipY ? 'svg' : 'math'}`} width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id={`pgridB${flipY ? 'svg' : 'math'}`} width="125" height="125" patternUnits="userSpaceOnUse">
          <rect width="125" height="125" fill={`url(#pgrid${flipY ? 'svg' : 'math'})`} stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        <marker id={`pArr${flipY ? 'svg' : 'math'}`} viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id={`pArrAngle${flipY ? 'svg' : 'math'}`} viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
        </marker>
        <marker id={`pArrAxis${flipY ? 'svg' : 'math'}`} viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
        </marker>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill={`url(#pgridB${flipY ? 'svg' : 'math'})`}/>

      {/* Polar circles (faint) */}
      {[STEP * 2, STEP * 4, STEP * 6].map(cr => (
        <circle key={cr} cx={ox} cy={oy} r={cr}
          fill="none" stroke="var(--diagram-grid)" strokeWidth="0.6" strokeDasharray="2 4"/>
      ))}

      {/* Axes */}
      <line x1={8} y1={oy} x2={W - 8} y2={oy}
        stroke="var(--fg-2)" strokeWidth={1.5} markerEnd={`url(#pArrAxis${flipY ? 'svg' : 'math'})`}/>
      <line x1={ox} y1={H - 8} x2={ox} y2={8}
        stroke="var(--fg-2)" strokeWidth={1.5} markerEnd={`url(#pArrAxis${flipY ? 'svg' : 'math'})`}/>

      {/* Axis labels */}
      <text x={W - 16} y={oy - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">x</text>
      <text x={ox + 6}  y={14}     fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">
        {flipY ? '−y' : 'y'}
      </text>

      {/* Y-down indicator for SVG panel */}
      {flipY && (
        <text x={ox + 6} y={H - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--handle)">y</text>
      )}

      {/* Tick labels */}
      {xTicks.map(t => (
        <g key={`xt${t}`}>
          <line x1={ox + t} y1={oy - 3} x2={ox + t} y2={oy + 3} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox + t} y={oy + 14} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="middle">
            {t / STEP}
          </text>
        </g>
      ))}
      {yTicks.map(t => (
        <g key={`yt${t}`}>
          <line x1={ox - 3} y1={oy + (flipY ? t : -t)} x2={ox + 3} y2={oy + (flipY ? t : -t)} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox - 6} y={oy + (flipY ? t : -t) + 4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-4)" textAnchor="end">
            {flipY ? t / STEP : -t / STEP}
          </text>
        </g>
      ))}

      {/* Origin */}
      <circle cx={ox} cy={oy} r="3" fill="var(--fg-1)"/>
      <text x={ox - 12} y={oy + 14} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">O</text>

      {/* Dashed lines from P to axes */}
      <line x1={pS.x} y1={pS.y} x2={pS.x} y2={oy}
        stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4 3"/>
      <line x1={pS.x} y1={pS.y} x2={ox} y2={pS.y}
        stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4 3"/>

      {/* Radius line O → P */}
      {rPx > 2 && (
        <line
          x1={ox} y1={oy}
          x2={pS.x - (p.x / rPx) * 12}
          y2={flipY
            ? pS.y - (-p.y / rPx) * 12
            : pS.y - (p.y / rPx) * 12}
          stroke="var(--accent)" strokeWidth="2.5"
          markerEnd={`url(#pArr${flipY ? 'svg' : 'math'})`}/>
      )}

      {/* Angle arc */}
      {rPx > 10 && Math.abs(degDisplay) > 1 && (
        <>
          <path
            d={`M ${ox + ARC_R} ${oy} A ${ARC_R} ${ARC_R} 0 ${large} ${sweep} ${arcEndX} ${arcEndY}`}
            fill="none" stroke="var(--formula)" strokeWidth="1.5"
            markerEnd={`url(#pArrAngle${flipY ? 'svg' : 'math'})`}/>
          {/* θ label */}
          <text
            x={ox + ARC_R * 0.7 * Math.cos(displayAngle / 2)}
            y={(flipY
              ? oy - ARC_R * 0.7 * Math.sin(displayAngle / 2)
              : oy - ARC_R * 0.7 * Math.sin(displayAngle / 2))}
            fontFamily="var(--font-math)" fontStyle="italic" fontSize="14"
            fill="var(--formula)" textAnchor="middle">
            θ{flipY ? '′' : ''}
          </text>
        </>
      )}

      {/* r label along the radius */}
      {rPx > 20 && (
        <text
          x={ox + (p.x / rPx) * rPx * 0.5 - (p.y / rPx) * 12}
          y={flipY
            ? oy + (p.y / rPx) * rPx * 0.5 - (p.x / rPx) * 12
            : oy - (p.y / rPx) * rPx * 0.5 - (p.x / rPx) * 12}
          fontFamily="var(--font-math)" fontStyle="italic" fontSize="15"
          fill="var(--accent)" textAnchor="middle">
          r
        </text>
      )}

      {/* Drag handle (only on math plane) */}
      {!readOnly && (
        <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
          <circle cx={pS.x} cy={pS.y} r="14" fill="var(--accent)" fillOpacity="0.12"/>
          <circle cx={pS.x} cy={pS.y} r="6"  fill="var(--accent)" stroke="white" strokeWidth="2"/>
        </g>
      )}
      {readOnly && (
        <circle cx={pS.x} cy={pS.y} r="6" fill="var(--handle)" stroke="white" strokeWidth="2"/>
      )}

      {/* P label */}
      <text
        x={pS.x + (p.x >= 0 ? 14 : -14)}
        y={pS.y + (flipY ? (p.y >= 0 ? 16 : -10) : (p.y >= 0 ? -10 : 16))}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="16"
        fill={readOnly ? 'var(--handle)' : 'var(--accent)'}
        textAnchor="middle">
        P
      </text>

      {/* Readout overlay */}
      <rect x="6" y="6" width="148" height={flipY ? 56 : 44} rx="5"
        fill="var(--surface)" fillOpacity="0.92" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x="14" y="22" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--fg-3)">
        r = {(rPx / STEP).toFixed(2)}
      </text>
      <text x="14" y="38" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--fg-3)">
        θ{flipY ? '′' : ''} = {degDisplay.toFixed(1)}°
      </text>
      {flipY && (
        <text x="14" y="54" fontFamily="var(--font-mono)" fontSize="10" fill="var(--handle)">
          θ′ = −θ  (y invertido)
        </text>
      )}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Polar → Cartesian */}
        <div style={{
          padding: 20, background: 'var(--surface-2)',
          borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Polar → Cartesianas' : 'Polar → Cartesian'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 20, lineHeight: 2.2 }}>
            <div><i>x</i> = <i style={{ color: 'var(--accent)' }}>r</i> · cos(<i style={{ color: 'var(--formula)' }}>θ</i>)</div>
            <div><i>y</i> = <i style={{ color: 'var(--accent)' }}>r</i> · sin(<i style={{ color: 'var(--formula)' }}>θ</i>)</div>
          </div>
        </div>

        {/* Cartesian → Polar */}
        <div style={{
          padding: 20, background: 'var(--surface-2)',
          borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
            {lang === 'es' ? 'Cartesianas → Polar' : 'Cartesian → Polar'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 20, lineHeight: 2.2 }}>
            <div><i style={{ color: 'var(--accent)' }}>r</i> = √(<i>x</i>² + <i>y</i>²)</div>
            <div><i style={{ color: 'var(--formula)' }}>θ</i> = atan2(<i>y</i>, <i>x</i>)</div>
          </div>
        </div>

        {/* SVG warning */}
        <div style={{
          gridColumn: 'span 2', padding: 16,
          background: 'var(--highlight-soft)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', borderLeft: '3px solid var(--handle)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--handle)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {lang === 'es' ? 'Plano SVG (y ↓)' : 'SVG Plane (y ↓)'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2, color: 'var(--fg-2)' }}>
            <span><i style={{ color: 'var(--handle)' }}>θ′</i> = −<i style={{ color: 'var(--formula)' }}>θ</i></span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-3)', marginLeft: 24 }}>
              {lang === 'es' ? '← el eje Y apunta hacia abajo en SVG' : '← Y-axis points down in SVG'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SVG code pane ─────────────────────────────────────────────────
// const SvgPane = ({ lang }: { lang: Lang }) => (
//   <pre style={{
//     margin: 0, padding: 24, fontSize: 12.5, lineHeight: 1.6, minHeight: 380,
//     overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)',
//   }}>
// {`// Coordenadas polares ↔ cartesianas — SVG snippet

// // Math plane (y up): angle positive counterclockwise
// const r     = Math.sqrt(x * x + y * y);
// const theta = Math.atan2(y, x);  // radians

// // Convert polar → cartesian (math)
// const x = r * Math.cos(theta);
// const y = r * Math.sin(theta);

// // ⚠ SVG plane: Y-axis is FLIPPED (y down)
// // Same r, but angle is negated:
// const thetaSvg = -theta;

// // Convert polar → SVG coords
// const svgX = originX + r * Math.cos(thetaSvg);
// const svgY = originY + r * Math.sin(thetaSvg);
// // Which simplifies to:
// const svgX = originX + x;
// const svgY = originY - y;  // subtract because SVG y is down

// // Draw angle arc in SVG
// function arcPath(cx, cy, r, startAngle, endAngle) {
//   const x1 = cx + r * Math.cos(startAngle);
//   const y1 = cy + r * Math.sin(startAngle);
//   const x2 = cx + r * Math.cos(endAngle);
//   const y2 = cy + r * Math.sin(endAngle);
//   const large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
//   return \`M \${x1} \${y1} A \${r} \${r} 0 \${large} 1 \${x2} \${y2}\`;
// }`}
//   </pre>
// );
