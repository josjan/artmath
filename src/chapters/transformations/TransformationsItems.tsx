// TransformationsItems.tsx — Ítems del capítulo Transformaciones
// Todos siguen el mismo patrón: tabs Fórmula / Explorar / SVG
// Exporta: TranslateItem, RotateItem, ScaleItem, SkewXItem, SkewYItem, UniformScaleItem, SymetryItem, ReflectionItem, AffinityItem, SimilarityItem, AnyItem

import { useState } from 'react';
//import { Icon } from '../../components/Icon';
import type { Lang } from '../../lib/data';

// ── Shared components ───────────────────────────────────

const TabBar = ({ tab, setTab, lang }: {
  tab: string; setTab: (t: any) => void; lang: Lang;
}) => {
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

// ── Transform Item Component Template ───────────────────────────────────

const TransformItem = ({ 
  title, 
  formulaPath, 
  svgPath, 
  exploreContent, 
  lang 
}: {
  title: string;
  formulaPath: string;
  svgPath: string;
  exploreContent: React.ReactNode;
  lang: Lang;
}) => {
  const [tab, setTab] = useState('explore');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{title}</h2>
        <TabBar tab={tab} setTab={setTab} lang={lang} />
      </div>

      {tab === 'formula' && (
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--hairline)', 
          borderRadius: 'var(--r-md)', 
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
        }}>
          <img 
            src={`/antiguos/formula/${formulaPath}`} 
            alt={`${title} formula`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}

      {tab === 'explore' && (
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--hairline)', 
          borderRadius: 'var(--r-md)', 
          padding: 24,
          minHeight: 400
        }}>
          {exploreContent}
        </div>
      )}

      {tab === 'svg' && (
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--hairline)', 
          borderRadius: 'var(--r-md)', 
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
        }}>
          <img 
            src={`/antiguos/svg/${svgPath}`} 
            alt={`${title} SVG example`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

// ── Individual Transform Items ───────────────────────────────────

export const TranslateItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Traslación' : 'Translate';
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Traslación' : 'Translation Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'La traslación mueve cada punto de una figura la misma distancia en la misma dirección. Es una transformación rígida que preserva el tamaño y la forma del objeto.'
          : 'Translation moves every point of a figure the same distance in the same direction. It is a rigid transformation that preserves the size and shape of the object.'
        }
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            {lang === 'es' ? 'Traslación X:' : 'Translation X:'} {translateX}
          </label>
          <input 
            type="range" 
            min="-100" 
            max="100" 
            value={translateX}
            onChange={e => setTranslateX(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            {lang === 'es' ? 'Traslación Y:' : 'Translation Y:'} {translateY}
          </label>
          <input 
            type="range" 
            min="-100" 
            max="100" 
            value={translateY}
            onChange={e => setTranslateY(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>transform="translate({translateX}, {translateY})"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          {lang === 'es' ? 'traslación en eje X' : 'X-axis translation'}: {translateX}<br/>
          {lang === 'es' ? 'traslación en eje Y' : 'Y-axis translation'}: {translateY}
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <svg width="300" height="200" viewBox="-150 -100 300 200">
          <rect x="-140" y="-90" width="280" height="180" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="1"/>
          
          {/* Grid */}
          <g stroke="#e9ecef" strokeWidth="0.5">
            {[-140, -120, -100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140].map(x => (
              <line key={`v-${x}`} x1={x} y1="-90" x2={x} y2="90" />
            ))}
            {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map(y => (
              <line key={`h-${y}`} x1="-140" y1={y} x2="140" y2={y} />
            ))}
          </g>
          
          {/* Axes */}
          <line x1="-140" y1="0" x2="140" y2="0" stroke="#6c757d" strokeWidth="1"/>
          <line x1="0" y1="-90" x2="0" y2="90" stroke="#6c757d" strokeWidth="1"/>
          
          {/* Original shape */}
          <rect x="-40" y="-30" width="80" height="60" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" opacity="0.7"/>
          
          {/* Translated shape */}
          <rect x={-40 + translateX/2} y={-30 + translateY/2} width="80" height="60" fill="#ffebee" stroke="#f44336" strokeWidth="2"/>
          
          {/* Connection lines */}
          <g stroke="#4caf50" strokeWidth="1" strokeDasharray="3,3">
            <line x1="-40" y1="-30" x2={-40 + translateX/2} y2={-30 + translateY/2}/>
            <line x1="40" y1="-30" x2={40 + translateX/2} y2={-30 + translateY/2}/>
            <line x1="40" y1="30" x2={40 + translateX/2} y2={30 + translateY/2}/>
            <line x1="-40" y1="30" x2={-40 + translateX/2} y2={30 + translateY/2}/>
          </g>
        </svg>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="translate.svg"
      svgPath="translate.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const RotateItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Rotación' : 'Rotate';
  const [angle, setAngle] = useState(0);

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Rotación' : 'Rotation Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'La rotación gira una figura alrededor de un punto fijo llamado centro de rotación. El ángulo de rotación determina cuánto gira la figura.'
          : 'Rotation rotates a figure around a fixed point called the center of rotation. The rotation angle determines how much the figure turns.'
        }
      </p>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
          {lang === 'es' ? 'Ángulo de rotación:' : 'Rotation angle:'} {angle}°
        </label>
        <input 
          type="range" 
          min="-180" 
          max="180" 
          value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
          <span>-180°</span>
          <span>180°</span>
        </div>
      </div>

      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>transform="rotate({angle}, 0, 0)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          {lang === 'es' ? 'ángulo de rotación' : 'rotation angle'}: {angle}°<br/>
          {lang === 'es' ? 'centro de rotación' : 'rotation center'}: (0, 0)
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <svg width="300" height="200" viewBox="-150 -100 300 200">
          <rect x="-140" y="-90" width="280" height="180" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="1"/>
          
          {/* Grid */}
          <g stroke="#e9ecef" strokeWidth="0.5">
            {[-140, -120, -100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140].map(x => (
              <line key={`v-${x}`} x1={x} y1="-90" x2={x} y2="90" />
            ))}
            {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map(y => (
              <line key={`h-${y}`} x1="-140" y1={y} x2="140" y2={y} />
            ))}
          </g>
          
          {/* Axes */}
          <line x1="-140" y1="0" x2="140" y2="0" stroke="#6c757d" strokeWidth="1"/>
          <line x1="0" y1="-90" x2="0" y2="90" stroke="#6c757d" strokeWidth="1"/>
          
          {/* Center point */}
          <circle cx="0" cy="0" r="3" fill="#ff5722"/>
          
          {/* Original shape */}
          <rect x="-40" y="-30" width="80" height="60" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" opacity="0.7"/>
          
          {/* Rotated shape */}
          <g transform={`rotate(${angle})`}>
            <rect x="-40" y="-30" width="80" height="60" fill="#ffebee" stroke="#f44336" strokeWidth="2"/>
          </g>
          
          {/* Angle arc */}
          <path d={`M 30 0 A 30 30 0 ${Math.abs(angle) > 90 ? 1 : 0} ${angle > 0 ? 0 : 1} ${30 * Math.cos(angle * Math.PI / 180)} ${-30 * Math.sin(angle * Math.PI / 180)}`} 
                fill="none" stroke="#ff9800" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="rotate.svg"
      svgPath="rotate.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const ScaleItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Escalado' : 'Scale';
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Escalado' : 'Scale Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'El escalado cambia el tamaño de una figura multiplicando las coordenadas por factores de escala. Puede ser diferente para cada eje.'
          : 'Scaling changes the size of a figure by multiplying coordinates by scale factors. It can be different for each axis.'
        }
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            {lang === 'es' ? 'Escala X:' : 'Scale X:'} {scaleX.toFixed(2)}
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1"
            value={scaleX}
            onChange={e => setScaleX(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
            <span>0.1</span>
            <span>2.0</span>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            {lang === 'es' ? 'Escala Y:' : 'Scale Y:'} {scaleY.toFixed(2)}
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1"
            value={scaleY}
            onChange={e => setScaleY(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
            <span>0.1</span>
            <span>2.0</span>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>transform="scale({scaleX.toFixed(1)}, {scaleY.toFixed(1)})"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          {lang === 'es' ? 'factor de escala en X' : 'X-axis scale factor'}: {scaleX.toFixed(1)}<br/>
          {lang === 'es' ? 'factor de escala en Y' : 'Y-axis scale factor'}: {scaleY.toFixed(1)}
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <svg width="300" height="200" viewBox="-150 -100 300 200">
          <rect x="-140" y="-90" width="280" height="180" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="1"/>
          
          {/* Grid */}
          <g stroke="#e9ecef" strokeWidth="0.5">
            {[-140, -120, -100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140].map(x => (
              <line key={`v-${x}`} x1={x} y1="-90" x2={x} y2="90" />
            ))}
            {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map(y => (
              <line key={`h-${y}`} x1="-140" y1={y} x2="140" y2={y} />
            ))}
          </g>
          
          {/* Axes */}
          <line x1="-140" y1="0" x2="140" y2="0" stroke="#6c757d" strokeWidth="1"/>
          <line x1="0" y1="-90" x2="0" y2="90" stroke="#6c757d" strokeWidth="1"/>
          
          {/* Original shape */}
          <rect x="-40" y="-30" width="80" height="60" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" opacity="0.7"/>
          
          {/* Scaled shape */}
          <rect x={-40 * scaleX} y={-30 * scaleY} width={80 * scaleX} height={60 * scaleY} fill="#ffebee" stroke="#f44336" strokeWidth="2"/>
          
          {/* Scale indicators */}
          <g stroke="#4caf50" strokeWidth="1" strokeDasharray="2,2">
            <line x1="0" y1="0" x2={40 * scaleX} y2="0"/>
            <line x1="0" y1="0" x2="0" y2={30 * scaleY}/>
          </g>
        </svg>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="scale.svg"
      svgPath="scale.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const SkewXItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Sesgo X' : 'Skew X';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Sesgo X' : 'Skew X Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'El sesgo X inclina una figura horizontalmente, manteniendo las coordenadas Y constantes mientras las coordenadas X se desplazan proporcionalmente a Y.'
          : 'Skew X slants a figure horizontally, keeping Y coordinates constant while X coordinates shift proportionally to Y.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="skewX(angle)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          angle: {lang === 'es' ? 'ángulo de sesgo horizontal' : 'horizontal skew angle'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="skewX.svg"
      svgPath="skewX.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const SkewYItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Sesgo Y' : 'Skew Y';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Sesgo Y' : 'Skew Y Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'El sesgo Y inclina una figura verticalmente, manteniendo las coordenadas X constantes mientras las coordenadas Y se desplazan proporcionalmente a X.'
          : 'Skew Y slants a figure vertically, keeping X coordinates constant while Y coordinates shift proportionally to X.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="skewY(angle)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          angle: {lang === 'es' ? 'ángulo de sesgo vertical' : 'vertical skew angle'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="skewY.svg"
      svgPath="skewY.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const UniformScaleItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Escalado Uniforme' : 'Uniform Scale';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Escalado Uniforme' : 'Uniform Scale Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'El escalado uniforme cambia el tamaño de una figura manteniendo las proporciones originales. El mismo factor de escala se aplica a ambos ejes.'
          : 'Uniform scale changes the size of a figure while maintaining original proportions. The same scale factor is applied to both axes.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="scale(s)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          s: {lang === 'es' ? 'factor de escala uniforme' : 'uniform scale factor'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="uniformScale.svg"
      svgPath="uniformScale.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const SymetryItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Simetría' : 'Symetry';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Simetría' : 'Symetry Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'La simetría refleja una figura a través de un eje o punto, creando una imagen especular. Es una transformación isométrica que preserva distancias.'
          : 'Symetry reflects a figure across an axis or point, creating a mirror image. It is an isometric transformation that preserves distances.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="symetry(axis)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          axis: {lang === 'es' ? 'eje de simetría' : 'symetry axis'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="symetry.svg"
      svgPath="symetry.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const ReflectionItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Reflexión' : 'Reflection';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Reflexión' : 'Reflection Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'La reflexión crea una imagen especular de una figura a través de una línea de reflexión. Cada punto y su imagen están a la misma distancia de la línea.'
          : 'Reflection creates a mirror image of a figure across a reflection line. Each point and its image are equidistant from the line.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="reflection(line)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          line: {lang === 'es' ? 'línea de reflexión' : 'reflection line'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="reflection.svg"
      svgPath="reflection.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const AffinityItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Afinidad' : 'Affinity';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Afinidad' : 'Affinity Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'La transformación afín preserva líneas paralelas y relaciones de colinealidad, pero puede alterar ángulos y distancias. Incluye traslaciones, rotaciones, escalados y sesgos.'
          : 'Affine transformation preserves parallel lines and collinearity relationships, but can alter angles and distances. It includes translations, rotations, scales, and skews.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="matrix(a,b,c,d,e,f)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          a-f: {lang === 'es' ? 'matriz de transformación afín' : 'affine transformation matrix'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="affinity.svg"
      svgPath="affinity.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const SimilarityItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Similitud' : 'Similarity';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Similitud' : 'Similarity Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'La transformación de similitud preserva la forma pero puede cambiar el tamaño. Incluye rotaciones, traslaciones, reflexiones y escalados uniformes.'
          : 'Similarity transformation preserves shape but may change size. It includes rotations, translations, reflections, and uniform scales.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="similarity(scale, rotate, translate)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          {lang === 'es' ? 'combinación de transformaciones que preservan forma' : 'combination of shape-preserving transformations'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="similarity.svg"
      svgPath="similarity.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};

export const AnyItem = ({ lang }: { lang: Lang }) => {
  const title = lang === 'es' ? 'Cualquier Transformación' : 'Any Transformation';
  const exploreContent = (
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {lang === 'es' ? 'Exploración de Transformaciones Combinadas' : 'Combined Transformations Exploration'}
      </h3>
      <p style={{ marginBottom: 12 }}>
        {lang === 'es' 
          ? 'Las transformaciones pueden combinarse para crear efectos complejos. El orden de aplicación afecta el resultado final.'
          : 'Transformations can be combined to create complex effects. The order of application affects the final result.'
        }
      </p>
      <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: 8 }}>transform="translate(...) rotate(...) scale(...)"</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          {lang === 'es' ? 'secuencia de transformaciones aplicadas en orden' : 'sequence of transformations applied in order'}
        </div>
      </div>
    </div>
  );

  return (
    <TransformItem 
      title={title}
      formulaPath="any.svg"
      svgPath="any.svg"
      exploreContent={exploreContent}
      lang={lang}
    />
  );
};
