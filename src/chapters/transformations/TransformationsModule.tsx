// TransformationsModule.tsx — Capítulo Transformaciones
// Misma arquitectura que TrigModule:
//  - Lista de 10 ítems a la izquierda (sticky)
//  - Ítem activo ocupa las 2 columnas restantes

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import {
  TranslateItem, RotateItem, ScaleItem, SkewXItem, SkewYItem,
  UniformScaleItem, SymetryItem, ReflectionItem, AffinityItem,
  SimilarityItem, AnyItem,
} from './TransformationsItems';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

const TRANSFORMATIONS_ITEMS = [
  { id: 'translate',    icon: '1' },
  { id: 'rotate',       icon: '2' },
  { id: 'scale',        icon: '3' },
  { id: 'skewX',        icon: '4' },
  { id: 'skewY',        icon: '5' },
  { id: 'uniformScale', icon: '6' },
  { id: 'symetry',      icon: '7' },
  { id: 'reflection',   icon: '8' },
  { id: 'affinity',     icon: '9' },
  { id: 'similarity',   icon: '10' },
  { id: 'any',          icon: '11' },
] as const;

type TransformationsItemId = typeof TRANSFORMATIONS_ITEMS[number]['id'];

const LABELS = {
  es: [
    'Traslación',
    'Rotación',
    'Escalado',
    'Sesgo X',
    'Sesgo Y',
    'Escalado Uniforme',
    'Simetría',
    'Reflexión',
    'Afinidad',
    'Similitud',
    'Cualquier Transformación',
  ],
  en: [
    'Translate',
    'Rotate',
    'Scale',
    'Skew X',
    'Skew Y',
    'Uniform Scale',
    'Symetry',
    'Reflection',
    'Affinity',
    'Similarity',
    'Any Transformation',
  ],
};

export const TransformationsModule = ({ lang, setRoute }: Props) => {
  const [item, setItem] = useState<TransformationsItemId>('translate');
  const labels = LABELS[lang];
  const ch = STRINGS[lang].chapters.transformations;

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
        {TRANSFORMATIONS_ITEMS.map((it, i) => {
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
        {item === 'translate'    && <TranslateItem    lang={lang} />}
        {item === 'rotate'       && <RotateItem       lang={lang} />}
        {item === 'scale'        && <ScaleItem        lang={lang} />}
        {item === 'skewX'        && <SkewXItem        lang={lang} />}
        {item === 'skewY'        && <SkewYItem        lang={lang} />}
        {item === 'uniformScale' && <UniformScaleItem lang={lang} />}
        {item === 'symetry'      && <SymetryItem      lang={lang} />}
        {item === 'reflection'   && <ReflectionItem   lang={lang} />}
        {item === 'affinity'     && <AffinityItem     lang={lang} />}
        {item === 'similarity'   && <SimilarityItem   lang={lang} />}
        {item === 'any'          && <AnyItem          lang={lang} />}
      </div>
    </div>
  );
};
