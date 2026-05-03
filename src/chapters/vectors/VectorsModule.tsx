// VectorsModule.tsx — Vectors chapter: item list + interactive figure + tabs + derivation

import { useState, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { VECTOR_ITEMS, STRINGS, type Lang } from '../../lib/data';
import { ghostBtn, type Route } from '../../components/AppShell';
import { CartesianItem } from './CartesianItem';
import { PolarItem } from './PolarItem';
import { ScalarItem } from './ScalarItem';
import { DotItem } from './DotItem';
import { CrossItem } from './CrossItem';
import { MidpointItem } from './MidpointItem';
import { BarycenterItem } from './BarycenterItem';
import { LinearSystemItem } from './LinearSystemItem';
import { VectorAdditionItem } from './VectorAdditionItem';

interface Props {
  lang: Lang;
  setRoute: (r: Route) => void;
}

interface Vec2 { x: number; y: number; }

export const VectorsModule = ({ lang, setRoute }: Props) => {
  const C = STRINGS[lang].chapter;

  const [item, setItem] = useState('sum');

  const crumbBtn: React.CSSProperties = {
    background: 'transparent', border: 'none', padding: 0,
    color: 'var(--fg-3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)',
  };

  const labels = {
    es: ['Sistema cartesiano','Sistema polar','Producto por escalar','Suma de vectores','Producto escalar','Producto vectorial','Punto medio','Baricentro','Sistema lineal'],
    en: ['Cartesian system','Polar system','Multiply by scalar','Sum of vectors','Dot product','Cross product','Midpoint','Barycenter','Solve linear system'],
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
          {STRINGS[lang].chapters.vectors.title}
        </span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '-0.02em' }}>
            {STRINGS[lang].chapters.vectors.title}
          </h1>
          <p style={{ color: 'var(--fg-3)', fontSize: 15, marginTop: 6 }}>
            {STRINGS[lang].chapters.vectors.blurb}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={ghostBtn}><Icon name="Share" size={14}/> {C.share}</button>
          <button style={ghostBtn}><Icon name="Copy" size={14}/> {C.copy}</button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: 20, alignItems: 'start' }}>

        {/* Item list — always visible */}
        <nav style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: 6, position: 'sticky', top: 76,
        }}>
          {VECTOR_ITEMS.map((it, i) => {
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
                {labels[lang][i]}
              </button>
            );
          })}
        </nav>

        {/* ── Sistema cartesiano: ocupa las 2 columnas restantes ── */}
        {item === 'cartesian' && (
          <div style={{ gridColumn: 'span 2' }}>
            <CartesianItem lang={lang} setRoute={setRoute} />
          </div>
        )}

        {/* ── Sistema polar: igual que cartesiano ── */}
        {item === 'polar' && (
          <div style={{ gridColumn: 'span 2' }}>
            <PolarItem lang={lang} />
          </div>
        )}

        {/* ── Producto por escalar ── */}
        {item === 'scalar' && (
          <div style={{ gridColumn: 'span 2' }}>
            <ScalarItem lang={lang} />
          </div>
        )}

        {/* ── Producto escalar (dot) ── */}
        {item === 'dot' && (
          <div style={{ gridColumn: 'span 2' }}>
            <DotItem lang={lang} />
          </div>
        )}

        {/* ── Producto vectorial (cross) ── */}
        {item === 'cross' && (
          <div style={{ gridColumn: 'span 2' }}>
            <CrossItem lang={lang} />
          </div>
        )}

        {/* ── Punto medio ── */}
        {item === 'midpoint' && (
          <div style={{ gridColumn: 'span 2' }}>
            <MidpointItem lang={lang} />
          </div>
        )}

        {/* ── Baricentro ── */}
        {item === 'barycenter' && (
          <div style={{ gridColumn: 'span 2' }}>
            <BarycenterItem lang={lang} />
          </div>
        )}

        {/* ── Sistema lineal — último ítem del capítulo ── */}
        {item === 'system' && (
          <div style={{ gridColumn: 'span 2' }}>
            <LinearSystemItem lang={lang} />
          </div>
        )}

        {/* ── Suma de vectores: usa el nuevo componente iPad-friendly ── */}
        {item === 'sum' && (
          <div style={{ gridColumn: 'span 2' }}>
            <VectorAdditionItem lang={lang} setRoute={setRoute} />
          </div>
        )}
      </div>
    </div>
  );
};

