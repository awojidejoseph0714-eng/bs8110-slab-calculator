/**
 * BS 8110-1:1997 Structural Concrete Slab Calculator Engine (v1 Specification)
 * Personal Cross-Checking Tool
 * 
 * Features:
 * - Directional depth split: dx = h - cover - phi/2, dy = dx - phi
 * - Over-reinforced guard: K > 0.156 halts z/As calculation and flags compression steel
 * - Full line-by-line worked equation strings for K, z, As,calc, As,min, As,req, spacing & As,prov
 * - Rebar spacing: s in {300, 250, 200, 175, 150, 100, 75, 50} where As,prov >= As,req + 100 and s <= min(3h, 400mm)
 * - Optional Shear check (off by default) with vc capped at min(0.8*sqrt(fcu), 5 N/mm²)
 * - Deflection check driven by slabType (20 for simple, 26 for continuous, 7 for cantilever)
 */

// Exact BS 8110 Table 3.14 Bending Moment Coefficients
const TABLE_3_14 = {
  interior: {
    1.0:  { bhx: 0.031, bsx: 0.024, bhy: 0.032, bsy: 0.024 },
    1.1:  { bhx: 0.037, bsx: 0.028, bhy: 0.032, bsy: 0.024 },
    1.2:  { bhx: 0.042, bsx: 0.032, bhy: 0.032, bsy: 0.024 },
    1.3:  { bhx: 0.046, bsx: 0.035, bhy: 0.032, bsy: 0.024 },
    1.4:  { bhx: 0.050, bsx: 0.037, bhy: 0.032, bsy: 0.024 },
    1.5:  { bhx: 0.053, bsx: 0.040, bhy: 0.032, bsy: 0.024 },
    1.75: { bhx: 0.059, bsx: 0.044, bhy: 0.032, bsy: 0.024 },
    2.0:  { bhx: 0.063, bsx: 0.048, bhy: 0.032, bsy: 0.024 }
  },
  one_short_discontinuous: {
    1.0:  { bhx: 0.039, bsx: 0.029, bhy: 0.037, bsy: 0.028 },
    1.1:  { bhx: 0.044, bsx: 0.033, bhy: 0.037, bsy: 0.028 },
    1.2:  { bhx: 0.048, bsx: 0.036, bhy: 0.037, bsy: 0.028 },
    1.3:  { bhx: 0.052, bsx: 0.039, bhy: 0.037, bsy: 0.028 },
    1.4:  { bhx: 0.055, bsx: 0.041, bhy: 0.037, bsy: 0.028 },
    1.5:  { bhx: 0.058, bsx: 0.043, bhy: 0.037, bsy: 0.028 },
    1.75: { bhx: 0.063, bsx: 0.047, bhy: 0.037, bsy: 0.028 },
    2.0:  { bhx: 0.067, bsx: 0.050, bhy: 0.037, bsy: 0.028 }
  },
  one_long_discontinuous: {
    1.0:  { bhx: 0.039, bsx: 0.030, bhy: 0.037, bsy: 0.028 },
    1.1:  { bhx: 0.049, bsx: 0.036, bhy: 0.037, bsy: 0.028 },
    1.2:  { bhx: 0.056, bsx: 0.042, bhy: 0.037, bsy: 0.028 },
    1.3:  { bhx: 0.062, bsx: 0.047, bhy: 0.037, bsy: 0.028 },
    1.4:  { bhx: 0.068, bsx: 0.051, bhy: 0.037, bsy: 0.028 },
    1.5:  { bhx: 0.073, bsx: 0.055, bhy: 0.037, bsy: 0.028 },
    1.75: { bhx: 0.082, bsx: 0.062, bhy: 0.037, bsy: 0.028 },
    2.0:  { bhx: 0.089, bsx: 0.067, bhy: 0.037, bsy: 0.028 }
  },
  two_adjacent_discontinuous: {
    1.0:  { bhx: 0.047, bsx: 0.036, bhy: 0.045, bsy: 0.034 },
    1.1:  { bhx: 0.056, bsx: 0.042, bhy: 0.045, bsy: 0.034 },
    1.2:  { bhx: 0.063, bsx: 0.047, bhy: 0.045, bsy: 0.034 },
    1.3:  { bhx: 0.069, bsx: 0.051, bhy: 0.045, bsy: 0.034 },
    1.4:  { bhx: 0.074, bsx: 0.055, bhy: 0.045, bsy: 0.034 },
    1.5:  { bhx: 0.078, bsx: 0.059, bhy: 0.045, bsy: 0.034 },
    1.75: { bhx: 0.087, bsx: 0.065, bhy: 0.045, bsy: 0.034 },
    2.0:  { bhx: 0.093, bsx: 0.070, bhy: 0.045, bsy: 0.034 }
  },
  two_short_discontinuous: {
    1.0:  { bhx: 0.046, bsx: 0.034, bhy: 0.000, bsy: 0.034 },
    1.1:  { bhx: 0.050, bsx: 0.038, bhy: 0.000, bsy: 0.034 },
    1.2:  { bhx: 0.054, bsx: 0.040, bhy: 0.000, bsy: 0.034 },
    1.3:  { bhx: 0.057, bsx: 0.043, bhy: 0.000, bsy: 0.034 },
    1.4:  { bhx: 0.060, bsx: 0.045, bhy: 0.000, bsy: 0.034 },
    1.5:  { bhx: 0.062, bsx: 0.047, bhy: 0.000, bsy: 0.034 },
    1.75: { bhx: 0.067, bsx: 0.050, bhy: 0.000, bsy: 0.034 },
    2.0:  { bhx: 0.070, bsx: 0.053, bhy: 0.000, bsy: 0.034 }
  },
  two_long_discontinuous: {
    1.0:  { bhx: 0.000, bsx: 0.034, bhy: 0.045, bsy: 0.034 },
    1.1:  { bhx: 0.000, bsx: 0.046, bhy: 0.045, bsy: 0.034 },
    1.2:  { bhx: 0.000, bsx: 0.056, bhy: 0.045, bsy: 0.034 },
    1.3:  { bhx: 0.000, bsx: 0.065, bhy: 0.045, bsy: 0.034 },
    1.4:  { bhx: 0.000, bsx: 0.072, bhy: 0.045, bsy: 0.034 },
    1.5:  { bhx: 0.000, bsx: 0.078, bhy: 0.045, bsy: 0.034 },
    1.75: { bhx: 0.000, bsx: 0.091, bhy: 0.045, bsy: 0.034 },
    2.0:  { bhx: 0.000, bsx: 0.100, bhy: 0.045, bsy: 0.034 }
  },
  three_edges_discontinuous_long_cont: {
    1.0:  { bhx: 0.057, bsx: 0.043, bhy: 0.000, bsy: 0.044 },
    1.1:  { bhx: 0.065, bsx: 0.048, bhy: 0.000, bsy: 0.044 },
    1.2:  { bhx: 0.071, bsx: 0.053, bhy: 0.000, bsy: 0.044 },
    1.3:  { bhx: 0.076, bsx: 0.057, bhy: 0.000, bsy: 0.044 },
    1.4:  { bhx: 0.081, bsx: 0.060, bhy: 0.000, bsy: 0.044 },
    1.5:  { bhx: 0.084, bsx: 0.063, bhy: 0.000, bsy: 0.044 },
    1.75: { bhx: 0.092, bsx: 0.069, bhy: 0.000, bsy: 0.044 },
    2.0:  { bhx: 0.098, bsx: 0.074, bhy: 0.000, bsy: 0.044 }
  },
  three_edges_discontinuous_short_cont: {
    1.0:  { bhx: 0.000, bsx: 0.042, bhy: 0.058, bsy: 0.044 },
    1.1:  { bhx: 0.000, bsx: 0.054, bhy: 0.058, bsy: 0.044 },
    1.2:  { bhx: 0.000, bsx: 0.063, bhy: 0.058, bsy: 0.044 },
    1.3:  { bhx: 0.000, bsx: 0.071, bhy: 0.058, bsy: 0.044 },
    1.4:  { bhx: 0.000, bsx: 0.078, bhy: 0.058, bsy: 0.044 },
    1.5:  { bhx: 0.000, bsx: 0.084, bhy: 0.058, bsy: 0.044 },
    1.75: { bhx: 0.000, bsx: 0.096, bhy: 0.058, bsy: 0.044 },
    2.0:  { bhx: 0.000, bsx: 0.105, bhy: 0.058, bsy: 0.044 }
  },
  four_edges_discontinuous: {
    1.0:  { bhx: 0.000, bsx: 0.055, bhy: 0.000, bsy: 0.056 },
    1.1:  { bhx: 0.000, bsx: 0.065, bhy: 0.000, bsy: 0.056 },
    1.2:  { bhx: 0.000, bsx: 0.074, bhy: 0.000, bsy: 0.056 },
    1.3:  { bhx: 0.000, bsx: 0.081, bhy: 0.000, bsy: 0.056 },
    1.4:  { bhx: 0.000, bsx: 0.087, bhy: 0.000, bsy: 0.056 },
    1.5:  { bhx: 0.000, bsx: 0.092, bhy: 0.000, bsy: 0.056 },
    1.75: { bhx: 0.000, bsx: 0.103, bhy: 0.000, bsy: 0.056 },
    2.0:  { bhx: 0.000, bsx: 0.111, bhy: 0.000, bsy: 0.056 }
  }
};

// Exact BS 8110 Table 3.15 Shear Force Coefficients
const TABLE_3_15 = {
  interior: {
    1.0:  { bvx: 0.33, bvy: 0.33 },
    1.1:  { bvx: 0.36, bvy: 0.33 },
    1.2:  { bvx: 0.39, bvy: 0.33 },
    1.3:  { bvx: 0.41, bvy: 0.33 },
    1.4:  { bvx: 0.43, bvy: 0.33 },
    1.5:  { bvx: 0.45, bvy: 0.33 },
    1.75: { bvx: 0.48, bvy: 0.33 },
    2.0:  { bvx: 0.50, bvy: 0.33 }
  },
  one_short_discontinuous: {
    1.0:  { bvx: 0.36, bvy: 0.36 },
    1.1:  { bvx: 0.39, bvy: 0.36 },
    1.2:  { bvx: 0.42, bvy: 0.36 },
    1.3:  { bvx: 0.44, bvy: 0.36 },
    1.4:  { bvx: 0.45, bvy: 0.36 },
    1.5:  { bvx: 0.47, bvy: 0.36 },
    1.75: { bvx: 0.50, bvy: 0.36 },
    2.0:  { bvx: 0.52, bvy: 0.36 }
  },
  one_long_discontinuous: {
    1.0:  { bvx: 0.36, bvy: 0.36 },
    1.1:  { bvx: 0.40, bvy: 0.36 },
    1.2:  { bvx: 0.44, bvy: 0.36 },
    1.3:  { bvx: 0.47, bvy: 0.36 },
    1.4:  { bvx: 0.49, bvy: 0.36 },
    1.5:  { bvx: 0.51, bvy: 0.36 },
    1.75: { bvx: 0.55, bvy: 0.36 },
    2.0:  { bvx: 0.59, bvy: 0.36 }
  },
  two_adjacent_discontinuous: {
    1.0:  { bvx: 0.40, bvy: 0.40 },
    1.1:  { bvx: 0.44, bvy: 0.40 },
    1.2:  { bvx: 0.47, bvy: 0.40 },
    1.3:  { bvx: 0.50, bvy: 0.40 },
    1.4:  { bvx: 0.52, bvy: 0.40 },
    1.5:  { bvx: 0.54, bvy: 0.40 },
    1.75: { bvx: 0.57, bvy: 0.40 },
    2.0:  { bvx: 0.60, bvy: 0.40 }
  },
  two_short_discontinuous: {
    1.0:  { bvx: 0.40, bvy: 0.26 },
    1.1:  { bvx: 0.43, bvy: 0.26 },
    1.2:  { bvx: 0.45, bvy: 0.26 },
    1.3:  { bvx: 0.47, bvy: 0.26 },
    1.4:  { bvx: 0.48, bvy: 0.26 },
    1.5:  { bvx: 0.49, bvy: 0.26 },
    1.75: { bvx: 0.52, bvy: 0.26 },
    2.0:  { bvx: 0.54, bvy: 0.26 }
  },
  two_long_discontinuous: {
    1.0:  { bvx: 0.26, bvy: 0.40 },
    1.1:  { bvx: 0.30, bvy: 0.40 },
    1.2:  { bvx: 0.33, bvy: 0.40 },
    1.3:  { bvx: 0.36, bvy: 0.40 },
    1.4:  { bvx: 0.38, bvy: 0.40 },
    1.5:  { bvx: 0.40, bvy: 0.40 },
    1.75: { bvx: 0.44, bvy: 0.40 },
    2.0:  { bvx: 0.47, bvy: 0.40 }
  },
  three_edges_discontinuous_long_cont: {
    1.0:  { bvx: 0.45, bvy: 0.29 },
    1.1:  { bvx: 0.48, bvy: 0.29 },
    1.2:  { bvx: 0.51, bvy: 0.29 },
    1.3:  { bvx: 0.53, bvy: 0.29 },
    1.4:  { bvx: 0.55, bvy: 0.29 },
    1.5:  { bvx: 0.57, bvy: 0.29 },
    1.75: { bvx: 0.60, bvy: 0.29 },
    2.0:  { bvx: 0.63, bvy: 0.29 }
  },
  three_edges_discontinuous_short_cont: {
    1.0:  { bvx: 0.29, bvy: 0.45 },
    1.1:  { bvx: 0.33, bvy: 0.45 },
    1.2:  { bvx: 0.36, bvy: 0.45 },
    1.3:  { bvx: 0.38, bvy: 0.45 },
    1.4:  { bvx: 0.40, bvy: 0.45 },
    1.5:  { bvx: 0.42, bvy: 0.45 },
    1.75: { bvx: 0.45, bvy: 0.45 },
    2.0:  { bvx: 0.48, bvy: 0.45 }
  },
  four_edges_discontinuous: {
    1.0:  { bvx: 0.33, bvy: 0.33 },
    1.1:  { bvx: 0.36, bvy: 0.33 },
    1.2:  { bvx: 0.39, bvy: 0.33 },
    1.3:  { bvx: 0.41, bvy: 0.33 },
    1.4:  { bvx: 0.43, bvy: 0.33 },
    1.5:  { bvx: 0.45, bvy: 0.33 },
    1.75: { bvx: 0.48, bvy: 0.33 },
    2.0:  { bvx: 0.50, bvy: 0.33 }
  }
};

const STANDARD_RATIOS = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.75, 2.0];

function getUpwardLookupRatio(ratioRaw) {
  const ratio = Math.max(1.0, Number(ratioRaw) || 1.0);
  if (ratio >= 2.0) return 2.0;
  for (let r of STANDARD_RATIOS) {
    if (r >= ratio) return r;
  }
  return 2.0;
}

function getTable314Coeffs(panelType, lyOverLxRaw) {
  const panelData = TABLE_3_14[panelType] || TABLE_3_14.interior;
  const ratio = Math.min(2.0, Math.max(1.0, Number(lyOverLxRaw) || 1.0));
  const upwardRatio = getUpwardLookupRatio(ratio);
  const coeffs = panelData[upwardRatio] || panelData[2.0];
  return { ...coeffs, effectiveRatio: upwardRatio };
}

function getTable315Coeffs(panelType, lyOverLxRaw) {
  const panelData = TABLE_3_15[panelType] || TABLE_3_15.interior;
  const ratio = Math.min(2.0, Math.max(1.0, Number(lyOverLxRaw) || 1.0));
  const upwardRatio = getUpwardLookupRatio(ratio);
  const coeffs = panelData[upwardRatio] || panelData[2.0];
  return { ...coeffs, effectiveRatio: upwardRatio };
}

/**
 * AUTOMATIC SPACING SOLVER
 * Picks largest standard spacing s in {300, 250, 200, 175, 150, 100, 75, 50} mm
 * where As,prov >= As,req + 100 mm²/m AND s <= min(3h, 400mm)
 */
function solveOptimalSpacing(As_req, b, d, h, barDia) {
  const standardSpacings = [300, 250, 200, 175, 150, 100, 75, 50];
  const maxSpacingLimit = Math.min(400, Math.floor(3 * h));
  const validSpacings = standardSpacings.filter((s) => s <= maxSpacingLimit);

  const targetAsProvMin = As_req + 100;
  let chosenBarDia = barDia;
  let chosenSpacing = 150;
  let As_prov = 0;

  for (let s of validSpacings) {
    const area = (1000 / s) * (Math.PI * Math.pow(chosenBarDia, 2) / 4) * (b / 1000);
    if (area >= targetAsProvMin) {
      chosenSpacing = s;
      As_prov = area;
      break;
    }
  }

  if (As_prov < targetAsProvMin) {
    const barSizes = [10, 12, 16, 20];
    const currentIndex = barSizes.indexOf(barDia);
    const nextBarDia = barSizes[Math.min(barSizes.length - 1, currentIndex + 1)];

    chosenBarDia = nextBarDia;
    for (let s of validSpacings) {
      const area = (1000 / s) * (Math.PI * Math.pow(chosenBarDia, 2) / 4) * (b / 1000);
      if (area >= targetAsProvMin) {
        chosenSpacing = s;
        As_prov = area;
        break;
      }
    }

    if (As_prov < targetAsProvMin) {
      chosenSpacing = 50;
      As_prov = (1000 / 50) * (Math.PI * Math.pow(chosenBarDia, 2) / 4) * (b / 1000);
    }
  }

  return {
    barDia: chosenBarDia,
    spacing: chosenSpacing,
    As_prov,
    margin: As_prov - As_req,
    maxSpacingLimit,
    barDetail: `Y${chosenBarDia} @ ${chosenSpacing} c/c`
  };
}

/**
 * Solve Single Section Flexure with Line-by-Line Worked Equations & K > 0.156 Guard
 */
function solveFlexureSection({ locationName, M, b, d, h, fcu, fy, initialBarDia }) {
  const minPercentage = fy >= 400 ? 0.0013 : 0.0024;
  const As_min = minPercentage * b * h;

  if (M <= 0) {
    const autoSteel = solveOptimalSpacing(As_min, b, d, h, initialBarDia);
    const workingLines = [
      `M = 0.00 kNm/m`,
      `As,min = ${minPercentage} × 1000 × ${h} = ${Math.round(As_min)} mm²/m`,
      `As,req  = ${Math.round(As_min)} mm²/m (governed by As,min)`,
      `Spacing: ${autoSteel.barDetail} → As,prov = ${Math.round(autoSteel.As_prov)} mm²/m ✓ (≤ 400mm, ≤ 3h=${autoSteel.maxSpacingLimit}mm)`
    ];

    return {
      locationName,
      M: 0,
      d,
      K: 0,
      overReinforced: false,
      z: 0.95 * d,
      As_calc: 0,
      As_min,
      As_req: As_min,
      governedBy: 'As_min',
      As_prov: autoSteel.As_prov,
      margin: autoSteel.margin,
      barDia: autoSteel.barDia,
      spacing: autoSteel.spacing,
      barDetail: autoSteel.barDetail,
      workingLines,
      pass: true
    };
  }

  // Flexural factor K
  const K = (M * 1e6) / (b * Math.pow(d, 2) * fcu);
  const K_working = `K = (${M.toFixed(2)}×10⁶)/(1000×${d.toFixed(0)}²×${fcu}) = ${K.toFixed(3)}`;

  // OVER-REINFORCED GUARD (K > 0.156)
  if (K > 0.156) {
    const workingLines = [
      K_working,
      `⚠️ OVER-REINFORCED SECTION: K (${K.toFixed(3)}) > 0.156 limit per BS 8110 Cl 3.4.4.4.`,
      `Section requires compression reinforcement or depth (h) redesign. z and As calculation halted.`
    ];

    return {
      locationName,
      M,
      d,
      K,
      overReinforced: true,
      overReinforcedMessage: `K = ${K.toFixed(3)} > 0.156 (Needs compression steel or redesign)`,
      z: null,
      As_calc: null,
      As_min,
      As_req: null,
      governedBy: null,
      As_prov: 0,
      margin: 0,
      barDia: initialBarDia,
      spacing: 0,
      barDetail: `Over-reinforced (K > 0.156)`,
      workingLines,
      pass: false
    };
  }

  // z calculation
  const z_factor = 0.5 + Math.sqrt(Math.max(0, 0.25 - K / 0.9));
  const z = Math.min(0.95 * d, d * z_factor);
  const z_working = `z = d[0.5 + √(0.25 − ${K.toFixed(3)}/0.9)] = ${z.toFixed(1)}mm (cap 0.95d = ${(0.95 * d).toFixed(1)}mm)`;

  // As,calc calculation
  const As_calc = (M * 1e6) / (0.95 * fy * z);
  const As_calc_working = `As,calc = (${M.toFixed(2)}×10⁶) / (0.95×${fy}×${z.toFixed(1)}) = ${Math.round(As_calc)} mm²/m`;

  // As,min calculation
  const As_min_working = `As,min = ${minPercentage} × 1000 × ${h} = ${Math.round(As_min)} mm²/m`;

  // As,req governing
  const As_req = Math.max(As_calc, As_min);
  const governedBy = As_calc >= As_min ? 'As_calc' : 'As_min';
  const As_req_working = `As,req  = max(${Math.round(As_calc)}, ${Math.round(As_min)}) = ${Math.round(As_req)} mm²/m   (governed by ${governedBy})`;

  // Spacing & As,prov
  const autoSteel = solveOptimalSpacing(As_req, b, d, h, initialBarDia);
  const spacing_working = `Spacing: ${autoSteel.barDetail} → As,prov = ${Math.round(autoSteel.As_prov)} mm²/m ✓ (≤ 400mm, ≤ 3h=${autoSteel.maxSpacingLimit}mm)`;

  const workingLines = [
    K_working,
    z_working,
    As_calc_working,
    As_min_working,
    As_req_working,
    spacing_working
  ];

  return {
    locationName,
    M,
    d,
    K,
    overReinforced: false,
    z,
    As_calc,
    As_min,
    As_req,
    governedBy,
    As_prov: autoSteel.As_prov,
    margin: autoSteel.margin,
    barDia: autoSteel.barDia,
    spacing: autoSteel.spacing,
    barDetail: autoSteel.barDetail,
    workingLines,
    pass: autoSteel.As_prov >= As_req
  };
}

/**
 * Dedicated BS 8110 Slab Engine
 */
export function calculateBS8110Slab(inputs) {
  if (!inputs) return null;

  const {
    slabType = 'two_way_restrained',
    panelCondition = 'one_long_discontinuous',
    
    lxInput = '',
    lyInput = '',
    lyOverLxInput = '',
    
    loadMode = 'direct_n',
    designLoadNInput = '',
    gkInput = '',
    qkInput = '',
    
    bInput = 1000,
    hInput = '',
    coverInput = 25,
    
    fcuInput = 30,
    fyInput = 460,
    
    targetPhi = 12,
    enableShearCheck = false
  } = inputs;

  const isLxEmpty = lxInput === '';
  const isHEmpty = hInput === '';
  const isLoadEmpty = loadMode === 'direct_n' ? designLoadNInput === '' : (gkInput === '' || qkInput === '');

  if (isLxEmpty || isHEmpty || isLoadEmpty) {
    return {
      isBlank: true,
      message: 'Please specify short span (lx), thickness (h), and design load (n) to calculate.'
    };
  }

  const b = 1000;
  const lx = Math.max(0.1, Number(lxInput) || 4.0);
  
  let ly = lx;
  if (slabType === 'one_way' || slabType === 'cantilever') {
    ly = lx;
  } else if (lyInput !== '' && !isNaN(Number(lyInput))) {
    ly = Math.max(lx, Number(lyInput));
  } else if (lyOverLxInput !== '' && !isNaN(Number(lyOverLxInput))) {
    ly = lx * Math.max(1.0, Number(lyOverLxInput));
  } else {
    ly = lx * 1.25;
  }
  
  const lyOverLxRaw = ly / lx;
  const h = Math.max(50, Number(hInput) || 150);
  const cover = Math.max(15, Number(coverInput) || 25);
  
  const fcu = Math.min(40, Math.max(15, Number(fcuInput) || 30));
  const fy = Math.min(460, Math.max(250, Number(fyInput) || 460));

  const phi = Number(targetPhi) || 12;

  // DIRECTIONAL DEPTH TRACKING: dx vs dy
  const dx = h - cover - phi / 2;
  const dy = dx - phi; // Second layer sits one bar diameter lower

  let n = 0;
  let Gk = 0;
  let Qk = 0;
  if (loadMode === 'gk_qk') {
    Gk = Number(gkInput) || 0;
    Qk = Number(qkInput) || 0;
    n = 1.4 * Gk + 1.6 * Qk;
  } else {
    n = Math.max(0.1, Number(designLoadNInput) || 12.0);
  }

  // -------------------------------------------------------------
  // STEP 1: BENDING MOMENTS (2x2 GRID FOR 2-WAY)
  // -------------------------------------------------------------
  let Msx = 0;
  let Mhx = 0;
  let Msy = 0;
  let Mhy = 0;

  let momentCoeffs = { bhx: 0, bsx: 0, bhy: 0, bsy: 0, effectiveRatio: 1.0 };
  let shearCoeffs = { bvx: 0, bvy: 0, effectiveRatio: 1.0 };

  if (slabType === 'one_way') {
    momentCoeffs.bsx = 0.125;
    Msx = 0.125 * n * Math.pow(lx, 2);
  } else if (slabType === 'cantilever') {
    momentCoeffs.bhx = 0.500;
    Mhx = 0.500 * n * Math.pow(lx, 2);
  } else if (slabType === 'two_way_ss') {
    momentCoeffs = getTable314Coeffs('four_edges_discontinuous', lyOverLxRaw);
    shearCoeffs = getTable315Coeffs('four_edges_discontinuous', lyOverLxRaw);
    Msx = momentCoeffs.bsx * n * Math.pow(lx, 2);
    Msy = momentCoeffs.bsy * n * Math.pow(lx, 2);
  } else {
    // Two-Way Restrained (BS 8110 Table 3.14)
    momentCoeffs = getTable314Coeffs(panelCondition, lyOverLxRaw);
    shearCoeffs = getTable315Coeffs(panelCondition, lyOverLxRaw);
    Msx = momentCoeffs.bsx * n * Math.pow(lx, 2);
    Mhx = momentCoeffs.bhx * n * Math.pow(lx, 2);
    Msy = momentCoeffs.bsy * n * Math.pow(lx, 2);
    Mhy = momentCoeffs.bhy * n * Math.pow(lx, 2);
  }

  const M_max = Math.max(Msx, Mhx, Msy, Mhy);

  // -------------------------------------------------------------
  // STEP 2: FLEXURE DESIGN PER SECTION (dx vs dy)
  // -------------------------------------------------------------
  const flexureShortMidspan = solveFlexureSection({
    locationName: 'Short Span Midspan (+ve Msx)',
    M: Msx, b, d: dx, h, fcu, fy, initialBarDia: phi
  });

  const flexureShortSupport = solveFlexureSection({
    locationName: 'Short Span Support (-ve Mhx)',
    M: Mhx, b, d: dx, h, fcu, fy, initialBarDia: phi
  });

  const flexureLongMidspan = solveFlexureSection({
    locationName: 'Long Span Midspan (+ve Msy)',
    M: Msy, b, d: dy, h, fcu, fy, initialBarDia: phi
  });

  const flexureLongSupport = solveFlexureSection({
    locationName: 'Long Span Support (-ve Mhy)',
    M: Mhy, b, d: dy, h, fcu, fy, initialBarDia: phi
  });

  const flexurePass = flexureShortMidspan.pass && flexureShortSupport.pass && flexureLongMidspan.pass && flexureLongSupport.pass;

  // -------------------------------------------------------------
  // STEP 3: OPTIONAL SHEAR CHECK (OFF BY DEFAULT)
  // -------------------------------------------------------------
  let shearCheck = null;
  if (enableShearCheck && (slabType === 'two_way_restrained' || slabType === 'two_way_ss')) {
    const Vx = (shearCoeffs.bvx || 0.5) * n * lx;
    const Vy = (shearCoeffs.bvy || 0.33) * n * lx;
    const V_max = Math.max(Vx, Vy);

    const v = (V_max * 1e3) / (b * dx);
    const v_max_cap = Math.min(0.8 * Math.sqrt(fcu), 5.0); // Capped at min(0.8*sqrt(fcu), 5 N/mm²)

    const rebarRatioRaw = (100 * flexureShortMidspan.As_prov) / (b * dx);
    const rebarRatioBounded = Math.min(3.0, Math.max(0.15, rebarRatioRaw));
    const depthFactor = Math.max(1.0, Math.pow(400 / dx, 0.25));
    const fcuFactor = Math.pow(Math.min(40, fcu) / 25, 1 / 3);

    const vc = (0.79 / 1.25) * Math.pow(rebarRatioBounded, 1 / 3) * depthFactor * fcuFactor;
    const vc_capped = Math.min(vc, v_max_cap);
    const shearPass = v <= vc_capped;

    shearCheck = {
      enabled: true,
      bvx: shearCoeffs.bvx,
      bvy: shearCoeffs.bvy,
      Vx,
      Vy,
      V_max,
      v,
      vc,
      vc_capped,
      v_max_cap,
      pass: shearPass,
      workingLines: [
        `Table 3.15 Shear Coeffs (ratio ${momentCoeffs.effectiveRatio}): βvx = ${shearCoeffs.bvx}, βvy = ${shearCoeffs.bvy}`,
        `Vx = βvx × n × lx = ${Vx.toFixed(2)} kN/m, Vy = βvy × n × lx = ${Vy.toFixed(2)} kN/m → Vmax = ${V_max.toFixed(2)} kN/m`,
        `Design shear stress v = (${V_max.toFixed(2)}×10³) / (1000×${dx.toFixed(0)}) = ${v.toFixed(3)} N/mm²`,
        `Concrete capacity vc = ${vc.toFixed(3)} N/mm² (capped at min(0.8√fcu, 5.0) = ${v_max_cap.toFixed(2)} N/mm²)`,
        `Check: v (${v.toFixed(3)}) ≤ vc (${vc_capped.toFixed(3)}) → ${shearPass ? 'PASS (No shear links required)' : 'FAIL'}`
      ]
    };
  }

  // -------------------------------------------------------------
  // STEP 4: DEFLECTION CHECK (Basic ratio driven by slabType)
  // -------------------------------------------------------------
  let basicSpanToDepth = 26; // Default continuous/restrained
  if (slabType === 'two_way_ss' || slabType === 'one_way') {
    basicSpanToDepth = 20;
  } else if (slabType === 'cantilever') {
    basicSpanToDepth = 7;
  }

  const fs = (2 / 3) * fy * (flexureShortMidspan.As_req / flexureShortMidspan.As_prov);
  const M_bd2 = (Msx * 1e6) / (b * Math.pow(dx, 2));

  const F1_raw = 0.55 + (477 - fs) / (120 * (0.9 + M_bd2));
  const F1 = Math.min(2.0, Math.max(0.55, F1_raw));
  const F2 = 1.0;

  const allowableSpanToDepth = basicSpanToDepth * F1 * F2;
  const actualSpanToDepth = (lx * 1000) / dx;
  const deflectionPass = actualSpanToDepth <= allowableSpanToDepth;

  const deflection = {
    basicSpanToDepth,
    fs,
    M_bd2,
    F1,
    F2,
    allowableSpanToDepth,
    actualSpanToDepth,
    pass: deflectionPass,
    workingLines: [
      `Basic span/d ratio = ${basicSpanToDepth} (tied to slab type: ${slabType.replace(/_/g, ' ')})`,
      `Service stress fs = (2/3) × ${fy} × (${Math.round(flexureShortMidspan.As_req)} / ${Math.round(flexureShortMidspan.As_prov)}) = ${fs.toFixed(1)} N/mm²`,
      `M/(b.d²) = (${Msx.toFixed(2)}×10⁶) / (1000×${dx.toFixed(0)}²) = ${M_bd2.toFixed(3)} N/mm²`,
      `Modification factor F1 = 0.55 + (477 - ${fs.toFixed(1)}) / [120 × (0.9 + ${M_bd2.toFixed(3)})] = ${F1_raw.toFixed(2)} (cap max 2.0 → ${F1.toFixed(2)})`,
      `Allowable span/d = ${basicSpanToDepth} × ${F1.toFixed(2)} = ${allowableSpanToDepth.toFixed(2)}`,
      `Actual span/d = (${lx}×1000) / ${dx.toFixed(0)} = ${actualSpanToDepth.toFixed(2)}`,
      `Check: Actual (${actualSpanToDepth.toFixed(1)}) ≤ Allowable (${allowableSpanToDepth.toFixed(1)}) → ${deflectionPass ? 'PASS (Deflection Satisfactory)' : 'FAIL'}`
    ]
  };

  const overallPass = flexurePass && (shearCheck ? shearCheck.pass : true) && deflectionPass;

  return {
    isBlank: false,
    inputs: { ...inputs, b, lx, ly, lyOverLxRaw, h, cover, dx, dy, fcu, fy, n, Gk, Qk, targetPhi: phi, effectiveRatio: momentCoeffs.effectiveRatio },
    n,
    M_max,
    moments: { Msx, Mhx, Msy, Mhy, momentCoeffs },
    flexureParts: {
      shortMidspan: flexureShortMidspan,
      shortSupport: flexureShortSupport,
      longMidspan: flexureLongMidspan,
      longSupport: flexureLongSupport
    },
    shearCheck,
    deflection,
    overallPass,
    timestamp: new Date().toISOString()
  };
}

export const SLAB_PRESETS = {
  two_way_restrained_interior: {
    name: 'Two-Way Restrained Slab (Interior Panel)',
    slabType: 'two_way_restrained',
    panelCondition: 'interior',
    lxInput: 4.0,
    lyInput: 5.0,
    hInput: 160,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 12.0,
    fcuInput: 30,
    fyInput: 460,
    targetPhi: 12
  },
  two_way_ss: {
    name: 'Two-Way Simply Supported Slab',
    slabType: 'two_way_ss',
    lxInput: 4.0,
    lyInput: 4.8,
    hInput: 160,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 11.5,
    fcuInput: 25,
    fyInput: 460,
    targetPhi: 12
  },
  one_way_solid: {
    name: 'One-Way Solid Floor Slab',
    slabType: 'one_way',
    lxInput: 3.8,
    lyInput: 8.5,
    hInput: 150,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 12.0,
    fcuInput: 30,
    fyInput: 460,
    targetPhi: 12
  },
  cantilever_balcony: {
    name: 'Cantilever Balcony Slab',
    slabType: 'cantilever',
    lxInput: 1.8,
    lyInput: 4.0,
    hInput: 150,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 10.0,
    fcuInput: 30,
    fyInput: 460,
    targetPhi: 12
  }
};
