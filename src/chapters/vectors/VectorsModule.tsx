// VectorsModule.tsx — Vectors chapter: item list + interactive figure + tabs + derivation

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { VECTOR_ITEMS, STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import { CartesianItem } from './CartesianItem';
import { PolarItem } from './PolarItem';
import { ScalarItem } from './ScalarItem';
import { DotItem } from './DotItem';
import { CrossItem } from './CrossItem';
import { MidpointItem } from './MidpointItem';
import { BarycenterItem } from './BarycenterItem';
import { LinearSystemItem } from './LinearSystemItem';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

interface Vec2 { x: number; y: number; }

export const VectorsModule = ({ lang, setRoute }: Props) => {
  const C = STRINGS[lang].chapter;

  const [item, setItem] = useState('sum');
  const [tab, setTab]   = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [u, setU] = useState<Vec2>({ x: 140, y: -100 });
  const [v, setV] = useState<Vec2>({ x: 140, y: 60 });

  const w: Vec2 = { x: u.x + v.x, y: u.y + v.y };
  const mag = (p: Vec2) => Math.hypot(p.x, p.y).toFixed(2);

  const crumbBtn: React.CSSProperties = {
    background: 'transparent', border: 'none', padding: 0,
    color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)',
  };
  const stepBtn: React.CSSProperties = {
    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-xs)', padding: 4, cursor: 'pointer',
    color: 'var(--fg-2)', display: 'inline-flex',
  };

  const labels = {
    es: ['Sistema cartesiano','Sistema polar','Producto por escalar','Suma de vectores','Producto escalar','Producto vectorial','Punto medio','Baricentro','Sistema lineal'],
    en: ['Cartesian system','Polar system','Multiply by scalar','Sum of vectors','Dot product','Cross product','Midpoint','Barycenter','Solve linear system'],
  };

  return (
    <div style={{ padding: '24px 32px 64px', maxWidth: 1240, margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-3)', marginBottom: 14 }}>
        <button onClick={() => setRoute({ view: 'landing' })} style={crumbBtn}>
          {STRINGS[lang].nav.library}
        </button>
        <Icon name="ChevronRight" size={12} />
        <span style={{ color: 'var(--fg-1)', fontWeight: 600 }}>
          {STRINGS[lang].chapters.vectors.title}
        </span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '-0.02em' }}>
            {STRINGS[lang].chapters.vectors.title}
          </h1>
          <p style={{ color: 'var(--fg-3)', fontSize: 15, marginTop: 6 }}>
            {STRINGS[lang].chapters.vectors.blurb}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={ghostBtn}><Icon name="Share" size={14}/> {C.share}</button>
          <button style={ghostBtn}><Icon name="Copy" size={14}/> {C.copy}</button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: 20, alignItems: 'start' }}>

        {/* Item list — always visible */}
        <nav style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 6, position: 'sticky', top: 76,
        }}>
          {VECTOR_ITEMS.map((it, i) => {
            const active = item === it.id;
            return (
              <button key={it.id} onClick={() => setItem(it.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '8px 10px', borderRadius: 'var(--r-sm)',
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  border: 'none', color: active ? 'var(--fg-1)' : 'var(--fg-2)',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: active ? 600 : 500,
                  cursor: 'pointer', textAlign: 'left',
                }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)', width: 22 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {labels[lang][i]}
              </button>
            );
          })}
        </nav>

        {/* ── Sistema cartesiano: ocupa las 2 columnas restantes ── */}
        {item === 'cartesian' && (
          <div style={{ gridColumn: 'span 2' }}>
            <CartesianItem lang={lang} setRoute={setRoute} />
          </div>
        )}

        {/* ── Sistema polar: igual que cartesiano ── */}
        {item === 'polar' && (
          <div style={{ gridColumn: 'span 2' }}>
            <PolarItem lang={lang} />
          </div>
        )}

        {/* ── Producto por escalar ── */}
        {item === 'scalar' && (
          <div style={{ gridColumn: 'span 2' }}>
            <ScalarItem lang={lang} />
          </div>
        )}

        {/* ── Producto escalar (dot) ── */}
        {item === 'dot' && (
          <div style={{ gridColumn: 'span 2' }}>
            <DotItem lang={lang} />
          </div>
        )}

        {/* ── Producto vectorial (cross) ── */}
        {item === 'cross' && (
          <div style={{ gridColumn: 'span 2' }}>
            <CrossItem lang={lang} />
          </div>
        )}

        {/* ── Punto medio ── */}
        {item === 'midpoint' && (
          <div style={{ gridColumn: 'span 2' }}>
            <MidpointItem lang={lang} />
          </div>
        )}

        {/* ── Baricentro ── */}
        {item === 'barycenter' && (
          <div style={{ gridColumn: 'span 2' }}>
            <BarycenterItem lang={lang} />
          </div>
        )}

        {/* ── Sistema lineal — último ítem del capítulo ── */}
        {item === 'system' && (
          <div style={{ gridColumn: 'span 2' }}>
            <LinearSystemItem lang={lang} />
          </div>
        )}

        {/* ── Centro + Inspector: suma de vectores (único ítem restante con layout genérico) ── */}
        {item === 'sum' && (
        <>{/* Center column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Tabs */}
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            background: 'var(--surface)', border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-sm)', padding: 3, gap: 2,
          }}>
            {([
              { id: 'formula', label: C.tabFormula },
              { id: 'explore', label: C.tabExplore },
              { id: 'svg',     label: C.tabSvg },
            ] as const).map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                style={{
                  padding: '7px 14px', borderRadius: 'var(--r-xs)',
                  background: tab === tb.id ? 'var(--surface-3)' : 'transparent',
                  color: tab === tb.id ? 'var(--fg-1)' : 'var(--fg-3)',
                  border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}>
                {tb.label}
              </button>
            ))}
          </div>

          {/* Figure */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden',
          }}>
            {tab === 'explore' && <DragFigure u={u} v={v} setU={setU} setV={setV} />}
            {tab === 'formula' && <FormulaPane lang={lang} />}
            {tab === 'svg'     && <SvgPane />}
          </div>

          {/* Derivation */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-md)', padding: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>{C.derivation}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-3)', fontSize: 12 }}>
                <button onClick={() => setStep(Math.max(0, step - 1))} style={stepBtn}><Icon name="ChevronLeft" size={14}/></button>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {C.step} {step + 1} {C.of} {C.derivationSteps.length}
                </span>
                <button onClick={() => setStep(Math.min(C.derivationSteps.length - 1, step + 1))} style={stepBtn}><Icon name="ChevronRight" size={14}/></button>
              </div>
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {C.derivationSteps.map((s, i) => (
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
                  <span dangerouslySetInnerHTML={{ __html: s.replace(/\b([uvw])\b/g, '<i class="math">$1</i>') }} />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Inspector */}
        <aside style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18, position: 'sticky', top: 76,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 4 }}>
            {C.inspector}
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--fg-3)', marginBottom: 14, lineHeight: 1.5 }}>
            {C.inspectorHint}
          </p>
          <ReadoutRow color="var(--accent)"  name="u"           point={u} mag={mag(u)} />
          <ReadoutRow color="var(--formula)" name="v"           point={v} mag={mag(v)} />
          <div style={{ height: 1, background: 'var(--hairline)', margin: '12px 0' }} />
          <ReadoutRow color="var(--handle)"  name="w" subscript="= u + v" point={w} mag={mag(w)} />
          <button
            onClick={() => { setU({ x: 140, y: -100 }); setV({ x: 140, y: 60 }); }}
            style={{ ...ghostBtn, width: '100%', marginTop: 14, justifyContent: 'center' }}>
            <Icon name="RotateCcw" size={13}/> {C.reset}
          </button>
        </aside>
        </>)}
      </div>
    </div>
  );
};

// ── Readout row ───────────────────────────────────────────────────
const ReadoutRow = ({ color, name, subscript, point, mag }: {
  color: string; name: string; subscript?: string; point: Vec2; mag: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13 }}>
    <span style={{ width: 10, height: 10, borderRadius: 99, background: color, flexShrink: 0 }}/>
    <span style={{ flex: 1 }}>
      <i className="math" style={{ color }}>{name}</i>
      {subscript && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)', marginLeft: 4 }}>{subscript}</span>}
    </span>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>
      ({point.x}, {-point.y})
    </span>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)', marginLeft: 8 }}>
      |{name}|={mag}
    </span>
  </div>
);

// ── Drag figure ───────────────────────────────────────────────────
const DragFigure = ({ u, v, setU, setV }: { u: Vec2; v: Vec2; setU: (p: Vec2) => void; setV: (p: Vec2) => void }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<'u' | 'v' | null>(null);

  const W = 720, H = 460;
  const ox = 200, oy = 240;

  const toSvg = (p: Vec2) => ({ x: ox + p.x, y: oy - p.y });
  const uS = toSvg(u), vS = toSvg(v), wS = toSvg({ x: u.x + v.x, y: u.y + v.y });

  const onPointerDown = (which: 'u' | 'v') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDrag(which);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top)  * (H / r.height);
    const p: Vec2 = { x: Math.round(sx - ox), y: Math.round(oy - sy) };
    if (drag === 'u') setU(p);
    if (drag === 'v') setV(p);
  };

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern id="vgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="vgridBold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#vgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
        {(['U','V','W'] as const).map(n => (
          <marker key={n} id={`arr${n}`} viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
            <path d="M-12 -5 L 0 0 L -12 5 z" fill={n === 'U' ? 'var(--accent)' : n === 'V' ? 'var(--formula)' : 'var(--handle)'}/>
          </marker>
        ))}
      </defs>
      <rect width={W} height={H} fill="url(#vgridBold)"/>
      <line x1={0} y1={oy} x2={W} y2={oy} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={ox} y1={0} x2={ox} y2={H} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={W - 14} y={oy - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={ox + 8}  y={14}     fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      <path d={`M ${ox} ${oy} L ${uS.x} ${uS.y} L ${wS.x} ${wS.y} L ${vS.x} ${vS.y} Z`}
        fill="var(--highlight-soft)" fillOpacity="0.7"
        stroke="var(--fg-4)" strokeDasharray="4 3" strokeWidth="1"/>

      <line x1={ox} y1={oy} x2={uS.x} y2={uS.y} stroke="var(--accent)"  strokeWidth="2.5" markerEnd="url(#arrU)"/>
      <line x1={ox} y1={oy} x2={vS.x} y2={vS.y} stroke="var(--formula)" strokeWidth="2.5" markerEnd="url(#arrV)"/>
      <line x1={ox} y1={oy} x2={wS.x} y2={wS.y} stroke="var(--handle)"  strokeWidth="2.5" markerEnd="url(#arrW)"/>

      <text x={(ox + uS.x)/2 + 6} y={(oy + uS.y)/2 - 8}  fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--accent)">u</text>
      <text x={(ox + vS.x)/2 + 6} y={(oy + vS.y)/2 + 18} fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--formula)">v</text>
      <text x={(ox + wS.x)/2 + 10} y={(oy + wS.y)/2 - 6} fontFamily="var(--font-math)" fontStyle="italic" fontSize="20" fill="var(--handle)">u + v</text>

      <circle cx={ox} cy={oy} r="3.5" fill="var(--fg-1)"/>
      <text x={ox - 12} y={oy + 18} fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">O</text>

      <DragHandle x={uS.x} y={uS.y} color="var(--accent)"  active={drag === 'u'} onPointerDown={onPointerDown('u')}/>
      <DragHandle x={vS.x} y={vS.y} color="var(--formula)" active={drag === 'v'} onPointerDown={onPointerDown('v')}/>
    </svg>
  );
};

const DragHandle = ({ x, y, color, active, onPointerDown }: {
  x: number; y: number; color: string; active: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}) => (
  <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
    <circle cx={x} cy={y} r={active ? 14 : 11} fill={color} fillOpacity="0.18"/>
    <circle cx={x} cy={y} r={active ? 7 : 5} fill={color} stroke="white" strokeWidth="2"/>
  </g>
);

// ── Formula pane ──────────────────────────────────────────────────
const FormulaPane = ({ lang }: { lang: Lang }) => {
  const C = STRINGS[lang].chapter;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{C.formulaTitle}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560 }}>{C.formulaBody}</p>
      <div style={{
        marginTop: 24, padding: 24, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 26,
      }}>
        <i style={{ color: 'var(--accent)' }}>u</i> + <i style={{ color: 'var(--formula)' }}>v</i> = (
        <i>u</i><sub style={{ fontSize: 14 }}>1</sub> + <i>v</i><sub style={{ fontSize: 14 }}>1</sub>,
        &nbsp;<i>u</i><sub style={{ fontSize: 14 }}>2</sub> + <i>v</i><sub style={{ fontSize: 14 }}>2</sub>)
      </div>
    </div>
  );
};

// ── SVG code pane ─────────────────────────────────────────────────
const SvgPane = () => (
  <pre style={{ margin: 0, padding: 24, fontSize: 12.5, lineHeight: 1.55, minHeight: 460, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{`// Sum of vectors — SVG snippet
function sumVectors(u, v) {
  return { x: u.x + v.x, y: u.y + v.y };
}

const w = sumVectors(u, v);
line.setAttribute("x2", origin.x + w.x);
line.setAttribute("y2", origin.y - w.y); // SVG y flipped

// Modern: D3-drag + Motion One
import { drag } from "d3-drag";
import { animate } from "motion";

drag().on("drag", (e) => {
  setU({ x: e.x - origin.x, y: origin.y - e.y });
});

animate(arrowEl, { x2: w.x }, { duration: 0.18, easing: "ease-out" });`}
  </pre>
);
