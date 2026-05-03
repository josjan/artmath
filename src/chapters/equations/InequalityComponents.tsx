// InequalityComponents.tsx — Interactive inequality components

// Solve linear inequality ax + b > 0, < 0, ≥ 0, ≤ 0
export const solveLinearInequality = (a: number, b: number, operator: string) => {
  if (Math.abs(a) < 0.0001) {
    // Constant inequality
    if (Math.abs(b) < 0.0001) {
      // 0 > 0, 0 < 0, etc.
      if (operator === '>' || operator === '<') {
        return { hasSolution: false, solution: null, type: 'no_solution' };
      } else {
        return { hasSolution: true, solution: 'all_real', type: 'all_real' };
      }
    } else {
      // b > 0, b < 0, etc.
      const condition = operator === '>' ? b > 0 :
                      operator === '<' ? b < 0 :
                      operator === '>=' ? b >= 0 :
                      operator === '<=' ? b <= 0 : false;
      
      return { hasSolution: condition, solution: condition ? 'all_real' : null, type: condition ? 'all_real' : 'no_solution' };
    }
  }
  
  const criticalPoint = -b / a;
  
  let solution;
  if (operator === '>') {
    solution = a > 0 ? { type: 'interval', start: criticalPoint, end: 'infinity', openStart: true } 
                     : { type: 'interval', start: 'negative_infinity', end: criticalPoint, openEnd: true };
  } else if (operator === '<') {
    solution = a > 0 ? { type: 'interval', start: 'negative_infinity', end: criticalPoint, openEnd: true }
                     : { type: 'interval', start: criticalPoint, end: 'infinity', openStart: true };
  } else if (operator === '>=') {
    solution = a > 0 ? { type: 'interval', start: criticalPoint, end: 'infinity', openStart: false }
                     : { type: 'interval', start: 'negative_infinity', end: criticalPoint, openEnd: false };
  } else if (operator === '<=') {
    solution = a > 0 ? { type: 'interval', start: 'negative_infinity', end: criticalPoint, openEnd: false }
                     : { type: 'interval', start: criticalPoint, end: 'infinity', openStart: false };
  }
  
  return { hasSolution: true, solution, type: 'interval' };
};

// Solve quadratic inequality ax² + bx + c > 0, < 0, ≥ 0, ≤ 0
export const solveQuadraticInequality = (a: number, b: number, c: number, operator: string) => {
  const disc = b * b - 4 * a * c;
  
  if (Math.abs(a) < 0.0001) {
    // Reduce to linear inequality
    return solveLinearInequality(b, c, operator);
  }
  
  if (disc < 0) {
    // No real roots, parabola doesn't cross x-axis
    const opensUp = a > 0;
    const alwaysPositive = opensUp;
    
    if (operator === '>') {
      return { hasSolution: alwaysPositive, solution: alwaysPositive ? 'all_real' : null, type: alwaysPositive ? 'all_real' : 'no_solution' };
    } else if (operator === '<') {
      return { hasSolution: !alwaysPositive, solution: !alwaysPositive ? 'all_real' : null, type: !alwaysPositive ? 'all_real' : 'no_solution' };
    } else if (operator === '>=') {
      return { hasSolution: true, solution: 'all_real', type: 'all_real' };
    } else {
      return { hasSolution: true, solution: 'all_real', type: 'all_real' };
    }
  }
  
  const sqrtDisc = Math.sqrt(disc);
  const root1 = (-b - sqrtDisc) / (2 * a);
  const root2 = (-b + sqrtDisc) / (2 * a);
  
  const smallerRoot = Math.min(root1, root2);
  const largerRoot = Math.max(root1, root2);
  const opensUp = a > 0;
  
  let solution;
  if (operator === '>') {
    solution = opensUp 
      ? [{ type: 'interval', start: 'negative_infinity', end: smallerRoot, openEnd: true },
         { type: 'interval', start: largerRoot, end: 'infinity', openStart: true }]
      : [{ type: 'interval', start: smallerRoot, end: largerRoot, openStart: true, openEnd: true }];
  } else if (operator === '<') {
    solution = opensUp
      ? [{ type: 'interval', start: smallerRoot, end: largerRoot, openStart: true, openEnd: true }]
      : [{ type: 'interval', start: 'negative_infinity', end: smallerRoot, openEnd: true },
         { type: 'interval', start: largerRoot, end: 'infinity', openStart: true }];
  } else if (operator === '>=') {
    solution = opensUp
      ? [{ type: 'interval', start: 'negative_infinity', end: smallerRoot, openEnd: false },
         { type: 'interval', start: largerRoot, end: 'infinity', openStart: false }]
      : [{ type: 'interval', start: smallerRoot, end: largerRoot, openStart: false, openEnd: false }];
  } else {
    solution = opensUp
      ? [{ type: 'interval', start: smallerRoot, end: largerRoot, openStart: false, openEnd: false }]
      : [{ type: 'interval', start: 'negative_infinity', end: smallerRoot, openEnd: false },
         { type: 'interval', start: largerRoot, end: 'infinity', openStart: false }];
  }
  
  return { hasSolution: true, solution, type: 'intervals' };
};

// Linear Inequality Figure Component
export const LinearInequalityFigure = ({ a, b, operator }: {
  a: number; b: number; operator: string;
}) => {
  const result = solveLinearInequality(a, b, operator);
  
  // Generate line and shaded region
  const generateVisualization = () => {
    const points: string[] = [];
    const shadePoints: string[] = [];
    
    if (Math.abs(a) > 0.0001) {
      
      // Generate the line y = (-a*x + b) / a? Wait, this is ax + b > 0
      // For visualization, we'll show y = 0 and shade the region where ax + b satisfies the inequality
      for (let x = -10; x <= 10; x += 0.1) {
        const px = 360 + x * 30;
        const py = 230; // y = 0 line
        points.push(`${points.length === 0 ? 'M' : 'L'}${px} ${py}`);
      }
      
      // Add shading based on solution
      if (result.hasSolution && result.solution && typeof result.solution === 'object' && 'type' in result.solution) {
        const sol = result.solution as any;
        if (sol.type === 'interval') {
          const startX = sol.start === 'negative_infinity' ? -10 : 
                        sol.start === 'infinity' ? 10 : Number(sol.start);
          const endX = sol.end === 'infinity' ? 10 : 
                      sol.end === 'negative_infinity' ? -10 : Number(sol.end);
          
          for (let x = Math.max(-10, startX); x <= Math.min(10, endX); x += 0.2) {
            const px = 360 + x * 30;
            shadePoints.push(`M${px} 230 L${px} 280`); // Shade below the line
          }
        }
      }
      
      // Mark critical point
      if (result.hasSolution && result.solution && typeof result.solution === 'object' && 'start' in result.solution) {
        const sol = result.solution as any;
        if (sol.start !== 'negative_infinity' && sol.start !== 'infinity') {
          const px = 360 + Number(sol.start) * 30;
          return {
            linePath: points.join(' '),
            shadePath: shadePoints.join(' '),
            criticalPoint: { x: px, y: 230, value: Number(sol.start) },
            isOpen: sol.openStart || false
          };
        }
      }
    }
    
    return {
      linePath: points.join(' '),
      shadePath: shadePoints.join(' '),
      criticalPoint: null,
      isOpen: false
    };
  };
  
  const viz = generateVisualization();

  return (
    <svg width="720" height="460" style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--surface)' }}>
      <defs>
        <pattern id="ineqgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="ineqgridBold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#ineqgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={720} height={460} fill="url(#ineqgridBold)"/>

      <line x1={0} y1={230} x2={720} y2={230} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={360} y1={0} x2={360} y2={460} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={720 - 14} y={230 - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={360 + 8}  y={14}    fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={360 + t * 30} y1={230 - 4} x2={360 + t * 30} y2={230 + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={360 + t * 30} y={230 + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}

      {/* Shaded region */}
      {viz.shadePath && (
        <path d={viz.shadePath} stroke="none" fill="var(--accent)" opacity="0.2" strokeWidth="0"/>
      )}

      {/* Main line */}
      <path d={viz.linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5"/>

      {/* Critical point */}
      {viz.criticalPoint && (
        <g>
          <circle cx={viz.criticalPoint.x} cy={viz.criticalPoint.y} r="8" 
                  fill={viz.isOpen ? "white" : "var(--handle)"} 
                  stroke="var(--handle)" strokeWidth="2"/>
          <text x={viz.criticalPoint.x} y={viz.criticalPoint.y + 25} 
                fontFamily="var(--font-mono)" fontSize="11" fill="var(--handle)" textAnchor="middle">
            x = {viz.criticalPoint.value.toFixed(2)}
          </text>
        </g>
      )}

      <circle cx={360} cy={230} r="3" fill="var(--fg-1)"/>
    </svg>
  );
};

// Quadratic Inequality Figure Component
export const QuadraticInequalityFigure = ({ a, b, c, operator }: {
  a: number; b: number; c: number; operator: string;
}) => {
  const result = solveQuadraticInequality(a, b, c, operator);
  
  // Generate parabola and shaded regions
  const generateVisualization = () => {
    const curvePoints: string[] = [];
    const shadeRegions: string[] = [];
    
    // Generate parabola points
    for (let x = -10; x <= 10; x += 0.05) {
      const y = a * x * x + b * x + c;
      const px = 360 + x * 30;
      const py = 230 - y * 20;
      if (py >= 0 && py <= 460) {
        curvePoints.push(`${curvePoints.length === 0 ? 'M' : 'L'}${px} ${py}`);
      }
    }
    
    // Add shading based on solution
    if (result.hasSolution && result.solution) {
      const sol = result.solution;
      if (typeof sol === 'string' && sol === 'all_real') {
        // Shade entire area
        shadeRegions.push('M0 0 L720 0 L720 460 L0 460 Z');
      } else if (Array.isArray(sol)) {
        // Shade specific intervals
        sol.forEach(interval => {
          const startX = interval.start === 'negative_infinity' ? -10 : 
                        interval.start === 'infinity' ? 10 : Number(interval.start);
          const endX = interval.end === 'infinity' ? 10 : 
                      interval.end === 'negative_infinity' ? -10 : Number(interval.end);
          
          const regionPoints: string[] = [];
          for (let x = Math.max(-10, startX); x <= Math.min(10, endX); x += 0.1) {
            const px = 360 + x * 30;
            regionPoints.push(`L${px} 460`);
          }
          
          if (regionPoints.length > 0) {
            const firstX = 360 + Math.max(-10, startX) * 30;
            regionPoints.unshift(`M${firstX} 230`);
            regionPoints.push('Z');
            shadeRegions.push(regionPoints.join(' '));
          }
        });
      }
    }
    
    return {
      curvePath: curvePoints.join(' '),
      shadePaths: shadeRegions
    };
  };
  
  const viz = generateVisualization();

  return (
    <svg width="720" height="460" style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--surface)' }}>
      <defs>
        <pattern id="quadineqgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="var(--diagram-grid)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="quadineqgridBold" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#quadineqgrid)" stroke="var(--diagram-grid-bold)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width={720} height={460} fill="url(#quadineqgridBold)"/>

      <line x1={0} y1={230} x2={720} y2={230} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <line x1={360} y1={0} x2={360} y2={460} stroke="var(--fg-2)" strokeWidth={1.2}/>
      <text x={720 - 14} y={230 - 8} fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)" textAnchor="end">x</text>
      <text x={360 + 8}  y={14}    fontFamily="var(--font-math)" fontStyle="italic" fontSize="14" fill="var(--fg-2)">y</text>

      {[-6, -4, -2, 2, 4, 6].map(t => (
        <g key={t}>
          <line x1={360 + t * 30} y1={230 - 4} x2={360 + t * 30} y2={230 + 4} stroke="var(--fg-3)" strokeWidth="0.8"/>
          <text x={360 + t * 30} y={230 + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)" textAnchor="middle">{t}</text>
        </g>
      ))}

      {/* Shaded regions */}
      {viz.shadePaths.map((path, i) => (
        <path key={i} d={path} stroke="none" fill="var(--accent)" opacity="0.2"/>
      ))}

      {/* Parabola */}
      <path d={viz.curvePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      <circle cx={360} cy={230} r="3" fill="var(--fg-1)"/>
    </svg>
  );
};
