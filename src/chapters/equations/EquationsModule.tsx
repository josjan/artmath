// EquationsModule.tsx — Equations chapter: interactive equations + tabs + derivation

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { EQUATION_ITEMS, STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import { Degree1EquationItem, CubicFigure, QuarticFigure, calculateCubicRoots, calculateQuarticRoots } from './EquationsItems';
import { System2Figure, System3Figure } from './SystemComponents';
import { QuadraticInequalityFigure } from './InequalityComponents';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

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
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: 20, alignItems: 'start' }}>

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
                {tab === 'explore' && <ParabolaFigure a={a} b={b} c={c} roots={roots} vx={vx} vy={vy} />}
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
                {tab === 'explore' && <CubicFigure a={a} b={b} c={c} d={d} />}
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
                {tab === 'explore' && <QuarticFigure a={a} b={b} c={c} d={d} e={e} />}
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

        {/* Inspector */}
        <aside style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 18, position: 'sticky', top: 76,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 6 }}>
            {C.inspector}
          </div>

          {/* Live equation */}
          <div style={{
            fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 16,
            color: 'var(--fg-1)', padding: '10px 0', borderBottom: '1px solid var(--hairline)',
          }}>
            {item === 'degree4' ? (
              <>
                <span style={{ color: 'var(--accent)' }}>{fmt(a)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x⁴ + </span>
                <span style={{ color: 'var(--formula)' }}>{fmt(b)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x³ + </span>
                <span style={{ color: 'var(--construction)' }}>{fmt(c)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x² + </span>
                <span style={{ color: 'var(--handle)' }}>{fmt(d)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x + </span>
                <span style={{ color: 'var(--accent)' }}>{fmt(e)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}> = 0</span>
              </>
            ) : item === 'degree3' ? (
              <>
                <span style={{ color: 'var(--accent)' }}>{fmt(a)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x³ + </span>
                <span style={{ color: 'var(--formula)' }}>{fmt(b)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x² + </span>
                <span style={{ color: 'var(--construction)' }}>{fmt(c)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x + </span>
                <span style={{ color: 'var(--handle)' }}>{fmt(d)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}> = 0</span>
              </>
            ) : (
              <>
                <span style={{ color: 'var(--accent)' }}>{fmt(a)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x² + </span>
                <span style={{ color: 'var(--formula)' }}>{fmt(b)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>x + </span>
                <span style={{ color: 'var(--handle)' }}>{fmt(c)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}> = 0</span>
              </>
            )}
          </div>

          {/* Discriminant */}
          {item === 'degree2' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {C.eqDiscriminant}
              </div>
              <div style={{ fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 16, color: discTone, marginTop: 2 }}>
                Δ = {fmt(disc)}
              </div>
              <div style={{ fontSize: 12, color: discTone, marginTop: 2 }}>{discLabel}</div>
            </div>
          )}

          {/* Roots */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              {C.eqRoots}
            </div>
            {roots.length === 0 && <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>—</div>}
            {roots.map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: 'var(--font-math)', fontStyle: 'italic', fontSize: 14,
                padding: '3px 0', color: 'var(--fg-1)',
              }}>
                <span>x<sub style={{ fontSize: 10 }}>{i + 1}</sub></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', color: 'var(--accent)' }}>{fmt(r)}</span>
              </div>
            ))}
          </div>

          {/* Vertex */}
          {item === 'degree2' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {C.eqVertex}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>
                ({fmt(vx)}, {fmt(vy)})
              </div>
            </div>
          )}

          <button onClick={() => { setA(1); setB(-2); setC(-3); setD(2); setE(1); }}
            style={{ ...ghostBtn, width: '100%', marginTop: 16, justifyContent: 'center' }}>
            <Icon name="RotateCcw" size={13}/> {C.reset}
          </button>
        </aside>
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
const ParabolaFigure = ({ a, b, c, roots, vx, vy }: {
  a: number; b: number; c: number;
  roots: number[]; vx: number; vy: number;
}) => {
  const W = 720, H = 460;
  const ox = W / 2, oy = H / 2 + 60;
  const sx = 40, sy = 20;
  const toPx = (x: number, y: number) => ({ X: ox + x * sx, Y: oy - y * sy });

  const samples: string[] = [];
  const xMin = -ox / sx, xMax = (W - ox) / sx;
  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = a * x * x + b * x + c;
    const p = toPx(x, y);
    if (p.Y >= -100 && p.Y <= H + 100)
      samples.push(`${samples.length === 0 ? 'M' : 'L'}${p.X.toFixed(1)} ${p.Y.toFixed(1)}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--surface)' }}>
      <defs>
        <pattern id="eqgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="eqgridBold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#eqgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#eqgridBold)"/>

      <line x1={0} y1={oy} x2={W} y2={oy} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={ox} y1={0} x2={ox} y2={H} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={W - 14} y={oy - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={ox + 8}  y={14}    fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={ox + t * sx} y1={oy - 4} x2={ox + t * sx} y2={oy + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={ox + t * sx} y={oy + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}

      <path d={samples.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {Number.isFinite(vx) && Number.isFinite(vy) && (() => {
        const v = toPx(vx, vy);
        return (
          <g>
            <line x1={v.X} y1={v.Y} x2={v.X} y2={oy} stroke="var(--construction)" strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx={v.X} cy={v.Y} r="6" fill="var(--construction)" stroke="white" strokeWidth="2"/>
            <text x={v.X + 10} y={v.Y - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="13" fill="var(--construction)">V</text>
          </g>
        );
      })()}

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

// ── Cubic Formula pane ──────────────────────────────────────────────────
const CubicFormulaPane = ({ lang }: { lang: Lang }) => {
  const C = STRINGS[lang].chapter;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{C.eqFormulaTitle}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560 }}>{C.eqFormulaBody}</p>
      <div style={{
        marginTop: 24, padding: 28, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 32,
      }}>
        <i>x</i>³ + <i>b</i>x² + <i>c</i>x + <i>d</i> = 0
      </div>
      <div style={{
        marginTop: 16, padding: 18, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 20, color: 'var(--fg-2)',
      }}>
        <i>x</i> = (−<i>b</i> ± √(<i>b</i>² − 4<i>ac</i>)) / 2<i>a</i>
      </div>
      <div style={{
        marginTop: 16, padding: 18, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 18, color: 'var(--fg-2)',
      }}>
        Δ = <i>b</i>² − 4<i>ac</i>
      </div>
    </div>
  );
};

// ── Quartic Formula pane ──────────────────────────────────────────────────
const QuarticFormulaPane = ({ lang }: { lang: Lang }) => {
  const C = STRINGS[lang].chapter;
  return (
    <div style={{ padding: '32px 40px', minHeight: 460 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>{C.eqFormulaTitle}</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 560 }}>{C.eqFormulaBody}</p>
      <div style={{
        marginTop: 24, padding: 28, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 30,
      }}>
        <span style={{ color: 'var(--accent)' }}>ax</span>⁴ + 
        <span style={{ color: 'var(--formula)' }}>bx</span>³ + 
        <span style={{ color: 'var(--construction)' }}>cx</span>² + 
        <span style={{ color: 'var(--handle)' }}>dx</span> + 
        <span style={{ color: 'var(--accent)' }}>e</span> = 0
      </div>
      <div style={{
        marginTop: 16, padding: 18, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg-3)',
      }}>
        {lang === 'es' ? 'Máximo 4 raíces reales' : 'Maximum 4 real roots'}
      </div>
      <div style={{
        marginTop: 16, padding: 18, background: 'var(--surface-2)',
        borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
        textAlign: 'center', fontFamily: 'var(--font-math)', fontSize: 18, color: 'var(--fg-2)',
      }}>
        {lang === 'es' ? 'Fórmula general: ax⁴ + bx³ + cx² + dx + e = 0' : 'General formula: ax⁴ + bx³ + cx² + dx + e = 0'}
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
