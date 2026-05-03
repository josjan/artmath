// CurvesItems.tsx — Ítems del capítulo Curvas
// Interactivos: puntos arrastrables directamente en el SVG
// Exporta: CircleItem, EllipseItem, ArcCircleItem, ArcEllipseItem, QuadraticItem, CubicItem

import { useState } from 'react';
import type { Lang } from '../../lib/data';

// ── Utilities ────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ro = (v: number) => Math.round(v);

function getSVGPoint(svg: SVGSVGElement, cx: number, cy: number): { x: number; y: number } {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const pt = svg.createSVGPoint();
  pt.x = cx; pt.y = cy;
  const r = pt.matrixTransform(ctm.inverse());
  return { x: r.x, y: r.y };
}

// ── SVG Shared Components ─────────────────────────────────────────────────────
// All canvases: width=500 height=400 viewBox="-250 -200 500 400" (origin at center)

function SvgGrid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse" x="-250" y="-200">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect x="-250" y="-200" width="500" height="400" fill={`url(#${id})`}/>
      <line x1="-250" y1="0" x2="250" y2="0" stroke="var(--fg-4)" strokeWidth="0.75"/>
      <line x1="0" y1="-200" x2="0" y2="200" stroke="var(--fg-4)" strokeWidth="0.75"/>
    </>
  );
}

type HandleProps = { x: number; y: number; fill?: string; active: boolean; onDown: () => void; label?: string };
function Handle({ x, y, fill = 'var(--accent)', active, onDown, label }: HandleProps) {
  return (
    <g>
      <circle cx={x} cy={y} r={active ? 9 : 7} fill={fill} stroke="white" strokeWidth="2"
        style={{ cursor: 'grab' }} onMouseDown={onDown}/>
      {label && (
        <text x={x + 10} y={y - 9} fontSize="11" fill={fill}
          style={{ pointerEvents: 'none', userSelect: 'none' }}>{label}</text>
      )}
    </g>
  );
}

type InfoProps = { params: [string, string | number][]; code: string; hint?: string; extra?: React.ReactNode };
function InfoPanel({ params, code, hint, extra }: InfoProps) {
  return (
    <div style={{ minWidth: 190, maxWidth: 250, fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.9, color: 'var(--fg-2)', marginBottom: 14 }}>
        {params.map(([k, v]) => (
          <div key={k}>
            <span style={{ color: 'var(--fg-4)' }}>{k}</span>
            {' = '}
            <span style={{ color: 'var(--fg-1)', fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
      {extra}
      <pre style={{
        background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--r-sm)',
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-1)', lineHeight: 1.6,
        margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      }}>{code}</pre>
      {hint && <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 10, lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

// ── Shared Tab Bar ─────────────────────────────────────────────────────────────

const TabBar = ({ tab, setTab, lang }: { tab: string; setTab: (t: string) => void; lang: Lang }) => {
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

// ── Formula helpers ────────────────────────────────────────────────────────────

const fLabelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--fg-4)',
  letterSpacing: '0.08em', textTransform: 'uppercase',
  marginBottom: 8, marginTop: 20,
};
const FLabel = ({ children }: { children: React.ReactNode }) =>
  <div style={fLabelStyle}>{children}</div>;

const FCode = ({ children }: { children: string }) => (
  <pre style={{
    background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--r-sm)',
    fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)',
    lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap',
  }}>{children}</pre>
);

const FEq = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: 'var(--font-math)', fontStyle: 'italic',
    fontSize: 16, color: 'var(--formula)', lineHeight: 1.9, paddingLeft: 16,
  }}>{children}</div>
);

const FAttr = ({ name, desc }: { name: string; desc: string }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2, color: 'var(--fg-2)' }}>
    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{name}</span>
    <span style={{ color: 'var(--fg-4)' }}> — </span>
    <span style={{ fontFamily: 'var(--font-sans)' }}>{desc}</span>
  </div>
);

const formulaBox: React.CSSProperties = { fontFamily: 'var(--font-sans)', maxWidth: 620 };

// ── Curve Item Template ────────────────────────────────────────────────────────

const CurveItem = ({ title, formulaContent, svgPath, exploreContent, lang }: {
  title: string; formulaContent: React.ReactNode; svgPath: string;
  exploreContent: React.ReactNode; lang: Lang;
}) => {
  const [tab, setTab] = useState('explore');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{title}</h2>
        <TabBar tab={tab} setTab={setTab} lang={lang} />
      </div>
      {tab === 'formula' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 32, minHeight: 400 }}>
          {formulaContent}
        </div>
      )}
      {tab === 'explore' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 24, minHeight: 420 }}>
          {exploreContent}
        </div>
      )}
      {/* {tab === 'svg' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 24,
          display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400,
        }}>
          <div style={{ background: 'white', borderRadius: 'var(--r-sm)', boxShadow: '0 1px 6px rgba(0,0,0,.14)', maxWidth: '100%' }}>
            <img src={`/antiguos/svg/${svgPath}`} alt={`${title} SVG`}
              style={{ display: 'block', maxWidth: '100%', height: 'auto' }}/>
          </div>
        </div>
      )} */}
    </div>
  );
};

// ── SVG canvas style ──────────────────────────────────────────────────────────
const canvasStyle = (dragging: boolean): React.CSSProperties => ({
  border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
  flexShrink: 0, cursor: dragging ? 'grabbing' : 'default', display: 'block',
});

const rowStyle: React.CSSProperties = {
  display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap',
};

// ── 1. Circle ──────────────────────────────────────────────────────────────────

export const CircleItem = ({ lang }: { lang: Lang }) => {
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [r, setR] = useState(80);
  const [rAngle, setRAngle] = useState(0); // angle of radius handle in radians

  type D = 'center' | 'radius' | null;
  const [drag, setDrag] = useState<D>(null);

  const rhx = cx + r * Math.cos(rAngle);
  const rhy = cy + r * Math.sin(rAngle);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);
    if (drag === 'center') {
      setCx(clamp(ro(p.x), -190, 190));
      setCy(clamp(ro(p.y), -150, 150));
    } else {
      const dx = p.x - cx, dy = p.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 3) {
        setR(clamp(ro(d), 10, 170));
        setRAngle(Math.atan2(dy, dx));
      }
    }
  };

  const title = lang === 'es' ? 'Círculo' : 'Circle';
  const hint = lang === 'es'
    ? 'Arrastra C para mover el centro. Arrastra el punto naranja para cambiar el radio.'
    : 'Drag C to move the center. Drag the orange point to change the radius.';

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>SVG element</FLabel>
      <FCode>{'<circle cx="cx" cy="cy" r="r"/>'}</FCode>
      <FLabel>Implicit equation</FLabel>
      <FEq>(x − cx)² + (y − cy)² = r²</FEq>
      <FLabel>Parametric equations</FLabel>
      <FEq>x = cx + r · cos(t)</FEq>
      <FEq>y = cy + r · sin(t),  t ∈ [0, 2π]</FEq>
      <FLabel>Attributes</FLabel>
      <FAttr name="cx, cy" desc={lang === 'es' ? 'Coordenadas del centro (0 por defecto)' : 'Center coordinates (default 0)'}/>
      <FAttr name="r" desc={lang === 'es' ? 'Radio — debe ser no negativo' : 'Radius — must be non-negative'}/>
    </div>
  );

  return (
    <CurveItem title={title} formulaContent={formulaContent} svgPath="circle.svg" lang={lang} exploreContent={
      <div style={rowStyle}>
        <svg width="500" height="400" viewBox="-250 -200 500 400"
          style={canvasStyle(!!drag)}
          onMouseMove={onMove} onMouseUp={() => setDrag(null)} onMouseLeave={() => setDrag(null)}>
          <SvgGrid id="g-circle"/>
          <circle cx={cx} cy={cy} r={r} fill="var(--accent)" fillOpacity="0.15" stroke="var(--accent)" strokeWidth="2"/>
          <line x1={cx} y1={cy} x2={rhx} y2={rhy} stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="4,2"/>
          <text x={(cx+rhx)/2+4} y={(cy+rhy)/2-7} fontSize="11" fill="var(--fg-3)"
            style={{ pointerEvents:'none', userSelect:'none' }}>r={r}</text>
          <Handle x={cx} y={cy} active={drag==='center'} onDown={() => setDrag('center')} label="C"/>
          <Handle x={rhx} y={rhy} fill="#f59e0b" active={drag==='radius'} onDown={() => setDrag('radius')}/>
        </svg>
        <InfoPanel
          params={[['cx', cx], ['cy', cy], ['r', r]]}
          code={`<circle\n  cx="${cx}" cy="${cy}"\n  r="${r}"/>`}
          hint={hint}
        />
      </div>
    }/>
  );
};

// ── 2. Ellipse ─────────────────────────────────────────────────────────────────

export const EllipseItem = ({ lang }: { lang: Lang }) => {
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [rx, setRx] = useState(100);
  const [ry, setRy] = useState(60);

  type D = 'center' | 'rx' | 'ry' | null;
  const [drag, setDrag] = useState<D>(null);

  const rxhx = cx + rx, rxhy = cy;
  const ryhx = cx, ryhy = cy + ry;

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);
    if (drag === 'center') {
      setCx(clamp(ro(p.x), -140, 140));
      setCy(clamp(ro(p.y), -130, 130));
    } else if (drag === 'rx') {
      setRx(clamp(ro(Math.abs(p.x - cx)), 8, 235));
    } else {
      setRy(clamp(ro(Math.abs(p.y - cy)), 8, 185));
    }
  };

  const title = lang === 'es' ? 'Elipse' : 'Ellipse';
  const hint = lang === 'es'
    ? 'Arrastra C para mover el centro, los puntos de color para cambiar los radios.'
    : 'Drag C to move the center, the colored handles to change the radii.';

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>SVG element</FLabel>
      <FCode>{'<ellipse cx="cx" cy="cy" rx="rx" ry="ry"/>'}</FCode>
      <FLabel>Implicit equation</FLabel>
      <FEq>((x − cx) / rx)² + ((y − cy) / ry)² = 1</FEq>
      <FLabel>Parametric equations</FLabel>
      <FEq>x = cx + rx · cos(t)</FEq>
      <FEq>y = cy + ry · sin(t),  t ∈ [0, 2π]</FEq>
      <FLabel>Attributes</FLabel>
      <FAttr name="cx, cy" desc={lang === 'es' ? 'Coordenadas del centro' : 'Center coordinates'}/>
      <FAttr name="rx" desc={lang === 'es' ? 'Radio horizontal (semieje en x)' : 'Horizontal radius (semi-axis along x)'}/>
      <FAttr name="ry" desc={lang === 'es' ? 'Radio vertical (semieje en y)' : 'Vertical radius (semi-axis along y)'}/>
    </div>
  );

  return (
    <CurveItem title={title} formulaContent={formulaContent} svgPath="ellipse.svg" lang={lang} exploreContent={
      <div style={rowStyle}>
        <svg width="500" height="400" viewBox="-250 -200 500 400"
          style={canvasStyle(!!drag)}
          onMouseMove={onMove} onMouseUp={() => setDrag(null)} onMouseLeave={() => setDrag(null)}>
          <SvgGrid id="g-ellipse"/>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="var(--accent)" fillOpacity="0.15" stroke="var(--accent)" strokeWidth="2"/>
          <line x1={cx} y1={cy} x2={rxhx} y2={rxhy} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2"/>
          <line x1={cx} y1={cy} x2={ryhx} y2={ryhy} stroke="#10b981" strokeWidth="1" strokeDasharray="4,2"/>
          <text x={(cx+rxhx)/2+2} y={cy-8} fontSize="11" fill="#f59e0b"
            style={{ pointerEvents:'none', userSelect:'none' }}>rx={rx}</text>
          <text x={cx+6} y={(cy+ryhy)/2+4} fontSize="11" fill="#10b981"
            style={{ pointerEvents:'none', userSelect:'none' }}>ry={ry}</text>
          <Handle x={cx} y={cy} active={drag==='center'} onDown={() => setDrag('center')} label="C"/>
          <Handle x={rxhx} y={rxhy} fill="#f59e0b" active={drag==='rx'} onDown={() => setDrag('rx')}/>
          <Handle x={ryhx} y={ryhy} fill="#10b981" active={drag==='ry'} onDown={() => setDrag('ry')}/>
        </svg>
        <InfoPanel
          params={[['cx', cx], ['cy', cy], ['rx', rx], ['ry', ry]]}
          code={`<ellipse\n  cx="${cx}" cy="${cy}"\n  rx="${rx}" ry="${ry}"/>`}
          hint={hint}
        />
      </div>
    }/>
  );
};

// ── 3. Circular Arc ────────────────────────────────────────────────────────────

export const ArcCircleItem = ({ lang }: { lang: Lang }) => {
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [r, setR] = useState(100);
  const [rAngle, setRAngle] = useState(Math.PI * 0.25); // angle for radius handle
  const [startDeg, setStartDeg] = useState(-30);
  const [endDeg, setEndDeg] = useState(200);
  const [largeArc, setLargeArc] = useState(0);

  type D = 'center' | 'radius' | 'start' | 'end' | null;
  const [drag, setDrag] = useState<D>(null);

  const sa = startDeg * Math.PI / 180;
  const ea = endDeg * Math.PI / 180;
  const x1 = ro(cx + r * Math.cos(sa)), y1 = ro(cy + r * Math.sin(sa));
  const x2 = ro(cx + r * Math.cos(ea)), y2 = ro(cy + r * Math.sin(ea));
  const rhx = cx + r * Math.cos(rAngle), rhy = cy + r * Math.sin(rAngle);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);
    if (drag === 'center') {
      setCx(clamp(ro(p.x), -140, 140));
      setCy(clamp(ro(p.y), -90, 90));
    } else if (drag === 'radius') {
      const dx = p.x - cx, dy = p.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 3) { setR(clamp(ro(d), 10, 170)); setRAngle(Math.atan2(dy, dx)); }
    } else {
      const dx = p.x - cx, dy = p.y - cy;
      const angle = ro(Math.atan2(dy, dx) * 180 / Math.PI);
      if (drag === 'start') setStartDeg(angle);
      else setEndDeg(angle);
    }
  };

  const arcPath = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  const title = lang === 'es' ? 'Arco Circular' : 'Circular Arc';

  const flagToggle = (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6 }}>large-arc-flag</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {([0, 1] as const).map(v => (
          <button key={v} onClick={() => setLargeArc(v)} style={{
            padding: '4px 16px', borderRadius: 'var(--r-sm)',
            border: '1px solid var(--hairline)',
            background: largeArc === v ? 'var(--accent)' : 'var(--surface-2)',
            color: largeArc === v ? 'white' : 'var(--fg-1)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)',
          }}>{v}</button>
        ))}
      </div>
    </div>
  );

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>SVG path command</FLabel>
      <FCode>{'<path d="M x1 y1 A r r 0 large-arc sweep x2 y2"/>'}</FCode>
      <FLabel>Arc parameters</FLabel>
      <FAttr name="r" desc={lang === 'es' ? 'Radio (igual en x e y — arco circular)' : 'Radius (same for x and y — circular arc)'}/>
      <FAttr name="x-rotation" desc={lang === 'es' ? 'Siempre 0 para un círculo (ejes alineados)' : 'Always 0 for a circle (axis-aligned)'}/>
      <FAttr name="large-arc-flag" desc={lang === 'es' ? '1 = arco > 180°,  0 = arco ≤ 180°' : '1 = arc > 180°,  0 = arc ≤ 180°'}/>
      <FAttr name="sweep-flag" desc={lang === 'es' ? '1 = sentido horario,  0 = antihorario' : '1 = clockwise,  0 = counter-clockwise'}/>
      <FAttr name="x2, y2" desc={lang === 'es' ? 'Punto final del arco' : 'End point of the arc'}/>
      <FLabel>{lang === 'es' ? 'Puntos desde centro y ángulo' : 'Endpoints from center and angle'}</FLabel>
      <FEq>x = cx + r · cos(θ)</FEq>
      <FEq>y = cy + r · sin(θ)</FEq>
    </div>
  );

  return (
    <CurveItem title={title} formulaContent={formulaContent} svgPath="arcCircle.svg" lang={lang} exploreContent={
      <div style={rowStyle}>
        <svg width="500" height="400" viewBox="-250 -200 500 400"
          style={canvasStyle(!!drag)}
          onMouseMove={onMove} onMouseUp={() => setDrag(null)} onMouseLeave={() => setDrag(null)}>
          <SvgGrid id="g-arccirc"/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--diagram-grid)" strokeWidth="1" strokeDasharray="5,3"/>
          <path d={arcPath} fill="none" stroke="var(--accent)" strokeWidth="3"/>
          <line x1={cx} y1={cy} x2={rhx} y2={rhy} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
          <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,2"/>
          <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="3,2"/>
          <Handle x={cx} y={cy} active={drag==='center'} onDown={() => setDrag('center')} label="C"/>
          <Handle x={rhx} y={rhy} fill="#f59e0b" active={drag==='radius'} onDown={() => setDrag('radius')}/>
          <Handle x={x1} y={y1} fill="#4ade80" active={drag==='start'} onDown={() => setDrag('start')} label={`${startDeg}°`}/>
          <Handle x={x2} y={y2} fill="#f87171" active={drag==='end'} onDown={() => setDrag('end')} label={`${endDeg}°`}/>
        </svg>
        <InfoPanel
          params={[['r', r], ['start', `${startDeg}°`], ['end', `${endDeg}°`]]}
          code={`<path d="M ${x1} ${y1}\n  A ${r} ${r} 0 ${largeArc} 1\n  ${x2} ${y2}"/>`}
          hint={lang === 'es'
            ? 'Arrastra los puntos sobre la circunferencia para cambiar el arco.'
            : 'Drag the handles around the circumference to reshape the arc.'}
          extra={flagToggle}
        />
      </div>
    }/>
  );
};

// ── 4. Elliptic Arc ────────────────────────────────────────────────────────────

export const ArcEllipseItem = ({ lang }: { lang: Lang }) => {
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [rx, setRx] = useState(110);
  const [ry, setRy] = useState(65);
  const [startDeg, setStartDeg] = useState(-30);
  const [endDeg, setEndDeg] = useState(200);
  const [largeArc, setLargeArc] = useState(0);

  type D = 'center' | 'start' | 'end' | 'rx' | 'ry' | null;
  const [drag, setDrag] = useState<D>(null);

  const sa = startDeg * Math.PI / 180;
  const ea = endDeg * Math.PI / 180;
  const x1 = ro(cx + rx * Math.cos(sa)), y1 = ro(cy + ry * Math.sin(sa));
  const x2 = ro(cx + rx * Math.cos(ea)), y2 = ro(cy + ry * Math.sin(ea));
  const rxhx = cx + rx, rxhy = cy;
  const ryhx = cx, ryhy = cy + ry;

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);
    if (drag === 'center') {
      setCx(clamp(ro(p.x), -130, 130));
      setCy(clamp(ro(p.y), -120, 120));
    } else if (drag === 'rx') {
      setRx(clamp(ro(Math.abs(p.x - cx)), 8, 235));
    } else if (drag === 'ry') {
      setRy(clamp(ro(Math.abs(p.y - cy)), 8, 185));
    } else {
      const dx = (p.x - cx) / rx, dy = (p.y - cy) / ry;
      const angle = ro(Math.atan2(dy, dx) * 180 / Math.PI);
      if (drag === 'start') setStartDeg(angle);
      else setEndDeg(angle);
    }
  };

  const arcPath = `M ${x1} ${y1} A ${rx} ${ry} 0 ${largeArc} 1 ${x2} ${y2}`;
  const title = lang === 'es' ? 'Arco Elíptico' : 'Elliptic Arc';

  const flagToggle = (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6 }}>large-arc-flag</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {([0, 1] as const).map(v => (
          <button key={v} onClick={() => setLargeArc(v)} style={{
            padding: '4px 16px', borderRadius: 'var(--r-sm)',
            border: '1px solid var(--hairline)',
            background: largeArc === v ? 'var(--accent)' : 'var(--surface-2)',
            color: largeArc === v ? 'white' : 'var(--fg-1)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)',
          }}>{v}</button>
        ))}
      </div>
    </div>
  );

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>SVG path command</FLabel>
      <FCode>{'<path d="M x1 y1 A rx ry x-rot large-arc sweep x2 y2"/>'}</FCode>
      <FLabel>Arc parameters</FLabel>
      <FAttr name="rx, ry" desc={lang === 'es' ? 'Semiejes de la elipse (horizontal, vertical)' : 'Semi-axes of the ellipse (horizontal, vertical)'}/>
      <FAttr name="x-rotation" desc={lang === 'es' ? 'Rotación de los ejes (grados)' : 'Rotation of the ellipse axes (degrees)'}/>
      <FAttr name="large-arc-flag" desc={lang === 'es' ? '1 = arco > 180°,  0 = arco ≤ 180°' : '1 = arc > 180°,  0 = arc ≤ 180°'}/>
      <FAttr name="sweep-flag" desc={lang === 'es' ? '1 = sentido horario,  0 = antihorario' : '1 = clockwise,  0 = counter-clockwise'}/>
      <FAttr name="x2, y2" desc={lang === 'es' ? 'Punto final del arco' : 'End point of the arc'}/>
      <FLabel>{lang === 'es' ? 'Puntos desde centro y ángulo' : 'Endpoints from center and angle'}</FLabel>
      <FEq>x = cx + rx · cos(θ)</FEq>
      <FEq>y = cy + ry · sin(θ)</FEq>
    </div>
  );

  return (
    <CurveItem title={title} formulaContent={formulaContent} svgPath="arcEllipse.svg" lang={lang} exploreContent={
      <div style={rowStyle}>
        <svg width="500" height="400" viewBox="-250 -200 500 400"
          style={canvasStyle(!!drag)}
          onMouseMove={onMove} onMouseUp={() => setDrag(null)} onMouseLeave={() => setDrag(null)}>
          <SvgGrid id="g-arcell"/>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="var(--diagram-grid)" strokeWidth="1" strokeDasharray="5,3"/>
          <line x1={cx} y1={cy} x2={rxhx} y2={rxhy} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
          <line x1={cx} y1={cy} x2={ryhx} y2={ryhy} stroke="#10b981" strokeWidth="1" strokeDasharray="3,2"/>
          <path d={arcPath} fill="none" stroke="var(--accent)" strokeWidth="3"/>
          <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="var(--fg-4)" strokeWidth="0.75" strokeDasharray="3,2"/>
          <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--fg-4)" strokeWidth="0.75" strokeDasharray="3,2"/>
          <Handle x={cx} y={cy} active={drag==='center'} onDown={() => setDrag('center')} label="C"/>
          <Handle x={rxhx} y={rxhy} fill="#f59e0b" active={drag==='rx'} onDown={() => setDrag('rx')}/>
          <Handle x={ryhx} y={ryhy} fill="#10b981" active={drag==='ry'} onDown={() => setDrag('ry')}/>
          <Handle x={x1} y={y1} fill="#4ade80" active={drag==='start'} onDown={() => setDrag('start')} label={`${startDeg}°`}/>
          <Handle x={x2} y={y2} fill="#f87171" active={drag==='end'} onDown={() => setDrag('end')} label={`${endDeg}°`}/>
        </svg>
        <InfoPanel
          params={[['rx', rx], ['ry', ry], ['start', `${startDeg}°`], ['end', `${endDeg}°`]]}
          code={`<path d="M ${x1} ${y1}\n  A ${rx} ${ry} 0 ${largeArc} 1\n  ${x2} ${y2}"/>`}
          hint={lang === 'es'
            ? 'Arrastra los puntos para remodelar el arco y los radios de la elipse.'
            : 'Drag the handles to reshape the arc and the ellipse radii.'}
          extra={flagToggle}
        />
      </div>
    }/>
  );
};

// ── 5. Quadratic Bezier ────────────────────────────────────────────────────────

export const QuadraticItem = ({ lang }: { lang: Lang }) => {
  const [p0, setP0] = useState({ x: -110, y: 90 });
  const [cp, setCp] = useState({ x: 0,    y: -110 });  // control point
  const [p2, setP2] = useState({ x: 110,  y: 90 });

  type D = 'p0' | 'cp' | 'p2' | null;
  const [drag, setDrag] = useState<D>(null);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);
    const c = { x: clamp(ro(p.x), -240, 240), y: clamp(ro(p.y), -190, 190) };
    if (drag === 'p0') setP0(c);
    else if (drag === 'cp') setCp(c);
    else setP2(c);
  };

  // De Casteljau at t=0.5 to illustrate the construction
  const m01 = { x: (p0.x + cp.x) / 2, y: (p0.y + cp.y) / 2 };
  const m12 = { x: (cp.x + p2.x) / 2, y: (cp.y + p2.y) / 2 };
  const mid  = { x: (m01.x + m12.x) / 2, y: (m01.y + m12.y) / 2 };

  const title = lang === 'es' ? 'Bézier Cuadrática' : 'Quadratic Bezier';

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>SVG path command</FLabel>
      <FCode>{'<path d="M x0 y0 Q cx cy x2 y2"/>'}</FCode>
      <FLabel>Parametric formula</FLabel>
      <FEq>P(t) = (1−t)² · P₀  +  2t(1−t) · C  +  t² · P₂</FEq>
      <FEq>t ∈ [0, 1]</FEq>
      <FLabel>Points</FLabel>
      <FAttr name="P0 (x0, y0)" desc={lang === 'es' ? 'Punto de inicio' : 'Start point'}/>
      <FAttr name="C (cx, cy)" desc={lang === 'es' ? 'Punto de control — la curva se acerca hacia C' : 'Control point — the curve is pulled toward C'}/>
      <FAttr name="P2 (x2, y2)" desc={lang === 'es' ? 'Punto final' : 'End point'}/>
      <FLabel>{lang === 'es' ? 'Construcción de De Casteljau (en t = 0.5)' : 'De Casteljau construction (at t = 0.5)'}</FLabel>
      <FEq>M₀₁ = midpoint(P₀, C)</FEq>
      <FEq>M₁₂ = midpoint(C, P₂)</FEq>
      <FEq>P(0.5) = midpoint(M₀₁, M₁₂)</FEq>
    </div>
  );

  return (
    <CurveItem title={title} formulaContent={formulaContent} svgPath="quadratic.svg" lang={lang} exploreContent={
      <div style={rowStyle}>
        <svg width="500" height="400" viewBox="-250 -200 500 400"
          style={canvasStyle(!!drag)}
          onMouseMove={onMove} onMouseUp={() => setDrag(null)} onMouseLeave={() => setDrag(null)}>
          <SvgGrid id="g-quad"/>
          {/* Control polygon */}
          <line x1={p0.x} y1={p0.y} x2={cp.x} y2={cp.y} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4,3"/>
          <line x1={cp.x} y1={cp.y} x2={p2.x} y2={p2.y} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4,3"/>
          {/* De Casteljau t=0.5 (light) */}
          <line x1={m01.x} y1={m01.y} x2={m12.x} y2={m12.y}
            stroke="var(--fg-3)" strokeWidth="0.75" strokeDasharray="2,4" opacity="0.5"/>
          <circle cx={mid.x} cy={mid.y} r="3" fill="var(--fg-3)" opacity="0.5"/>
          {/* Curve */}
          <path d={`M ${p0.x} ${p0.y} Q ${cp.x} ${cp.y} ${p2.x} ${p2.y}`}
            fill="none" stroke="var(--accent)" strokeWidth="3"/>
          {/* Handles */}
          <Handle x={p0.x} y={p0.y} fill="#4ade80" active={drag==='p0'} onDown={() => setDrag('p0')} label="P0"/>
          <Handle x={cp.x} y={cp.y} fill="#f59e0b" active={drag==='cp'} onDown={() => setDrag('cp')} label="C"/>
          <Handle x={p2.x} y={p2.y} fill="#f87171" active={drag==='p2'} onDown={() => setDrag('p2')} label="P2"/>
        </svg>
        <InfoPanel
          params={[
            ['P0', `(${p0.x}, ${p0.y})`],
            ['C',  `(${cp.x}, ${cp.y})`],
            ['P2', `(${p2.x}, ${p2.y})`],
          ]}
          code={`<path d="M ${p0.x} ${p0.y}\n  Q ${cp.x} ${cp.y}\n  ${p2.x} ${p2.y}"/>`}
          hint={lang === 'es'
            ? 'Arrastra P0/P2 (extremos) y C (punto de control) para cambiar la curva.'
            : 'Drag P0/P2 (endpoints) and C (control point) to reshape the curve.'}
        />
      </div>
    }/>
  );
};

// ── 6. Cubic Bezier ────────────────────────────────────────────────────────────

export const CubicItem = ({ lang }: { lang: Lang }) => {
  const [p0, setP0] = useState({ x: -120, y:  90 });
  const [c1, setC1] = useState({ x: -50,  y: -100 });
  const [c2, setC2] = useState({ x:  50,  y: -100 });
  const [p3, setP3] = useState({ x:  120, y:  90 });

  type D = 'p0' | 'c1' | 'c2' | 'p3' | null;
  const [drag, setDrag] = useState<D>(null);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);
    const c = { x: clamp(ro(p.x), -240, 240), y: clamp(ro(p.y), -190, 190) };
    if (drag === 'p0') setP0(c);
    else if (drag === 'c1') setC1(c);
    else if (drag === 'c2') setC2(c);
    else setP3(c);
  };

  const title = lang === 'es' ? 'Bézier Cúbica' : 'Cubic Bezier';

  const formulaContent = (
    <div style={formulaBox}>
      <FLabel>SVG path command</FLabel>
      <FCode>{'<path d="M x0 y0 C c1x c1y c2x c2y x3 y3"/>'}</FCode>
      <FLabel>Parametric formula</FLabel>
      <FEq>P(t) = (1−t)³ · P₀  +  3t(1−t)² · C₁  +  3t²(1−t) · C₂  +  t³ · P₃</FEq>
      <FEq>t ∈ [0, 1]</FEq>
      <FLabel>Points</FLabel>
      <FAttr name="P0 (x0, y0)" desc={lang === 'es' ? 'Punto de inicio' : 'Start point'}/>
      <FAttr name="C1 (c1x, c1y)" desc={lang === 'es' ? 'Primer punto de control — tangente en P0' : 'First control point — tangent direction at P0'}/>
      <FAttr name="C2 (c2x, c2y)" desc={lang === 'es' ? 'Segundo punto de control — tangente en P3' : 'Second control point — tangent direction at P3'}/>
      <FAttr name="P3 (x3, y3)" desc={lang === 'es' ? 'Punto final' : 'End point'}/>
    </div>
  );

  return (
    <CurveItem title={title} formulaContent={formulaContent} svgPath="cubic.svg" lang={lang} exploreContent={
      <div style={rowStyle}>
        <svg width="500" height="400" viewBox="-250 -200 500 400"
          style={canvasStyle(!!drag)}
          onMouseMove={onMove} onMouseUp={() => setDrag(null)} onMouseLeave={() => setDrag(null)}>
          <SvgGrid id="g-cubic"/>
          {/* Control polygon */}
          <line x1={p0.x} y1={p0.y} x2={c1.x} y2={c1.y} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" opacity="0.8"/>
          <line x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="var(--fg-4)" strokeWidth="1" strokeDasharray="4,3"/>
          <line x1={c2.x} y1={c2.y} x2={p3.x} y2={p3.y} stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" opacity="0.8"/>
          {/* Curve */}
          <path d={`M ${p0.x} ${p0.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p3.x} ${p3.y}`}
            fill="none" stroke="var(--accent)" strokeWidth="3"/>
          {/* Handles */}
          <Handle x={p0.x} y={p0.y} fill="#4ade80" active={drag==='p0'} onDown={() => setDrag('p0')} label="P0"/>
          <Handle x={c1.x} y={c1.y} fill="#f59e0b" active={drag==='c1'} onDown={() => setDrag('c1')} label="C1"/>
          <Handle x={c2.x} y={c2.y} fill="#a78bfa" active={drag==='c2'} onDown={() => setDrag('c2')} label="C2"/>
          <Handle x={p3.x} y={p3.y} fill="#f87171" active={drag==='p3'} onDown={() => setDrag('p3')} label="P3"/>
        </svg>
        <InfoPanel
          params={[
            ['P0', `(${p0.x}, ${p0.y})`],
            ['C1', `(${c1.x}, ${c1.y})`],
            ['C2', `(${c2.x}, ${c2.y})`],
            ['P3', `(${p3.x}, ${p3.y})`],
          ]}
          code={`<path d="M ${p0.x} ${p0.y}\n  C ${c1.x} ${c1.y} ${c2.x} ${c2.y}\n  ${p3.x} ${p3.y}"/>`}
          hint={lang === 'es'
            ? 'Arrastra los puntos. C1 controla la tangente en P0, C2 la tangente en P3.'
            : 'Drag the points. C1 controls the tangent at P0, C2 the tangent at P3.'}
        />
      </div>
    }/>
  );
};
