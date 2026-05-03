// LinesModule.tsx — Capítulo Rectas
// Misma arquitectura que VectorsModule:
//  - Lista de 8 ítems a la izquierda (sticky)
//  - Ítem activo ocupa las 2 columnas restantes con su propio layout (tabs + figura + inspector + derivación)
// Primer ítem implementado: "Recta por 2 puntos" (LineABItem)
// Resto: "Próximamente" hasta que se implementen

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import { LineABItem } from './LineABItem';
import { LineParallelItem } from './LineParallelItem';
import { LineOrthogonalItem, MediatrixItem, LineInterItem, LineParamItem, LineDistItem, LineAngleItem } from './LineItems';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

const LINE_ITEMS = [
  { id: 'lineAB',       icon: '1' },
  { id: 'parallel',     icon: '2' },
  { id: 'orthogonal',   icon: '3' },
  { id: 'mediatrix',    icon: '4' },
  { id: 'intersection', icon: '5' },
  { id: 'parametric',   icon: '6' },
  { id: 'distance',     icon: '7' },
  { id: 'angle',        icon: '8' },
] as const;

type LineItemId = typeof LINE_ITEMS[number]['id'];

const LABELS = {
  es: [
    'Recta por 2 puntos',
    'Recta paralela',
    'Recta ortogonal',
    'Mediatriz',
    'Intersección de rectas',
    'Ecuación paramétrica',
    'Distancia punto-recta',
    'Ángulo entre rectas',
  ],
  en: [
    'Line by 2 points',
    'Line parallel',
    'Line orthogonal',
    'Mediatrix',
    'Lines intersection',
    'Parametric equation',
    'Distance point-line',
    'Angle between lines',
  ],
};

export const LinesModule = ({ lang, setRoute }: Props) => {
  const [item, setItem] = useState<LineItemId>('lineAB');
  const labels = LABELS[lang];
  const ch = STRINGS[lang].chapters.lines;

  const crumbBtn: React.CSSProperties = {
    background: 'transparent', border: 'none', padding: 0,
    color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)',
  };

  return (
    <div style={{ padding: '24px 32px 64px', maxWidth: 1240, margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-3)', marginBottom: 14 }}>
        <button onClick={() => setRoute({ view: 'landing' })} style={crumbBtn}>
          {STRINGS[lang].nav.library}
        </button>
        <Icon name="ChevronRight" size={12} />
        <span style={{ color: 'var(--fg-1)', fontWeight: 600 }}>{ch.title}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '-0.02em' }}>
            {ch.title}
          </h1>
          <p style={{ color: 'var(--fg-3)', fontSize: 15, marginTop: 6 }}>{ch.blurb}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={ghostBtn}><Icon name="Share" size={14}/> {STRINGS[lang].chapter.share}</button>
          <button style={ghostBtn}><Icon name="Copy" size={14}/> {STRINGS[lang].chapter.copy}</button>
        </div>
      </div>

      {/* Tab nav horizontal */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap',
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)', padding: '10px 12px', marginBottom: 20,
      }}>
        {LINE_ITEMS.map((it, i) => {
          const active = item === it.id;
          return (
            <button key={it.id} onClick={() => setItem(it.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 'var(--r-sm)',
                background: active ? 'var(--accent-soft)' : 'transparent',
                border: '1px solid ' + (active ? 'var(--accent)' : 'transparent'),
                color: active ? 'var(--fg-1)' : 'var(--fg-2)',
                fontFamily: 'var(--font-sans)', fontSize: 13,
                fontWeight: active ? 600 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {labels[i]}
            </button>
          );
        })}
      </div>

      {/* Content — pleno ancho */}
      <div>
        {item === 'lineAB'       && <LineABItem lang={lang} />}
        {item === 'parallel'     && <LineParallelItem lang={lang} />}
        {item === 'orthogonal'   && <LineOrthogonalItem lang={lang} />}
        {item === 'mediatrix'    && <MediatrixItem lang={lang} />}
        {item === 'intersection' && <LineInterItem lang={lang} />}
        {item === 'parametric'   && <LineParamItem lang={lang} />}
        {item === 'distance'     && <LineDistItem lang={lang} />}
        {item === 'angle'        && <LineAngleItem lang={lang} />}
      </div>
    </div>
  );
};

// ── Coming soon placeholder ────────────────────────────────────────
// const ComingSoon = ({ lang, label }: { lang: Lang; label: string }) => (
//   <div style={{
//     background: 'var(--surface)', border: '1px solid var(--hairline)',
//     borderRadius: 'var(--r-md)', padding: '56px 32px', textAlign: 'center',
//   }}>
//     <div style={{
//       width: 48, height: 48, borderRadius: 'var(--r-md)',
//       background: 'var(--accent-soft)', display: 'grid', placeItems: 'center',
//       color: 'var(--accent)', margin: '0 auto 16px', fontSize: 22,
//     }}>✦</div>
//     <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>{label}</div>
//     <p style={{ color: 'var(--fg-3)', maxWidth: 360, margin: '0 auto', fontSize: 14 }}>
//       {lang === 'es'
//         ? 'Ítem en preparación. Sigue el mismo patrón que "Recta por 2 puntos".'
//         : 'Item in preparation. Follows the same pattern as "Line by 2 points".'}
//     </p>
//   </div>
// );
