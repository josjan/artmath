// AreaItems.tsx — Ítems del capítulo Área & Longitud
// Explore: canvas SVG interactivo con puntos arrastrables (estilo VectorsModule)
// Formula + SVG tabs: fórmulas y código

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import type { Lang } from '../../lib/data';

// ── Constantes del canvas ───────────────────────────────
const CVW = 380;   // canvas width  px
const CVH = 280;   // canvas height px
const STEP = 20;   // px por unidad de display

// ── Helpers ─────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function snapG(v: number) { return Math.round(v / STEP) * STEP; }
function pu(px: number) { return (px / STEP).toFixed(1); }  // px → display units string

function svgPt(e: React.PointerEvent, el: SVGSVGElement): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return {
    x: snapG(clamp((e.clientX - r.left) * (CVW / r.width),  STEP, CVW - STEP)),
    y: snapG(clamp((e.clientY - r.top)  * (CVH / r.height), STEP, CVH - STEP)),
  };
}

// ── Shared visual components ────────────────────────────

/** Draggable handle: halo translúcido + core con borde blanco (estilo VectorsModule) */
const Handle = ({ cx, cy, label, color, onPointerDown }: {
  cx: number; cy: number; label?: string; color: string;
  onPointerDown: (e: React.PointerEvent) => void;
}) => (
  <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
    <circle cx={cx} cy={cy} r={16} fill={color} fillOpacity={0.15}/>
    <circle cx={cx} cy={cy} r={6}  fill={color} stroke="white" strokeWidth={2}/>
    {label && (
      <text x={cx} y={cy - 18} textAnchor="middle" fontSize={13}
        fill={color} fontStyle="italic" fontFamily="var(--font-math)">{label}</text>
    )}
  </g>
);

/** Grid de fondo con líneas menores y mayores */
const GridBg = () => {
  const v: React.ReactNode[] = [];
  const h: React.ReactNode[] = [];
  for (let x = 0; x <= CVW; x += STEP) {
    const major = (x / STEP) % 4 === 0;
    v.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={CVH}
      stroke={major ? 'var(--fg-4)' : 'var(--hairline)'}
      strokeWidth={major ? 0.8 : 0.4}/>);
  }
  for (let y = 0; y <= CVH; y += STEP) {
    const major = (y / STEP) % 4 === 0;
    h.push(<line key={`h${y}`} x1={0} y1={y} x2={CVW} y2={y}
      stroke={major ? 'var(--fg-4)' : 'var(--hairline)'}
      strokeWidth={major ? 0.8 : 0.4}/>);
  }
  return <>{v}{h}</>;
};

/** Panel derecho: canvas SVG con eventos de arrastre */
const SvgCanvas = ({ svgRef, onPointerMove, onPointerUp, children }: {
  svgRef: React.RefObject<SVGSVGElement>;
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
  children: React.ReactNode;
}) => (
  <svg ref={svgRef} viewBox={`0 0 ${CVW} ${CVH}`}
    style={{ width: '100%', height: 'auto', display: 'block',
      touchAction: 'none', background: 'var(--surface-2)',
      borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerLeave={onPointerUp}>
    <GridBg/>
    {children}
  </svg>
);

/** Panel izquierdo: valores dinámicos */
const InfoPanel = ({ rows }: { rows: { label: string; value: string; highlight?: boolean }[] }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {rows.map(({ label, value, highlight }) => (
      <div key={label} style={{
        padding: '10px 14px', borderRadius: 'var(--r-sm)',
        background: highlight ? 'var(--highlight-soft)' : 'var(--surface-2)',
        border: `1px solid ${highlight ? 'var(--highlight)' : 'var(--hairline)'}`,
      }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 3 }}>{label}</div>
        <div style={{
          fontFamily: 'var(--font-math)', fontSize: highlight ? 22 : 15,
          fontWeight: highlight ? 700 : 400,
          color: highlight ? 'var(--accent)' : 'var(--fg-1)',
        }}>{value}</div>
      </div>
    ))}
  </div>
);

// Shared tab bar & deriv list ────────────────────────────

const TabBar = ({ tab, setTab, lang }: { tab: string; setTab: (t: any) => void; lang: Lang }) => {
  const tabs = lang === 'es'
    ? [['explore','Explorar'],['formula','Fórmula']]
    : [['explore','Explore'],['formula','Formula']];
  return (
    <div style={{ display: 'inline-flex', alignSelf: 'flex-start',
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 'var(--r-sm)', padding: 3, gap: 2 }}>
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
  const btn: React.CSSProperties = { background: 'var(--surface-2)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-xs)', padding: 4, cursor: 'pointer', color: 'var(--fg-2)', display: 'inline-flex' };
  const lbl = lang === 'es' ? ['Paso','de'] : ['Step','of'];
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{lang === 'es' ? 'Derivación' : 'Derivation'}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-3)' }}>
          <button onClick={() => setStep(Math.max(0, step-1))} style={btn}><Icon name="ChevronLeft" size={14}/></button>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{lbl[0]} {step+1} {lbl[1]} {steps.length}</span>
          <button onClick={() => setStep(Math.min(steps.length-1, step+1))} style={btn}><Icon name="ChevronRight" size={14}/></button>
        </div>
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((txt, i) => (
          <li key={i} style={{ display: 'flex', gap: 12, padding: '8px 12px',
            background: i === step ? 'var(--highlight-soft)' : 'transparent',
            borderLeft: i === step ? '3px solid var(--highlight)' : '3px solid transparent',
            borderRadius: 'var(--r-xs)', color: i === step ? 'var(--fg-1)' : 'var(--fg-3)',
            fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-4)', fontSize: 12 }}>{String(i+1).padStart(2,'0')}</span>
            <span>{txt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

const FormulaCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>{title}</div>
    <div style={{ fontFamily: 'var(--font-math)', fontSize: 15, lineHeight: 2.1 }}>{children}</div>
  </div>
);

// ════════════════════════════════════════════════════════
// 01 — TRIÁNGULO
// ════════════════════════════════════════════════════════
export const TriangleAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [A, setA] = useState({ x: 80,  y: 220 });
  const [B, setB] = useState({ x: 300, y: 220 });
  const [C, setC] = useState({ x: 180, y: 80  });
  const drag = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const area = Math.abs((B.x-A.x)*(C.y-A.y) - (C.x-A.x)*(B.y-A.y)) / 2 / (STEP*STEP);
  const base = Math.hypot(B.x-A.x, B.y-A.y) / STEP;
  const h = (2*area) / base;

  const onPD = (which: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = which;
  };
  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    if (drag.current === 'A') setA(p);
    if (drag.current === 'B') setB(p);
    if (drag.current === 'C') setC(p);
  };

  const pts = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;

  const steps = lang === 'es' ? [
    'Un triángulo es la mitad de un paralelogramo de la misma base y altura.',
    'Duplicando el triángulo (copia invertida) se forma un paralelogramo: A_paral = b·h.',
    'Por tanto: A = ½ · b · h.',
    'La altura debe ser perpendicular a la base elegida.',
    'La fórmula de Herón: A = √(s(s−a)(s−b)(s−c)) permite calcularlo con solo los tres lados.',
  ] : [
    'A triangle is half of a parallelogram with the same base and height.',
    'Doubling the triangle (flipping a copy) forms a parallelogram: A_paral = b·h.',
    'Therefore: A = ½ · b · h.',
    'The height must be perpendicular to the chosen base.',
    "Heron's formula: A = √(s(s−a)(s−b)(s−c)) uses only the three side lengths.",
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <InfoPanel rows={[
                { label: lang === 'es' ? 'Base |AB|' : 'Base |AB|', value: `${base.toFixed(2)} u` },
                { label: lang === 'es' ? 'Altura (h)' : 'Height (h)', value: `${h.toFixed(2)} u` },
                { label: 'A = ½ · b · h', value: `${area.toFixed(3)} u²`, highlight: true },
              ]}/>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'Arrastra los vértices A, B, C' : 'Drag vertices A, B, C'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = null; }}>
                  <polygon points={pts} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  {/* height line */}
                  {(() => {
                    const bx = B.x - A.x; const by = B.y - A.y;
                    const len2 = bx*bx + by*by;
                    const t = ((C.x-A.x)*bx + (C.y-A.y)*by) / len2;
                    const fx = A.x + t*bx; const fy = A.y + t*by;
                    return <line x1={C.x} y1={C.y} x2={fx} y2={fy} stroke="var(--fg-3)" strokeWidth={1} strokeDasharray="5,4"/>;
                  })()}
                  <Handle cx={A.x} cy={A.y} label="A" color="var(--accent)"   onPointerDown={onPD('A')}/>
                  <Handle cx={B.x} cy={B.y} label="B" color="#22b966"          onPointerDown={onPD('B')}/>
                  <Handle cx={C.x} cy={C.y} label="C" color="#e05050"          onPointerDown={onPD('C')}/>
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Área del Triángulo' : 'Triangle Area'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'El área del triángulo es la mitad del producto entre la base y la altura perpendicular.' : 'The area of a triangle is half the product of the base and perpendicular height.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Base-altura' : 'Base-height'}>
                <div>A = ½ · b · h</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>{lang === 'es' ? 'h ⊥ b' : 'h ⊥ b'}</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Fórmula de Herón' : "Heron's formula"}>
                <div>s = (a+b+c)/2</div>
                <div>A = √(s(s−a)(s−b)(s−c))</div>
              </FormulaCard>
            </div>
            <div style={{ marginTop: 16, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>{lang === 'es' ? 'Con ángulo incluido' : 'With included angle'}</div>
              <div style={{ fontFamily: 'var(--font-math)', fontSize: 15 }}>A = ½ · a · b · sin(C)</div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Triangle area\nfunction triangleArea(base, height) { return 0.5 * base * height; }\n\n// Heron's formula (three sides)\nfunction heronArea(a, b, c) {\n  const s = (a + b + c) / 2;\n  return Math.sqrt(s * (s-a) * (s-b) * (s-c));\n}\n\n// Area from three points (cross product)\nfunction triangleAreaPts(ax,ay, bx,by, cx,cy) {\n  return Math.abs((bx-ax)*(cy-ay) - (cx-ax)*(by-ay)) / 2;\n}\n\n// SVG triangle\nfunction svgTriangle(x1,y1, x2,y2, x3,y3) {\n  return `<polygon points=\"${x1},${y1} ${x2},${y2} ${x3},${y3}\"\n    fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 02 — PARALELOGRAMO
// ════════════════════════════════════════════════════════
export const ParallelogramAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const O = { x: 60, y: 220 };   // fixed origin
  const [B, setB] = useState({ x: 280, y: 220 });
  const [T, setT] = useState({ x: 120, y: 100 });
  const drag = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const bx = B.x - O.x; const by = B.y - O.y;
  const tx = T.x - O.x; const ty = T.y - O.y;
  const area = Math.abs(bx * ty - by * tx) / (STEP * STEP);
  const base = Math.hypot(bx, by) / STEP;
  const side = Math.hypot(tx, ty) / STEP;
  const D = { x: B.x + tx, y: B.y + ty };

  const onPD = (which: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = which;
  };
  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    if (drag.current === 'B') setB(p);
    if (drag.current === 'T') setT(p);
  };

  const pts = `${O.x},${O.y} ${B.x},${B.y} ${D.x},${D.y} ${T.x},${T.y}`;

  const steps = lang === 'es' ? [
    'Un paralelogramo tiene dos pares de lados paralelos e iguales.',
    'Cortando un triángulo de un extremo y pegándolo al otro obtenemos un rectángulo.',
    'El rectángulo resultante tiene la misma base y altura: A = b · h.',
    'La altura h es perpendicular a la base, independiente del ángulo de inclinación.',
    'Con el ángulo θ entre lados: A = a · b · sin(θ).',
  ] : [
    'A parallelogram has two pairs of equal parallel sides.',
    'Cutting a triangle from one end and attaching it to the other gives a rectangle.',
    'The resulting rectangle has the same base and height: A = b · h.',
    'The height h is always perpendicular to the base, regardless of slant.',
    'With angle θ between sides: A = a · b · sin(θ).',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <InfoPanel rows={[
                { label: lang === 'es' ? 'Base (b)' : 'Base (b)', value: `${base.toFixed(2)} u` },
                { label: lang === 'es' ? 'Lado (a)' : 'Side (a)', value: `${side.toFixed(2)} u` },
                { label: 'A = |b⃗ × s⃗|', value: `${area.toFixed(3)} u²`, highlight: true },
              ]}/>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'Arrastra B (base) y T (lado)' : 'Drag B (base) and T (side)'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = null; }}>
                  <polygon points={pts} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  {/* height dashed line */}
                  {(() => {
                    const len2 = bx*bx + by*by;
                    if (len2 < 1) return null;
                    const t2 = (tx*bx + ty*by) / len2;
                    const fx = O.x + t2*bx; const fy = O.y + t2*by;
                    return <line x1={T.x} y1={T.y} x2={fx} y2={fy} stroke="var(--fg-3)" strokeWidth={1} strokeDasharray="5,4"/>;
                  })()}
                  <circle cx={O.x} cy={O.y} r={4} fill="var(--fg-3)"/>
                  <text x={O.x-10} y={O.y+4} fontSize={12} fill="var(--fg-3)" fontFamily="var(--font-math)">O</text>
                  <Handle cx={B.x} cy={B.y} label="B" color="var(--accent)" onPointerDown={onPD('B')}/>
                  <Handle cx={T.x} cy={T.y} label="T" color="#22b966"       onPointerDown={onPD('T')}/>
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Área del Paralelogramo' : 'Parallelogram Area'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'El área de un paralelogramo es base por altura (perpendicular a la base).' : 'The area of a parallelogram is base times height (perpendicular to the base).'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Fórmula principal' : 'Main formula'}>
                <div>A = b · h</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>h ⊥ b</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Con ángulo' : 'With angle'}>
                <div>A = a · b · sin(θ)</div>
              </FormulaCard>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Parallelogram area\nfunction parallelogramArea(base, height) { return base * height; }\nfunction parallelogramAreaAngle(a, b, angleDeg) {\n  return a * b * Math.sin(angleDeg * Math.PI / 180);\n}\n\n// SVG parallelogram (origin + 2 edge vectors)\nfunction svgParallelogram(ox,oy, bx,by, tx,ty) {\n  const pts = [\n    `${ox},${oy}`,\n    `${ox+bx},${oy+by}`,\n    `${ox+bx+tx},${oy+by+ty}`,\n    `${ox+tx},${oy+ty}`,\n  ].join(' ');\n  return `<polygon points=\"${pts}\" fill=\"none\" stroke=\"currentColor\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 03 — RECTÁNGULO
// ════════════════════════════════════════════════════════
export const RectangleAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [TL, setTL] = useState({ x: 80,  y: 80  });
  const [BR, setBR] = useState({ x: 300, y: 200 });
  const drag = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const w = Math.abs(BR.x - TL.x) / STEP;
  const h = Math.abs(BR.y - TL.y) / STEP;
  const area = w * h;
  const diagonal = Math.hypot(w, h);

  const onPD = (which: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = which;
  };
  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    if (drag.current === 'TL') setTL(p);
    if (drag.current === 'BR') setBR(p);
    if (drag.current === 'TR') { setBR(prev => ({ x: p.x, y: prev.y })); setTL(prev => ({ x: prev.x, y: p.y })); }
    if (drag.current === 'BL') { setTL(prev => ({ x: p.x, y: prev.y })); setBR(prev => ({ x: prev.x, y: p.y })); }
  };

  const x0 = Math.min(TL.x, BR.x); const y0 = Math.min(TL.y, BR.y);
  const rw = Math.abs(BR.x - TL.x); const rh = Math.abs(BR.y - TL.y);

  const steps = lang === 'es' ? [
    'El rectángulo tiene cuatro ángulos rectos y lados opuestos iguales y paralelos.',
    'El área es el número de cuadrados unidad que caben dentro: A = w × h.',
    'El perímetro es la suma de todos los lados: P = 2(w + h).',
    'La diagonal se calcula con Pitágoras: d = √(w² + h²).',
    'Un cuadrado es un rectángulo con w = h → A = a².',
  ] : [
    'A rectangle has four right angles and equal opposite parallel sides.',
    'The area is the count of unit squares inside: A = w × h.',
    'The perimeter: P = 2(w + h).',
    'Diagonal by Pythagoras: d = √(w² + h²).',
    'A square is a rectangle with w = h → A = a².',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <InfoPanel rows={[
                { label: lang === 'es' ? 'Ancho (w)' : 'Width (w)', value: `${w.toFixed(1)} u` },
                { label: lang === 'es' ? 'Alto (h)' : 'Height (h)', value: `${h.toFixed(1)} u` },
                { label: lang === 'es' ? 'Diagonal' : 'Diagonal', value: `${diagonal.toFixed(2)} u` },
                { label: 'A = w · h', value: `${area.toFixed(2)} u²`, highlight: true },
              ]}/>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'Arrastra cualquier esquina' : 'Drag any corner'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = null; }}>
                  <rect x={x0} y={y0} width={rw} height={rh} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  <line x1={x0} y1={y0} x2={x0+rw} y2={y0+rh} stroke="var(--fg-3)" strokeWidth={1} strokeDasharray="5,4"/>
                  {/* 4 corners */}
                  <Handle cx={TL.x} cy={TL.y} label="↖" color="var(--accent)" onPointerDown={onPD('TL')}/>
                  <Handle cx={BR.x} cy={BR.y} label="↘" color="var(--accent)" onPointerDown={onPD('BR')}/>
                  <Handle cx={BR.x} cy={TL.y} label="↗" color="#22b966"       onPointerDown={onPD('TR')}/>
                  <Handle cx={TL.x} cy={BR.y} label="↙" color="#22b966"       onPointerDown={onPD('BL')}/>
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Área del Rectángulo' : 'Rectangle Area'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'El rectángulo es la figura base para derivar el área de todas las demás.' : 'The rectangle is the reference shape for deriving the area of all other figures.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Rectángulo' : 'Rectangle'}>
                <div>A = w · h</div><div>P = 2(w + h)</div><div>d = √(w² + h²)</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Cuadrado' : 'Square'}>
                <div>A = a²</div><div>P = 4a</div><div>d = a√2</div>
              </FormulaCard>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Rectangle\nfunction rectArea(w, h) { return w * h; }\nfunction rectPerimeter(w, h) { return 2 * (w + h); }\nfunction rectDiagonal(w, h) { return Math.hypot(w, h); }\n\n// SVG rectangle from two corners\nfunction svgRect(x1,y1, x2,y2) {\n  const x = Math.min(x1,x2), y = Math.min(y1,y2);\n  const w = Math.abs(x2-x1), h = Math.abs(y2-y1);\n  return `<rect x=\"${x}\" y=\"${y}\" width=\"${w}\" height=\"${h}\"\n    fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 04 — TRAPECIO
// ════════════════════════════════════════════════════════
export const TrapezeAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  // Bottom edge: P1 (BL), P2 (BR) — share y
  // Top edge:   P3 (TL), P4 (TR) — share y
  const [P1, setP1] = useState({ x: 60,  y: 220 });
  const [P2, setP2] = useState({ x: 320, y: 220 });
  const [P3, setP3] = useState({ x: 100, y: 100 });
  const [P4, setP4] = useState({ x: 280, y: 100 });
  const drag = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const b = Math.abs(P2.x - P1.x) / STEP;
  const a = Math.abs(P4.x - P3.x) / STEP;
  const h = Math.abs(P1.y - P3.y) / STEP;
  const area = 0.5 * (a + b) * h;

  const onPD = (which: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = which;
  };
  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    if (drag.current === 'P1') { setP1({ x: p.x, y: p.y }); setP2(prev => ({ ...prev, y: p.y })); }
    if (drag.current === 'P2') setP2({ x: p.x, y: P1.y });
    if (drag.current === 'P3') { setP3({ x: p.x, y: p.y }); setP4(prev => ({ ...prev, y: p.y })); }
    if (drag.current === 'P4') setP4({ x: p.x, y: P3.y });
  };

  const pts = `${P1.x},${P1.y} ${P2.x},${P2.y} ${P4.x},${P4.y} ${P3.x},${P3.y}`;

  const steps = lang === 'es' ? [
    'El trapecio tiene exactamente un par de lados paralelos: bases a (menor) y b (mayor).',
    'Se puede convertir en un rectángulo con base promedio: (a + b) / 2.',
    'A = ½ · (a + b) · h.',
    'Equivalente: A = media_bases × altura.',
    'Si a = b se convierte en paralelogramo.',
  ] : [
    'A trapezoid has exactly one pair of parallel sides: bases a (shorter) and b (longer).',
    'It reshapes into a rectangle with average base: (a + b) / 2.',
    'A = ½ · (a + b) · h.',
    'Equivalent: A = average_bases × height.',
    'If a = b it becomes a parallelogram.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <InfoPanel rows={[
                { label: lang === 'es' ? 'Base mayor (b)' : 'Longer base (b)', value: `${b.toFixed(1)} u` },
                { label: lang === 'es' ? 'Base menor (a)' : 'Shorter base (a)', value: `${a.toFixed(1)} u` },
                { label: lang === 'es' ? 'Altura (h)' : 'Height (h)', value: `${h.toFixed(1)} u` },
                { label: 'A = ½(a+b)·h', value: `${area.toFixed(2)} u²`, highlight: true },
              ]}/>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'P1/P2: base inferior · P3/P4: base superior' : 'P1/P2: lower base · P3/P4: upper base'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = null; }}>
                  <polygon points={pts} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  <line x1={(P1.x+P2.x)/2} y1={P1.y} x2={(P3.x+P4.x)/2} y2={P3.y}
                    stroke="var(--fg-3)" strokeWidth={1} strokeDasharray="5,4"/>
                  <Handle cx={P1.x} cy={P1.y} label="P1" color="var(--accent)" onPointerDown={onPD('P1')}/>
                  <Handle cx={P2.x} cy={P2.y} label="P2" color="var(--accent)" onPointerDown={onPD('P2')}/>
                  <Handle cx={P3.x} cy={P3.y} label="P3" color="#22b966"       onPointerDown={onPD('P3')}/>
                  <Handle cx={P4.x} cy={P4.y} label="P4" color="#22b966"       onPointerDown={onPD('P4')}/>
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Área del Trapecio' : 'Trapezoid Area'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'El trapecio tiene dos bases paralelas de longitudes diferentes. Su área es la media de las bases multiplicada por la altura.' : 'A trapezoid has two parallel bases of different lengths. Its area is the average of the bases times the height.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Fórmula' : 'Formula'}>
                <div>A = ½ · (a + b) · h</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Interpretación' : 'Interpretation'}>
                <div>A = media_bases × h</div>
              </FormulaCard>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Trapezoid area\nfunction trapezoidArea(a, b, h) {\n  return 0.5 * (a + b) * h;\n}\n\n// SVG isosceles trapezoid (centered)\nfunction svgTrapezoid(cx, yBase, a, b, h) {\n  const pts = [\n    `${cx-b/2},${yBase}`, `${cx+b/2},${yBase}`,\n    `${cx+a/2},${yBase-h}`, `${cx-a/2},${yBase-h}`,\n  ].join(' ');\n  return `<polygon points=\"${pts}\" fill=\"none\" stroke=\"currentColor\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 05 — CÍRCULO
// ════════════════════════════════════════════════════════
export const CircleAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const CENTER = { x: 190, y: 140 };
  const [P, setP] = useState({ x: 310, y: 140 });  // point on circle
  const drag = useRef<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const rPx = Math.hypot(P.x - CENTER.x, P.y - CENTER.y);
  const r = rPx / STEP;
  const area = Math.PI * r * r;
  const circ = 2 * Math.PI * r;

  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    // keep point on circle edge — snap radius
    const angle = Math.atan2(p.y - CENTER.y, p.x - CENTER.x);
    const rSnap = snapG(Math.hypot(p.x - CENTER.x, p.y - CENTER.y));
    setP({ x: CENTER.x + rSnap * Math.cos(angle), y: CENTER.y + rSnap * Math.sin(angle) });
  };

  const steps = lang === 'es' ? [
    'Dividimos el círculo en infinitos sectores delgados y los reordenamos.',
    'Los sectores forman un rectángulo con base ≈ circunferencia/2 = πr y altura ≈ r.',
    'A = (πr) · r = π · r².',
    'La circunferencia: C = 2πr.',
    'También: A = π·d²/4 donde d es el diámetro.',
  ] : [
    'Split the circle into infinitely thin sectors and rearrange them.',
    'The sectors form a rectangle with base ≈ circumference/2 = πr and height ≈ r.',
    'A = (πr) · r = π · r².',
    'Circumference: C = 2πr.',
    'Also: A = π·d²/4 where d is the diameter.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <InfoPanel rows={[
                { label: lang === 'es' ? 'Radio (r)' : 'Radius (r)', value: `${r.toFixed(2)} u` },
                { label: lang === 'es' ? 'Diámetro' : 'Diameter', value: `${(2*r).toFixed(2)} u` },
                { label: lang === 'es' ? 'Circunferencia' : 'Circumference', value: `${circ.toFixed(3)} u` },
                { label: 'A = π · r²', value: `${area.toFixed(3)} u²`, highlight: true },
              ]}/>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'Arrastra P para cambiar el radio' : 'Drag P to change the radius'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = false; }}>
                  <circle cx={CENTER.x} cy={CENTER.y} r={rPx} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  <line x1={CENTER.x} y1={CENTER.y} x2={P.x} y2={P.y} stroke="var(--fg-1)" strokeWidth={1.5}/>
                  <circle cx={CENTER.x} cy={CENTER.y} r={4} fill="var(--fg-3)"/>
                  <text x={CENTER.x} y={CENTER.y+16} textAnchor="middle" fontSize={11} fill="var(--fg-3)" fontFamily="var(--font-math)">O</text>
                  <Handle cx={P.x} cy={P.y} label="P" color="var(--accent)"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      (e.target as Element).setPointerCapture(e.pointerId);
                      drag.current = true;
                    }}/>
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Área del Círculo' : 'Circle Area'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'El área del círculo es π veces el cuadrado del radio.' : 'The circle area is π times the radius squared.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Área' : 'Area'}>
                <div>A = π · r²</div><div>A = π · d² / 4</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Circunferencia' : 'Circumference'}>
                <div>C = 2π · r</div><div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>π ≈ 3.14159…</div>
              </FormulaCard>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Circle\nfunction circleArea(r) { return Math.PI * r * r; }\nfunction circumference(r) { return 2 * Math.PI * r; }\n\n// SVG circle\nfunction svgCircle(cx, cy, r) {\n  return `<circle cx=\"${cx}\" cy=\"${cy}\" r=\"${r}\"\n    fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 06 — ELIPSE
// ════════════════════════════════════════════════════════
export const EllipseAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const CENTER = { x: 190, y: 140 };
  const [PA, setPA] = useState({ x: 330, y: 140 });  // semi-major (x axis)
  const [PB, setPB] = useState({ x: 190, y: 60  });  // semi-minor (y axis)
  const drag = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const aPx = Math.abs(PA.x - CENTER.x);
  const bPx = Math.abs(PB.y - CENTER.y);
  const a = aPx / STEP; const b = bPx / STEP;
  const area = Math.PI * a * b;
  const hH = ((a - b) / (a + b)) ** 2;
  const perim = Math.PI * (a + b) * (1 + 3*hH / (10 + Math.sqrt(4 - 3*hH)));

  const onPD = (which: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = which;
  };
  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    if (drag.current === 'A') setPA({ x: clamp(p.x, CENTER.x + STEP, CVW - STEP), y: CENTER.y });
    if (drag.current === 'B') setPB({ x: CENTER.x, y: clamp(p.y, STEP, CENTER.y - STEP) });
  };

  const steps = lang === 'es' ? [
    'La elipse es una circunferencia escalada: escalar x por a e y por b transforma el círculo unitario.',
    'El escalado multiplica el área por a·b: A = π·a·b.',
    'a = semieje mayor, b = semieje menor.',
    'Si a = b se convierte en un círculo de radio a.',
    'El perímetro no tiene fórmula exacta — Ramanujan lo aproxima.',
  ] : [
    'An ellipse is a scaled circle: scaling x by a and y by b transforms the unit circle.',
    'Scaling multiplies area by a·b: A = π·a·b.',
    'a = semi-major axis, b = semi-minor axis.',
    'When a = b it becomes a circle of radius a.',
    "The perimeter has no exact formula — Ramanujan's approximation is standard.",
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <InfoPanel rows={[
                { label: lang === 'es' ? 'Semieje mayor (a)' : 'Semi-major (a)', value: `${a.toFixed(1)} u` },
                { label: lang === 'es' ? 'Semieje menor (b)' : 'Semi-minor (b)', value: `${b.toFixed(1)} u` },
                { label: lang === 'es' ? 'Perímetro (≈)' : 'Perimeter (≈)', value: `${perim.toFixed(2)} u` },
                { label: 'A = π · a · b', value: `${area.toFixed(3)} u²`, highlight: true },
              ]}/>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'A: semieje horizontal · B: semieje vertical' : 'A: horizontal semi-axis · B: vertical semi-axis'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = null; }}>
                  <ellipse cx={CENTER.x} cy={CENTER.y} rx={aPx} ry={bPx}
                    fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  <line x1={CENTER.x} y1={CENTER.y} x2={PA.x} y2={CENTER.y} stroke="var(--fg-1)" strokeWidth={1.5}/>
                  <line x1={CENTER.x} y1={CENTER.y} x2={CENTER.x} y2={PB.y} stroke="var(--fg-3)" strokeWidth={1.5} strokeDasharray="4,3"/>
                  <circle cx={CENTER.x} cy={CENTER.y} r={4} fill="var(--fg-3)"/>
                  <Handle cx={PA.x} cy={CENTER.y} label="A" color="var(--accent)" onPointerDown={onPD('A')}/>
                  <Handle cx={CENTER.x} cy={PB.y}  label="B" color="#22b966"      onPointerDown={onPD('B')}/>
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Área de la Elipse' : 'Ellipse Area'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'La elipse extiende la fórmula del círculo usando dos semiejes.' : 'The ellipse extends the circle formula using two semi-axes.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Área' : 'Area'}>
                <div>A = π · a · b</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Perímetro (Ramanujan)' : 'Perimeter (Ramanujan)'}>
                <div style={{ fontSize: 12 }}>h = ((a−b)/(a+b))²</div>
                <div style={{ fontSize: 12 }}>P ≈ π(a+b)(1+3h/(10+√(4−3h)))</div>
              </FormulaCard>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Ellipse\nfunction ellipseArea(a, b) { return Math.PI * a * b; }\nfunction ellipsePerimeter(a, b) {\n  const h = ((a-b)/(a+b))**2;\n  return Math.PI*(a+b)*(1+3*h/(10+Math.sqrt(4-3*h)));\n}\n\n// SVG ellipse\nfunction svgEllipse(cx, cy, rx, ry) {\n  return `<ellipse cx=\"${cx}\" cy=\"${cy}\" rx=\"${rx}\" ry=\"${ry}\"\n    fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 07 — POLÍGONO REGULAR
// ════════════════════════════════════════════════════════
export const RegularPolygonAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [n, setN] = useState(6);
  const CENTER = { x: 190, y: 140 };
  const [V, setV] = useState({ x: 310, y: 140 });  // one vertex
  const drag = useRef<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const rPx = Math.hypot(V.x - CENTER.x, V.y - CENTER.y);
  const R = rPx / STEP;
  const area = 0.5 * n * R * R * Math.sin(2 * Math.PI / n);
  const side = 2 * R * Math.sin(Math.PI / n);
  const apothem = R * Math.cos(Math.PI / n);

  const angle0 = Math.atan2(V.y - CENTER.y, V.x - CENTER.x);
  const vertices = Array.from({ length: n }, (_, i) => {
    const a = angle0 + (2 * Math.PI * i / n);
    return { x: CENTER.x + rPx * Math.cos(a), y: CENTER.y + rPx * Math.sin(a) };
  });
  const pts = vertices.map(v => `${v.x},${v.y}`).join(' ');

  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    const angle = Math.atan2(p.y - CENTER.y, p.x - CENTER.x);
    const rSnap = snapG(Math.max(STEP, Math.hypot(p.x - CENTER.x, p.y - CENTER.y)));
    setV({ x: CENTER.x + rSnap * Math.cos(angle), y: CENTER.y + rSnap * Math.sin(angle) });
  };

  const steps = lang === 'es' ? [
    'Un polígono regular de n lados se divide en n triángulos isósceles con vértice en el centro.',
    'Cada triángulo tiene base = lado y altura = apotema.',
    'A_triángulo = ½ · lado · apotema. Total: A = n · ½ · s · a = ½ · P · a.',
    'La apotema: a = R · cos(π/n). El lado: s = 2R · sin(π/n).',
    'Sustituyendo: A = ½ · n · R² · sin(2π/n).',
  ] : [
    'A regular n-gon splits into n isosceles triangles with vertex at the center.',
    'Each triangle has base = side and height = apothem.',
    'A_triangle = ½ · side · apothem. Total: A = n · ½ · s · a = ½ · P · a.',
    'Apothem: a = R · cos(π/n). Side: s = 2R · sin(π/n).',
    'Substituting: A = ½ · n · R² · sin(2π/n).',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6 }}>{lang === 'es' ? 'Lados (n)' : 'Sides (n)'}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {[3,4,5,6,7,8,10,12].map(v => (
                      <button key={v} onClick={() => setN(v)} style={{
                        padding: '3px 10px', borderRadius: 'var(--r-xs)',
                        background: n === v ? 'var(--accent)' : 'var(--surface)',
                        color: n === v ? 'var(--on-accent)' : 'var(--fg-2)',
                        border: '1px solid var(--hairline)', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                      }}>{v}</button>
                    ))}
                  </div>
                </div>
                <InfoPanel rows={[
                  { label: lang === 'es' ? 'Circunradio (R)' : 'Circumradius (R)', value: `${R.toFixed(2)} u` },
                  { label: lang === 'es' ? 'Lado (s)' : 'Side (s)', value: `${side.toFixed(2)} u` },
                  { label: lang === 'es' ? 'Apotema' : 'Apothem', value: `${apothem.toFixed(2)} u` },
                  { label: 'A = ½·n·R²·sin(2π/n)', value: `${area.toFixed(3)} u²`, highlight: true },
                ]}/>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'Arrastra V para cambiar el tamaño' : 'Drag V to change size'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = false; }}>
                  <polygon points={pts} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  {/* apothem line to first side midpoint */}
                  <line x1={CENTER.x} y1={CENTER.y}
                    x2={(vertices[0].x+vertices[1].x)/2} y2={(vertices[0].y+vertices[1].y)/2}
                    stroke="var(--fg-3)" strokeWidth={1} strokeDasharray="4,3"/>
                  <circle cx={CENTER.x} cy={CENTER.y} r={4} fill="var(--fg-3)"/>
                  <Handle cx={V.x} cy={V.y} label="V" color="var(--accent)"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      (e.target as Element).setPointerCapture(e.pointerId);
                      drag.current = true;
                    }}/>
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Área del Polígono Regular' : 'Regular Polygon Area'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'Un polígono regular tiene todos sus lados y ángulos iguales. Se divide en n triángulos para calcular el área.' : 'A regular n-gon has equal sides and angles. Split into n triangles to compute area.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Por lado (s)' : 'By side (s)'}>
                <div>A = n·s² / (4·tan(π/n))</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Por circumradio (R)' : 'By circumradius (R)'}>
                <div>A = ½·n·R²·sin(2π/n)</div>
              </FormulaCard>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Regular polygon\nfunction regularPolygonArea(n, R) {\n  return 0.5 * n * R * R * Math.sin(2 * Math.PI / n);\n}\n\n// SVG regular polygon\nfunction svgRegularPolygon(cx, cy, R, n, startAngle = -Math.PI/2) {\n  const pts = Array.from({ length: n }, (_, i) => {\n    const a = startAngle + (2 * Math.PI * i / n);\n    return `${cx+R*Math.cos(a)},${cy+R*Math.sin(a)}`;\n  }).join(' ');\n  return `<polygon points=\"${pts}\" fill=\"none\" stroke=\"currentColor\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 08 — POLÍGONO (Shoelace) — vértices arrastrables
// ════════════════════════════════════════════════════════
function shoelaceArea(pts: { x: number; y: number }[]): number {
  const n = pts.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const { x: x1, y: y1 } = pts[i];
    const { x: x2, y: y2 } = pts[(i + 1) % n];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

const POLYGON_COLORS = ['var(--accent)', '#22b966', '#e05050', '#f5a623', '#9b59b6', '#1abc9c', '#e67e22', '#3498db'];

export const PolygonAreaItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [pts, setPts] = useState([
    { x: 190, y: 60 }, { x: 300, y: 120 }, { x: 280, y: 220 },
    { x: 190, y: 240 }, { x: 100, y: 220 }, { x: 80,  y: 120 },
  ]);
  const drag = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const areaPx2 = shoelaceArea(pts);
  const area = areaPx2 / (STEP * STEP);

  const onPD = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = i;
  };
  const onPM = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current === null || !svgRef.current) return;
    const p = svgPt(e, svgRef.current);
    setPts(prev => prev.map((v, i) => i === drag.current ? p : v));
  };

  const steps = lang === 'es' ? [
    'La fórmula del cordón (Shoelace) calcula el área de cualquier polígono simple.',
    'Se suman los productos cruzados de coordenadas consecutivas: Σ(xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ).',
    'El área es la mitad del valor absoluto de esa suma.',
    'El orden de los vértices (horario/antihorario) afecta el signo pero no el módulo.',
    'Funciona para cualquier polígono simple (sin auto-intersecciones).',
  ] : [
    'The Shoelace formula computes the area of any simple polygon.',
    'Sum the cross products of consecutive coordinates: Σ(xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ).',
    'The area is half the absolute value of that sum.',
    'Vertex order (CW/CCW) affects the sign but not the magnitude.',
    'Works for any simple polygon (no self-intersections).',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoPanel rows={[
                  { label: lang === 'es' ? 'Vértices (n)' : 'Vertices (n)', value: `${pts.length}` },
                  { label: 'A = ½|Σ xᵢyᵢ₊₁−xᵢ₊₁yᵢ|', value: `${area.toFixed(2)} u²`, highlight: true },
                ]}/>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => {
                    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
                    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
                    const a = 2 * Math.PI * pts.length / (pts.length + 1);
                    const r = 80;
                    setPts(prev => [...prev, { x: snapG(cx + r * Math.cos(a)), y: snapG(cy + r * Math.sin(a)) }]);
                  }} style={{
                    flex: 1, padding: '8px 0', borderRadius: 'var(--r-sm)',
                    background: 'var(--accent)', color: 'white', border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}>+ {lang === 'es' ? 'Vértice' : 'Vertex'}</button>
                  {pts.length > 3 && (
                    <button onClick={() => setPts(prev => prev.slice(0, -1))} style={{
                      flex: 1, padding: '8px 0', borderRadius: 'var(--r-sm)',
                      background: 'var(--surface-2)', color: 'var(--fg-2)', border: '1px solid var(--hairline)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    }}>− {lang === 'es' ? 'Vértice' : 'Vertex'}</button>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                  {lang === 'es' ? 'Arrastra cualquier vértice · añade/quita con los botones' : 'Drag any vertex · add/remove with buttons'}
                </div>
                <SvgCanvas svgRef={svgRef} onPointerMove={onPM} onPointerUp={() => { drag.current = null; }}>
                  <polygon
                    points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2}/>
                  {pts.map((p, i) => (
                    <Handle key={i} cx={p.x} cy={p.y}
                      label={String.fromCharCode(65 + i)}
                      color={POLYGON_COLORS[i % POLYGON_COLORS.length]}
                      onPointerDown={onPD(i)}/>
                  ))}
                </SvgCanvas>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{lang === 'es' ? 'Fórmula del Cordón (Shoelace)' : 'Shoelace Formula'}</h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es' ? 'Calcula el área de cualquier polígono simple con solo sus coordenadas, en O(n).' : 'Computes area of any simple polygon from coordinates alone, in O(n).'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormulaCard title={lang === 'es' ? 'Fórmula' : 'Formula'}>
                <div style={{ fontSize: 13 }}>A = ½|Σᵢ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)|</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>{lang === 'es' ? 'Índices cíclicos: xₙ = x₀' : 'Cyclic indices: xₙ = x₀'}</div>
              </FormulaCard>
              <FormulaCard title={lang === 'es' ? 'Complejidad' : 'Complexity'}>
                <div>O(n)</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>{lang === 'es' ? 'Solo n multiplicaciones.' : 'Only n multiplications.'}</div>
              </FormulaCard>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Shoelace formula\nfunction polygonArea(points) {\n  const n = points.length;\n  let sum = 0;\n  for (let i = 0; i < n; i++) {\n    const [x1,y1] = points[i];\n    const [x2,y2] = points[(i+1) % n];\n    sum += x1*y2 - x2*y1;\n  }\n  return Math.abs(sum) / 2;\n}\n\n// SVG polygon from points array\nfunction svgPolygon(points) {\n  const pts = points.map(([x,y]) => `${x},${y}`).join(' ');\n  return `<polygon points=\"${pts}\" fill=\"none\" stroke=\"currentColor\"/>`;\n}"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};
