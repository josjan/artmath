// InterpolationModule.tsx — Capítulo Interpolación
// Misma arquitectura que CurvesModule:
//  - Lista de 4 ítems a la izquierda (sticky)
//  - Ítem activo ocupa las 2 columnas restantes

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import {
  LinearInterpoItem, HermiteInterpoItem, CompareInterpoItem, CardinalInterpoItem,
} from './InterpolationItems.tsx';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

const INTERPOLATION_ITEMS = [
  { id: 'linearInterpo', icon: '1' },
  { id: 'hermiteInterpo', icon: '2' },
  { id: 'compareInterpo', icon: '3' },
  { id: 'cardinalInterpo', icon: '4' },
] as const;

type InterpolationItemId = typeof INTERPOLATION_ITEMS[number]['id'];

const LABELS = {
  es: [
    'Interpolación Lineal',
    'Interpolación Hermite',
    'Comparación de Interpolaciones',
    'Interpolación Cardinal',
  ],
  en: [
    'Linear Interpolation',
    'Hermite Interpolation',
    'Compare Interpolations',
    'Cardinal Interpolation',
  ],
};

export const InterpolationModule = ({ lang, setRoute }: Props) => {
  const [item, setItem] = useState<InterpolationItemId>('linearInterpo');
  const labels = LABELS[lang];
  const ch = STRINGS[lang].chapters.interpolation;

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
        {INTERPOLATION_ITEMS.map((it, i) => {
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
        {item === 'linearInterpo'  && <LinearInterpoItem  lang={lang} />}
        {item === 'hermiteInterpo' && <HermiteInterpoItem lang={lang} />}
        {item === 'compareInterpo' && <CompareInterpoItem lang={lang} />}
        {item === 'cardinalInterpo' && <CardinalInterpoItem lang={lang} />}
      </div>
    </div>
  );
};
