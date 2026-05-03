// EquationsModule.tsx — Equations chapter: interactive equations + tabs + derivation

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { EQUATION_ITEMS, STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import { Degree1EquationItem, CubicFigure, QuarticFigure, calculateCubicRoots, calculateQuarticRoots } from './EquationsItems.tsx';
import { System2Figure, System3Figure } from './SystemComponents';
import { QuadraticInequalityFigure } from './InequalityComponents';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

// ── Derivation steps per degree ───────────────────────────────────
const CUBIC_DERIV = {
  es: [
    'La forma general es ax³ + bx² + cx + d = 0, con a ≠ 0.',
    'Se sustituye x = t − b/(3a) para eliminar el término cuadrático y obtener la cúbica deprimida t³ + pt + q = 0.',
    'Se calculan los coeficientes: p = (3ac − b²) / 3a²  y  q = (2b³ − 9abc + 27a²d) / 27a³.',
    'El discriminante Δ = −4p³ − 27q² indica las raíces: Δ > 0 → 3 reales; Δ = 0 → raíz doble; Δ < 0 → 1 real.',
    'La fórmula de Cardano: t = ∛(−q/2 + √(q²/4 + p³/27)) + ∛(−q/2 − √(q²/4 + p³/27)).',
    'Finalmente se recupera la variable original: x = t − b/(3a).',
  ],
  en: [
    'The general form is ax³ + bx² + cx + d = 0, with a ≠ 0.',
    'Substitute x = t − b/(3a) to eliminate the quadratic term and get the depressed cubic t³ + pt + q = 0.',
    'Compute the coefficients: p = (3ac − b²) / 3a²  and  q = (2b³ − 9abc + 27a²d) / 27a³.',
    'The discriminant Δ = −4p³ − 27q² tells the roots: Δ > 0 → 3 real; Δ = 0 → double root; Δ < 0 → 1 real.',
    "Cardano's formula: t = ∛(−q/2 + √(q²/4 + p³/27)) + ∛(−q/2 − √(q²/4 + p³/27)).",
    'Recover the original variable: x = t − b/(3a).',
  ],
};

const QUARTIC_DERIV = {
  es: [
    'La forma general es ax⁴ + bx³ + cx² + dx + e = 0, con a ≠ 0.',
    'Se divide entre a y se sustituye x = t − b/(4a) para eliminar el término cúbico.',
    'Se obtiene la cuártica deprimida: t⁴ + pt² + qt + r = 0 (sin término en t³).',
    'Se introduce un parámetro m y se construye la ecuación resolvente cúbica en m.',
    'Con m conocido, la cuártica se factoriza en dos cuadráticas: (t² + m)² = (…)² .',
    'Se resuelven las dos ecuaciones cuadráticas para obtener hasta 4 raíces reales.',
  ],
  en: [
    'The general form is ax⁴ + bx³ + cx² + dx + e = 0, with a ≠ 0.',
    'Divide by a and substitute x = t − b/(4a) to eliminate the cubic term.',
    'This gives the depressed quartic: t⁴ + pt² + qt + r = 0 (no t³ term).',
    'Introduce a parameter m and build the resolvent cubic equation in m.',
    'With m known, the quartic factors into two quadratics: (t² + m)² = (…)².',
    'Solve the two quadratic equations to obtain up to 4 real roots.',
  ],
};

export const EquationsModule = ({ lang, setRoute }: Props) => {
  const C = STRINGS[lang].chapter;

  const [item, setItem] = useState('degree2');
  const [tab, setTab]   = useState<'formula' | 'explore' | 'svg'>('explore');
  const [step, setStep] = useState(0);
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const [d, setD] = useState(2);
  const [e, setE] = useState(1);

  // System coefficients
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(-1);
  const [c1, setC1] = useState(2);
  const [a2, setA2] = useState(2);
  const [b2, setB2] = useState(1);
  const [c2, setC2] = useState(-1);

  // 3x3 system coefficients
  const [coeff3x3] = useState([
    [1, 2, -1, 2],
    [2, -1, 1, 1],
    [1, 1, 1, 3]
  ]);

  // Inequality coefficients
  const [ineqA, setIneqA] = useState(1);
  const [ineqB, setIneqB] = useState(-2);
  const [ineqC, setIneqC] = useState(-3);
  const [ineqOp, setIneqOp] = useState('>');

  const disc = b * b - 4 * a * c;
  const vx = -b / (2 * a);
  const vy = a * vx * vx + b * vx + c;

  const degree2Roots = disc > 0
    ? [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)]
    : disc === 0 ? [vx] : [];

  const roots = item === 'degree3'
    ? calculateCubicRoots(a, b, c, d)
    : item === 'degree4'
    ? calculateQuarticRoots(a, b, c, d, e)
    : degree2Roots;
  const fmt = (n: number) =>
    Number.isFinite(n) ? (Math.abs(n) < 0.005 ? 0 : +n.toFixed(2)) : '—';

  const discTone  = disc > 0 ? 'var(--accent)' : disc === 0 ? 'var(--construction)' : 'var(--handle)';
  const discLabel = disc > 0 ? C.eqDiscPos : disc === 0 ? C.eqDiscZero : C.eqDiscNeg;

  const crumbBtn: React.CSSProperties = {
    background: 'transparent', border: 'none', padding: 0,
    color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)',
  };
  const stepBtn: React.CSSProperties = {
    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-xs)', padding: 4, cursor: 'pointer',
    color: 'var(--fg-2)', display: 'inline-flex',
  };

  const itemLabels = {
    es: ['Grado 1 — lineal','Grado 2 — cuadrática','Grado 3 — cúbica','Grado 4 — cuártica','Sistema 2×2','Sistema 3+','Inecuaciones'],
    en: ['Degree 1 — linear','Degree 2 — quadratic','Degree 3 — cubic','Degree 4 — quartic','System 2×2','System 3+','Inequations'],
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
          {STRINGS[lang].chapters.equations.title}
        </span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '-0.02em' }}>
            {STRINGS[lang].chapters.equations.title}
          </h1>
          <p style={{ color: 'var(--fg-3)', fontSize: 15, marginTop: 6 }}>
            {STRINGS[lang].chapters.equations.blurb}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={ghostBtn}><Icon name="Share" size={14}/> {C.share}</button>
          <button style={ghostBtn}><Icon name="Copy" size={14}/> {C.copy}</button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Item list */}
        <nav style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 6, position: 'sticky', top: 76,
        }}>
          {EQUATION_ITEMS.map((it, i) => {
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
                {itemLabels[lang][i]}
              </button>
            );
          })}
        </nav>

        {/* Center column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Equation Components */}
          {item === 'degree1' && <Degree1EquationItem lang={lang} />}
          
          {item === 'degree2' && (
            <>
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
                {tab === 'explore' && <ParabolaFigure a={a} b={b} c={c} roots={roots} vx={vx} vy={vy} setB={setB} setC={setC} />}
                {tab === 'formula' && (item === 'degree2' ? <EqFormulaPane lang={lang} /> : <CubicFormulaPane lang={lang} />)}
                {tab === 'svg'     && (item === 'degree2' ? <EqSvgPane /> : <EqSvgPane />)}
              </div>

              {/* Coefficient sliders */}
              {tab === 'explore' && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--hairline)',
                  borderRadius: 'var(--r-md)', padding: 18,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                    {C.eqCoefficients}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <CoefSlider name="a" value={a} setValue={setA} min={-3} max={3} step={0.5} accent="var(--accent)" />
                    <CoefSlider name="b" value={b} setValue={setB} min={-6} max={6} step={0.5} accent="var(--formula)" />
                    <CoefSlider name="c" value={c} setValue={setC} min={-6} max={6} step={0.5} accent="var(--construction)" />
                  </div>
                </div>
              )}

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
                      {C.step} {step + 1} {C.of} {C.eqDerivation.length}
                    </span>
                    <button onClick={() => setStep(Math.min(C.eqDerivation.length - 1, step + 1))} style={stepBtn}><Icon name="ChevronRight" size={14}/></button>
                  </div>
                </div>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {C.eqDerivation.map((s, i) => (
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
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {item === 'degree3' && (
            <>
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
                {tab === 'explore' && <CubicFigure a={a} b={b} c={c} d={d} setD={setD} />}
                {tab === 'formula' && <CubicFormulaPane lang={lang} />}
                {tab === 'svg'     && <EqSvgPane />}
              </div>

              {/* Coefficient sliders */}
              {tab === 'explore' && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--hairline)',
                  borderRadius: 'var(--r-md)', padding: 18,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                    {C.eqCoefficients}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
                    <CoefSlider name="a" value={a} setValue={setA} min={-3} max={3} step={0.5} accent="var(--accent)" />
                    <CoefSlider name="b" value={b} setValue={setB} min={-6} max={6} step={0.5} accent="var(--formula)" />
                    <CoefSlider name="c" value={c} setValue={setC} min={-6} max={6} step={0.5} accent="var(--construction)" />
                    <CoefSlider name="d" value={d} setValue={setD} min={-6} max={6} step={0.5} accent="var(--handle)" />
                  </div>
                </div>
              )}

              {/* Derivation — cubic */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--hairline)',
                borderRadius: 'var(--r-md)', padding: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{C.derivation}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-3)', fontSize: 12 }}>
                    <button onClick={() => setStep(Math.max(0, step - 1))} style={stepBtn}><Icon name="ChevronLeft" size={14}/></button>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {C.step} {step + 1} {C.of} {CUBIC_DERIV[lang].length}
                    </span>
                    <button onClick={() => setStep(Math.min(CUBIC_DERIV[lang].length - 1, step + 1))} style={stepBtn}><Icon name="ChevronRight" size={14}/></button>
                  </div>
                </div>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CUBIC_DERIV[lang].map((txt, i) => (
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
            </>
          )}

          {item === 'degree4' && (
            <>
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
                {tab === 'explore' && <QuarticFigure a={a} b={b} c={c} d={d} e={e} setE={setE} />}
                {tab === 'formula' && <QuarticFormulaPane lang={lang} />}
                {tab === 'svg'     && (item === 'degree4' ? <QuarticSvgPane /> : <EqSvgPane />)}
              </div>

              {/* Coefficient sliders */}
              {tab === 'explore' && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--hairline)',
                  borderRadius: 'var(--r-md)', padding: 18,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                    {C.eqCoefficients}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 14 }}>
                    <CoefSlider name="a" value={a} setValue={setA} min={-3} max={3} step={0.5} accent="var(--accent)" />
                    <CoefSlider name="b" value={b} setValue={setB} min={-6} max={6} step={0.5} accent="var(--formula)" />
                    <CoefSlider name="c" value={c} setValue={setC} min={-6} max={6} step={0.5} accent="var(--construction)" />
                    <CoefSlider name="d" value={d} setValue={setD} min={-6} max={6} step={0.5} accent="var(--handle)" />
                    <CoefSlider name="e" value={e} setValue={setE} min={-6} max={6} step={0.5} accent="var(--accent)" />
                  </div>
                </div>
              )}

              {/* Derivation — quartic */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--hairline)',
                borderRadius: 'var(--r-md)', padding: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{C.derivation}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-3)', fontSize: 12 }}>
                    <button onClick={() => setStep(Math.max(0, step - 1))} style={stepBtn}><Icon name="ChevronLeft" size={14}/></button>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {C.step} {step + 1} {C.of} {QUARTIC_DERIV[lang].length}
                    </span>
                    <button onClick={() => setStep(Math.min(QUARTIC_DERIV[lang].length - 1, step + 1))} style={stepBtn}><Icon name="ChevronRight" size={14}/></button>
                  </div>
                </div>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {QUARTIC_DERIV[lang].map((txt, i) => (
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
            </>
          )}

          {/* System 2x2 */}
          {item === 'system2' && (
            <>
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
                {tab === 'explore' && <System2Figure a1={a1} b1={b1} c1={c1} a2={a2} b2={b2} c2={c2} />}
                {tab === 'formula' && <System2FormulaPane lang={lang} />}
                {tab === 'svg'     && <System2SvgPane />}
              </div>

              {/* Coefficient sliders */}
              {tab === 'explore' && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--hairline)',
                  borderRadius: 'var(--r-md)', padding: 18,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                    {lang === 'es' ? 'Coeficientes' : 'Coefficients'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--fg-4)', marginBottom: 4 }}>Ecuación 1</div>
                      <CoefSlider name="a₁" value={a1} setValue={setA1} min={-5} max={5} step={0.5} accent="var(--accent)" />
                      <CoefSlider name="b₁" value={b1} setValue={setB1} min={-5} max={5} step={0.5} accent="var(--formula)" />
                      <CoefSlider name="c₁" value={c1} setValue={setC1} min={-5} max={5} step={0.5} accent="var(--construction)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--fg-4)', marginBottom: 4 }}>Ecuación 2</div>
                      <CoefSlider name="a₂" value={a2} setValue={setA2} min={-5} max={5} step={0.5} accent="var(--accent)" />
                      <CoefSlider name="b₂" value={b2} setValue={setB2} min={-5} max={5} step={0.5} accent="var(--formula)" />
                      <CoefSlider name="c₂" value={c2} setValue={setC2} min={-5} max={5} step={0.5} accent="var(--construction)" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* System 3x3 */}
          {item === 'system3' && (
            <>
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
                {tab === 'explore' && <System3Figure coefficients={coeff3x3} lang={lang} />}
                {tab === 'formula' && <System3FormulaPane lang={lang} />}
                {tab === 'svg'     && <System3SvgPane />}
              </div>
            </>
          )}

          {/* Inequalities */}
          {item === 'inequations' && (
            <>
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
                {tab === 'explore' && <QuadraticInequalityFigure a={ineqA} b={ineqB} c={ineqC} operator={ineqOp} />}
                {tab === 'formula' && <InequalityFormulaPane lang={lang} />}
                {tab === 'svg'     && <InequalitySvgPane />}
              </div>

              {/* Coefficient sliders */}
              {tab === 'explore' && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--hairline)',
                  borderRadius: 'var(--r-md)', padding: 18,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
                    {lang === 'es' ? 'Coeficientes' : 'Coefficients'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
                    <CoefSlider name="a" value={ineqA} setValue={setIneqA} min={-5} max={5} step={0.5} accent="var(--accent)" />
                    <CoefSlider name="b" value={ineqB} setValue={setIneqB} min={-5} max={5} step={0.5} accent="var(--formula)" />
                    <CoefSlider name="c" value={ineqC} setValue={setIneqC} min={-5} max={5} step={0.5} accent="var(--construction)" />
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--fg-4)', marginBottom: 4 }}>Operador</div>
                      <select value={ineqOp} onChange={e => setIneqOp(e.target.value)} 
                        style={{ width: '100%', padding: 4, background: 'var(--surface-2)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-xs)' }}>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&ge;</option>
                        <option value="<=">&le;</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Inspector removed */}
      </div>
    </div>
  );
};

// ── Coefficient slider ────────────────────────────────────────────
const CoefSlider = ({ name, value, setValue, min, max, step, accent }: {
  name: string; value: number; setValue: (v: number) => void;
  min: number; max: number; step: number; accent: string;
}) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 16, color: accent }}>{name}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>{value}</span>
    </span>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => setValue(parseFloat(e.target.value))}
      style={{ accentColor: accent, width: '100%' }}/>
  </label>
);

// ── Parabola figure ───────────────────────────────────────────────
const ParabolaFigure = ({ a, b, c, roots, vx, vy, setB, setC }: {
  a: number; b: number; c: number;
  roots: number[]; vx: number; vy: number;
  setB: (v: number) => void;
  setC: (v: number) => void;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const W = 720, H = 460;
  const ox = W / 2, oy = H / 2;
  const scale = Math.min(W, H) / 20;
  const toPx = (x: number, y: number) => ({ X: ox + x * scale, Y: oy - y * scale });

  const samples: string[] = [];
  for (let x = -ox / scale; x <= (W - ox) / scale; x += 0.1) {
    const y = a * x * x + b * x + c;
    const p = toPx(x, y);
    if (p.Y >= -100 && p.Y <= H + 100)
      samples.push(`${samples.length === 0 ? 'M' : 'L'}${p.X.toFixed(1)} ${p.Y.toFixed(1)}`);
  }

  const onVertexDown = (e: React.PointerEvent) => {
    if (Math.abs(a) < 0.001) return;
    e.preventDefault(); e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    isDragging.current = true;
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging.current || !svgRef.current || Math.abs(a) < 0.001) return;
    const r  = svgRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - r.left) * (W / r.width) - ox) / scale;
    const rawY = (oy - (e.clientY - r.top) * (H / r.height)) / scale;
    const newVx = Math.round(rawX * 2) / 2;
    const newVy = Math.round(rawY * 2) / 2;
    setB(-2 * a * newVx);
    setC(newVy - a * newVx * newVx);
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', background: 'var(--surface)' }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { isDragging.current = false; }}
      onPointerLeave={() => { isDragging.current = false; }}>
      <defs>
        <pattern id="para-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="para-grid-bold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#para-grid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#para-grid-bold)"/>

      <line x1={0} y1={oy} x2={W} y2={oy} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={ox} y1={0} x2={ox} y2={H} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={W - 14} y={oy - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={ox + 8}  y={14}    fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {[-8, -6, -4, -2, 2, 4, 6, 8].map(t => (
        <g key={t}>
          <line x1={ox + t * scale} y1={oy - 4} x2={ox + t * scale} y2={oy + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox + t * scale} y={oy + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}
      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={ox - 4} y1={oy - t * scale} x2={ox + 4} y2={oy - t * scale} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox - 8} y={oy - t * scale + 3} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="end">{t}</text>
        </g>
      ))}

      <path d={samples.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Root markers */}
      {roots.map((r, i) => {
        const p = toPx(r, 0);
        return (
          <g key={i}>
            <circle cx={p.X} cy={p.Y} r="7" fill="var(--handle)" stroke="white" strokeWidth="2"/>
            <text x={p.X} y={p.Y + 22} fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" textAnchor="middle">
              x={(+r.toFixed(2))}
            </text>
          </g>
        );
      })}

      <circle cx={ox} cy={oy} r="3" fill="var(--fg-1)"/>

      {/* Vertex — draggable handle */}
      {Number.isFinite(vx) && Number.isFinite(vy) && Math.abs(a) > 0.001 && (() => {
        const v = toPx(vx, vy);
        const inView = v.Y > 10 && v.Y < H - 10;
        return inView ? (
          <g style={{ cursor: 'grab' }} onPointerDown={onVertexDown}>
            <line x1={v.X} y1={v.Y} x2={v.X} y2={oy} stroke="var(--construction)" strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx={v.X} cy={v.Y} r="14" fill="var(--construction)" fillOpacity="0.15"/>
            <circle cx={v.X} cy={v.Y} r="6"  fill="var(--construction)" stroke="white" strokeWidth="2"/>
            <text x={v.X + 16} y={v.Y - 6} fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--construction)">V</text>
          </g>
        ) : null;
      })()}
    </svg>
  );
};

// ── Formula pane ──────────────────────────────────────────────────
const EqFormulaPane = ({ lang }: { lang: Lang }) => {
  const C = STRINGS[lang].chapter;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{C.eqFormulaTitle}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560 }}>{C.eqFormulaBody}</p>
      <div style={{
        marginTop: 24, padding: 28, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 28,
      }}>
        <i>x</i> = (−<i>b</i> ± √(<i>b</i>² − 4<i>ac</i>)) / 2<i>a</i>
      </div>
      <div style={{
        marginTop: 16, padding: 18, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 20, color: 'var(--fg-2)',
      }}>
        Δ = <i>b</i>² − 4<i>ac</i>
      </div>
    </div>
  );
};

// ── Cubic Formula pane ───────────────────────────────────────────
const CubicFormulaPane = ({ lang }: { lang: Lang }) => {
  const es = lang === 'es';
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
        {es ? 'Ecuación cúbica' : 'Cubic equation'}
      </h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, lineHeight: 1.6 }}>
        {es
          ? 'Una ecuación cúbica tiene la forma ax³ + bx² + cx + d = 0 y posee hasta 3 raíces reales. Para resolverla se reduce a una cúbica deprimida mediante la sustitución x = t − b/(3a).'
          : 'A cubic equation has the form ax³ + bx² + cx + d = 0 and has up to 3 real roots. It is solved by reducing to a depressed cubic via the substitution x = t − b/(3a).'}
      </p>

      {/* General form */}
      <div style={{
        marginTop: 24, padding: 20, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 28,
      }}>
        <i style={{ color: 'var(--accent)' }}>a</i><i>x</i>³ + <i style={{ color: 'var(--formula)' }}>b</i><i>x</i>² + <i style={{ color: 'var(--construction)' }}>c</i><i>x</i> + <i style={{ color: 'var(--handle)' }}>d</i> = 0
      </div>

      {/* Depressed cubic */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{
          padding: 18, background: 'var(--surface-2)',
          borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {es ? 'Cúbica deprimida (t³ + pt + q = 0)' : 'Depressed cubic (t³ + pt + q = 0)'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 15, lineHeight: 2, color: 'var(--fg-2)' }}>
            <div><i>p</i> = (3<i>ac</i> − <i>b</i>²) / 3<i>a</i>²</div>
            <div><i>q</i> = (2<i>b</i>³ − 9<i>abc</i> + 27<i>a</i>²<i>d</i>) / 27<i>a</i>³</div>
          </div>
        </div>
        <div style={{
          padding: 18, background: 'var(--surface-2)',
          borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {es ? 'Discriminante' : 'Discriminant'}
          </div>
          <div style={{ fontFamily: 'var(--font-math)', fontSize: 15, lineHeight: 2, color: 'var(--fg-2)' }}>
            <div>Δ = −4<i>p</i>³ − 27<i>q</i>²</div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.7 }}>
            <div>Δ &gt; 0 → {es ? '3 raíces reales distintas' : '3 distinct real roots'}</div>
            <div>Δ = 0 → {es ? 'raíz repetida' : 'repeated root'}</div>
            <div>Δ &lt; 0 → {es ? '1 raíz real' : '1 real root'}</div>
          </div>
        </div>
      </div>

      {/* Cardano note */}
      <div style={{
        marginTop: 12, padding: 14, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6,
      }}>
        {es
          ? 'Fórmula de Cardano (1545): t = ∛(−q/2 + √(q²/4 + p³/27)) + ∛(−q/2 − √(q²/4 + p³/27))'
          : "Cardano's formula (1545): t = ∛(−q/2 + √(q²/4 + p³/27)) + ∛(−q/2 − √(q²/4 + p³/27))"}
      </div>
    </div>
  );
};

// ── Quartic Formula pane ──────────────────────────────────────────
const QuarticFormulaPane = ({ lang }: { lang: Lang }) => {
  const es = lang === 'es';
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
        {es ? 'Ecuación cuártica' : 'Quartic equation'}
      </h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, lineHeight: 1.6 }}>
        {es
          ? 'Una ecuación cuártica tiene la forma ax⁴ + bx³ + cx² + dx + e = 0 y posee hasta 4 raíces reales. El método de Ferrari (1540) la reduce a dos ecuaciones cuadráticas.'
          : 'A quartic equation has the form ax⁴ + bx³ + cx² + dx + e = 0 and has up to 4 real roots. Ferrari\'s method (1540) reduces it to two quadratic equations.'}
      </p>

      {/* General form */}
      <div style={{
        marginTop: 24, padding: 20, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 26,
      }}>
        <i style={{ color: 'var(--accent)' }}>a</i><i>x</i>⁴ + <i style={{ color: 'var(--formula)' }}>b</i><i>x</i>³ + <i style={{ color: 'var(--construction)' }}>c</i><i>x</i>² + <i style={{ color: 'var(--handle)' }}>d</i><i>x</i> + <i style={{ color: 'var(--accent)' }}>e</i> = 0
      </div>

      {/* Ferrari steps */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{
          padding: 18, background: 'var(--surface-2)',
          borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {es ? 'Método de Ferrari' : "Ferrari's method"}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8 }}>
            <div>1. {es ? 'Dividir entre a, obtener cuártica mónica' : 'Divide by a → monic quartic'}</div>
            <div>2. {es ? 'Sustituir x = t − b/(4a) para eliminar x³' : 'Sub x = t − b/(4a) to remove x³'}</div>
            <div>3. {es ? 'Resolver la cúbica auxiliar (resolvente)' : 'Solve auxiliary cubic (resolvent)'}</div>
            <div>4. {es ? 'Resolver dos ecuaciones cuadráticas' : 'Solve two quadratic equations'}</div>
          </div>
        </div>
        <div style={{
          padding: 18, background: 'var(--surface-2)',
          borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            {es ? 'Número de raíces reales' : 'Number of real roots'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.9 }}>
            <div>0 {es ? 'raíces reales' : 'real roots'}</div>
            <div>2 {es ? 'raíces reales' : 'real roots'}</div>
            <div>4 {es ? 'raíces reales' : 'real roots'}</div>
            <div style={{ marginTop: 8, color: 'var(--fg-4)', fontSize: 12 }}>
              {es ? '(1 o 3 solo con raíces repetidas)' : '(1 or 3 only with repeated roots)'}
            </div>
          </div>
        </div>
      </div>

      {/* Discriminant note */}
      <div style={{
        marginTop: 12, padding: 14, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6,
      }}>
        {es
          ? 'El discriminante Δ determina la naturaleza de las raíces: Δ > 0 → 0 ó 4 reales; Δ = 0 → raíz múltiple; Δ < 0 → 2 reales y 2 complejas.'
          : 'The discriminant Δ determines root nature: Δ > 0 → 0 or 4 real; Δ = 0 → multiple root; Δ < 0 → 2 real and 2 complex.'}
      </div>
    </div>
  );
};

// ── Quartic SVG pane ─────────────────────────────────────────────────
const QuarticSvgPane = () => (
  <div style={{ padding: '32px 40px', minHeight: 460 }}>
    <img src={`/antiguos/explore/eqdegre4.svg`} style={{ maxWidth: '100%', height: 'auto' }} />
  </div>
);

// ── SVG code pane ─────────────────────────────────────────────────
const EqSvgPane = () => (
  <pre style={{ margin: 0, padding: 24, fontSize: 12.5, lineHeight: 1.55, minHeight: 460, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{`// Quadratic equation — SVG snippet
function solveQuadratic(a, b, c) {
  const disc = b * b - 4 * a * c;
  if (disc < 0) return [];
  if (disc === 0) return [-b / (2 * a)];
  const s = Math.sqrt(disc);
  return [(-b - s) / (2 * a), (-b + s) / (2 * a)];
}

// Sample the parabola y = ax² + bx + c
const pts = [];
for (let x = -10; x <= 10; x += 0.1) {
  pts.push([x, a * x * x + b * x + c]);

// Modern: D3-scale + Motion One
import { scaleLinear } from "d3-scale";
import { animate } from "motion";
`}
  </pre>
);

// ── System 2x2 Formula pane ──────────────────────────────────────────────────
const System2FormulaPane = ({ lang }: { lang: Lang }) => {
  const C = STRINGS[lang].chapter;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{C.eqFormulaTitle}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560 }}>
        {lang === 'es' 
          ? 'Un sistema de ecuaciones lineales 2×2 se puede resolver usando la regla de Cramer o el método de sustitución.'
          : 'A 2×2 linear system can be solved using Cramer\'s rule or substitution method.'}
      </p>
      <div style={{
        marginTop: 24, padding: 28, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 24,
      }}>
        <div>a₁x + b₁y = c₁</div>
        <div>a₂x + b₂y = c₂</div>
      </div>
      <div style={{
        marginTop: 16, padding: 18, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 20, color: 'var(--fg-2)',
      }}>
        <div>x = (c₁b₂ - c₂b₁) / (a₁b₂ - a₂b₁)</div>
        <div>y = (a₁c₂ - a₂c₁) / (a₁b₂ - a₂b₁)</div>
      </div>
    </div>
  );
};

// ── System 2x2 SVG pane ─────────────────────────────────────────────────
const System2SvgPane = () => (
  <div style={{ padding: '32px 40px', minHeight: 460 }}>
    <img src={`/antiguos/explore/system2.svg`} style={{ maxWidth: '100%', height: 'auto' }} />
  </div>
);

// ── System 3x3 Formula pane ──────────────────────────────────────────────────
const System3FormulaPane = ({ lang }: { lang: Lang }) => {
  const C = STRINGS[lang].chapter;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{C.eqFormulaTitle}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560 }}>
        {lang === 'es' 
          ? 'Un sistema de ecuaciones lineales 3×3 se puede resolver usando la regla de Cramer o eliminación gaussiana.'
          : 'A 3×3 linear system can be solved using Cramer\'s rule or Gaussian elimination.'}
      </p>
      <div style={{
        marginTop: 24, padding: 28, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 20,
      }}>
        <div>a₁x + b₁y + c₁z = d₁</div>
        <div>a₂x + b₂y + c₂z = d₂</div>
        <div>a₃x + b₃y + c₃z = d₃</div>
      </div>
    </div>
  );
};

// ── System 3x3 SVG pane ─────────────────────────────────────────────────
const System3SvgPane = () => (
  <div style={{ padding: '32px 40px', minHeight: 460 }}>
    <img src={`/antiguos/explore/system3.svg`} style={{ maxWidth: '100%', height: 'auto' }} />
  </div>
);

// ── Inequality Formula pane ──────────────────────────────────────────────────
const InequalityFormulaPane = ({ lang }: { lang: Lang }) => {
  const C = STRINGS[lang].chapter;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{C.eqFormulaTitle}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560 }}>
        {lang === 'es' 
          ? 'Las inecuaciones cuadráticas se resuelven encontrando las raíces y determinando los intervalos donde se cumple la desigualdad.'
          : 'Quadratic inequalities are solved by finding roots and determining intervals where the inequality holds.'}
      </p>
      <div style={{
        marginTop: 24, padding: 28, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 24,
      }}>
        <div>ax² + bx + c {'>'} 0</div>
      </div>
    </div>
  );
};

// ── Inequality SVG pane ─────────────────────────────────────────────────
const InequalitySvgPane = () => (
  <div style={{ padding: '32px 40px', minHeight: 460 }}>
    <img src={`/antiguos/explore/inequality.svg`} style={{ maxWidth: '100%', height: 'auto' }} />
  </div>
);
