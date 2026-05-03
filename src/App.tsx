// App.tsx — root component, routing, theme management

import { useState, useEffect } from 'react';
import { AppShell, type Route } from './components/AppShell';
import { Landing } from './chapters/Landing';
import { VectorsModule } from './chapters/vectors/VectorsModule';
import { EquationsModule } from './chapters/equations/EquationsModule';
import { LinesModule } from './chapters/lines/LinesModule';
import { MatricesModule } from './chapters/matrices/MatricesModule';
import { TrigModule } from './chapters/trig/TrigModule';
import { TransformationsModule } from './chapters/transformations/TransformationsModule';
import { CurvesModule } from './chapters/curves/CurvesModule';
import { AreasModule } from './chapters/areas/AreasModule';
import { InterpolationModule } from './chapters/interpolation/InterpolationModule';
import { IntersectionsModule } from './chapters/intersections/IntersectionsModule';
import { STRINGS } from './lib/data';
import type { Lang } from './lib/data';

const ComingSoon = ({ lang, chapter, setRoute }: { lang: Lang; chapter: string; setRoute: (r: Route) => void }) => {
  const ch = STRINGS[lang].chapters[chapter as keyof typeof STRINGS['es']['chapters']];
  return (
    <div style={{ padding: 56, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: 'var(--r-md)',
        background: 'var(--accent-soft)', display: 'grid', placeItems: 'center',
        color: 'var(--accent)', margin: '0 auto 20px',
        fontSize: 28,
      }}>
        ✦
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>
        {ch?.title ?? chapter}
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
        {lang === 'es'
          ? 'Capítulo en preparación. La estructura es idéntica al módulo de Vectores.'
          : 'Chapter in preparation. Structure matches the Vectors module.'}
      </p>
      <button
        onClick={() => setRoute({ view: 'chapter', chapter: 'vectors' })}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '11px 18px', background: 'var(--accent)', color: 'var(--on-accent)',
          border: 'none', borderRadius: 'var(--r-sm)',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
        {lang === 'es' ? 'Ver módulo de Vectores' : 'Open Vectors module'}
      </button>
    </div>
  );
};

export const App = () => {
  const [lang, setLang] = useState<Lang>('es');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [route, setRoute] = useState<Route>({ view: 'landing' });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderContent = () => {
    if (route.view === 'landing') {
      return <Landing lang={lang} setRoute={setRoute} />;
    }
    if (route.view === 'chapter') {
      switch (route.chapter) {
        case 'vectors':   return <VectorsModule   lang={lang} setRoute={setRoute} />;
        case 'equations': return <EquationsModule lang={lang} setRoute={setRoute} />;
        case 'lines':     return <LinesModule     lang={lang} setRoute={setRoute} />;
        case 'matrix':       return <MatricesModule  lang={lang} setRoute={setRoute} />;
        case 'trigonometry': return <TrigModule      lang={lang} setRoute={setRoute} />;
        case 'transformations': return <TransformationsModule lang={lang} setRoute={setRoute} />;
        case 'curves':       return <CurvesModule        lang={lang} setRoute={setRoute} />;
        case 'areas':        return <AreasModule         lang={lang} setRoute={setRoute} />;
        case 'interpolation': return <InterpolationModule  lang={lang} setRoute={setRoute} />;
        case 'intersections': return <IntersectionsModule lang={lang} setRoute={setRoute} />;
        default:             return <ComingSoon lang={lang} chapter={route.chapter} setRoute={setRoute} />;
      }
    }
  };

  return (
    <AppShell
      lang={lang} setLang={setLang}
      theme={theme} setTheme={setTheme}
      route={route} setRoute={setRoute}
    >
      {renderContent()}
    </AppShell>
  );
};
