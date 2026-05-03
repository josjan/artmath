// TrigModule.tsx — Capítulo Trigonometría
// Misma arquitectura que MatricesModule:
//  - Lista de 8 ítems a la izquierda (sticky)
//  - Ítem activo ocupa las 2 columnas restantes

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import {
  SinusItem, CosinusItem, TangentItem,
  ArcSinusItem, ArcCosinusItem, ArcTangentItem,
  SumAnglesItem, ScalarAnglesItem,
} from './TrigItems';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

const TRIG_ITEMS = [
  { id: 'sinus',        icon: '1' },
  { id: 'cosinus',      icon: '2' },
  { id: 'tangent',      icon: '3' },
  { id: 'arcsinus',     icon: '4' },
  { id: 'arccosinus',   icon: '5' },
  { id: 'arctangent',   icon: '6' },
  { id: 'sumangles',    icon: '7' },
  { id: 'scalarangles', icon: '8' },
] as const;

type TrigItemId = typeof TRIG_ITEMS[number]['id'];

const LABELS = {
  es: [
    'Seno',
    'Coseno',
    'Tangente',
    'Arcoseno',
    'Arcocoseno',
    'Arcotangente',
    'Suma de ángulos',
    'Ángulo múltiplo',
  ],
  en: [
    'Sinus',
    'Cosinus',
    'Tangent',
    'Arcsinus',
    'Arccosinus',
    'Arctangent',
    'Sum of angles',
    'Scalar angles',
  ],
};

export const TrigModule = ({ lang, setRoute }: Props) => {
  const [item, setItem] = useState<TrigItemId>('sinus');
  const labels = LABELS[lang];
  const ch = STRINGS[lang].chapters.trigonometry;

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

      {/* Main 3-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Item list — always visible */}
        <nav style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 6, position: 'sticky', top: 76,
        }}>
          {TRIG_ITEMS.map((it, i) => {
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
                {labels[i]}
              </button>
            );
          })}
        </nav>

        {/* Content — spans 2 columns */}
        <div style={{ gridColumn: 'span 2' }}>
          {item === 'sinus'        && <SinusItem        lang={lang} />}
          {item === 'cosinus'      && <CosinusItem       lang={lang} />}
          {item === 'tangent'      && <TangentItem       lang={lang} />}
          {item === 'arcsinus'     && <ArcSinusItem      lang={lang} />}
          {item === 'arccosinus'   && <ArcCosinusItem    lang={lang} />}
          {item === 'arctangent'   && <ArcTangentItem    lang={lang} />}
          {item === 'sumangles'    && <SumAnglesItem     lang={lang} />}
          {item === 'scalarangles' && <ScalarAnglesItem  lang={lang} />}
        </div>
      </div>
    </div>
  );
};
