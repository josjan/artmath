// TrigItems.tsx — Ítems del capítulo Trigonometría
// Todos siguen el mismo patrón: tabs Fórmula / Explorar / SVG
// Exporta: SinusItem, CosinusItem, TangentItem, ArcSinusItem, ArcCosinusItem, ArcTangentItem, SumAnglesItem, ScalarAnglesItem

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import type { Lang } from '../../lib/data';

// ── Shared components ───────────────────────────────────

const TabBar = ({ tab, setTab, lang }: {
  tab: string; setTab: (t: any) => void; lang: Lang;
}) => {
  const tabs = lang === 'es'
    ? [['formula','Fórmula'],['explore','Explorar']]
    : [['formula','Formula'],['explore','Explore']];
  return (
    <div style={{
      display: 'inline-flex', alignSelf: 'flex-start',
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 'var(--r-sm)', padding: 3, gap: 2,
    }}>
      {tabs.map(([id, label]) => (
        <button key={id} onClick={() => setTab(id)} style={{
          padding: '7px 14px', borderRadius: 'var(--r-xs)',
          background: tab === id ? 'var(--surface-3)' : 'transparent',
          color: tab === id ? 'var(--fg-1)' : 'var(--fg-3)',
          border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}>{label}</button>
      ))}
    </div>
  );
};

const DerivList = ({ steps, step, setStep, lang }: {
  steps: string[]; step: number; setStep: (n: number) => void; lang: Lang;
}) => {
  const stepBtn: React.CSSProperties = {
    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-xs)', padding: 4, cursor: 'pointer',
    color: 'var(--fg-2)', display: 'inline-flex',
  };
  const lbl = lang === 'es' ? ['Paso', 'de'] : ['Step', 'of'];
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{lang === 'es' ? 'Derivación' : 'Derivation'}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-3)' }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} style={stepBtn}><Icon name="ChevronLeft" size={14}/></button>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{lbl[0]} {step + 1} {lbl[1]} {steps.length}</span>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} style={stepBtn}><Icon name="ChevronRight" size={14}/></button>
        </div>
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((txt, i) => (
          <li key={i} style={{
            display: 'flex', gap: 12, padding: '8px 12px',
            background: i === step ? 'var(--highlight-soft)' : 'transparent',
            borderLeft: i === step ? '3px solid var(--highlight)' : '3px solid transparent',
            borderRadius: 'var(--r-xs)', color: i === step ? 'var(--fg-1)' : 'var(--fg-3)',
            fontSize: 14, lineHeight: 1.5,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-4)', fontSize: 12 }}>{String(i + 1).padStart(2, '0')}</span>
            <span>{txt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

// Static unit circle (used by TangentItem and ScalarAnglesItem)
const UnitCircle = ({ angleDeg, showSin = true, showCos = true }: {
  angleDeg: number; showSin?: boolean; showCos?: boolean;
}) => {
  const rad = (angleDeg * Math.PI) / 180;
  const S = 200; const R = 78; const O = S / 2;
  const px = O + Math.cos(rad) * R;
  const py = O - Math.sin(rad) * R;
  const arcR = 22;
  const large = angleDeg > 180 ? 1 : 0;
  const arcEx = O + arcR * Math.cos(rad);
  const arcEy = O - arcR * Math.sin(rad);
  return (
    <svg width={S} height={S} style={{ display: 'block' }}>
      <line x1={12} y1={O} x2={S-12} y2={O} stroke="var(--fg-4)" strokeWidth="1"/>
      <line x1={O} y1={12} x2={O} y2={S-12} stroke="var(--fg-4)" strokeWidth="1"/>
      <circle cx={O} cy={O} r={R} fill="none" stroke="var(--fg-3)" strokeWidth="1.5"/>
      {showCos && <line x1={O} y1={O} x2={px} y2={O} stroke="var(--accent)" strokeWidth="2" strokeDasharray="5,3"/>}
      {showSin && <line x1={px} y1={O} x2={px} y2={py} stroke="#e05050" strokeWidth="2" strokeDasharray="5,3"/>}
      <line x1={O} y1={O} x2={px} y2={py} stroke="var(--fg-1)" strokeWidth="2"/>
      <path d={`M ${O+arcR} ${O} A ${arcR} ${arcR} 0 ${large} 0 ${arcEx} ${arcEy}`} fill="none" stroke="var(--accent)" strokeWidth="1.5"/>
      <circle cx={px} cy={py} r={5} fill="var(--accent)"/>
      <circle cx={O} cy={O} r={2.5} fill="var(--fg-3)"/>
    </svg>
  );
};

// Shared formula card layout
const FormulaGrid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>{children}</div>
);
const FormulaCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>{title}</div>
    <div style={{ fontFamily: 'var(--font-math)', fontSize: 15, lineHeight: 2.1 }}>{children}</div>
  </div>
);

// Angle slider + display (used by TangentItem, ScalarAnglesItem)
const AngleControl = ({ angleDeg, setAngleDeg, lang }: {
  angleDeg: number; setAngleDeg: (v: number) => void; lang: Lang;
}) => (
  <div>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
      {lang === 'es' ? 'Ángulo' : 'Angle'}
    </h3>
    <input type="range" min="0" max="360" value={angleDeg}
      onChange={e => setAngleDeg(Number(e.target.value))}
      style={{ width: '100%', marginBottom: 8 }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)' }}>
      <span>0°</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-1)', fontSize: 15 }}>θ = {angleDeg}°</span>
      <span>360°</span>
    </div>
    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-3)', textAlign: 'center' }}>
      {(angleDeg * Math.PI / 180).toFixed(4)} rad
    </div>
  </div>
);

const ResultBox = ({ label, value }: { label: string; value: string }) => (
  <div style={{ marginTop: 20, padding: 18, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-math)', fontSize: 26, fontWeight: 700, color: 'var(--accent)' }}>{value}</div>
  </div>
);

// Inspector cell (matching LinearSystemItem / VectorAdditionItem pattern)
const InspCell = ({ label, color, main, sub }: {
  label: string; color: string; main: string; sub?: string;
}) => (
  <div>
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-4)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 600, marginBottom: 2 }}>{main}</div>
    {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{sub}</div>}
  </div>
);

// ── Interactive linked unit circle + wave ─────────────────────────
// Círculo unitario a la izquierda con punto arrastrable.
// La línea horizontal punteada conecta el punto del círculo con el
// punto correspondiente en la onda: funciona porque CY == WCY y CR == WA,
// por lo que Py = CY − CR·sin(θ) = WCY − WA·sin(θ) = Wy (modo sin).
const TrigLinkedFigure = ({ mode, angleDeg, setAngleDeg }: {
  mode: 'sin' | 'cos';
  angleDeg: number;
  setAngleDeg: (v: number) => void;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const W = 720, H = 380;
  // Círculo: centro y radio
  const CX = 155, CY = H / 2, CR = 105;
  // Onda: rango x y amplitud (CR == WA es la condición clave para el link horizontal)
  const WX0 = 295, WX1 = 695, WCY = H / 2, WA = CR;

  const rad = angleDeg * Math.PI / 180;
  const normDeg = ((angleDeg % 360) + 360) % 360; // siempre [0, 360)

  // Punto P en el círculo (coords SVG, y invertida)
  const Px = CX + CR * Math.cos(rad);
  const Py = CY - CR * Math.sin(rad);

  // Punto correspondiente en la onda
  const Wx = WX0 + (normDeg / 360) * (WX1 - WX0);
  const Wy = mode === 'sin'
    ? WCY - WA * Math.sin(rad)   // == Py siempre (link horizontal perfecto)
    : WCY - WA * Math.cos(rad);  // != Py en general (link diagonal, intencional)

  // Arco del ángulo
  const arcR = 28;
  const large = normDeg > 180 ? 1 : 0;
  const arcEx = CX + arcR * Math.cos(rad);
  const arcEy = CY - arcR * Math.sin(rad);

  // Path de la onda
  const waveD = Array.from({ length: 361 }, (_, d) => {
    const r = d * Math.PI / 180;
    const wx = WX0 + (d / 360) * (WX1 - WX0);
    const wy = mode === 'sin'
      ? WCY - WA * Math.sin(r)
      : WCY - WA * Math.cos(r);
    return `${d === 0 ? 'M' : 'L'} ${wx.toFixed(1)} ${wy.toFixed(1)}`;
  }).join(' ');

  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const waveColor = mode === 'sin' ? '#e05050' : 'var(--accent)';
  const linkColor = mode === 'sin' ? '#e05050' : 'var(--formula)';

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragging.current = true;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    // Convertir a ángulo matemático (y invertida)
    const dx = sx - CX;
    const dy = -(sy - CY);
    let deg = Math.atan2(dy, dx) * 180 / Math.PI;
    if (deg < 0) deg += 360;
    setAngleDeg(Math.round(deg));
  };

  const stopDrag = () => { dragging.current = false; };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
    >
      <defs>
        <pattern id="trig-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.4"/>
        </pattern>
        <pattern id="trig-grid-bold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#trig-grid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.6"/>
        </pattern>
      </defs>

      {/* Fondo completo con rejilla */}
      <rect width={W} height={H} fill="url(#trig-grid-bold)"/>

      {/* Separador vertical entre círculo y onda */}
      <line x1={275} y1={12} x2={275} y2={H - 12}
        stroke="var(--hairline)" strokeWidth="1" strokeDasharray="4 4"/>

      {/* ══ IZQUIERDA: Círculo unitario ══ */}

      {/* Ejes */}
      <line x1={CX - CR - 16} y1={CY} x2={CX + CR + 20} y2={CY}
        stroke="var(--fg-3)" strokeWidth="1.2"/>
      <line x1={CX} y1={CY + CR + 16} x2={CX} y2={CY - CR - 16}
        stroke="var(--fg-3)" strokeWidth="1.2"/>
      <text x={CX + CR + 14} y={CY + 5} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-3)">x</text>
      <text x={CX + 6} y={CY - CR - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-3)">y</text>

      {/* Marcas ±1 */}
      {[1, -1].map(v => (
        <g key={v}>
          <line x1={CX + v * CR - 0.5} y1={CY - 4} x2={CX + v * CR - 0.5} y2={CY + 4} stroke="var(--fg-4)" strokeWidth="1"/>
          <text x={CX + v * CR} y={CY + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)" textAnchor="middle">{v}</text>
          <line x1={CX - 4} y1={CY - v * CR} x2={CX + 4} y2={CY - v * CR} stroke="var(--fg-4)" strokeWidth="1"/>
          <text x={CX - 10} y={CY - v * CR + 4} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)" textAnchor="end">{v}</text>
        </g>
      ))}

      {/* Círculo unitario */}
      <circle cx={CX} cy={CY} r={CR} fill="none" stroke="var(--fg-3)" strokeWidth="1.5"/>

      {/* Proyección sin (vertical, roja) */}
      <line x1={Px} y1={CY} x2={Px} y2={Py}
        stroke="#e05050" strokeWidth="2.5" strokeDasharray="5 3"/>

      {/* Proyección cos (horizontal, azul-acento) */}
      <line x1={CX} y1={Py} x2={Px} y2={Py}
        stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3"/>

      {/* Radio O → P */}
      <line x1={CX} y1={CY} x2={Px} y2={Py}
        stroke="var(--fg-1)" strokeWidth="2.5"/>

      {/* Arco del ángulo θ */}
      <path d={`M ${CX + arcR} ${CY} A ${arcR} ${arcR} 0 ${large} 0 ${arcEx} ${arcEy}`}
        fill="none" stroke="var(--fg-2)" strokeWidth="1.5"/>
      <text x={CX + arcR + 10} y={CY - 5}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">θ</text>

      {/* Etiquetas sin θ y cos θ en el círculo */}
      <text
        x={Px + (cosVal >= 0 ? 7 : -7)}
        y={(CY + Py) / 2 + 4}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="12" fill="#e05050"
        textAnchor={cosVal >= 0 ? 'start' : 'end'}>
        sin θ
      </text>
      <text
        x={(CX + Px) / 2}
        y={Py + (sinVal >= 0 ? -8 : 18)}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="12" fill="var(--accent)"
        textAnchor="middle">
        cos θ
      </text>

      {/* Punto origen */}
      <circle cx={CX} cy={CY} r="3" fill="var(--fg-2)"/>

      {/* Handle arrastrable en P */}
      <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
        <circle cx={Px} cy={Py} r={15} fill={waveColor} fillOpacity="0.15"/>
        <circle cx={Px} cy={Py} r={7} fill={waveColor} stroke="white" strokeWidth="2"/>
      </g>
      <text x={Px + (cosVal >= 0 ? 16 : -16)} y={Py - 10}
        fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill={waveColor}
        textAnchor="middle">P</text>

      {/* ══ LÍNEA DE ENLACE círculo → onda ══ */}
      {/* En modo sin: Py == Wy siempre (link horizontal perfecto) */}
      {/* En modo cos: link diagonal — muestra igualmente la conexión */}
      <line x1={Px} y1={Py} x2={Wx} y2={Wy}
        stroke={linkColor} strokeWidth="1.5" strokeDasharray="8 4" strokeOpacity="0.7"/>

      {/* ══ DERECHA: Onda sin/cos (0° a 360°) ══ */}

      {/* Ejes de la onda */}
      <line x1={WX0 - 12} y1={WCY} x2={WX1 + 12} y2={WCY}
        stroke="var(--fg-3)" strokeWidth="1.2"/>
      <line x1={WX0} y1={WCY + WA + 18} x2={WX0} y2={WCY - WA - 18}
        stroke="var(--fg-3)" strokeWidth="1"/>

      {/* Líneas punteadas ±1 en la onda */}
      {[1, -1].map(v => (
        <g key={v}>
          <line x1={WX0 - 6} y1={WCY - v * WA} x2={WX1 + 6} y2={WCY - v * WA}
            stroke="var(--fg-4)" strokeWidth="0.5" strokeDasharray="3 6"/>
          <text x={WX0 - 10} y={WCY - v * WA + 4}
            fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)" textAnchor="end">{v}</text>
        </g>
      ))}

      {/* Marcas en eje x de la onda: 0°, 90°, 180°, 270°, 360° */}
      {([0, 90, 180, 270, 360] as const).map((d, i) => {
        const xTick = WX0 + (d / 360) * (WX1 - WX0);
        const labels = ['0', 'π/2', 'π', '3π/2', '2π'];
        return (
          <g key={d}>
            <line x1={xTick} y1={WCY - 5} x2={xTick} y2={WCY + 5}
              stroke="var(--fg-3)" strokeWidth="1"/>
            <line x1={xTick} y1={WCY - WA - 8} x2={xTick} y2={WCY + WA + 8}
              stroke="var(--fg-4)" strokeWidth="0.4" strokeDasharray="2 6"/>
            <text x={xTick} y={WCY + 18}
              fontFamily="var(--font-math)" fontStyle="italic" fontSize="11" fill="var(--fg-3)" textAnchor="middle">
              {labels[i]}
            </text>
          </g>
        );
      })}

      {/* Curva de la onda */}
      <path d={waveD} fill="none" stroke={waveColor} strokeWidth="2.5"/>

      {/* Línea vertical en θ actual */}
      <line x1={Wx} y1={WCY - WA - 8} x2={Wx} y2={WCY + WA + 8}
        stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="4 3"/>

      {/* Segmento vertical desde eje al punto (muestra valor de la función) */}
      <line x1={Wx} y1={WCY} x2={Wx} y2={Wy}
        stroke={waveColor} strokeWidth="2" strokeDasharray="4 3" strokeOpacity="0.7"/>

      {/* Punto en la onda */}
      <circle cx={Wx} cy={Wy} r={7} fill={waveColor} stroke="white" strokeWidth="2"/>

      {/* ══ Overlay de lectura (arriba-derecha de la onda) ══ */}
      <rect x={WX1 - 162} y="8" width="160" height="76" rx="5"
        fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
      <text x={WX1 - 152} y="26"
        fontFamily="var(--font-mono)" fontSize="12" fill="var(--fg-2)" fontWeight="600">
        θ = {angleDeg}°
      </text>
      <text x={WX1 - 152} y="44"
        fontFamily="var(--font-mono)" fontSize="12" fill="#e05050" fontWeight={mode === 'sin' ? '700' : '400'}>
        sin = {sinVal.toFixed(4)}
      </text>
      <text x={WX1 - 152} y="62"
        fontFamily="var(--font-mono)" fontSize="12" fill="var(--accent)" fontWeight={mode === 'cos' ? '700' : '400'}>
        cos = {cosVal.toFixed(4)}
      </text>
      <text x={WX1 - 152} y="76"
        fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
        {(rad).toFixed(4)} rad  ·  arrastra P
      </text>
    </svg>
  );
};

// ════════════════════════════════════════════════════════
// 01 — SENO
// ════════════════════════════════════════════════════════
export const SinusItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [angleDeg, setAngleDeg] = useState(30);
  const rad = angleDeg * Math.PI / 180;
  const val = Math.sin(rad);

  const steps = lang === 'es' ? [
    'En un triángulo rectángulo, el seno es el cociente entre el cateto opuesto y la hipotenusa.',
    'En el círculo unitario (r = 1), sin(θ) es la coordenada y del punto en el ángulo θ.',
    'La función seno es impar: sin(−θ) = −sin(θ).',
    'Período: sin(θ + 2π) = sin(θ). El rango es [−1, 1].',
    'Identidad fundamental: sin²(θ) + cos²(θ) = 1.',
  ] : [
    'In a right triangle, the sine is the ratio of the opposite side to the hypotenuse.',
    'On the unit circle (r = 1), sin(θ) is the y-coordinate of the point at angle θ.',
    'The sine function is odd: sin(−θ) = −sin(θ).',
    'Period: sin(θ + 2π) = sin(θ). Range is [−1, 1].',
    'Fundamental identity: sin²(θ) + cos²(θ) = 1.',
  ];

  const quadrant = angleDeg < 90 ? 1 : angleDeg < 180 ? 2 : angleDeg < 270 ? 3 : 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />

      {/* Figure */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <TrigLinkedFigure mode="sin" angleDeg={angleDeg} setAngleDeg={setAngleDeg} />
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Función Seno' : 'Sine Function'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'El seno es la función trigonométrica que relaciona un ángulo con el cociente cateto opuesto / hipotenusa. En el círculo unitario, es la coordenada y.'
                : 'The sine is the trig function relating an angle to the ratio opposite / hypotenuse. On the unit circle, it is the y-coordinate.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Definición' : 'Definition'}>
                <div>sin(θ) = opuesto / hip.</div>
                <div>sin(θ) = y  (círculo unitario)</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                  {lang === 'es' ? 'Dominio: ℝ · Rango: [−1, 1]' : 'Domain: ℝ · Range: [−1, 1]'}
                </div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Identidades' : 'Identities'}>
                <div>sin²(θ) + cos²(θ) = 1</div>
                <div>sin(−θ) = −sin(θ)</div>
                <div>sin(π − θ) = sin(θ)</div>
              </FormulaCard>
            </FormulaGrid>
            <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                {lang === 'es' ? 'Valores especiales' : 'Special values'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, fontFamily: 'var(--font-math)', textAlign: 'center' }}>
                {[['0°','0'],['30°','½'],['45°','√2/2'],['60°','√3/2'],['90°','1'],['180°','0']].map(([a,v]) => (
                  <div key={a} style={{ padding: '8px 4px', background: 'var(--surface)', borderRadius: 'var(--r-xs)' }}>
                    <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>{a}</div>
                    <div style={{ fontWeight: 700, marginTop: 4, fontSize: 13 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Sine in JavaScript\nconst sinDeg = deg => Math.sin(deg * Math.PI / 180);\n\nconsole.log(sinDeg(0));   // 0\nconsole.log(sinDeg(30));  // 0.5\nconsole.log(sinDeg(45));  // 0.7071...\nconsole.log(sinDeg(90));  // 1\n\n// SVG sine wave\nfunction sineWavePath(width, height, periods = 2) {\n  const pts = [];\n  for (let x = 0; x <= width; x++) {\n    const t = (x / width) * periods * 2 * Math.PI;\n    const y = height / 2 - (height / 2 - 10) * Math.sin(t);\n    pts.push(`${x},${y.toFixed(2)}`);\n  }\n  return `<polyline\n  points=\"${pts.join(' ')}\"\n  fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\n/>`;\n}\n\nconsole.log(sineWavePath(400, 120));"}
          </pre>
        )}
      </div>

      {/* Inspector — solo en Explorar */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
        }}>
          {/* Slider */}
          <input type="range" min="0" max="360" value={angleDeg}
            onChange={e => setAngleDeg(Number(e.target.value))}
            style={{ width: '100%', marginBottom: 6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}>
            <span>0°</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-1)', fontSize: 14 }}>
              θ = {angleDeg}°  ·  {rad.toFixed(4)} rad
            </span>
            <span>360°</span>
          </div>
          {/* Celdas de valor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <InspCell
              label={`sin(${angleDeg}°)`}
              color="#e05050"
              main={val.toFixed(5)}
              sub={lang === 'es' ? 'coord. y en círculo' : 'y-coord on circle'}
            />
            <InspCell
              label={`cos(${angleDeg}°)`}
              color="var(--accent)"
              main={Math.cos(rad).toFixed(5)}
              sub={lang === 'es' ? 'coord. x en círculo' : 'x-coord on circle'}
            />
            <InspCell
              label="sin² + cos²"
              color="var(--formula)"
              main={(val * val + Math.cos(rad) ** 2).toFixed(5)}
              sub={lang === 'es' ? '= 1 (identidad Pitágoras)' : '= 1 (Pythagorean id.)'}
            />
            <InspCell
              label={lang === 'es' ? 'Cuadrante' : 'Quadrant'}
              color="var(--fg-2)"
              main={`Q${quadrant}`}
              sub={`${normDeg(angleDeg)}° mod 360°`}
            />
          </div>
        </div>
      )}

      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 02 — COSENO
// ════════════════════════════════════════════════════════
export const CosinusItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [angleDeg, setAngleDeg] = useState(60);
  const rad = angleDeg * Math.PI / 180;
  const val = Math.cos(rad);

  const steps = lang === 'es' ? [
    'En un triángulo rectángulo, el coseno es el cociente entre el cateto adyacente y la hipotenusa.',
    'En el círculo unitario (r = 1), cos(θ) es la coordenada x del punto en el ángulo θ.',
    'La función coseno es par: cos(−θ) = cos(θ).',
    'Período: cos(θ + 2π) = cos(θ). El rango es [−1, 1].',
    'Se puede deducir del seno: cos(θ) = sin(90° − θ).',
  ] : [
    'In a right triangle, the cosine is the ratio of the adjacent side to the hypotenuse.',
    'On the unit circle (r = 1), cos(θ) is the x-coordinate of the point at angle θ.',
    'The cosine function is even: cos(−θ) = cos(θ).',
    'Period: cos(θ + 2π) = cos(θ). Range is [−1, 1].',
    'It can be derived from sine: cos(θ) = sin(90° − θ).',
  ];

  const quadrant = angleDeg < 90 ? 1 : angleDeg < 180 ? 2 : angleDeg < 270 ? 3 : 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />

      {/* Figure */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <TrigLinkedFigure mode="cos" angleDeg={angleDeg} setAngleDeg={setAngleDeg} />
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Función Coseno' : 'Cosine Function'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'El coseno relaciona el ángulo con el cateto adyacente sobre la hipotenusa. En el círculo unitario es la coordenada x.'
                : 'The cosine relates the angle to the adjacent side over the hypotenuse. On the unit circle it is the x-coordinate.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Definición' : 'Definition'}>
                <div>cos(θ) = adyacente / hip.</div>
                <div>cos(θ) = x  (círculo unitario)</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                  {lang === 'es' ? 'Dominio: ℝ · Rango: [−1, 1]' : 'Domain: ℝ · Range: [−1, 1]'}
                </div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Identidades' : 'Identities'}>
                <div>sin²(θ) + cos²(θ) = 1</div>
                <div>cos(−θ) = cos(θ)</div>
                <div>cos(π − θ) = −cos(θ)</div>
              </FormulaCard>
            </FormulaGrid>
            <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                {lang === 'es' ? 'Valores especiales' : 'Special values'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, fontFamily: 'var(--font-math)', textAlign: 'center' }}>
                {[['0°','1'],['30°','√3/2'],['45°','√2/2'],['60°','½'],['90°','0'],['180°','−1']].map(([a,v]) => (
                  <div key={a} style={{ padding: '8px 4px', background: 'var(--surface)', borderRadius: 'var(--r-xs)' }}>
                    <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>{a}</div>
                    <div style={{ fontWeight: 700, marginTop: 4, fontSize: 13 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Cosine in JavaScript\nconst cosDeg = deg => Math.cos(deg * Math.PI / 180);\n\nconsole.log(cosDeg(0));   // 1\nconsole.log(cosDeg(60));  // 0.5\nconsole.log(cosDeg(90));  // 0  (≈ 6.12e-17)\nconsole.log(cosDeg(180)); // -1\n\n// SVG cosine wave (same as sine, but offset by 90°)\nfunction cosineWavePath(width, height, periods = 2) {\n  const pts = [];\n  for (let x = 0; x <= width; x++) {\n    const t = (x / width) * periods * 2 * Math.PI;\n    const y = height / 2 - (height / 2 - 10) * Math.cos(t);\n    pts.push(`${x},${y.toFixed(2)}`);\n  }\n  return `<polyline\n  points=\"${pts.join(' ')}\"\n  fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\n/>`;\n}"}
          </pre>
        )}
      </div>

      {/* Inspector — solo en Explorar */}
      {tab === 'explore' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18,
        }}>
          <input type="range" min="0" max="360" value={angleDeg}
            onChange={e => setAngleDeg(Number(e.target.value))}
            style={{ width: '100%', marginBottom: 6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}>
            <span>0°</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-1)', fontSize: 14 }}>
              θ = {angleDeg}°  ·  {rad.toFixed(4)} rad
            </span>
            <span>360°</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <InspCell
              label={`cos(${angleDeg}°)`}
              color="var(--accent)"
              main={val.toFixed(5)}
              sub={lang === 'es' ? 'coord. x en círculo' : 'x-coord on circle'}
            />
            <InspCell
              label={`sin(${angleDeg}°)`}
              color="#e05050"
              main={Math.sin(rad).toFixed(5)}
              sub={lang === 'es' ? 'coord. y en círculo' : 'y-coord on circle'}
            />
            <InspCell
              label="sin² + cos²"
              color="var(--formula)"
              main={(Math.sin(rad) ** 2 + val * val).toFixed(5)}
              sub={lang === 'es' ? '= 1 (identidad Pitágoras)' : '= 1 (Pythagorean id.)'}
            />
            <InspCell
              label={lang === 'es' ? 'Cuadrante' : 'Quadrant'}
              color="var(--fg-2)"
              main={`Q${quadrant}`}
              sub={`${normDeg(angleDeg)}° mod 360°`}
            />
          </div>
        </div>
      )}

      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 03 — TANGENTE
// ════════════════════════════════════════════════════════
export const TangentItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('formula');
  const [step, setStep] = useState(0);
  const [angleDeg, setAngleDeg] = useState(45);
  const rad = angleDeg * Math.PI / 180;
  const cosV = Math.cos(rad);
  const isUndef = Math.abs(cosV) < 0.005;
  const val = isUndef ? null : Math.tan(rad);

  const steps = lang === 'es' ? [
    'La tangente es el cociente entre el seno y el coseno: tan(θ) = sin(θ) / cos(θ).',
    'En un triángulo rectángulo: tan(θ) = cateto opuesto / cateto adyacente.',
    'La tangente no está definida cuando cos(θ) = 0, es decir, en θ = 90° + n·180°.',
    'Período: tan(θ + π) = tan(θ). El rango es (−∞, +∞).',
    'Identidad: 1 + tan²(θ) = sec²(θ), donde sec(θ) = 1/cos(θ).',
  ] : [
    'The tangent is the ratio of sine to cosine: tan(θ) = sin(θ) / cos(θ).',
    'In a right triangle: tan(θ) = opposite / adjacent.',
    'Tangent is undefined when cos(θ) = 0, i.e., at θ = 90° + n·180°.',
    'Period: tan(θ + π) = tan(θ). Range is (−∞, +∞).',
    'Identity: 1 + tan²(θ) = sec²(θ), where sec(θ) = 1/cos(θ).',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 40, alignItems: 'start' }}>
              <div>
                <AngleControl angleDeg={angleDeg} setAngleDeg={setAngleDeg} lang={lang} />
                <div style={{ marginTop: 20, padding: 18, background: isUndef ? 'var(--surface-2)' : 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6 }}>tan({angleDeg}°)</div>
                  {isUndef
                    ? <div style={{ fontFamily: 'var(--font-math)', fontSize: 20, color: 'var(--red)', fontWeight: 700 }}>
                        {lang === 'es' ? '∞ — no definida' : '∞ — undefined'}
                      </div>
                    : <div style={{ fontFamily: 'var(--font-math)', fontSize: 26, fontWeight: 700, color: 'var(--accent)' }}>
                        {val!.toFixed(5)}
                      </div>
                  }
                </div>
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', textAlign: 'center', fontSize: 13 }}>
                    <div style={{ color: 'var(--fg-3)', marginBottom: 4 }}>sin({angleDeg}°)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{Math.sin(rad).toFixed(4)}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', textAlign: 'center', fontSize: 13 }}>
                    <div style={{ color: 'var(--fg-3)', marginBottom: 4 }}>cos({angleDeg}°)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cosV.toFixed(4)}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12 }}>
                  {lang === 'es' ? 'Círculo unitario' : 'Unit circle'}
                </h3>
                <UnitCircle angleDeg={angleDeg} showSin={true} showCos={true} />
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Función Tangente' : 'Tangent Function'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'La tangente es el cociente sin/cos. Tiene asíntotas verticales en 90° + n·180° donde el coseno se anula.'
                : 'The tangent is the quotient sin/cos. It has vertical asymptotes at 90° + n·180° where cosine is zero.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Definición' : 'Definition'}>
                <div>tan(θ) = sin(θ) / cos(θ)</div>
                <div>tan(θ) = opuesto / adyacente</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                  {lang === 'es' ? 'No definida en 90° + n·180°' : 'Undefined at 90° + n·180°'}
                </div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Identidades' : 'Identities'}>
                <div>tan(−θ) = −tan(θ)</div>
                <div>1 + tan²(θ) = sec²(θ)</div>
                <div>tan(θ + π) = tan(θ)</div>
              </FormulaCard>
            </FormulaGrid>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Tangent in JavaScript\nconst tanDeg = deg => Math.tan(deg * Math.PI / 180);\n\n// Watch out for near-90° values\nconsole.log(tanDeg(0));    // 0\nconsole.log(tanDeg(45));   // 1\nconsole.log(tanDeg(135));  // -1\nconsole.log(tanDeg(89.9)); // ~572 (very large)\n\n// Safe tangent (returns null at asymptotes)\nfunction safeTan(deg) {\n  const normalised = ((deg % 180) + 180) % 180;\n  if (Math.abs(normalised - 90) < 0.01) return null;\n  return Math.tan(deg * Math.PI / 180);\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 04 — ARCOSENO
// ════════════════════════════════════════════════════════
export const ArcSinusItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('formula');
  const [step, setStep] = useState(0);
  const [yVal, setYVal] = useState(50); // -100..100 → -1..1
  const y = yVal / 100;
  const radResult = Math.asin(y);
  const degResult = radResult * 180 / Math.PI;

  const steps = lang === 'es' ? [
    'El arcoseno es la función inversa del seno: arcsin(y) = θ tal que sin(θ) = y.',
    'Para que sea una función (un solo valor de salida), se restringe el dominio del seno a [−90°, 90°].',
    'Dominio de arcsin: [−1, 1]. Rango: [−π/2, π/2] = [−90°, 90°].',
    'arcsin(sin(θ)) = θ solo si θ ∈ [−90°, 90°].',
    'Identidad: arcsin(x) + arccos(x) = π/2 para todo x ∈ [−1, 1].',
  ] : [
    'Arcsine is the inverse of the sine function: arcsin(y) = θ such that sin(θ) = y.',
    'To be a function (single output), the sine domain is restricted to [−90°, 90°].',
    'Domain of arcsin: [−1, 1]. Range: [−π/2, π/2] = [−90°, 90°].',
    'arcsin(sin(θ)) = θ only if θ ∈ [−90°, 90°].',
    'Identity: arcsin(x) + arccos(x) = π/2 for all x ∈ [−1, 1].',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Valor y ∈ [−1, 1]' : 'Value y ∈ [−1, 1]'}
                </h3>
                <input type="range" min="-100" max="100" value={yVal}
                  onChange={e => setYVal(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: 8 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)' }}>
                  <span>−1</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-1)', fontSize: 15 }}>y = {y.toFixed(2)}</span>
                  <span>+1</span>
                </div>
                <ResultBox label={`arcsin(${y.toFixed(2)})`} value={`${degResult.toFixed(2)}°`} />
                <div style={{ marginTop: 10, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', fontSize: 13, textAlign: 'center' }}>
                  <div style={{ color: 'var(--fg-3)', marginBottom: 4 }}>{lang === 'es' ? 'En radianes' : 'In radians'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{radResult.toFixed(5)} rad</div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Verificación' : 'Verification'}
                </h3>
                <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 14, lineHeight: 2 }}>
                  <div>sin({degResult.toFixed(2)}°) = <strong>{Math.sin(radResult).toFixed(5)}</strong></div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 12 }}>
                    {lang === 'es' ? '← debe coincidir con y' : '← must match y'}
                  </div>
                  <div style={{ marginTop: 8 }}>arcsin(sin({degResult.toFixed(1)}°)) = <strong>{degResult.toFixed(2)}°</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Función Arcoseno' : 'Arcsine Function'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'El arcoseno es la inversa del seno restringida al rango [−90°, 90°]. Dado un valor y, devuelve el ángulo cuyo seno es y.'
                : 'Arcsine is the inverse of sine restricted to [−90°, 90°]. Given a value y, it returns the angle whose sine is y.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Definición' : 'Definition'}>
                <div>arcsin(y) = θ ⟺ sin(θ) = y</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                  <div>{lang === 'es' ? 'Dominio: [−1, 1]' : 'Domain: [−1, 1]'}</div>
                  <div>{lang === 'es' ? 'Rango: [−π/2, π/2]' : 'Range: [−π/2, π/2]'}</div>
                </div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Identidades' : 'Identities'}>
                <div>arcsin(x) + arccos(x) = π/2</div>
                <div>arcsin(−x) = −arcsin(x)</div>
                <div>sin(arcsin(x)) = x</div>
              </FormulaCard>
            </FormulaGrid>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Arcsine in JavaScript\n// Math.asin returns radians in [-π/2, π/2]\nconst asinDeg = y => Math.asin(y) * 180 / Math.PI;\n\nconsole.log(asinDeg(0));    // 0\nconsole.log(asinDeg(0.5));  // 30\nconsole.log(asinDeg(1));    // 90\nconsole.log(asinDeg(-1));   // -90\n// asinDeg(2) → NaN (out of domain)\n\n// Find the angle of a point on a circle\nfunction angleFromY(y, r) {\n  const normalised = y / r; // normalize to [-1, 1]\n  if (normalised < -1 || normalised > 1) return null;\n  return asinDeg(normalised);\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 05 — ARCOCOSENO
// ════════════════════════════════════════════════════════
export const ArcCosinusItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('formula');
  const [step, setStep] = useState(0);
  const [xVal, setXVal] = useState(50); // -100..100 → -1..1
  const x = xVal / 100;
  const radResult = Math.acos(x);
  const degResult = radResult * 180 / Math.PI;

  const steps = lang === 'es' ? [
    'El arcocoseno es la función inversa del coseno: arccos(x) = θ tal que cos(θ) = x.',
    'Para que sea una función, se restringe el dominio del coseno a [0°, 180°].',
    'Dominio de arccos: [−1, 1]. Rango: [0, π] = [0°, 180°].',
    'arccos(cos(θ)) = θ solo si θ ∈ [0°, 180°].',
    'Identidad: arcsin(x) + arccos(x) = π/2 para todo x ∈ [−1, 1].',
  ] : [
    'Arccosine is the inverse of cosine: arccos(x) = θ such that cos(θ) = x.',
    'To be a function, the cosine domain is restricted to [0°, 180°].',
    'Domain of arccos: [−1, 1]. Range: [0, π] = [0°, 180°].',
    'arccos(cos(θ)) = θ only if θ ∈ [0°, 180°].',
    'Identity: arcsin(x) + arccos(x) = π/2 for all x ∈ [−1, 1].',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Valor x ∈ [−1, 1]' : 'Value x ∈ [−1, 1]'}
                </h3>
                <input type="range" min="-100" max="100" value={xVal}
                  onChange={e => setXVal(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: 8 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)' }}>
                  <span>−1</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-1)', fontSize: 15 }}>x = {x.toFixed(2)}</span>
                  <span>+1</span>
                </div>
                <ResultBox label={`arccos(${x.toFixed(2)})`} value={`${degResult.toFixed(2)}°`} />
                <div style={{ marginTop: 10, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', fontSize: 13, textAlign: 'center' }}>
                  <div style={{ color: 'var(--fg-3)', marginBottom: 4 }}>{lang === 'es' ? 'En radianes' : 'In radians'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{radResult.toFixed(5)} rad</div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Verificación' : 'Verification'}
                </h3>
                <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 14, lineHeight: 2 }}>
                  <div>cos({degResult.toFixed(2)}°) = <strong>{Math.cos(radResult).toFixed(5)}</strong></div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 12 }}>
                    {lang === 'es' ? '← debe coincidir con x' : '← must match x'}
                  </div>
                  <div style={{ marginTop: 8 }}>arccos(cos({degResult.toFixed(1)}°)) = <strong>{degResult.toFixed(2)}°</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Función Arcocoseno' : 'Arccosine Function'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'El arcocoseno es la inversa del coseno restringida a [0°, 180°]. Dado un valor x, devuelve el ángulo cuyo coseno es x.'
                : 'Arccosine is the inverse of cosine restricted to [0°, 180°]. Given a value x, it returns the angle whose cosine is x.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Definición' : 'Definition'}>
                <div>arccos(x) = θ ⟺ cos(θ) = x</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                  <div>{lang === 'es' ? 'Dominio: [−1, 1]' : 'Domain: [−1, 1]'}</div>
                  <div>{lang === 'es' ? 'Rango: [0, π]' : 'Range: [0, π]'}</div>
                </div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Identidades' : 'Identities'}>
                <div>arcsin(x) + arccos(x) = π/2</div>
                <div>arccos(−x) = π − arccos(x)</div>
                <div>cos(arccos(x)) = x</div>
              </FormulaCard>
            </FormulaGrid>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Arccosine in JavaScript\n// Math.acos returns radians in [0, π]\nconst acosDeg = x => Math.acos(x) * 180 / Math.PI;\n\nconsole.log(acosDeg(1));    // 0\nconsole.log(acosDeg(0.5));  // 60\nconsole.log(acosDeg(0));    // 90\nconsole.log(acosDeg(-1));   // 180\n\n// Find the angle between two vectors using dot product\nfunction angleBetweenVectors(ax, ay, bx, by) {\n  const dot = ax * bx + ay * by;\n  const magA = Math.hypot(ax, ay);\n  const magB = Math.hypot(bx, by);\n  return acosDeg(dot / (magA * magB));\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 06 — ARCOTANGENTE
// ════════════════════════════════════════════════════════
export const ArcTangentItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('formula');
  const [step, setStep] = useState(0);
  const [tVal, setTVal] = useState(100); // -500..500 → -5..5
  const t = tVal / 100;
  const radResult = Math.atan(t);
  const degResult = radResult * 180 / Math.PI;

  const steps = lang === 'es' ? [
    'La arcotangente es la función inversa de la tangente: atan(t) = θ tal que tan(θ) = t.',
    'A diferencia de arcsin y arccos, el dominio de atan es todos los reales (−∞, +∞).',
    'Rango de atan: (−π/2, π/2) = (−90°, 90°), los extremos no se alcanzan.',
    'atan2(y, x) es la versión extendida que devuelve ángulos en (−π, π] usando el cuadrante correcto.',
    'atan(t) ≈ t para t pequeño — aproximación de primer orden.',
  ] : [
    'Arctangent is the inverse of tangent: atan(t) = θ such that tan(θ) = t.',
    'Unlike arcsin and arccos, the domain of atan is all reals (−∞, +∞).',
    'Range of atan: (−π/2, π/2) = (−90°, 90°), endpoints never reached.',
    'atan2(y, x) is the extended version that returns angles in (−π, π] using the correct quadrant.',
    'atan(t) ≈ t for small t — first-order approximation.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Valor t ∈ (−∞, +∞)' : 'Value t ∈ (−∞, +∞)'}
                </h3>
                <input type="range" min="-500" max="500" value={tVal}
                  onChange={e => setTVal(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: 8 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)' }}>
                  <span>−5</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-1)', fontSize: 15 }}>t = {t.toFixed(2)}</span>
                  <span>+5</span>
                </div>
                <ResultBox label={`atan(${t.toFixed(2)})`} value={`${degResult.toFixed(3)}°`} />
                <div style={{ marginTop: 10, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', fontSize: 13, textAlign: 'center' }}>
                  <div style={{ color: 'var(--fg-3)', marginBottom: 4 }}>{lang === 'es' ? 'En radianes' : 'In radians'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{radResult.toFixed(5)} rad</div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Verificación' : 'Verification'}
                </h3>
                <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 14, lineHeight: 2 }}>
                  <div>tan({degResult.toFixed(2)}°) = <strong>{Math.tan(radResult).toFixed(4)}</strong></div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 12 }}>
                    {lang === 'es' ? '← debe coincidir con t' : '← must match t'}
                  </div>
                  <div style={{ marginTop: 8, color: 'var(--fg-3)', fontSize: 12 }}>
                    {lang === 'es' ? 'Rango acotado:' : 'Bounded range:'} {degResult.toFixed(1)}° ∈ (−90°, 90°)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Función Arcotangente' : 'Arctangent Function'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'La arcotangente acepta cualquier número real y devuelve el ángulo en (−90°, 90°). Es muy usada en gráficos para calcular la dirección de un vector.'
                : 'Arctangent accepts any real number and returns the angle in (−90°, 90°). Widely used in graphics to compute the direction of a vector.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Definición' : 'Definition'}>
                <div>atan(t) = θ ⟺ tan(θ) = t</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                  <div>{lang === 'es' ? 'Dominio: ℝ' : 'Domain: ℝ'}</div>
                  <div>{lang === 'es' ? 'Rango: (−π/2, π/2)' : 'Range: (−π/2, π/2)'}</div>
                </div>
              </FormulaCard>
              <FormulaCard title="atan2">
                <div>atan2(y, x) ∈ (−π, π]</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                  {lang === 'es' ? 'Versión de 4 cuadrantes — usa el signo de x e y para elegir el cuadrante correcto.' : 'Four-quadrant version — uses the sign of x and y to pick the correct quadrant.'}
                </div>
              </FormulaCard>
            </FormulaGrid>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Arctangent in JavaScript\nconst atanDeg = t => Math.atan(t) * 180 / Math.PI;\n\nconsole.log(atanDeg(0));   // 0\nconsole.log(atanDeg(1));   // 45\nconsole.log(atanDeg(-1));  // -45\n\n// atan2: angle of a point (x, y) from origin — 4-quadrant!\nfunction pointAngleDeg(x, y) {\n  return Math.atan2(y, x) * 180 / Math.PI;\n}\n\nconsole.log(pointAngleDeg(1, 0));   // 0°\nconsole.log(pointAngleDeg(0, 1));   // 90°\nconsole.log(pointAngleDeg(-1, 0));  // 180°\nconsole.log(pointAngleDeg(0, -1));  // -90°\nconsole.log(pointAngleDeg(1, 1));   // 45°"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 07 — SUMA DE ÁNGULOS
// ════════════════════════════════════════════════════════
export const SumAnglesItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('formula');
  const [step, setStep] = useState(0);
  const [aDeg, setADeg] = useState(30);
  const [bDeg, setBDeg] = useState(45);
  const a = aDeg * Math.PI / 180;
  const b = bDeg * Math.PI / 180;
  const sinSum = Math.sin(a + b);
  const cosSum = Math.cos(a + b);
  const sinSumFormula = Math.sin(a)*Math.cos(b) + Math.cos(a)*Math.sin(b);
  const cosSumFormula = Math.cos(a)*Math.cos(b) - Math.sin(a)*Math.sin(b);

  const steps = lang === 'es' ? [
    'Las fórmulas de suma de ángulos permiten calcular sin(a+b) y cos(a+b) sin calcular a+b directamente.',
    'sin(a + b) = sin(a)·cos(b) + cos(a)·sin(b).',
    'cos(a + b) = cos(a)·cos(b) − sin(a)·sin(b).',
    'Se obtienen a partir de la multiplicación de números complejos: e^(ia)·e^(ib) = e^(i(a+b)).',
    'Para la diferencia: sin(a−b) = sin(a)cos(b) − cos(a)sin(b).',
  ] : [
    'Angle addition formulas let you compute sin(a+b) and cos(a+b) without computing a+b directly.',
    'sin(a + b) = sin(a)·cos(b) + cos(a)·sin(b).',
    'cos(a + b) = cos(a)·cos(b) − sin(a)·sin(b).',
    'Derived from complex number multiplication: e^(ia)·e^(ib) = e^(i(a+b)).',
    'For the difference: sin(a−b) = sin(a)cos(b) − cos(a)sin(b).',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Ángulos' : 'Angles'}
                </h3>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 6 }}>α = {aDeg}°</div>
                  <input type="range" min="0" max="360" value={aDeg} onChange={e => setADeg(Number(e.target.value))} style={{ width: '100%' }}/>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 6 }}>β = {bDeg}°</div>
                  <input type="range" min="0" max="360" value={bDeg} onChange={e => setBDeg(Number(e.target.value))} style={{ width: '100%' }}/>
                </div>
                <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', fontSize: 13 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>α + β = {aDeg + bDeg}°</div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 12 }}>{lang === 'es' ? '≡' : '≡'} {(aDeg + bDeg) % 360}° {lang === 'es' ? '(módulo 360)' : '(mod 360)'}</div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 12 }}>
                  {lang === 'es' ? 'Comprobación' : 'Verification'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: 14, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>sin({aDeg}° + {bDeg}°)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700 }}>= {sinSum.toFixed(5)}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                      {lang === 'es' ? 'Por fórmula:' : 'By formula:'} {sinSumFormula.toFixed(5)}
                    </div>
                  </div>
                  <div style={{ padding: 14, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>cos({aDeg}° + {bDeg}°)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700 }}>= {cosSum.toFixed(5)}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                      {lang === 'es' ? 'Por fórmula:' : 'By formula:'} {cosSumFormula.toFixed(5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Fórmulas de Suma de Ángulos' : 'Angle Addition Formulas'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'Permiten expandir sin(a ± b) y cos(a ± b) en términos de las funciones del ángulo individual. Clave para simplificar expresiones trigonométricas.'
                : 'Allow expanding sin(a ± b) and cos(a ± b) in terms of the individual angles. Key for simplifying trig expressions.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Seno' : 'Sine'}>
                <div>sin(a + b) = sin a·cos b + cos a·sin b</div>
                <div>sin(a − b) = sin a·cos b − cos a·sin b</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Coseno' : 'Cosine'}>
                <div>cos(a + b) = cos a·cos b − sin a·sin b</div>
                <div>cos(a − b) = cos a·cos b + sin a·sin b</div>
              </FormulaCard>
            </FormulaGrid>
            <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                {lang === 'es' ? 'Tangente de suma' : 'Tangent addition'}
              </div>
              <div style={{ fontFamily: 'var(--font-math)', fontSize: 15 }}>
                tan(a + b) = (tan a + tan b) / (1 − tan a · tan b)
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Angle addition formulas in JavaScript\nconst d2r = deg => deg * Math.PI / 180;\n\nfunction sinSum(a, b) {\n  return Math.sin(d2r(a)) * Math.cos(d2r(b))\n       + Math.cos(d2r(a)) * Math.sin(d2r(b));\n}\n\nfunction cosSum(a, b) {\n  return Math.cos(d2r(a)) * Math.cos(d2r(b))\n       - Math.sin(d2r(a)) * Math.sin(d2r(b));\n}\n\n// Verify: sin(30 + 45) == sin(75)\nconsole.log(sinSum(30, 45).toFixed(6));\nconsole.log(Math.sin(d2r(75)).toFixed(6)); // same\n\n// Use to rotate a point by angle b around origin\nfunction rotate(x, y, angleDeg) {\n  const a = d2r(angleDeg);\n  return {\n    x: x * Math.cos(a) - y * Math.sin(a),\n    y: x * Math.sin(a) + y * Math.cos(a),\n  };\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 08 — ÁNGULO ESCALAR (Ángulo múltiplo)
// ════════════════════════════════════════════════════════
export const ScalarAnglesItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('formula');
  const [step, setStep] = useState(0);
  const [angleDeg, setAngleDeg] = useState(30);
  const [n, setN] = useState(2);
  const rad = angleDeg * Math.PI / 180;
  const sinN = Math.sin(n * rad);
  const cosN = Math.cos(n * rad);
  const sin2 = 2 * Math.sin(rad) * Math.cos(rad);
  const cos2 = Math.cos(rad)**2 - Math.sin(rad)**2;

  const steps = lang === 'es' ? [
    'Las fórmulas de ángulo doble se derivan de la suma: sin(2a) = sin(a+a) = sin a·cos a + cos a·sin a.',
    'Simplificando: sin(2a) = 2·sin(a)·cos(a).',
    'De igual modo: cos(2a) = cos²(a) − sin²(a) = 2cos²(a) − 1 = 1 − 2sin²(a).',
    'Para ángulo triple y superiores se aplica recursivamente: sin(3a) = sin(2a+a).',
    'En general: cos(n·a) = T_n(cos a), donde T_n es el polinomio de Chebyshev de grado n.',
  ] : [
    'Double-angle formulas come from the addition formula: sin(2a) = sin(a+a) = sin a·cos a + cos a·sin a.',
    'Simplified: sin(2a) = 2·sin(a)·cos(a).',
    'Similarly: cos(2a) = cos²(a) − sin²(a) = 2cos²(a) − 1 = 1 − 2sin²(a).',
    'For triple and higher angles, apply recursively: sin(3a) = sin(2a+a).',
    'In general: cos(n·a) = T_n(cos a), where T_n is the degree-n Chebyshev polynomial.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
              <div>
                <AngleControl angleDeg={angleDeg} setAngleDeg={setAngleDeg} lang={lang} />
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 8 }}>
                    {lang === 'es' ? 'Multiplicador n' : 'Multiplier n'} = {n}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1,2,3,4].map(v => (
                      <button key={v} onClick={() => setN(v)} style={{
                        padding: '6px 16px', borderRadius: 'var(--r-xs)',
                        background: n === v ? 'var(--accent)' : 'var(--surface-2)',
                        color: n === v ? 'var(--on-accent)' : 'var(--fg-2)',
                        border: '1px solid var(--hairline)', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                      }}>{v}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: 14, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>sin({n}·{angleDeg}°) = sin({n*angleDeg}°)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{sinN.toFixed(5)}</div>
                    {n === 2 && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>2·sin·cos = {sin2.toFixed(5)}</div>}
                  </div>
                  <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--r-md)' }}>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>cos({n}·{angleDeg}°) = cos({n*angleDeg}°)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700 }}>{cosN.toFixed(5)}</div>
                    {n === 2 && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>cos²−sin² = {cos2.toFixed(5)}</div>}
                  </div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12 }}>
                  {lang === 'es' ? 'Círculo unitario — n·θ' : 'Unit circle — n·θ'}
                </h3>
                <UnitCircle angleDeg={n * angleDeg} showSin={true} showCos={true} />
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-3)', textAlign: 'center' }}>
                  {lang === 'es' ? 'ángulo efectivo:' : 'effective angle:'} {n}·{angleDeg}° = {n*angleDeg}°
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Fórmulas de Ángulo Múltiplo' : 'Multiple-Angle Formulas'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'Expresan sin(n·θ) y cos(n·θ) en términos de sin(θ) y cos(θ). Las más usadas son las de ángulo doble.'
                : 'Express sin(n·θ) and cos(n·θ) in terms of sin(θ) and cos(θ). The double-angle ones are the most used.'}
            </p>
            <FormulaGrid>
              <FormulaCard title={lang === 'es' ? 'Ángulo doble' : 'Double angle'}>
                <div>sin(2θ) = 2·sin θ·cos θ</div>
                <div>cos(2θ) = cos²θ − sin²θ</div>
                <div>cos(2θ) = 2cos²θ − 1</div>
                <div>cos(2θ) = 1 − 2sin²θ</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Ángulo triple' : 'Triple angle'}>
                <div>sin(3θ) = 3·sin θ − 4·sin³θ</div>
                <div>cos(3θ) = 4·cos³θ − 3·cos θ</div>
              </FormulaCard>
            </FormulaGrid>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Multiple-angle formulas in JavaScript\nconst d2r = deg => deg * Math.PI / 180;\n\nfunction sin2(deg) {\n  const a = d2r(deg);\n  return 2 * Math.sin(a) * Math.cos(a); // = sin(2*deg)\n}\n\nfunction cos2(deg) {\n  const a = d2r(deg);\n  return Math.cos(a)**2 - Math.sin(a)**2; // = cos(2*deg)\n}\n\nconsole.log(sin2(30).toFixed(6)); // sin(60°) ≈ 0.866025\nconsole.log(cos2(30).toFixed(6)); // cos(60°) = 0.5\n\n// General: use recursive addition formula\nfunction sinN(n, deg) {\n  if (n === 1) return Math.sin(d2r(deg));\n  const a = d2r(deg);\n  return Math.sin(n * a); // JavaScript handles it natively\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ── Helper: normalize degrees to [0, 360) ────────────────────────
function normDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}
