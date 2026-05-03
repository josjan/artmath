// Landing.tsx — Homepage hero + chapter grid

import { Icon } from '../components/Icon';
import { CHAPTERS, STRINGS, type Lang } from '../lib/data';
import { primaryBtn, ghostBtn, type Route } from '../components/AppShell';

interface LandingProps {
  lang: Lang;
  setRoute: (r: Route) => void;
}

export const Landing = ({ lang, setRoute }: LandingProps) => {
  const L = STRINGS[lang].landing;

  return (
    <div style={{ padding: '40px 56px 80px', maxWidth: 1240, margin: '0 auto' }}>

      {/* Hero */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56, alignItems: 'center', marginBottom: 64 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', borderRadius: 'var(--r-pill)',
            background: 'var(--accent-soft)', color: 'var(--accent)',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 20,
          }}>
            <Icon name="Sparkles" size={13} /> {L.eyebrow}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1.05,
            letterSpacing: '-0.02em', marginBottom: 18,
          }}>{L.title}</h1>
          <p style={{ fontSize: 17, color: 'var(--fg-2)', lineHeight: 1.55, maxWidth: 560, marginBottom: 28 }}>
            {L.sub}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setRoute({ view: 'chapter', chapter: 'vectors' })} style={primaryBtn}>
              {L.cta} <Icon name="ArrowRight" size={16} />
            </button>
            <button style={ghostBtn}>
              <Icon name="BookOpen" size={16} /> {L.ctaAlt}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
            {L.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--fg-1)' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <HeroDiagram />
      </section>

      {/* Continue card */}
      <section style={{ marginBottom: 48 }}>
        <ContinueCard lang={lang} setRoute={setRoute} />
      </section>

      {/* Chapter grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, letterSpacing: '-0.01em' }}>{L.featured}</h2>
          <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
            10 · {CHAPTERS.reduce((a, b) => a + b.itemCount, 0)} {lang === 'es' ? 'ejemplos' : 'examples'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {CHAPTERS.map(ch => {
            const meta = STRINGS[lang].chapters[ch.id as keyof typeof STRINGS['es']['chapters']];
            return (
              <button
                key={ch.id}
                onClick={() => setRoute({ view: 'chapter', chapter: ch.id })}
                style={{
                  textAlign: 'left', padding: 18, background: 'var(--surface)',
                  border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
                  boxShadow: 'var(--shadow-1)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-1)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--r-sm)',
                    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
                    display: 'grid', placeItems: 'center', color: 'var(--accent)',
                  }}>
                    <Icon name={ch.icon} size={18} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)' }}>
                    {String(ch.itemCount).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{meta.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.45 }}>{meta.blurb}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

// Mini hero diagram — parallelogram "sum of vectors" preview
const HeroDiagram = () => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-md)', padding: 16, boxShadow: 'var(--shadow-2)',
  }}>
    <svg viewBox="0 0 400 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <marker id="arrowAccent" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--accent)"/>
        </marker>
        <marker id="arrowFormula" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--formula)"/>
        </marker>
        <marker id="arrowHandle" viewBox="-12 -5 16 10" refX="0" refY="0" markerWidth="10" markerHeight="8" orient="auto">
          <path d="M-12 -5 L 0 0 L -12 5 z" fill="var(--handle)"/>
        </marker>
      </defs>
      <rect width="400" height="320" fill="url(#grid)"/>
      <line x1="40" y1="240" x2="380" y2="240" stroke="var(--fg-3)" strokeWidth="1"/>
      <line x1="40" y1="40"  x2="40" y2="240"  stroke="var(--fg-3)" strokeWidth="1"/>
      <path d="M 40 240 L 180 140 L 320 200 L 180 300 Z"
        fill="var(--highlight-soft)" fillOpacity="0.5"
        stroke="var(--fg-4)" strokeDasharray="3 3" strokeWidth="1"/>
      <line x1="40" y1="240" x2="180" y2="140" stroke="var(--accent)" strokeWidth="2.5" markerEnd="url(#arrowAccent)"/>
      <line x1="40" y1="240" x2="180" y2="300" stroke="var(--formula)" strokeWidth="2.5" markerEnd="url(#arrowFormula)"/>
      <line x1="40" y1="240" x2="320" y2="200" stroke="var(--handle)" strokeWidth="2.5" markerEnd="url(#arrowHandle)"/>
      <text x="105" y="180" fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--accent)">u</text>
      <text x="100" y="290" fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--formula)">v</text>
      <text x="240" y="210" fontFamily="var(--font-math)" fontStyle="italic" fontSize="18" fill="var(--handle)">u + v</text>
      <circle cx="40" cy="240" r="3" fill="var(--fg-1)"/>
      <text x="26" y="258" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-3)">O</text>
    </svg>
    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--handle)', display: 'inline-block' }}/>
      Vectores · suma <span style={{ color: 'var(--fg-4)' }}>·</span> u + v
    </div>
  </div>
);

const ContinueCard = ({ lang, setRoute }: LandingProps) => {
  const L = STRINGS[lang].landing;
  return (
    <button
      onClick={() => setRoute({ view: 'chapter', chapter: 'vectors' })}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, width: '100%',
        textAlign: 'left', padding: 16, cursor: 'pointer',
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)',
      }}>
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--r-sm)',
        background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent)',
      }}>
        <Icon name="Sparkles" size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
          {L.todayHint}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          {lang === 'es' ? 'Vectores · Suma de vectores' : 'Vectors · Sum of vectors'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>
          {lang === 'es' ? 'Paso 3 de 5 · Regla del paralelogramo' : 'Step 3 of 5 · Parallelogram rule'}
        </div>
      </div>
      <Icon name="ArrowRight" size={18} />
    </button>
  );
};
