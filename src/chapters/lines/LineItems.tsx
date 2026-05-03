// LineItems.tsx — Ítems 03–07 del capítulo Rectas
// Todos siguen el mismo patrón: tabs Fórmula / Explorar / SVG
// Exporta: LineOrthogonalItem, MediatrixItem, LineInterItem,
//          LineParamItem, LineDistItem

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
//import { ghostBtn } from '../../components/AppShell';
import type { Lang } from '../../lib/data';

// ── Shared types & helpers ─────────────────────────────────────────
interface Vec2 { x: number; y: number; }
const STEP = 25;

function clipLine(
  u: number, v: number, w: number,
  x0: number, y0: number, x1: number, y1: number
): [Vec2, Vec2] | null {
  const pts: Vec2[] = [];
  const tryAdd = (px: number, py: number) => {
    if (px >= x0 - 0.5 && px <= x1 + 0.5 && py >= y0 - 0.5 && py <= y1 + 0.5)
      if (!pts.some(p => Math.abs(p.x - px) < 1 && Math.abs(p.y - py) < 1))
        pts.push({ x: px, y: py });
  };
  if (Math.abs(v) < 1e-9) {
    if (Math.abs(u) < 1e-9) return null;
    const x = -w / u; tryAdd(x, y0); tryAdd(x, y1);
  } else if (Math.abs(u) < 1e-9) {
    const y = -w / v; tryAdd(x0, y); tryAdd(x1, y);
  } else {
    tryAdd((-v * y0 - w) / u, y0); tryAdd((-v * y1 - w) / u, y1);
    tryAdd(x0, (-u * x0 - w) / v); tryAdd(x1, (-u * x1 - w) / v);
  }
  return pts.length >= 2 ? [pts[0], pts[1]] : null;
}

// Shared derivation step list
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
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 'var(--r-md)', padding: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>
          {lang === 'es' ? 'Derivación' : 'Derivation'}
        </h3>
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
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-4)', fontSize: 12 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{txt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

// Shared SVG canvas skeleton
// const FigureCanvas = ({ children, onMove, onUp, W = 720, H = 420 }: {
//   children: React.ReactNode;
//   onMove: (e: React.PointerEvent<SVGSVGElement>) => void;
//   onUp: () => void;
//   W?: number; H?: number;
// }) => (
//   <svg viewBox={`0 0 ${W} ${H}`}
//     style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
//     onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
//     <defs>
//       <pattern id="shGrid"  width="25" height="25" patternUnits="userSpaceOnUse">
//         <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
//       </pattern>
//       <pattern id="shGridB" width="125" height="125" patternUnits="userSpaceOnUse">
//         <rect width="125" height="125" fill="url(#shGrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
//       </pattern>
//       <marker id="shAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
//         <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/>
//       </marker>
//     </defs>
//     <rect width={W} height={H} fill="url(#shGridB)"/>
//     {/* Axes */}
//     <line x1={8} y1={H/2} x2={W-8} y2={H/2} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#shAxis)"/>
//     <line x1={W/2} y1={H-8} x2={W/2} y2={8} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#shAxis)"/>
//     <text x={W-18} y={H/2-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">x</text>
//     <text x={W/2+8} y={14}   fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>
//     {children}
//   </svg>
// );

const DragHandle = ({ x, y, color, onDown }: {
  x: number; y: number; color: string;
  onDown: (e: React.PointerEvent) => void;
}) => (
  <g style={{ cursor: 'grab' }} onPointerDown={onDown}>
    <circle cx={x} cy={y} r="12" fill={color} fillOpacity="0.12"/>
    <circle cx={x} cy={y} r="6"  fill={color} stroke="white" strokeWidth="2"/>
  </g>
);

const Overlay = ({ children, w = 280, h = 68 }: { children: React.ReactNode; w?: number; h?: number }) => (
  <>
    <rect x="8" y="8" width={w} height={h} rx="5"
      fill="var(--surface)" fillOpacity="0.93" stroke="var(--hairline)" strokeWidth="0.8"/>
    {children}
  </>
);

// Standard tab bar
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

// ════════════════════════════════════════════════════════
// 03 — RECTA ORTOGONAL
// ════════════════════════════════════════════════════════
export const LineOrthogonalItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ x: 180, y: 295 });
  const [b, setB] = useState<Vec2>({ x: 480, y: 125 });
  const [c, setC] = useState<Vec2>({ x: 500, y: 290 });

  const W = 720, H = 420, M = 4, OX = W/2, OY = H/2;
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<'A'|'B'|'C'|null>(null);

  // Direction AB (SVG)
  const Ux = b.x - a.x, Uy = b.y - a.y;
  const u = Uy, v = -Ux;
  const w1 = -(u * a.x + v * a.y);
  // Perpendicular: direction (v, -u) in SVG = (−Ux, −Uy) rotated
  // normal of perp = (u_perp, v_perp) = (−v, u) = (Ux, Uy) ... 
  // Perp through C: direction (v, -u) → normal is (u, v) rotated 90° = (-v, u) wait
  // Simpler: perpendicular has direction (u,v) [which is normal to AB]
  // so its normal is (-v, u) = (Ux, Uy) in SVG (since v=-Ux → -v=Ux)
  const u2 = -v, v2 = u; // = (Ux, Uy)
  const w2 = -(u2 * c.x + v2 * c.y);

  const line1 = clipLine(u, v, w1, M, M, W-M, H-M);
  const line2 = clipLine(u2, v2, w2, M, M, W-M, H-M);

  // Foot of perpendicular from C to AB
  const norm2 = u*u + v*v;
  const foot: Vec2 = norm2 > 0 ? {
    x: c.x - u*(u*c.x + v*c.y + w1)/norm2,
    y: c.y - v*(u*c.x + v*c.y + w1)/norm2,
  } : c;

  const onDown = (which: 'A'|'B'|'C') => (e: React.PointerEvent) => {
    e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(STEP, Math.min(W-STEP, Math.round(((e.clientX-r.left)*(W/r.width))/STEP)*STEP));
    const sy = Math.max(STEP, Math.min(H-STEP, Math.round(((e.clientY-r.top)*(H/r.height))/STEP)*STEP));
    if (drag.current==='A') setA({x:sx,y:sy});
    if (drag.current==='B') setB({x:sx,y:sy});
    if (drag.current==='C') setC({x:sx,y:sy});
  };

  const steps = lang === 'es' ? [
    'La recta (AB) tiene ecuación u·x + v·y + w₁ = 0, con u=Uy, v=−Ux.',
    'Una recta perpendicular a (AB) tiene vector director (u, v) — el vector normal de (AB).',
    'Su ecuación es −v·x + u·y + w₂ = 0, donde los coeficientes son (−v, u).',
    'Como C pertenece a la perpendicular: w₂ = −(−v)·xC − u·yC = v·xC − u·yC.',
    'Si la pendiente de (AB) es a, la perpendicular tiene pendiente −1/a (condición a·a′=−1).',
    'La ecuación de la perpendicular es: Ux·x + Uy·y − Ux·xC − Uy·yC = 0.',
  ] : [
    'Line (AB) has equation u·x + v·y + w₁ = 0, with u=Uy, v=−Ux.',
    'A line perpendicular to (AB) has direction vector (u, v) — the normal of (AB).',
    'Its equation is −v·x + u·y + w₂ = 0, with coefficients (−v, u).',
    'Since C lies on it: w₂ = v·xC − u·yC.',
    'If slope of (AB) is a, perpendicular has slope −1/a (condition a·a′=−1).',
    'Perpendicular equation: Ux·x + Uy·y − Ux·xC − Uy·yC = 0.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
            style={{ width:'100%',height:'auto',display:'block',touchAction:'none',background:'var(--surface)' }}
            onPointerMove={onMove} onPointerUp={()=>{drag.current=null;}} onPointerLeave={()=>{drag.current=null;}}>
            <defs>
              <pattern id="ogrid" width="25" height="25" patternUnits="userSpaceOnUse"><rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/></pattern>
              <pattern id="ogridB" width="125" height="125" patternUnits="userSpaceOnUse"><rect width="125" height="125" fill="url(#ogrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/></pattern>
              <marker id="oAxis" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto"><path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--fg-2)"/></marker>
            </defs>
            <rect width={W} height={H} fill="url(#ogridB)"/>
            <line x1={8} y1={OY} x2={W-8} y2={OY} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#oAxis)"/>
            <line x1={OX} y1={H-8} x2={OX} y2={8} stroke="var(--fg-2)" strokeWidth={1.5} markerEnd="url(#oAxis)"/>
            {/* Right angle at foot */}
            {norm2 > 5 && (() => {
              const un = u/Math.sqrt(norm2), vn = v/Math.sqrt(norm2);
              const S = 10;
              const px = -vn*S, py = un*S;
              return <path d={`M${foot.x+px} ${foot.y+py} L${foot.x+px+un*S} ${foot.y+py+vn*S} L${foot.x+un*S} ${foot.y+vn*S}`}
                fill="none" stroke="var(--fg-4)" strokeWidth="1"/>;
            })()}
            {line1 && <line x1={line1[0].x} y1={line1[0].y} x2={line1[1].x} y2={line1[1].y} stroke="var(--formula)" strokeWidth="2.5"/>}
            {line2 && <line x1={line2[0].x} y1={line2[0].y} x2={line2[1].x} y2={line2[1].y} stroke="var(--accent)" strokeWidth="2.5"/>}
            {/* Labels */}
            {([{pt:a,c:'var(--formula)',l:'A',dx:-20,dy:-8},{pt:b,c:'var(--formula)',l:'B',dx:12,dy:-8},{pt:c,c:'var(--accent)',l:'C',dx:12,dy:-8}] as any[]).map(({pt,c:col,l,dx,dy})=>(
              <g key={l}>
                <DragHandle x={pt.x} y={pt.y} color={col} onDown={onDown(l as any)}/>
                <text x={pt.x+dx} y={pt.y+dy} fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill={col}>{l}</text>
              </g>
            ))}
            <Overlay w={320} h={68}>
              <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="11" fill="var(--formula)" fontWeight="600">
                (AB): {Math.round(u*10)/10}·x + {Math.round(v*10)/10}·y + {Math.round(w1*10)/10} = 0
              </text>
              <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="11" fill="var(--accent)" fontWeight="600">
                (⊥C): {Math.round(u2*10)/10}·x + {Math.round(v2*10)/10}·y + {Math.round(w2*10)/10} = 0
              </text>
              <text x="16" y="56" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
                u·u₂+v·v₂ = {(u*u2+v*v2).toFixed(0)} ← {lang==='es'?'debe ser 0 (perpendicular)':'must be 0 (perpendicular)'}
              </text>
              <text x="16" y="70" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
                a·a′ = (Uy/Ux)·(−Ux/Uy) = −1 ✓
              </text>
            </Overlay>
          </svg>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 320 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang==='es' ? 'Recta ortogonal a (AB) por C' : 'Line orthogonal to (AB) through C'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang==='es'
                ? 'Si (AB) tiene vector director U=(Ux,Uy), la perpendicular tiene vector director (u,v) = el vector normal de (AB).'
                : 'If (AB) has direction vector U=(Ux,Uy), the perpendicular has direction vector (u,v) = the normal of (AB).'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>{lang==='es'?'Forma implícita':'Implicit form'}</div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div style={{color:'var(--formula)'}}><i>u</i>·<i>x</i> + <i>v</i>·<i>y</i> + <i>w₁</i> = 0 <span style={{fontSize:12,color:'var(--fg-3)',fontFamily:'var(--font-sans)'}}>(AB)</span></div>
                  <div style={{color:'var(--accent)'}}><i>−v</i>·<i>x</i> + <i>u</i>·<i>y</i> + <i>w₂</i> = 0 <span style={{fontSize:12,color:'var(--fg-3)',fontFamily:'var(--font-sans)'}}>(⊥ por C)</span></div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>w₂ = v·xC − u·yC</div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>{lang==='es'?'Condición pendiente':'Slope condition'}</div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div><i>a</i> · <i>a′</i> = −1</div>
                  <div><i>a′</i> = −1/<i>a</i></div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>u·u₂ + v·v₂ = 0</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 320 }}>
            <pre style={{ margin:0,padding:24,fontSize:11.5,lineHeight:1.7,overflow:'auto',color:'var(--fg-1)',background:'var(--surface-2)',borderRight:'1px solid var(--hairline)' }}>
{`// Project mouse onto line (AB)
// Line: u·x + v·y + w = 0

function onMouseMove(e) {
  const xm = e.clientX;
  const ym = e.clientY;

  // Perpendicular through (xm,ym):
  // direction is (u, v) → normal (-v, u)
  // equation: -v·x + u·y + w2 = 0
  const w2 = v * xm - u * ym;

  // Solve the 2×2 system:
  // u·x + v·y = -w
  // -v·x + u·y = -w2
  const det = u*u + v*v; // always > 0
  const xFoot = (v*w2 - u*w) / det;
  const yFoot = (-u*w2 - v*w) / det;

  // M snaps onto line (AB)
  point.setAttribute("cx", xFoot);
  point.setAttribute("cy", yFoot);
}`}
            </pre>
            <div style={{ display:'flex',flexDirection:'column' }}>
              <div style={{ padding:'8px 16px',borderBottom:'1px solid var(--hairline)',fontSize:11,fontWeight:600,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'0.06em' }}>
                {lang==='es'?'M desliza sobre (AB) — mueve el ratón':'M slides on (AB) — move mouse'}
              </div>
              <SlideOnLine u={u} v={v} w={w1} line1={line1} a={a} b={b} W={360} H={220}/>
            </div>
          </div>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// Mini demo: point M snaps onto line as mouse moves
const SlideOnLine = ({ u, v, w, line1, a, b, W, H }: {
  u:number;v:number;w:number;line1:[Vec2,Vec2]|null;a:Vec2;b:Vec2;W:number;H:number;
}) => {
  const [m, setM] = useState<Vec2>({ x: (a.x+b.x)/2, y: (a.y+b.y)/2 });
  const ref = useRef<SVGSVGElement>(null);
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const xm = (e.clientX - r.left) * (W / r.width);
    const ym = (e.clientY - r.top)  * (H / r.height);
    const det = u*u + v*v;
    if (det < 0.01) return;
    const w2 = v*xm - u*ym;
    setM({ x: (v*w2 - u*w)/det, y: (-u*w2 - v*w)/det });
  };
  // Scale line1 to W×H (it was computed for 720×420)
  const sx = W/720, sy = H/420;
  const sc = (p: Vec2) => ({ x: p.x*sx, y: p.y*sy });
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
      style={{ flex:1,display:'block',cursor:'crosshair',touchAction:'none',background:'var(--surface)' }}
      onPointerMove={onMove}>
      <defs>
        <pattern id="slGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#slGrid)"/>
      {line1 && <line x1={sc(line1[0]).x} y1={sc(line1[0]).y} x2={sc(line1[1]).x} y2={sc(line1[1]).y}
        stroke="var(--formula)" strokeWidth="2"/>}
      <circle cx={m.x*sx} cy={m.y*sy} r="7" fill="var(--accent)" stroke="white" strokeWidth="2"/>
      <text x={m.x*sx+10} y={m.y*sy-6} fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--accent)">M</text>
    </svg>
  );
};

// ════════════════════════════════════════════════════════
// 04 — MEDIATRIZ
// ════════════════════════════════════════════════════════
export const MediatrixItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ x: 220, y: 310 });
  const [b, setB] = useState<Vec2>({ x: 500, y: 130 });

  const W = 720, H = 420, M = 4;
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<'A'|'B'|null>(null);

  const mid: Vec2 = { x: (a.x+b.x)/2, y: (a.y+b.y)/2 };
  // Mediatrix: direction = AB = (b.x-a.x, b.y-a.y), so normal = (b.y-a.y, a.x-b.x) rotated
  // Actually mediatrix ⊥ AB: normal of mediatrix is AB direction
  // Mediatrix eq: Ux·x + Uy·y + w = 0 where Ux=b.x-a.x, Uy=b.y-a.y
  // passes through midpoint: w = -Ux*mid.x - Uy*mid.y
  const Ux = b.x - a.x, Uy = b.y - a.y;
  const um = Ux, vm = Uy;
  const wm = -(um*mid.x + vm*mid.y);

  // Line AB (for reference)
  const ua = Uy, va = -Ux;
  const wa = -(ua*a.x + va*a.y);
  const lineAB = clipLine(ua, va, wa, M, M, W-M, H-M);
  const lineMed = clipLine(um, vm, wm, M, M, W-M, H-M);

  const onDown = (which: 'A'|'B') => (e: React.PointerEvent) => {
    e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(STEP, Math.min(W-STEP, Math.round(((e.clientX-r.left)*(W/r.width))/STEP)*STEP));
    const sy = Math.max(STEP, Math.min(H-STEP, Math.round(((e.clientY-r.top)*(H/r.height))/STEP)*STEP));
    if (drag.current==='A') setA({x:sx,y:sy}); else setB({x:sx,y:sy});
  };

  const dist = (Math.hypot(b.x-a.x, b.y-a.y)/STEP).toFixed(2);

  const steps = lang === 'es' ? [
    'La mediatriz de AB es la recta perpendicular a AB que pasa por su punto medio O.',
    'O = ((xA+xB)/2, (yA+yB)/2) es el punto medio.',
    'El vector director de AB es U = (Ux, Uy) = (xB−xA, yB−yA).',
    'La mediatriz tiene U como vector normal → ecuación Ux·x + Uy·y + w = 0.',
    'Como O pertenece a la mediatriz: w = −Ux·xO − Uy·yO.',
    'Todo punto M de la mediatriz verifica |MA| = |MB|.',
  ] : [
    'The mediatrix of AB is the line perpendicular to AB passing through its midpoint O.',
    'O = ((xA+xB)/2, (yA+yB)/2) is the midpoint.',
    'Direction vector of AB is U = (Ux, Uy) = (xB−xA, yB−yA).',
    'The mediatrix has U as normal → equation Ux·x + Uy·y + w = 0.',
    'Since O lies on it: w = −Ux·xO − Uy·yO.',
    'Every point M on the mediatrix satisfies |MA| = |MB|.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{ background:'var(--surface)',border:'1px solid var(--hairline)',borderRadius:'var(--r-md)',boxShadow:'var(--shadow-1)',overflow:'hidden' }}>
        {tab === 'explore' && (
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
            style={{ width:'100%',height:'auto',display:'block',touchAction:'none',background:'var(--surface)' }}
            onPointerMove={onMove} onPointerUp={()=>{drag.current=null;}} onPointerLeave={()=>{drag.current=null;}}>
            <defs>
              <pattern id="mgrid" width="25" height="25" patternUnits="userSpaceOnUse"><rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/></pattern>
              <pattern id="mgridB" width="125" height="125" patternUnits="userSpaceOnUse"><rect width="125" height="125" fill="url(#mgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/></pattern>
            </defs>
            <rect width={W} height={H} fill="url(#mgridB)"/>
            {/* Segment AB */}
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--fg-2)" strokeWidth="2" strokeDasharray="6 3"/>
            {/* Equal-length tick marks */}
            {(() => {
              const len = Math.hypot(Ux,Uy);
              if (len<5) return null;
              const ux=Ux/len, uy=Uy/len, px=-uy*7, py=ux*7;
              const t1={x:(a.x+mid.x)/2,y:(a.y+mid.y)/2};
              const t2={x:(mid.x+b.x)/2,y:(mid.y+b.y)/2};
              return (<>
                <line x1={t1.x-px} y1={t1.y-py} x2={t1.x+px} y2={t1.y+py} stroke="var(--handle)" strokeWidth="1.5"/>
                <line x1={t2.x-px} y1={t2.y-py} x2={t2.x+px} y2={t2.y+py} stroke="var(--handle)" strokeWidth="1.5"/>
              </>);
            })()}
            {/* Line AB (dashed reference) */}
            {lineAB && <line x1={lineAB[0].x} y1={lineAB[0].y} x2={lineAB[1].x} y2={lineAB[1].y} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3 3"/>}
            {/* Mediatrix */}
            {lineMed && <line x1={lineMed[0].x} y1={lineMed[0].y} x2={lineMed[1].x} y2={lineMed[1].y} stroke="var(--formula)" strokeWidth="2.5"/>}
            {/* Midpoint O */}
            <circle cx={mid.x} cy={mid.y} r="6" fill="var(--construction)" stroke="white" strokeWidth="2"/>
            <text x={mid.x+12} y={mid.y-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--construction)">O</text>
            {/* A B handles */}
            <g style={{cursor:'grab'}} onPointerDown={onDown('A')}>
              <circle cx={a.x} cy={a.y} r="12" fill="var(--accent)" fillOpacity="0.12"/>
              <circle cx={a.x} cy={a.y} r="6" fill="var(--accent)" stroke="white" strokeWidth="2"/>
            </g>
            <text x={a.x-18} y={a.y-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--accent)">A</text>
            <g style={{cursor:'grab'}} onPointerDown={onDown('B')}>
              <circle cx={b.x} cy={b.y} r="12" fill="var(--formula)" fillOpacity="0.12"/>
              <circle cx={b.x} cy={b.y} r="6" fill="var(--formula)" stroke="white" strokeWidth="2"/>
            </g>
            <text x={b.x+10} y={b.y-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--formula)">B</text>
            <Overlay w={300} h={56}>
              <text x="16" y="22" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
                O = ({((mid.x-W/2)/STEP).toFixed(1)}, {((H/2-mid.y)/STEP).toFixed(1)})  |AB|={dist}
              </text>
              <text x="16" y="38" fontFamily="var(--font-mono)" fontSize="11" fill="var(--formula)" fontWeight="600">
                {Math.round(um*10)/10}·x + {Math.round(vm*10)/10}·y + {Math.round(wm*10)/10} = 0
              </text>
              <text x="16" y="52" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
                w = −Ux·xO − Uy·yO
              </text>
            </Overlay>
          </svg>
        )}
        {tab === 'formula' && (
          <div style={{padding:'32px 40px',minHeight:280}}>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:22,marginBottom:12}}>
              {lang==='es'?'Mediatriz de AB':'Mediatrix of AB'}
            </h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{padding:20,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--hairline)'}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--fg-3)',marginBottom:12}}>{lang==='es'?'Ecuación':'Equation'}</div>
                <div style={{fontFamily:'var(--font-math)',fontSize:18,lineHeight:2}}>
                  <div><i>Ux</i>·<i>x</i> + <i>Uy</i>·<i>y</i> + <i>w</i> = 0</div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>w = −Ux·xO − Uy·yO</div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>O = ((xA+xB)/2, (yA+yB)/2)</div>
                </div>
              </div>
              <div style={{padding:20,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--hairline)'}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--fg-3)',marginBottom:12}}>{lang==='es'?'Propiedad':'Property'}</div>
                <div style={{fontFamily:'var(--font-math)',fontSize:18,lineHeight:2}}>
                  <div>M ∈ {lang==='es'?'mediatriz':'mediatrix'}</div>
                  <div>↔ |MA| = |MB|</div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>OM⃗ · AB⃗ = 0</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{margin:0,padding:24,fontSize:12,lineHeight:1.7,minHeight:280,overflow:'auto',color:'var(--fg-1)',background:'var(--surface-2)'}}>
{`// Mediatrix of segment AB
// u = xB - xA  (direction of AB = normal of mediatrix)
// v = yB - yA
const u = B.x - A.x;
const v = B.y - A.y;

// Midpoint O
const xO = (A.x + B.x) / 2;
const yO = (A.y + B.y) / 2;

// w so that O lies on the mediatrix
const w = -(u * xO + v * yO);

// Clip and draw
const [p1, p2] = clipLine(u, v, w, ...viewport);
line.setAttribute("x1", p1[0]);
line.setAttribute("y1", p1[1]);
line.setAttribute("x2", p2[0]);
line.setAttribute("y2", p2[1]);`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 05 — INTERSECCIÓN DE RECTAS (reuses LinearSystemItem logic)
// ════════════════════════════════════════════════════════
export const LineInterItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ x: 160, y: 320 });
  const [b, setB] = useState<Vec2>({ x: 560, y: 190 });
  const [c, setC] = useState<Vec2>({ x: 530, y: 270 });
  const [d, setD] = useState<Vec2>({ x: 140, y: 180 });

  const W = 720, H = 420, M2 = 4;
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<'A'|'B'|'C'|'D'|null>(null);

  const lineCoeffs = (p1: Vec2, p2: Vec2) => {
    const u = -(p2.y-p1.y), v = p2.x-p1.x, w = -(u*p1.x+v*p1.y);
    return {u,v,w};
  };
  const L1 = lineCoeffs(a,b), L2 = lineCoeffs(c,d);
  const det = L1.u*L2.v - L2.u*L1.v;
  const isParallel = Math.abs(det) < 0.5;
  const mx = !isParallel ? (-L1.w*L2.v-(-L2.w)*L1.v)/det : NaN;
  const my = !isParallel ? (L1.u*(-L2.w)-L2.u*(-L1.w))/det : NaN;

  const line1 = clipLine(L1.u,L1.v,L1.w,M2,M2,W-M2,H-M2);
  const line2 = clipLine(L2.u,L2.v,L2.w,M2,M2,W-M2,H-M2);

  const onDown = (which: 'A'|'B'|'C'|'D') => (e: React.PointerEvent) => {
    e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = which;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(STEP,Math.min(W-STEP,Math.round(((e.clientX-r.left)*(W/r.width))/STEP)*STEP));
    const sy = Math.max(STEP,Math.min(H-STEP,Math.round(((e.clientY-r.top)*(H/r.height))/STEP)*STEP));
    if(drag.current==='A')setA({x:sx,y:sy});
    if(drag.current==='B')setB({x:sx,y:sy});
    if(drag.current==='C')setC({x:sx,y:sy});
    if(drag.current==='D')setD({x:sx,y:sy});
  };

  const steps = lang==='es' ? [
    'Las rectas (AB) y (CD) tienen ecuaciones u₁·x+v₁·y+w₁=0 y u₂·x+v₂·y+w₂=0.',
    'M intersección verifica ambas ecuaciones → sistema 2×2.',
    'Calculamos det = u₁·v₂ − u₂·v₁.',
    'Si det = 0 las rectas son paralelas (o coincidentes).',
    'Si det ≠ 0: xM = (v₁·w₂ − v₂·w₁)/det, yM = (−u₁·w₂ + u₂·w₁)/det.',
  ] : [
    'Lines (AB) and (CD) have equations u₁·x+v₁·y+w₁=0 and u₂·x+v₂·y+w₂=0.',
    'Intersection M satisfies both → 2×2 linear system.',
    'Compute det = u₁·v₂ − u₂·v₁.',
    'If det = 0, lines are parallel (or coincident).',
    'If det ≠ 0: xM = (v₁·w₂ − v₂·w₁)/det, yM = (−u₁·w₂ + u₂·w₁)/det.',
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{background:'var(--surface)',border:'1px solid var(--hairline)',borderRadius:'var(--r-md)',boxShadow:'var(--shadow-1)',overflow:'hidden'}}>
        {tab==='explore' && (
          <>
            <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
              style={{width:'100%',height:'auto',display:'block',touchAction:'none',background:'var(--surface)'}}
              onPointerMove={onMove} onPointerUp={()=>{drag.current=null;}} onPointerLeave={()=>{drag.current=null;}}>
              <defs>
                <pattern id="igrid" width="25" height="25" patternUnits="userSpaceOnUse"><rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/></pattern>
                <pattern id="igridB" width="125" height="125" patternUnits="userSpaceOnUse"><rect width="125" height="125" fill="url(#igrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/></pattern>
              </defs>
              <rect width={W} height={H} fill="url(#igridB)"/>
              {line1 && <line x1={line1[0].x} y1={line1[0].y} x2={line1[1].x} y2={line1[1].y} stroke="var(--formula)" strokeWidth="2.5"/>}
              {line2 && <line x1={line2[0].x} y1={line2[0].y} x2={line2[1].x} y2={line2[1].y} stroke="var(--accent)" strokeWidth="2.5"/>}
              {!isParallel && Number.isFinite(mx) && Number.isFinite(my) && (
                <>
                  <circle cx={mx} cy={my} r="8" fill="var(--handle)" stroke="white" strokeWidth="2"/>
                  <text x={mx+12} y={my-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--handle)">M</text>
                </>
              )}
              {([{pt:a,c:'var(--formula)',l:'A',dx:-20,dy:-8},{pt:b,c:'var(--formula)',l:'B',dx:12,dy:-8},
                 {pt:c,c:'var(--accent)',l:'C',dx:12,dy:-8},{pt:d,c:'var(--accent)',l:'D',dx:-20,dy:-8}] as any[]).map(({pt,c:col,l,dx,dy})=>(
                <g key={l}>
                  <DragHandle x={pt.x} y={pt.y} color={col} onDown={onDown(l as any)}/>
                  <text x={pt.x+dx} y={pt.y+dy} fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill={col}>{l}</text>
                </g>
              ))}
              <Overlay w={340} h={72}>
                <text x="16" y="22" fontFamily="var(--font-mono)" fontSize="10" fill="var(--formula)">
                  (AB): {Math.round(L1.u)}·x + {Math.round(L1.v)}·y + {Math.round(L1.w)} = 0
                </text>
                <text x="16" y="36" fontFamily="var(--font-mono)" fontSize="10" fill="var(--accent)">
                  (CD): {Math.round(L2.u)}·x + {Math.round(L2.v)}·y + {Math.round(L2.w)} = 0
                </text>
                <text x="16" y="52" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">
                  det = {det.toFixed(1)}
                </text>
                {!isParallel ? (
                  <text x="16" y="68" fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" fontWeight="600">
                    M = ({(mx/STEP).toFixed(2)}, {((H/2-my)/STEP).toFixed(2)})
                  </text>
                ) : (
                  <text x="16" y="68" fontFamily="var(--font-mono)" fontSize="11" fill="var(--construction)" fontWeight="600">
                    {lang==='es'?'Rectas paralelas — sin intersección':'Parallel lines — no intersection'}
                  </text>
                )}
              </Overlay>
            </svg>
            {isParallel && (
              <div style={{padding:'8px 20px',borderTop:'1px solid var(--hairline)',background:'var(--highlight-soft)',color:'var(--handle)',fontSize:13,fontWeight:600}}>
                {lang==='es'?'det = 0 → rectas paralelas o coincidentes':'det = 0 → parallel or coincident lines'}
              </div>
            )}
          </>
        )}
        {tab==='formula' && (
          <div style={{padding:'32px 40px',minHeight:280}}>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:22,marginBottom:12}}>
              {lang==='es'?'Intersección de rectas':'Line intersection'}
            </h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{padding:20,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--hairline)'}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--fg-3)',marginBottom:12}}>{lang==='es'?'Sistema':'System'}</div>
                <div style={{fontFamily:'var(--font-math)',fontSize:16,lineHeight:2}}>
                  <div><i style={{color:'var(--formula)'}}>u₁</i>·x + <i style={{color:'var(--formula)'}}>v₁</i>·y = −w₁</div>
                  <div><i style={{color:'var(--accent)'}}>u₂</i>·x + <i style={{color:'var(--accent)'}}>v₂</i>·y = −w₂</div>
                </div>
              </div>
              <div style={{padding:20,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--hairline)'}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--fg-3)',marginBottom:12}}>Cramer</div>
                <div style={{fontFamily:'var(--font-math)',fontSize:15,lineHeight:2}}>
                  <div>det = u₁·v₂ − u₂·v₁</div>
                  <div><i style={{color:'var(--handle)'}}>xM</i> = (v₁·w₂ − v₂·w₁)/det</div>
                  <div><i style={{color:'var(--handle)'}}>yM</i> = (−u₁·w₂ + u₂·w₁)/det</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab==='svg' && (
          <pre style={{margin:0,padding:24,fontSize:12,lineHeight:1.7,minHeight:280,overflow:'auto',color:'var(--fg-1)',background:'var(--surface-2)'}}>
{`// Intersection of lines AB and CD
const det = u1*v2 - u2*v1;
if (Math.abs(det) < 1e-9) {
  // Parallel or coincident — no unique intersection
  return;
}
const xM = (v1*w2 - v2*w1) / det;
const yM = (-u1*w2 + u2*w1) / det;

point.setAttribute("cx", xM);
point.setAttribute("cy", yM);`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 06 — ECUACIÓN PARAMÉTRICA
// ════════════════════════════════════════════════════════
export const LineParamItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ x: 200, y: 300 });
  const [b, setB] = useState<Vec2>({ x: 550, y: 140 });
  const [t, setT] = useState(0.5);

  const W = 720, H = 420;
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<'A'|'B'|null>(null);

  // M = A + t*(B-A)
  const m: Vec2 = { x: a.x + t*(b.x-a.x), y: a.y + t*(b.y-a.y) };
  const Ux = (b.x-a.x)/STEP, Uy = -(b.y-a.y)/STEP;

  const onDown = (which: 'A'|'B') => (e: React.PointerEvent) => {
    e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = which;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(STEP,Math.min(W-STEP,Math.round(((e.clientX-r.left)*(W/r.width))/STEP)*STEP));
    const sy = Math.max(STEP,Math.min(H-STEP,Math.round(((e.clientY-r.top)*(H/r.height))/STEP)*STEP));
    if(drag.current==='A')setA({x:sx,y:sy}); else setB({x:sx,y:sy});
  };

  const xA = ((a.x-W/2)/STEP).toFixed(1), yA = ((H/2-a.y)/STEP).toFixed(1);

  const steps = lang==='es' ? [
    'La ecuación paramétrica de la recta (AB) usa el parámetro t.',
    'M pertenece a la recta ↔ existe t tal que AM⃗ = t·AB⃗.',
    'Componente x: x = xA + t·Ux, donde Ux = xB − xA.',
    'Componente y: y = yA + t·Uy, donde Uy = yB − yA.',
    'Para t=0: M=A. Para t=1: M=B. Para t=0.5: M es el punto medio.',
    'Cualquier valor de t da un punto de la recta; t∈[0,1] da el segmento AB.',
  ] : [
    'The parametric equation of line (AB) uses parameter t.',
    'M lies on the line ↔ there exists t such that AM⃗ = t·AB⃗.',
    'x component: x = xA + t·Ux, where Ux = xB − xA.',
    'y component: y = yA + t·Uy, where Uy = yB − yA.',
    't=0: M=A. t=1: M=B. t=0.5: M is the midpoint.',
    'Any t gives a point on the line; t∈[0,1] gives segment AB.',
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{background:'var(--surface)',border:'1px solid var(--hairline)',borderRadius:'var(--r-md)',boxShadow:'var(--shadow-1)',overflow:'hidden'}}>
        {tab==='explore' && (
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
            style={{width:'100%',height:'auto',display:'block',touchAction:'none',background:'var(--surface)'}}
            onPointerMove={onMove} onPointerUp={()=>{drag.current=null;}} onPointerLeave={()=>{drag.current=null;}}>
            <defs>
              <pattern id="pgrid" width="25" height="25" patternUnits="userSpaceOnUse"><rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/></pattern>
              <pattern id="pgridB" width="125" height="125" patternUnits="userSpaceOnUse"><rect width="125" height="125" fill="url(#pgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/></pattern>
            </defs>
            <rect width={W} height={H} fill="url(#pgridB)"/>
            {/* Extended line */}
            {clipLine(b.y-a.y,a.x-b.x,-(( b.y-a.y)*a.x+(a.x-b.x)*a.y),4,4,W-4,H-4) && (() => {
              const cl = clipLine(b.y-a.y,a.x-b.x,-((b.y-a.y)*a.x+(a.x-b.x)*a.y),4,4,W-4,H-4)!;
              return <line x1={cl[0].x} y1={cl[0].y} x2={cl[1].x} y2={cl[1].y} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="5 3"/>;
            })()}
            {/* Segment AB */}
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--formula)" strokeWidth="3"/>
            {/* AM segment (t portion) */}
            <line x1={a.x} y1={a.y} x2={m.x} y2={m.y} stroke="var(--accent)" strokeWidth="3"/>
            {/* M point */}
            <circle cx={m.x} cy={m.y} r="7" fill="var(--handle)" stroke="white" strokeWidth="2"/>
            <text x={m.x+12} y={m.y-8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="16" fill="var(--handle)">M(t={t.toFixed(2)})</text>
            {/* Handles */}
            {([{pt:a,c:'var(--accent)',l:'A',dx:-20,dy:-8},{pt:b,c:'var(--formula)',l:'B',dx:12,dy:-8}] as any[]).map(({pt,c:col,l,dx,dy})=>(
              <g key={l}>
                <DragHandle x={pt.x} y={pt.y} color={col} onDown={onDown(l as any)}/>
                <text x={pt.x+dx} y={pt.y+dy} fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill={col}>{l}</text>
              </g>
            ))}
            <Overlay w={300} h={72}>
              <text x="16" y="20" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
                x = {xA} + t · {Ux.toFixed(1)}
              </text>
              <text x="16" y="36" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
                y = {yA} + t · {Uy.toFixed(1)}
              </text>
              <text x="16" y="54" fontFamily="var(--font-mono)" fontSize="12" fill="var(--handle)" fontWeight="600">
                t = {t.toFixed(2)}  →  M = ({((m.x-W/2)/STEP).toFixed(2)}, {((H/2-m.y)/STEP).toFixed(2)})
              </text>
              <text x="16" y="70" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-4)">
                {lang==='es'?'t=0→A, t=0.5→medio, t=1→B':'t=0→A, t=0.5→mid, t=1→B'}
              </text>
            </Overlay>
          </svg>
        )}
        {tab==='explore' && (
          <div style={{padding:'12px 20px',borderTop:'1px solid var(--hairline)',display:'flex',alignItems:'center',gap:16}}>
            <label style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
              <span style={{fontFamily:'var(--font-mono)',fontSize:14,color:'var(--fg-2)',whiteSpace:'nowrap'}}>t = {t.toFixed(2)}</span>
              <input type="range" min={-0.5} max={1.5} step={0.01} value={t}
                onChange={e=>setT(parseFloat(e.target.value))}
                style={{flex:1,accentColor:'var(--accent)'}}/>
              <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-4)',whiteSpace:'nowrap'}}>−0.5 … 1.5</span>
            </label>
          </div>
        )}
        {tab==='formula' && (
          <div style={{padding:'32px 40px',minHeight:280}}>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:22,marginBottom:12}}>
              {lang==='es'?'Ecuación paramétrica':'Parametric equation'}
            </h3>
            <div style={{padding:24,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--hairline)',marginBottom:16,textAlign:'center',fontFamily:'var(--font-math)',fontSize:22,lineHeight:2.2}}>
              <div><i>x</i> = <i style={{color:'var(--accent)'}}>xA</i> + <i style={{color:'var(--handle)'}}>t</i>·<i>Ux</i></div>
              <div><i>y</i> = <i style={{color:'var(--accent)'}}>yA</i> + <i style={{color:'var(--handle)'}}>t</i>·<i>Uy</i></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              {[['t = 0','M = A','var(--accent)'],['t = 1','M = B','var(--formula)'],['t = 0.5',lang==='es'?'punto medio':'midpoint','var(--handle)']].map(([v,d,c])=>(
                <div key={v} style={{padding:'10px 14px',background:'var(--surface-2)',border:'1px solid var(--hairline)',borderRadius:'var(--r-sm)',borderLeft:`3px solid ${c}`}}>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:12,color:c,fontWeight:600,marginBottom:4}}>{v}</div>
                  <div style={{fontSize:12,color:'var(--fg-3)'}}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==='svg' && (
          <pre style={{margin:0,padding:24,fontSize:12,lineHeight:1.7,minHeight:280,overflow:'auto',color:'var(--fg-1)',background:'var(--surface-2)'}}>
{`// Parametric equation: M = A + t*(B-A)
// t ∈ [0,1] → segment AB
// t ∈ ℝ → full line

function getPointOnLine(A, B, t) {
  return {
    x: A.x + t * (B.x - A.x),
    y: A.y + t * (B.y - A.y),
  };
}

// Find t from mouse position (project onto line)
function projectToLine(A, B, mouse) {
  const Ux = B.x - A.x, Uy = B.y - A.y;
  const len2 = Ux*Ux + Uy*Uy;
  const t = ((mouse.x-A.x)*Ux + (mouse.y-A.y)*Uy) / len2;
  return Math.max(0, Math.min(1, t)); // clamp to [0,1]
}

// Clamp to segment
const tClamped = Math.max(0, Math.min(1, t));
const M = getPointOnLine(A, B, tClamped);`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 07 — DISTANCIA PUNTO-RECTA + BISECTRIZ
// ════════════════════════════════════════════════════════
export const LineDistItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ x: 160, y: 160 });
  const [b, setB] = useState<Vec2>({ x: 560, y: 230 });
  const [c, setC] = useState<Vec2>({ x: 300, y: 310 });

  const W = 720, H = 420, M2 = 4;
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<'A'|'B'|'C'|null>(null);

  const Ux = b.x-a.x, Uy = b.y-a.y;
  const u = Uy, v = -Ux;
  const w = -(u*a.x + v*a.y);
  const norm = Math.sqrt(u*u + v*v);

  // Distance C to line AB
  const dist = norm > 0 ? Math.abs(u*c.x + v*c.y + w) / norm / STEP : 0;

  // Foot of perpendicular from C
  const k = norm > 0 ? (u*c.x + v*c.y + w) / (norm*norm) : 0;
  const foot: Vec2 = { x: c.x - u*k, y: c.y - v*k };

  const lineAB = clipLine(u,v,w, M2,M2,W-M2,H-M2);

  const onDown = (which: 'A'|'B'|'C') => (e: React.PointerEvent) => {
    e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = which;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if(!drag.current||!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(STEP,Math.min(W-STEP,Math.round(((e.clientX-r.left)*(W/r.width))/STEP)*STEP));
    const sy = Math.max(STEP,Math.min(H-STEP,Math.round(((e.clientY-r.top)*(H/r.height))/STEP)*STEP));
    if(drag.current==='A')setA({x:sx,y:sy});
    if(drag.current==='B')setB({x:sx,y:sy});
    if(drag.current==='C')setC({x:sx,y:sy});
  };

  const onLine = dist < 0.05;

  const steps = lang==='es' ? [
    'La recta (AB) tiene ecuación u·x + v·y + w = 0.',
    'Proyectamos C sobre la recta por la perpendicular a (AB) por C.',
    'La perpendicular a (AB) por C tiene ecuación paramétrica: x=xC+k·u, y=yC+k·v.',
    'El pie h verifica la ecuación de (AB): k = −(u·xC+v·yC+w)/(u²+v²).',
    'La distancia es |Ch| = |k|·√(u²+v²) = |u·xC+v·yC+w|/√(u²+v²).',
    'Si C ∈ (AB), entonces u·xC+v·yC+w=0 y d=0.',
  ] : [
    'Line (AB) has equation u·x + v·y + w = 0.',
    'We project C onto the line via the perpendicular to (AB) through C.',
    'The perpendicular parametric eq: x=xC+k·u, y=yC+k·v.',
    'Foot h lies on (AB): k = −(u·xC+v·yC+w)/(u²+v²).',
    'Distance |Ch| = |k|·√(u²+v²) = |u·xC+v·yC+w|/√(u²+v²).',
    'If C ∈ (AB), then u·xC+v·yC+w=0 and d=0.',
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <TabBar tab={tab} setTab={setTab} lang={lang}/>
      <div style={{background:'var(--surface)',border:'1px solid var(--hairline)',borderRadius:'var(--r-md)',boxShadow:'var(--shadow-1)',overflow:'hidden'}}>
        {tab==='explore' && (
          <>
            <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
              style={{width:'100%',height:'auto',display:'block',touchAction:'none',background:'var(--surface)'}}
              onPointerMove={onMove} onPointerUp={()=>{drag.current=null;}} onPointerLeave={()=>{drag.current=null;}}>
              <defs>
                <pattern id="distg" width="25" height="25" patternUnits="userSpaceOnUse"><rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/></pattern>
                <pattern id="distgB" width="125" height="125" patternUnits="userSpaceOnUse"><rect width="125" height="125" fill="url(#distg)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/></pattern>
                <marker id="dArr" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="8" markerHeight="6" orient="auto">
                  <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--construction)"/>
                </marker>
              </defs>
              <rect width={W} height={H} fill="url(#distgB)"/>
              {lineAB && <line x1={lineAB[0].x} y1={lineAB[0].y} x2={lineAB[1].x} y2={lineAB[1].y} stroke="var(--formula)" strokeWidth="2.5"/>}
              {/* Perpendicular segment C→foot */}
              {norm>5 && !onLine && (<>
                <line x1={c.x} y1={c.y} x2={foot.x} y2={foot.y}
                  stroke="var(--construction)" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#dArr)"/>
                {/* Right angle mark */}
                {(() => {
                  const un=u/norm,vn=v/norm,S=8;
                  const px=-vn*S,py=un*S;
                  return <path d={`M${foot.x+px} ${foot.y+py} L${foot.x+px+un*S} ${foot.y+py+vn*S} L${foot.x+un*S} ${foot.y+vn*S}`}
                    fill="none" stroke="var(--fg-4)" strokeWidth="1"/>;
                })()}
                {/* h foot point */}
                <circle cx={foot.x} cy={foot.y} r="5" fill="var(--construction)" stroke="white" strokeWidth="1.5"/>
                <text x={foot.x+10} y={foot.y-6} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--construction)">h</text>
                {/* distance label */}
                <text x={(c.x+foot.x)/2+14} y={(c.y+foot.y)/2}
                  fontFamily="var(--font-mono)" fontSize="11" fill="var(--construction)">d={dist.toFixed(2)}</text>
              </>)}
              {([{pt:a,c2:'var(--formula)',l:'A',dx:-20,dy:-8},{pt:b,c2:'var(--formula)',l:'B',dx:12,dy:-8},{pt:c,c2:'var(--accent)',l:'C',dx:12,dy:-8}] as any[]).map(({pt,c2,l,dx,dy})=>(
                <g key={l}>
                  <DragHandle x={pt.x} y={pt.y} color={c2} onDown={onDown(l as any)}/>
                  <text x={pt.x+dx} y={pt.y+dy} fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill={c2}>{l}</text>
                </g>
              ))}
              <Overlay w={340} h={68}>
                <text x="16" y="22" fontFamily="var(--font-mono)" fontSize="11" fill="var(--formula)">
                  (AB): {Math.round(u)}·x + {Math.round(v)}·y + {Math.round(w)} = 0
                </text>
                <text x="16" y="38" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
                  d = |u·xC+v·yC+w| / √(u²+v²)
                </text>
                <text x="16" y="56" fontFamily="var(--font-mono)" fontSize="13" fill="var(--construction)" fontWeight="600">
                  d = {dist.toFixed(3)}
                </text>
                {onLine && <text x="16" y="70" fontFamily="var(--font-mono)" fontSize="10" fill="var(--accent)">C ∈ (AB) → d = 0</text>}
              </Overlay>
            </svg>
          </>
        )}
        {tab==='formula' && (
          <div style={{padding:'32px 40px',minHeight:280}}>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:22,marginBottom:12}}>
              {lang==='es'?'Distancia de C a la recta (AB)':'Distance from C to line (AB)'}
            </h3>
            <div style={{padding:24,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--hairline)',marginBottom:16}}>
              <div style={{fontFamily:'var(--font-math)',fontSize:24,textAlign:'center',lineHeight:2}}>
                d = |<i style={{color:'var(--construction)'}}>u</i>·xC + <i style={{color:'var(--construction)'}}>v</i>·yC + <i style={{color:'var(--construction)'}}>w</i>| / √(<i>u</i>² + <i>v</i>²)
              </div>
            </div>
            <div style={{padding:16,background:'var(--highlight-soft)',borderRadius:'var(--r-md)',border:'1px solid var(--hairline)',borderLeft:'3px solid var(--construction)'}}>
              <p style={{fontSize:13,color:'var(--fg-2)',margin:0,lineHeight:1.6}}>
                {lang==='es'
                  ? 'k = −(u·xC+v·yC+w)/(u²+v²), el pie h=(xC+k·u, yC+k·v). La bisectriz interior de dos rectas es el lugar geométrico equidistante a ambas: d₁=d₂.'
                  : 'k = −(u·xC+v·yC+w)/(u²+v²), foot h=(xC+k·u, yC+k·v). The angle bisector of two lines is the locus equidistant from both: d₁=d₂.'}
              </p>
            </div>
          </div>
        )}
        {tab==='svg' && (
          <pre style={{margin:0,padding:24,fontSize:11.5,lineHeight:1.7,minHeight:280,overflow:'auto',color:'var(--fg-1)',background:'var(--surface-2)'}}>
{`// Distance from C to line: u·x + v·y + w = 0
const dist = Math.abs(u*C.x + v*C.y + w)
           / Math.sqrt(u*u + v*v);

// Foot of perpendicular
const k  = -(u*C.x + v*C.y + w) / (u*u + v*v);
const hx = C.x + k * u;
const hy = C.y + k * v;

// Angle bisectors of lines L1 and L2
// Points equidistant from both lines:
// |u1*x+v1*y+w1|/n1 = |u2*x+v2*y+w2|/n2
// → two linear equations (±):
const n1 = Math.sqrt(u1*u1 + v1*v1);
const n2 = Math.sqrt(u2*u2 + v2*v2);
// Bisector 1 (interior):
const ub1 = u1*n2 - u2*n1;
const vb1 = v1*n2 - v2*n1;
const wb1 = w1*n2 - w2*n1;
// Bisector 2 (exterior):
const ub2 = u1*n2 + u2*n1;
const vb2 = v1*n2 + v2*n1;
const wb2 = w1*n2 + w2*n1;`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 08 — ÁNGULO ENTRE RECTAS
// ════════════════════════════════════════════════════════
export const LineAngleItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Vec2>({ x: 180, y: 300 });
  const [b, setB] = useState<Vec2>({ x: 480, y: 150 });
  const [c, setC] = useState<Vec2>({ x: 200, y: 150 });
  const [d, setD] = useState<Vec2>({ x: 500, y: 280 });

  const W = 720, H = 420, M = 4;
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<'A'|'B'|'C'|'D'|null>(null);

  // Direction vectors of both lines
  const U1x = b.x - a.x, U1y = b.y - a.y; // Director of line 1
  const U2x = d.x - c.x, U2y = d.y - c.y; // Director of line 2
  
  // Line coefficients for display
  const u1 = -U1y, v1 = U1x, w1 = -(u1*a.x + v1*a.y);
  const u2 = -U2y, v2 = U2x, w2 = -(u2*c.x + v2*c.y);
  
  // Angle calculation using dot product
  const dot = U1x * U2x + U1y * U2y;
  const len1 = Math.hypot(U1x, U1y);
  const len2 = Math.hypot(U2x, U2y);
  const cosA = len1 > 0 && len2 > 0 ? dot / (len1 * len2) : 0;
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const angleDeg = angleRad * 180 / Math.PI;
  const angleDegRounded = Math.round(angleDeg * 10) / 10;

  const line1 = clipLine(u1, v1, w1, M, M, W-M, H-M);
  const line2 = clipLine(u2, v2, w2, M, M, W-M, H-M);

  const onDown = (which: 'A'|'B'|'C'|'D') => (e: React.PointerEvent) => {
    e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = which;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const sx = Math.max(STEP, Math.min(W-STEP, Math.round(((e.clientX-r.left)*(W/r.width))/STEP)*STEP));
    const sy = Math.max(STEP, Math.min(H-STEP, Math.round(((e.clientY-r.top)*(H/r.height))/STEP)*STEP));
    if (drag.current==='A') setA({x:sx,y:sy});
    if (drag.current==='B') setB({x:sx,y:sy});
    if (drag.current==='C') setC({x:sx,y:sy});
    if (drag.current==='D') setD({x:sx,y:sy});
  };

  const steps = lang === 'es' ? [
    'Sean (AB) y (CD) dos rectas con vectores directores U₁ y U₂.',
    'El ángulo θ entre las rectas es el ángulo entre sus vectores directores.',
    'Usamos el producto escalar: U₁·U₂ = |U₁|·|U₂|·cos(θ).',
    'Despejamos el coseno: cos(θ) = (U₁·U₂)/(|U₁|·|U₂|).',
    'El ángulo es θ = arccos[(U₁·U₂)/(|U₁|·|U₂|)].',
    'Si U₁·U₂ = 0, las rectas son perpendiculares (θ = 90°).',
  ] : [
    'Let (AB) and (CD) be two lines with direction vectors U₁ and U₂.',
    'The angle θ between the lines is the angle between their direction vectors.',
    'Using the dot product: U₁·U₂ = |U₁|·|U₂|·cos(θ).',
    'Solve for cosine: cos(θ) = (U₁·U₂)/(|U₁|·|U₂|).',
    'The angle is θ = arccos[(U₁·U₂)/(|U₁|·|U₂|)].',
    'If U₁·U₂ = 0, the lines are perpendicular (θ = 90°).',
  ];

  // Draw angle arc at intersection point
  const drawAngleArc = () => {
    if (len1 < 5 || len2 < 5) return null;
    
    // Find intersection point (approximate for display)
    const det = u1*v2 - u2*v1;
    if (Math.abs(det) < 0.5) return null; // Parallel lines
    
    const ix = (-w1*v2 - (-w2)*v1) / det;
    const iy = (u1*(-w2) - u2*(-w1)) / det;
    
    // Normalize direction vectors
    const ux1 = U1x / len1, uy1 = U1y / len1;
    const ux2 = U2x / len2, uy2 = U2y / len2;
    
    // Calculate arc parameters
    const radius = 40;
    const startAngle = Math.atan2(uy1, ux1); // Corrected angle calculation
    const endAngle = Math.atan2(uy2, ux2);
    
    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const x1 = ix + radius * Math.cos(startAngle);
    const y1 = iy + radius * Math.sin(startAngle);
    const x2 = ix + radius * Math.cos(endAngle);
    const y2 = iy + radius * Math.sin(endAngle);
    
    return (
      <g>
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <text
          x={ix + radius * 1.5 * Math.cos((startAngle + endAngle) / 2)}
          y={iy + radius * 1.5 * Math.sin((startAngle + endAngle) / 2)}
          fontFamily="var(--font-math)"
          fontSize="14"
          fill="var(--accent)"
        >
          θ
        </text>
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
            onPointerMove={onMove} onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}>
            <defs>
              <pattern id="angrid" width="25" height="25" patternUnits="userSpaceOnUse">
                <rect width="25" height="25" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
              </pattern>
              <pattern id="angridB" width="125" height="125" patternUnits="userSpaceOnUse">
                <rect width="125" height="125" fill="url(#angrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#angridB)"/>
            {line1 && <line x1={line1[0].x} y1={line1[0].y} x2={line1[1].x} y2={line1[1].y} stroke="var(--formula)" strokeWidth="2.5"/>}
            {line2 && <line x1={line2[0].x} y1={line2[0].y} x2={line2[1].x} y2={line2[1].y} stroke="var(--accent)" strokeWidth="2.5"/>}
            {drawAngleArc()}
            {([
              {pt:a,c:'var(--formula)',l:'A',dx:-20,dy:-8},
              {pt:b,c:'var(--formula)',l:'B',dx:12,dy:-8},
              {pt:c,c:'var(--accent)',l:'C',dx:-20,dy:-8},
              {pt:d,c:'var(--accent)',l:'D',dx:12,dy:-8}
            ] as any[]).map(({pt,c,l,dx,dy}) => (
              <g key={l}>
                <DragHandle x={pt.x} y={pt.y} color={c} onDown={onDown(l as any)}/>
                <text x={pt.x+dx} y={pt.y+dy} fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill={c}>{l}</text>
              </g>
            ))}
            <Overlay w={360} h={84}>
              <text x="16" y="22" fontFamily="var(--font-mono)" fontSize="11" fill="var(--formula)" fontWeight="600">
                (AB): {Math.round(u1)}·x + {Math.round(v1)}·y + {Math.round(w1)} = 0
              </text>
              <text x="16" y="38" fontFamily="var(--font-mono)" fontSize="11" fill="var(--accent)" fontWeight="600">
                (CD): {Math.round(u2)}·x + {Math.round(v2)}·y + {Math.round(w2)} = 0
              </text>
              <text x="16" y="56" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">
                U₁·U₂ = {Math.round(dot)}  |U₁| = {Math.round(len1)}  |U₂| = {Math.round(len2)}
              </text>
              <text x="16" y="72" fontFamily="var(--font-mono)" fontSize="13" fill="var(--construction)" fontWeight="600">
                θ = {angleDegRounded}°  (cos θ = {cosA.toFixed(3)})
              </text>
            </Overlay>
          </svg>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 320 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang==='es' ? 'Ángulo entre rectas (AB) y (CD)' : 'Angle between lines (AB) and (CD)'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang==='es'
                ? 'El ángulo entre dos rectas es el ángulo entre sus vectores directores. Se calcula usando el producto escalar.'
                : 'The angle between two lines is the angle between their direction vectors. It is calculated using the dot product.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang==='es'?'Fórmula principal':'Main formula'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div>cos <i>θ</i> = (U₁·U₂)/(|U₁|·|U₂|)</div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>U₁·U₂ = U₁ₓ·U₂ₓ + U₁ᵧ·U₂ᵧ</div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>|U| = √(Uₓ² + Uᵧ²)</div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang==='es'?'Casos especiales':'Special cases'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div>U₁·U₂ = 0 → <i>θ</i> = 90°</div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>{lang==='es'?'Rectas perpendiculares':'Perpendicular lines'}</div>
                  <div>cos <i>θ</i> = ±1 → <i>θ</i> = 0°</div>
                  <div style={{fontSize:13,color:'var(--fg-3)'}}>{lang==='es'?'Rectas paralelas':'Parallel lines'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin:0,padding:24,fontSize:11.5,lineHeight:1.7,overflow:'auto',color:'var(--fg-1)',background:'var(--surface-2)' }}>
{`// Angle between two lines using direction vectors
// Line 1: A(x1,y1) → B(x2,y2)  Direction: U1 = (x2-x1, y2-y1)
// Line 2: C(x3,y3) → D(x4,y4)  Direction: U2 = (x4-x3, y4-y3)

const U1x = B.x - A.x;
const U1y = B.y - A.y;
const U2x = D.x - C.x;
const U2y = D.y - C.y;

// Dot product and magnitudes
const dot = U1x * U2x + U1y * U2y;
const len1 = Math.hypot(U1x, U1y);
const len2 = Math.hypot(U2x, U2y);

// Angle in radians and degrees
const cosTheta = dot / (len1 * len2);
const thetaRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
const thetaDeg = thetaRad * 180 / Math.PI;

// Check perpendicular
if (Math.abs(dot) < 0.001) {
  console.log('Lines are perpendicular (90°)');
}`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};
