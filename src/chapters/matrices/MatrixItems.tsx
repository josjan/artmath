// MatrixItems.tsx — Ítems del capítulo Matrices
// Todos siguen el mismo patrón: tabs Fórmula / Explorar / SVG
// Exporta: DefineMatrixItem, SumMatrixItem, ScalarProductItem, MatrixProductItem, DeterminantItem, InverseItem

import { useState } from 'react';
import { Icon } from '../../components/Icon';
import type { Lang } from '../../lib/data';

// ── Shared types & helpers ─────────────────────────────────────────
interface Matrix2D {
  data: number[][];
  rows: number;
  cols: number;
}

const createMatrix = (rows: number, cols: number, fill = 0): Matrix2D => ({
  data: Array(rows).fill(null).map(() => Array(cols).fill(fill)),
  rows,
  cols,
});

const matrixToString = (m: Matrix2D): string => {
  return m.data.map(row => 
    '[' + row.map(val => val.toString().padStart(6, ' ')).join(' ') + ']'
  ).join('\n');
};

// Standard tab bar
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

// Shared derivation step list
const DerivList = ({ steps, step, setStep, lang }: {
  steps: string[]; step: number; setStep: (n: number) => void; lang: Lang;
}) => {
  const stepBtn: React.CSSProperties = {
    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
    borderRadius: 'var(--r-xs)', padding: 4, cursor: 'pointer',
    color: 'var(--fg-2)', display: 'inline-flex',
  };
  const lbl = lang === 'es' ? ['Paso', 'de'] : ['Step', 'of'];
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 'var(--r-md)', padding: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>
          {lang === 'es' ? 'Derivación' : 'Derivation'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-3)' }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} style={stepBtn}><Icon name="ChevronLeft" size={14}/></button>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{lbl[0]} {step + 1} {lbl[1]} {steps.length}</span>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} style={stepBtn}><Icon name="ChevronRight" size={14}/></button>
        </div>
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((txt, i) => (
          <li key={i} style={{
            display: 'flex', gap: 12, padding: '8px 12px',
            background: i === step ? 'var(--highlight-soft)' : 'transparent',
            borderLeft: i === step ? '3px solid var(--highlight)' : '3px solid transparent',
            borderRadius: 'var(--r-xs)', color: i === step ? 'var(--fg-1)' : 'var(--fg-3)',
            fontSize: 14, lineHeight: 1.5,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-4)', fontSize: 12 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{txt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 01 — DEFINIR MATRIZ
// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
// 02 — PRODUCTO DE MATRICES
// ════════════════════════════════════════════════════════
export const MatrixProductItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  
  // Default matrices: 2x3 and 3x2 to show multiplication
  const [matrixA, setMatrixA] = useState<Matrix2D>(() => ({
    data: [[1, 2, 3], [4, 5, 6]],
    rows: 2,
    cols: 3,
  }));
  
  const [matrixB, setMatrixB] = useState<Matrix2D>(() => ({
    data: [[7, 8], [9, 10], [11, 12]],
    rows: 3,
    cols: 2,
  }));

  // Calculate matrix product
  const calculateProduct = (): Matrix2D | null => {
    if (matrixA.cols !== matrixB.rows) return null;
    
    const result = createMatrix(matrixA.rows, matrixB.cols);
    
    for (let i = 0; i < matrixA.rows; i++) {
      for (let j = 0; j < matrixB.cols; j++) {
        let sum = 0;
        for (let k = 0; k < matrixA.cols; k++) {
          sum += matrixA.data[i][k] * matrixB.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    
    return result;
  };

  const product = calculateProduct();

  const updateCell = (matrix: 'A' | 'B', i: number, j: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const targetMatrix = matrix === 'A' ? matrixA : matrixB;
    const newMatrix = { ...targetMatrix };
    newMatrix.data[i][j] = numValue;
    
    if (matrix === 'A') {
      setMatrixA(newMatrix);
    } else {
      setMatrixB(newMatrix);
    }
  };

  const steps = lang === 'es' ? [
    'El producto de matrices A×B solo está definido si el número de columnas de A igual al número de filas de B.',
    'Si A es m×n y B es n×p, el resultado C = A×B es una matriz m×p.',
    'Cada elemento cᵢⱼ de C se calcula como: cᵢⱼ = Σₖ₌₁ⁿ aᵢₖ·bₖⱼ.',
    'Esto es el producto escalar de la fila i de A con la columna j de B.',
    'El producto de matrices no es conmutativo: A×B ≠ B×A en general.',
    'En transformaciones geométricas, las matrices se componen multiplicándolas.',
  ] : [
    'Matrix product A×B is only defined if columns of A equal rows of B.',
    'If A is m×n and B is n×p, the result C = A×B is an m×p matrix.',
    'Each element cᵢⱼ of C is calculated as: cᵢⱼ = Σₖ₌₁ⁿ aᵢₖ·bₖⱼ.',
    'This is the dot product of row i of A with column j of B.',
    'Matrix multiplication is not commutative: A×B ≠ B×A in general.',
    'In geometric transformations, matrices are composed by multiplying them.',
  ];

  return ( 
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 500 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 40, alignItems: 'start' }}>
              {/* Matrix A */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz A' : 'Matrix A'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({matrixA.rows}×{matrixA.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${matrixA.cols}, 50px)`,
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrixA.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={`A-${i}-${j}`}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell('A', i, j, e.target.value)}
                        style={{
                          padding: '6px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Multiplication symbol */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-math)', fontSize: 24,
                  color: 'var(--formula)', fontWeight: 600,
                }}>×</div>
              </div>

              {/* Matrix B */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz B' : 'Matrix B'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({matrixB.rows}×{matrixB.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${matrixB.cols}, 50px)`,
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrixB.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={`B-${i}-${j}`}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell('B', i, j, e.target.value)}
                        style={{
                          padding: '6px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Result */}
            {product && (
              <div style={{ marginTop: 32, padding: 20, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Resultado A×B' : 'Result A×B'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({product?.rows}×{product?.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${product?.cols}, 60px)`,
                  gap: 8, padding: 16, background: 'var(--surface)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--accent)',
                }}>
                  {product?.data?.map((row, i) =>
                    row.map((val, j) => (
                      <div
                        key={`result-${i}-${j}`}
                        style={{
                          padding: '8px', border: '1px solid var(--accent)',
                          borderRadius: 'var(--r-xs)', fontSize: 14, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--accent-soft)',
                          color: 'var(--accent)', fontWeight: 600,
                        }}
                      >
                        {val}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!product && (
              <div style={{ 
                marginTop: 32, padding: 16, background: 'var(--surface-2)', 
                borderRadius: 'var(--r-md)', textAlign: 'center', color: 'var(--fg-3)' 
              }}>
                {lang === 'es' 
                  ? `No se puede multiplicar: A tiene ${matrixA.cols} columnas pero B tiene ${matrixB.rows} filas.`
                  : `Cannot multiply: A has ${matrixA.cols} columns but B has ${matrixB.rows} rows.`
                }
              </div>
            )}
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Producto de Matrices' : 'Matrix Product'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'El producto de matrices combina dos transformaciones lineales en una sola. Solo está definido cuando las dimensiones son compatibles.'
                : 'Matrix multiplication combines two linear transformations into one. It is only defined when dimensions are compatible.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Fórmula' : 'Formula'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div>C = A×B</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                    cᵢⱼ = Σₖ₌₁ⁿ aᵢₖ·bₖⱼ
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'donde A es m×n y B es n×p' : 'where A is m×n and B is n×p'}
                  </div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Transformación SVG' : 'SVG Transformation'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 1.8 }}>
                  <div>[x&apos;]   [a c e] [x]</div>
                  <div>[y&apos;] = [b d f] [y]</div>
                  <div>[1 ]    [0 0 1] [1]</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'Coordenadas homogéneas para traslación' : 'Homogeneous coordinates for translation'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{`// Matrix multiplication for SVG transformations
// A: transformation matrix, B: point matrix

function multiplyMatrices(A, B) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

// 2D transformation matrix (3x3 for homogeneous coordinates)
const transform = [
  [a, c, e],  // scale_x, skew_x, translate_x
  [b, d, f],  // skew_y, scale_y, translate_y
  [0, 0, 1]   // homogeneous row
];

// Point in homogeneous coordinates
const point = [
  [x],
  [y],
  [1]
];

// Transform point
const transformed = multiplyMatrices(transform, point);
const newX = transformed[0][0];
const newY = transformed[1][0];

// For SVG transform attribute:
// transform=\`translate(\${newX}, \${newY}) scale(\${a}, \${d}) skewX(\${c}) skewY(\${b})\``}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// 03 — SUMA DE MATRICES
// ════════════════════════════════════════════════════════
export const SumMatrixItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  
  // Default matrices: both 3x3 for easy demonstration
  const [matrixA, setMatrixA] = useState<Matrix2D>(() => ({
    data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    rows: 3,
    cols: 3,
  }));
  
  const [matrixB, setMatrixB] = useState<Matrix2D>(() => ({
    data: [[9, 8, 7], [6, 5, 4], [3, 2, 1]],
    rows: 3,
    cols: 3,
  }));

  // Calculate matrix sum
  const calculateSum = (): Matrix2D | null => {
    if (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols) return null;
    
    const result = createMatrix(matrixA.rows, matrixA.cols);
    
    for (let i = 0; i < matrixA.rows; i++) {
      for (let j = 0; j < matrixA.cols; j++) {
        result.data[i][j] = matrixA.data[i][j] + matrixB.data[i][j];
      }
    }
    
    return result;
  };

  const sum = calculateSum();

  const updateCell = (matrix: 'A' | 'B', i: number, j: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const targetMatrix = matrix === 'A' ? matrixA : matrixB;
    const newMatrix = { ...targetMatrix };
    newMatrix.data[i][j] = numValue;
    
    if (matrix === 'A') {
      setMatrixA(newMatrix);
    } else {
      setMatrixB(newMatrix);
    }
  };

  const steps = lang === 'es' ? [
    'La suma de matrices A+B solo está definida si ambas matrices tienen las mismas dimensiones.',
    'Si A y B son m×n, el resultado C = A+B es también una matriz m×n.',
    'Cada elemento cᵢⱼ de C se calcula como: cᵢⱼ = aᵢⱼ + bᵢⱼ.',
    'La suma de matrices es conmutativa: A+B = B+A.',
    'La suma es asociativa: (A+B)+C = A+(B+C).',
    'La suma de matrices no se usa directamente para transformaciones SVG, pero sí para combinar transformaciones.',
  ] : [
    'Matrix sum A+B is only defined if both matrices have the same dimensions.',
    'If A and B are m×n, result C = A+B is also an m×n matrix.',
    'Each element cᵢⱼ of C is calculated as: cᵢⱼ = aᵢⱼ + bᵢⱼ.',
    'Matrix addition is commutative: A+B = B+A.',
    'Addition is associative: (A+B)+C = A+(B+C).',
    'Matrix addition is not used directly for SVG transformations, but for combining them.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 500 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 40, alignItems: 'start' }}>
              {/* Matrix A */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz A' : 'Matrix A'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({matrixA.rows}×{matrixA.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${matrixA.cols}, 50px)`,
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrixA.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={`A-${i}-${j}`}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell('A', i, j, e.target.value)}
                        style={{
                          padding: '6px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Plus symbol */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-math)', fontSize: 24,
                  color: 'var(--formula)', fontWeight: 600,
                }}>+</div>
              </div>

              {/* Matrix B */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz B' : 'Matrix B'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({matrixB.rows}×{matrixB.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${matrixB.cols}, 50px)`,
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrixB.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={`B-${i}-${j}`}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell('B', i, j, e.target.value)}
                        style={{
                          padding: '6px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Result */}
            {sum && (
              <div style={{ marginTop: 32, padding: 20, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Resultado A+B' : 'Result A+B'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({sum?.rows}×{sum?.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${sum?.cols}, 60px)`,
                  gap: 8, padding: 16, background: 'var(--surface)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--accent)',
                }}>
                  {sum?.data.map((row, i) =>
                    row.map((val, j) => (
                      <div
                        key={`result-${i}-${j}`}
                        style={{
                          padding: '8px', border: '1px solid var(--accent)',
                          borderRadius: 'var(--r-xs)', fontSize: 14, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--accent-soft)',
                          color: 'var(--accent)', fontWeight: 600,
                        }}
                      >
                        {val}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!sum && (
              <div style={{ 
                marginTop: 32, padding: 16, background: 'var(--surface-2)', 
                borderRadius: 'var(--r-md)', textAlign: 'center', color: 'var(--fg-3)' 
              }}>
                {lang === 'es' 
                  ? `No se puede sumar: las dimensiones no coinciden (${matrixA.rows}×${matrixA.cols} ≠ ${matrixB.rows}×${matrixB.cols})`
                  : `Cannot add: dimensions don't match (${matrixA.rows}×${matrixA.cols} ≠ ${matrixB.rows}×${matrixB.cols})`
                }
              </div>
            )}
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Suma de Matrices' : 'Matrix Sum'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'La suma de matrices se realiza elemento por elemento. Ambas matrices deben tener las mismas dimensiones.'
                : 'Matrix addition is performed element by element. Both matrices must have the same dimensions.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Fórmula' : 'Formula'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div>C = A + B</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                    cᵢⱼ = aᵢⱼ + bᵢⱼ
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'donde A y B son m×n' : 'where A and B are m×n'}
                  </div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Propiedades' : 'Properties'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 1.8 }}>
                  <div>A + B = B + A</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                    {lang === 'es' ? 'Conmutativa' : 'Commutative'}
                  </div>
                  <div>k·(A + B) = k·A + k·B</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                    {lang === 'es' ? 'Distributiva con escalar' : 'Distributive with scalar'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{`// Matrix addition in JavaScript
// Note: Matrix addition is NOT used directly for SVG transformations
// To combine transformations, multiply matrices instead

function addMatrices(A, B) {
  // Check if dimensions match
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error('Matrix dimensions must match');
  }
  
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] + B[i][j];
    }
  }
  return result;
}

// Example: Adding two transformation matrices
const transform1 = [
  [1, 0, 10],  // translation x=10
  [0, 1, 20],  // translation y=20  
  [0, 0, 1]   // homogeneous row
];

const transform2 = [
  [2, 0, 0],   // scale x=2
  [0, 2, 0],   // scale y=2
  [0, 0, 1]    // homogeneous row
];

// To combine transformations: MULTIPLY, don't add
const combined = multiplyMatrices(transform2, transform1);
// This applies scale first, then translation

// For SVG:
// transform=\`translate(\${combined[0][2]}, \${combined[1][2]}) 
//           scale(\${combined[0][0]}, \${combined[1][1]})\``}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════════════════
// 04 — PRODUCTO POR ESCALAR
// ══════════════════════════════════════════════════════
export const ScalarProductItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  
  // Default matrix: 3x3 for demonstration
  const [matrix, setMatrix] = useState<Matrix2D>(() => ({
    data: [[2, 3, 1], [4, 5, 6], [7, 8, 9]],
    rows: 3,
    cols: 3,
  }));
  
  const [scalar, setScalar] = useState(2);

  // Calculate scalar product
  const calculateScalarProduct = (): Matrix2D => {
    const result = createMatrix(matrix.rows, matrix.cols);
    
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.data[i][j] = scalar * matrix.data[i][j];
      }
    }
    
    return result;
  };

  const product = calculateScalarProduct();

  const updateCell = (i: number, j: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = { ...matrix };
    newMatrix.data[i][j] = numValue;
    setMatrix(newMatrix);
  };

  const steps = lang === 'es' ? [
    'El producto de una matriz A por un escalar k se define como k·A.',
    'Cada elemento de la matriz resultante se calcula como: (k·A)ᵢⱼ = k·aᵢⱼ.',
    'Si k = 1, la matriz resultante es igual a la original: 1·A = A.',
    'Si k = -1, se obtiene la matriz negativa: (-1)·A = -A.',
    'El producto por escalar es distributivo: k·(A+B) = k·A + k·B.',
    'En SVG, el producto por escalar se usa para transformaciones de escala uniforme.',
  ] : [
    'Scalar multiplication of matrix A by scalar k is defined as k·A.',
    'Each element of the resulting matrix is calculated as: (k·A)ᵢⱼ = k·aᵢⱼ.',
    'If k = 1, the resulting matrix equals the original: 1·A = A.',
    'If k = -1, we get the negative matrix: (-1)·A = -A.',
    'Scalar multiplication is distributive: k·(A+B) = k·A + k·B.',
    'In SVG, scalar multiplication is used for uniform scale transformations.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 500 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 40, alignItems: 'start' }}>
              {/* Scalar input */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Escalar k' : 'Scalar k'}
                </h3>
                <input
                  type="number"
                  value={scalar}
                  onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%', padding: '12px', border: '1px solid var(--hairline)',
                    borderRadius: 'var(--r-sm)', fontSize: 16, textAlign: 'center',
                    fontFamily: 'var(--font-mono)', background: 'var(--surface-2)',
                  }}
                />
                <div style={{ marginTop: 16, padding: 12, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                    {lang === 'es' ? 'Propiedades:' : 'Properties:'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6 }}>
                    <div>1·A = A</div>
                    <div>(-1)·A = -A</div>
                    <div>k·(A+B) = k·A + k·B</div>
                  </div>
                </div>
              </div>

              {/* Multiplication symbol */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-math)', fontSize: 24,
                  color: 'var(--formula)', fontWeight: 600,
                }}>×</div>
              </div>

              {/* Matrix */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz A' : 'Matrix A'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({matrix.rows}×{matrix.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${matrix.cols}, 50px)`,
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrix.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={i + "-" + j}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell(i, j, e.target.value)}
                        style={{
                          padding: '6px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Result */}
            <div style={{ marginTop: 32, padding: 20, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                {lang === 'es' ? 'Resultado k·A' : 'Result k·A'}
                <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                  ({product.rows}×{product.cols})
                </span>
              </h3>
              <div style={{
                display: 'grid', gridTemplateColumns: `repeat(${product.cols}, 60px)`,
                gap: 8, padding: 16, background: 'var(--surface)',
                borderRadius: 'var(--r-md)', border: '1px solid var(--accent)',
              }}>
                {product.data.map((row, i) =>
                  row.map((val, j) => (
                    <div
                      key={`result-${i}-${j}`}
                      style={{
                        padding: '8px', border: '1px solid var(--accent)',
                        borderRadius: 'var(--r-xs)', fontSize: 14, textAlign: 'center',
                        fontFamily: 'var(--font-mono)', background: 'var(--accent-soft)',
                        color: 'var(--accent)', fontWeight: 600,
                      }}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Producto por Escalar' : 'Scalar Multiplication'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'El producto de una matriz por un escalar multiplica cada elemento de la matriz por el mismo valor.'
                : 'Scalar multiplication multiplies each element of a matrix by the same value.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Fórmula' : 'Formula'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div>B = k·A</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                    bᵢⱼ = k·aᵢⱼ
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'donde A es m×n y k ∈ ℝ' : 'where A is m×n and k ∈ ℝ'}
                  </div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Propiedades' : 'Properties'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 1.8 }}>
                  <div>1·A = A</div>
                  <div>(-1)·A = -A</div>
                  <div>k·(A+B) = k·A + k·B</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'Distributiva' : 'Distributive'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{`// Scalar multiplication in JavaScript
// Note: k * A is NOT used directly for SVG transformations
// For scaling, use scale() in transform attribute

function multiplyScalar(k, A) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = k * A[i][j];
    }
  }
  return result;
}

// Example: Scale transformation matrix
const originalTransform = [
  [1, 0, 100],  // translate x=100
  [0, 1, 50],   // translate y=50
  [0, 0, 1]    // homogeneous row
];

// Scale by 2x
const scaleFactor = 2;
const scaledTransform = multiplyScalar(scaleFactor, originalTransform);

// For SVG, use scale() instead of matrix multiplication:
// transform=\`translate(\${scaledTransform[0][2]}, \${scaledTransform[1][2]}) 
//           scale(\${scaleFactor}, \${scaleFactor})\`

// If you MUST use matrix (for complex transformations):
const combinedTransform = [
  [scaleFactor, 0, scaledTransform[0][2]],  // scale + translate
  [0, scaleFactor, scaledTransform[1][2]],  // scale + translate  
  [0, 0, 1]                           // homogeneous row
];

// Alternative: multiply matrices for complex cases
const translationMatrix = [
  [1, 0, 100],
  [0, 1, 50],
  [0, 0, 1]
];

const scaleMatrix = [
  [scaleFactor, 0, 0],
  [0, scaleFactor, 0],
  [0, 0, 1]
];

// Scale first, then translate
const result = multiplyMatrices(translationMatrix, scaleMatrix);
// This applies scale around origin, then translation`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ══════════════════════════════════════════════════
// 05 — DETERMINANTE
// ══════════════════════════════════════════════════════
export const DeterminantItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  
  // Default 3x3 matrix for determinant calculation
  const [matrix, setMatrix] = useState<Matrix2D>(() => ({
    data: [[2, 3, 1], [4, 5, 6], [7, 8, 9]],
    rows: 3,
    cols: 3,
  }));

  // Calculate determinant using rule of Sarrus
  const calculateDeterminant = (): number => {
    if (matrix.rows !== 3 || matrix.cols !== 3) return 0;
    
    const m = matrix.data;
    // Rule of Sarrus for 3x3 matrix
    return (
      m[0][0] * (m[1][1] * m[2][2] + m[1][2] * m[2][1] + m[2][0] * m[1][2]) -
      m[0][1] * (m[1][0] * m[2][2] + m[1][2] * m[2][0] + m[2][0] * m[1][1]) +
      m[0][2] * (m[1][0] * m[2][1] + m[1][1] * m[2][0] + m[2][0] * m[1][2])
    );
  };

  const determinant = calculateDeterminant();

  const updateCell = (i: number, j: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = { ...matrix };
    newMatrix.data[i][j] = numValue;
    setMatrix(newMatrix);
  };

  const steps = lang === 'es' ? [
    'El determinante solo está definido para matrices cuadradas (n×n).',
    'Para una matriz 3×3, usamos la regla de Sarrus: suma de productos diagonales con signos alternantes.',
    'det(A) = a₁₁·a₂₂·a₃₃ + a₁₃·a₂₁·a₃₂ + a₁₂·a₂₃·a₃₁ - a₁₃·a₂₂·a₃₁ - a₁₁·a₂₃·a₃₂',
    'Si det(A) = 0, la matriz es singular (no tiene inversa).',
    'Si det(A) ≠ 0, la matriz es invertible y tiene inversa única.',
    'En transformaciones SVG, el determinante indica si una transformación es reversible.',
  ] : [
    'Determinant is only defined for square matrices (n×n).',
    'For a 3×3 matrix, we use the rule of Sarrus: sum of diagonal products with alternating signs.',
    'det(A) = a₁₁·a₂₂·a₃₃ + a₁₃·a₂₁·a₃₂ + a₁₂·a₂₃·a₃₁ - a₁₃·a₂₂·a₃₁ - a₁₁·a₂₃·a₃₂',
    'If det(A) = 0, the matrix is singular (no inverse exists).',
    'If det(A) ≠ 0, the matrix is invertible and has a unique inverse.',
    'In SVG transformations, the determinant indicates if a transformation is reversible.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 500 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'start' }}>
              {/* Matrix */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz A (3×3)' : 'Matrix A (3×3)'}
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: "repeat(" + matrix.cols + ", 60px)",
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrix.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={i + "-" + j}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell(i, j, e.target.value)}
                        style={{
                          padding: '6px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Determinant visualization */}
            <div style={{ marginTop: 32, padding: 20, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                {lang === 'es' ? 'Determinante det(A)' : 'Determinant det(A)'}
              </h3>
              <div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 14, lineHeight: 2.2, marginBottom: 16, textAlign: 'center', color: 'var(--fg-3)' }}>
                  {lang === 'es' ? 'Regla de Sarrus (3×3):' : 'Sarrus Rule (3×3):'}
                </div>
                <div style={{ 
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', 
                  gap: 12, marginTop: 12, alignItems: 'center',
                  padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)'
                }}>
                  {/* Términos positivos */}
                  <div style={{ textAlign: 'center', color: 'var(--green)' }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                      {lang === 'es' ? 'Términos positivos (+)' : 'Positive terms (+)'}
                    </div>
                    <div>{matrix.data[0][0]} · {matrix.data[1][1]} · {matrix.data[2][2]}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>
                      +
                    </div>
                    <div>{matrix.data[0][1]} · {matrix.data[1][2]} · {matrix.data[2][0]}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>
                      +
                    </div>
                    <div>{matrix.data[0][2]} · {matrix.data[1][0]} · {matrix.data[2][1]}</div>
                  </div>
                  </div>
                  
                  {/* Términos negativos */}
                  <div style={{ 
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: 12, marginTop: 12, alignItems: 'center',
                    padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)'
                  }}>
                    <div style={{ textAlign: 'center', color: 'var(--red)' }}>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>
                        {lang === 'es' ? 'Términos negativos (-)' : 'Negative terms (-)'}
                      </div>
                      <div>{matrix.data[0][1]} · {matrix.data[1][0]} · {matrix.data[2][2]}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>
                        -
                      </div>
                      <div>{matrix.data[0][2]} · {matrix.data[1][1]} · {matrix.data[2][0]}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>
                        -
                      </div>
                      <div>{matrix.data[0][0]} · {matrix.data[1][2]} · {matrix.data[2][1]}</div>
                    </div>
                  </div>
                
                <div style={{ 
                  display: 'flex', justifyContent: 'center', 
                  marginTop: 20, fontSize: 18, fontWeight: 600
                }}>
                  <span style={{ color: 'var(--green)' }}>+</span>
                  <span style={{ margin: '0 8px', color: 'var(--red)' }}>-</span>
                  <span style={{ margin: '0 8px', color: 'var(--red)' }}>-</span>
                  <span style={{ margin: '0 8px', color: 'var(--green)' }}>+</span>
                </div>
            </div>
              <div style={{ 
                fontSize: 24, fontWeight: 600, textAlign: 'center', 
                color: determinant === 0 ? 'var(--accent)' : 'var(--formula)',
                marginTop: 16, padding: 12, borderRadius: 'var(--r-sm)',
                background: determinant === 0 ? 'var(--accent-soft)' : 'var(--formula-soft)'
              }}>
                = {determinant.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: 14, textAlign: 'center', 
                color: determinant === 0 ? 'var(--accent)' : 'var(--fg-3)',
                marginTop: 8
              }}>
                {determinant === 0 
                  ? (lang === 'es' ? 'Matriz singular (no invertible)' : 'Singular matrix (no inverse)')
                  : (lang === 'es' ? 'Matriz invertible' : 'Invertible matrix')
                }
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Determinante de Matriz' : 'Matrix Determinant'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'El determinante es un número escalar que indica si una matriz cuadrada es invertible y el factor de escala de transformaciones lineales.'
                : 'The determinant is a scalar number that indicates if a square matrix is invertible and the scale factor of linear transformations.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Regla de Sarrus (3×3)' : 'Sarrus Rule (3×3)'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 2.1 }}>
                  <div>det(A) = a₁₁·a₂₂·a₃₃ + a₁₃·a₂₁·a₃₂ + a₁₂·a₂₃·a₃₁</div>
                  <div style={{ fontSize: 16, color: 'var(--fg-3)' }}>
                    - a₁₃·a₂₂·a₃₁ - a₁₁·a₂₃·a₃₂ - a₁₂·a₂₁·a₃₁
                  </div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Propiedades' : 'Properties'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 1.8 }}>
                  <div>det(A) = 0 → {lang === 'es' ? 'Matriz singular' : 'Singular matrix'}</div>
                  <div>det(A) ≠ 0 → {lang === 'es' ? 'Matriz invertible' : 'Invertible matrix'}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'Área de transformación = |det(A)|' : 'Transformation area = |det(A)|'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{`// Determinant calculation in JavaScript
// Rule of Sarrus for 3x3 matrix

function determinant3x3(A) {
  if (A.length !== 3 || A[0].length !== 3) {
    throw new Error('Matrix must be 3x3');
  }
  
  const a = A[0][0], b = A[0][1], c = A[0][2];
  const d = A[1][0], e = A[1][1], f = A[1][2];
  const g = A[2][0], h = A[2][1], i = A[2][2];
  
  // Rule of Sarrus
  return (
    a * (e * i - f * h) +
    b * (f * g + d * i) +
    c * (d * h - e * g)
  );
}

// Check if matrix is invertible
const det = determinant3x3(transformMatrix);
if (Math.abs(det) < 0.0001) {
  console.log('Matrix is singular (determinant ≈ 0)');
  console.log('Transformation cannot be inverted');
} else {
  console.log(\`Determinant = \${det.toFixed(4)}\`);
  console.log('Matrix is invertible');
  console.log(\`Transformation area = |\${det.toFixed(4)}|\`);
}

// For 2x2 matrix (simpler):
function determinant2x2(A) {
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

// In SVG, determinant affects transform behavior:
// - det > 0: preserves orientation (counterclockwise)
// - det < 0: reverses orientation (clockwise)
// - det = 0: collapses to lower dimension`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

// ════════════════════════════════════════
// 06 — MATRIZ INVERSA
// ════════════════════════════════════════════
export const InverseMatrixItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  
  // Default 3x3 matrix for inverse calculation
  const [matrix, setMatrix] = useState<Matrix2D>(() => ({
    data: [[2, 1, 3], [4, 5, 6], [7, 8, 9]],
    rows: 3,
    cols: 3,
  }));

  // Calculate inverse matrix using adjugate and determinant
  const calculateInverse = (): Matrix2D | null => {
    if (matrix.rows !== 3 || matrix.cols !== 3) return null;
    
    const m = matrix.data;
    
    // Calculate determinant
    const det = 
      m[0][0] * (m[1][1] * m[2][2] - m[0][2] * m[1][0]) +
      m[0][1] * (m[1][2] * m[2][0] + m[0][2] * m[1][1]) +
      m[0][2] * (m[1][1] * m[2][0] + m[0][2] * m[1][1]);
    
    if (Math.abs(det) < 0.0001) {
      return null; // Singular matrix - no inverse
    }
    
    // Calculate adjugate matrix
    const adjugate = (matrix: number[][]): number[][] => {
      const n = matrix.length;
      const result: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
      
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          // Calculate cofactor for position (i,j)
          const sign = ((i + j) % 2 === 0) ? 1 : -1;
          const minor = getMinor(matrix, i, j);
          const det = calculate2x2Determinant(minor);
          result[j][i] = sign * det; // Note: transpose for adjugate
        }
      }
      
      return result;
    };
    
    // Helper function to get 2x2 minor matrix
    const getMinor = (matrix: number[][], row: number, col: number): number[][] => {
      return matrix
        .filter((_, i) => i !== row)
        .map(row => row.filter((_, j) => j !== col));
    };
    
    // Helper function to calculate 2x2 determinant
    const calculate2x2Determinant = (matrix: number[][]): number => {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    };
    
    const adjugateMatrix = adjugate(matrix.data);
    
    const inverseData = adjugateMatrix.map((row, _i) =>
      row.map((val, _j) => val / det)
    );

    const inverse = {
      data: inverseData,
      rows: matrix.rows,
      cols: matrix.cols,
    };

    return inverse;
  };

  // Calculate inverse matrix whenever matrix changes
  const inverse = calculateInverse();

  const updateCell = (i: number, j: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = { ...matrix };
    newMatrix.data[i][j] = numValue;
    setMatrix(newMatrix);
  };

  const steps = lang === 'es' ? [
    'La matriz inversa A⁻¹ solo existe para matrices cuadradas invertibles (det(A) ≠ 0).',
    'Para calcular A⁻¹, usamos la matriz adjunta: adj(A) = (1/det)·adj(A).',
    'La matriz adjunta se obtiene reemplazando cada elemento aᵢⱼ por su cofactor correspondiente.',
    'La matriz inversa también se puede calcular como: A⁻¹ = (1/det(A))·adj(A).',
    'En transformaciones SVG, la matriz inversa permite revertir transformaciones lineales.',
    'Si det(A) = 0, la matriz es singular y no tiene inversa.',
    'La inversa de A es única: (A⁻¹)·A = I (matriz identidad).',
    'Para verificar: A·A⁻¹ = I, donde I es la matriz identidad.',
  ] : [
    'The inverse matrix A⁻¹ only exists for invertible square matrices (det(A) ≠ 0).',
    'To calculate A⁻¹, use the adjugate: adj(A) = (1/det(A))·adj(A).',
    'The adjugate matrix is obtained by replacing each element aᵢⱼ with its corresponding cofactor.',
    'The inverse matrix can also be calculated as: A⁻¹ = (1/det(A))·adj(A).',
    'In SVG transformations, the inverse matrix allows reversing linear transformations.',
    'If det(A) = 0, the matrix is singular and has no inverse.',
    'The inverse of A is unique: (A⁻¹)·A = I (identity matrix).',
    'To verify: A·A⁻¹ = I, where I is the identity matrix.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 500 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'start' }}>
              {/* Matrix */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz A (3×3)' : 'Matrix A (3×3)'}
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: "repeat(" + matrix.cols + ", 60px)",
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrix.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={i + "-" + j}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell(i, j, e.target.value)}
                        style={{
                          padding: '6px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Inverse Matrix */}
            {inverse && (
              <div style={{ marginTop: 32, padding: 20, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz Inversa A⁻¹' : 'Inverse Matrix A⁻¹'}
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: `repeat(${inverse?.cols || 3}, 60px)`,
                  gap: 6, padding: 16, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {inverse?.data.map((row, i) =>
                    row.map((val, j) => (
                      <div
                        key={i + "-" + j}
                        style={{
                          padding: '8px', border: '1px solid var(--accent)',
                          borderRadius: 'var(--r-xs)', fontSize: 13, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--accent-soft)',
                          color: 'var(--accent)', fontWeight: 600,
                        }}
                      >
                        {val.toFixed(3)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!inverse && (
              <div style={{ 
                marginTop: 32, padding: 40, background: 'var(--surface-2)',
                borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                textAlign: 'center', color: 'var(--fg-3)'
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--red)' }}>
                  {lang === 'es' ? 'Matriz singular (no invertible)' : 'Singular matrix (no inverse)'}
                </div>
                <div style={{ fontSize: 14, marginTop: 8, color: 'var(--fg-3)' }}>
                  {lang === 'es' ? 'det(A) = 0 → No se puede calcular la inversa' : 'det(A) = 0 → Cannot calculate inverse'}
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Matriz Inversa' : 'Inverse Matrix'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'La matriz inversa A⁻¹ solo existe para matrices cuadradas invertibles. Se calcula usando la matriz adjunta: adj(A) = (1/det(A))·adj(A).'
                : 'The inverse matrix A⁻¹ only exists for invertible square matrices (det(A) ≠ 0). It is calculated using the adjugate: adj(A) = (1/det(A))·adj(A).'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Fórmula principal' : 'Main Formula'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div>A⁻¹ = (1/det(A))·adj(A)</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'donde adj(A) es la matriz de cofactores' : 'where adj(A) is the matrix of cofactors'}
                  </div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Propiedades' : 'Properties'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 1.8 }}>
                  <div>A·A⁻¹ = I</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'La inversa es única' : 'The inverse is unique'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? '(A⁻¹)·A = I solo si det(A) ≠ 0' : '(A⁻¹)·A = I only if det(A) ≠ 0)'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                    {lang === 'es' ? 'det(A) = 0 → Matriz singular' : 'det(A) = 0 → Singular matrix'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{`// Matrix inverse calculation in JavaScript
// Using adjugate method for 3x3 matrix

function adjugate(matrix, cofactor) {
  const n = matrix.length;
  const result = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        if (k !== i && k !== j) {
          const minor = matrix[i][k] * matrix[j][k];
          sum += minor;
        }
      }
      result[i][i] = sum;
    }
  }
  
  // Apply cofactor
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i][j] = cofactor[i][j];
    }
  }
  
  return result;
}

function inverseMatrix3x3(A) {
  if (A.length !== 3 || A[0].length !== 3) {
    throw new Error('Matrix must be 3x3');
  }
  
  const det = 
    A[0][0] * (A[1][1] * A[2][2] - A[0][2] * A[1][1]) +
    A[0][1] * (A[1][2] * A[2][2] + A[0][2] * A[1][1]);
  
  if (Math.abs(det) < 0.0001) {
    return null; // Singular matrix - no inverse
  }
  
  const adjugate = adjugate(A, 1/det);
  
  // Calculate inverse: A⁻¹ = (1/det) * adjugate
  return adjugate.map((row, i) =>
    row.map((val, j) => val / det)
  );
}

// Example usage
const matrix = [
  [2, 1, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const inverse = inverseMatrix3x3(matrix);
console.log('Inverse matrix:');
console.table(inverse);

// Verification: A · A⁻¹ should equal identity matrix
const product = matrix.map((row, i) => 
  row.reduce((sum, val, j) => sum + val * matrix[0][j], 0)
);

const isIdentity = product.every((val, i, j) => 
  Math.abs(val - (i === j ? 1 : 0)) < 0.0001
);

console.log('Verification passed:', isIdentity);`}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};

export const DefineMatrixItem = ({ lang }: { lang: Lang }) => {
  const [tab, setTab] = useState('explore');
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [matrix, setMatrix] = useState<Matrix2D>(() => createMatrix(3, 3));

  const updateCell = (i: number, j: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = { ...matrix };
    newMatrix.data[i][j] = numValue;
    setMatrix(newMatrix);
  };

  const resizeMatrix = () => {
    const newMatrix = createMatrix(rows, cols);
    // Copy existing values
    for (let i = 0; i < Math.min(rows, matrix.rows); i++) {
      for (let j = 0; j < Math.min(cols, matrix.cols); j++) {
        newMatrix.data[i][j] = matrix.data[i][j];
      }
    }
    setMatrix(newMatrix);
  };

  const steps = lang === 'es' ? [
    'Una matriz es un arreglo rectangular de números organizado en filas y columnas.',
    'Se denota como A = [aᵢⱼ] donde i es el índice de fila y j el de columna.',
    'Las dimensiones se escriben como m×n (m filas, n columnas).',
    'Los elementos individuales se acceden mediante sus índices: aᵢⱼ.',
    'Las matrices pueden representar sistemas de ecuaciones, transformaciones lineales, etc.',
  ] : [
    'A matrix is a rectangular array of numbers organized in rows and columns.',
    'It is denoted as A = [aᵢⱼ] where i is the row index and j is the column index.',
    'Dimensions are written as m×n (m rows, n columns).',
    'Individual elements are accessed by their indices: aᵢⱼ.',
    'Matrices can represent systems of equations, linear transformations, etc.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabBar tab={tab} setTab={setTab} lang={lang} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
        {tab === 'explore' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, alignItems: 'start' }}>
              {/* Controls */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Dimensiones' : 'Dimensions'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>
                      {lang === 'es' ? 'Filas (m):' : 'Rows (m):'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={rows}
                      onChange={(e) => setRows(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
                      style={{
                        width: '100%', padding: '8px 12px', border: '1px solid var(--hairline)',
                        borderRadius: 'var(--r-sm)', fontSize: 14, fontFamily: 'var(--font-mono)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>
                      {lang === 'es' ? 'Columnas (n):' : 'Columns (n):'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={cols}
                      onChange={(e) => setCols(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
                      style={{
                        width: '100%', padding: '8px 12px', border: '1px solid var(--hairline)',
                        borderRadius: 'var(--r-sm)', fontSize: 14, fontFamily: 'var(--font-mono)',
                      }}
                    />
                  </div>
                  <button
                    onClick={resizeMatrix}
                    style={{
                      width: '100%', padding: '10px', background: 'var(--accent)',
                      color: 'white', border: 'none', borderRadius: 'var(--r-sm)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {lang === 'es' ? 'Redimensionar' : 'Resize'}
                  </button>
                </div>
              </div>

              {/* Matrix Display */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                  {lang === 'es' ? 'Matriz A' : 'Matrix A'}
                  <span style={{ fontSize: 14, color: 'var(--fg-3)', marginLeft: 8 }}>
                    ({matrix.rows}×{matrix.cols})
                  </span>
                </h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: "repeat(" + matrix.cols + ", 60px)",
                  gap: 8, padding: 20, background: 'var(--surface-2)',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)',
                }}>
                  {matrix.data.map((row, i) =>
                    row.map((val, j) => (
                      <input
                        key={i + "-" + j}
                        type="number"
                        value={val}
                        onChange={(e) => updateCell(i, j, e.target.value)}
                        style={{
                          padding: '8px', border: '1px solid var(--hairline)',
                          borderRadius: 'var(--r-xs)', fontSize: 14, textAlign: 'center',
                          fontFamily: 'var(--font-mono)', background: 'var(--surface)',
                        }}
                      />
                    ))
                  )}
                </div>
                <div style={{ marginTop: 16, padding: 16, background: 'var(--highlight-soft)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>
                    {lang === 'es' ? 'Notación matricial:' : 'Matrix notation:'}
                  </div>
                  <pre style={{ 
                    margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12,
                    color: 'var(--fg-1)', whiteSpace: 'pre-wrap',
                  }}>
                    {matrixToString(matrix)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'formula' && (
          <div style={{ padding: '32px 40px', minHeight: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
              {lang === 'es' ? 'Definición de Matriz' : 'Matrix Definition'}
            </h3>
            <p style={{ color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'es'
                ? 'Una matriz es un arreglo bidimensional de números que se utiliza para representar datos tabulares, sistemas de ecuaciones lineales y transformaciones geométricas.'
                : 'A matrix is a two-dimensional array of numbers used to represent tabular data, systems of linear equations, and geometric transformations.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Notación' : 'Notation'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 18, lineHeight: 2.1 }}>
                  <div>A = [aᵢⱼ] ∈ ℝᵐˣⁿ</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                    {lang === 'es' ? 'donde i = 1,...,m y j = 1,...,n' : 'where i = 1,...,m and j = 1,...,n'}
                  </div>
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {lang === 'es' ? 'Ejemplo' : 'Example'}
                </div>
                <div style={{ fontFamily: 'var(--font-math)', fontSize: 16, lineHeight: 1.8 }}>
                  <div>A =</div>
                  <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: 8, textAlign: 'center', margin: '8px 0' 
                  }}>
                    <div>1</div><div>2</div><div>3</div>
                    <div>4</div><div>5</div><div>6</div>
                    <div>7</div><div>8</div><div>9</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                    A ∈ ℝ³ˣ³
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'svg' && (
          <pre style={{ margin: 0, padding: 24, fontSize: 11.5, lineHeight: 1.7, minHeight: 400, overflow: 'auto', color: 'var(--fg-1)', background: 'var(--surface-2)' }}>
{"// Create and display a matrix in JavaScript\n\nclass Matrix {\n  constructor(rows, cols) {\n    this.rows = rows;\n    this.cols = cols;\n    this.data = Array(rows).fill(null)\n      .map(() => Array(cols).fill(0));\n  }\n  \n  get(i, j) {\n    return this.data[i][j];\n  }\n  \n  set(i, j, value) {\n    this.data[i][j] = value;\n  }\n  \n  toString() {\n    return this.data.map(row => \n      '[' + row.map(val => \n        val.toString().padStart(6, ' ')\n      ).join(' ') + ']'\n    ).join('\\n');\n  }\n}\n\n// Usage\nconst A = new Matrix(3, 3);\nA.set(0, 0, 1); A.set(0, 1, 2); A.set(0, 2, 3);\nA.set(1, 0, 4); A.set(1, 1, 5); A.set(1, 2, 6);\nA.set(2, 0, 7); A.set(2, 1, 8); A.set(2, 2, 9);\n\nconsole.log(A.toString());\n// Output:\n// [     1     2     3]\n// [     4     5     6]\n// [     7     8     9]"}
          </pre>
        )}
      </div>
      <DerivList steps={steps} step={step} setStep={setStep} lang={lang}/>
    </div>
  );
};
