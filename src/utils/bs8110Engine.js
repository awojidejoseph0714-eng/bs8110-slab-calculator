/**
 * BS 8110-1:1997 Structural Concrete Slab Calculator Engine
 * Standard Rebar Spacings: [300, 250, 200, 175, 150, 100, 75, 50] mm c/c
 * Enforces rule: (As_prov - As_req) >= 100 mm²/m margin
 */

// Exact BS 8110 Table 3.14 Bending Moment Coefficients from Code Scan
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

// Exact BS 8110 Table 3.15 Shear Force Coefficients from Code Scan
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

/**
 * Upward Ratio Lookup
 */
function getUpwardLookupRatio(ratioRaw) {
  const ratio = Math.max(1.0, Number(ratioRaw) || 1.0);
  if (ratio >= 2.0) return 2.0;

  for (let r of STANDARD_RATIOS) {
    if (r >= ratio) {
      return r;
    }
  }
  return 2.0;
}

/**
 * Get BS 8110 Bending Moment Coefficients with UPWARD ratio lookup
 */
function getTable314Coeffs(panelType, lyOverLxRaw) {
  const panelData = TABLE_3_14[panelType] || TABLE_3_14.interior;
  const ratio = Math.min(2.0, Math.max(1.0, Number(lyOverLxRaw) || 1.0));

  const upwardRatio = getUpwardLookupRatio(ratio);
  const coeffs = panelData[upwardRatio] || panelData[2.0];

  return {
    ...coeffs,
    effectiveRatio: upwardRatio,
    lookupMode: 'upward'
  };
}

/**
 * Get BS 8110 Shear Coefficients with UPWARD ratio lookup
 */
function getTable315Coeffs(panelType, lyOverLxRaw) {
  const panelData = TABLE_3_15[panelType] || TABLE_3_15.interior;
  const ratio = Math.min(2.0, Math.max(1.0, Number(lyOverLxRaw) || 1.0));

  const upwardRatio = getUpwardLookupRatio(ratio);
  const coeffs = panelData[upwardRatio] || panelData[2.0];

  return {
    ...coeffs,
    effectiveRatio: upwardRatio,
    lookupMode: 'upward'
  };
}

/**
 * AUTOMATIC SPACING SOLVER
 * Restricted strictly to standard structural detailing spacings:
 * [300, 250, 200, 175, 150, 100, 75, 50] mm c/c
 */
function solveOptimalSpacing(As_governing_req, b, d, barDia) {
  const standardSpacings = [300, 250, 200, 175, 150, 100, 75, 50];
  const maxSpacingLimit = Math.min(300, Math.floor(3 * d));
  const validSpacings = standardSpacings.filter((s) => s <= maxSpacingLimit);

  // Require provided steel to be at least As_req + 100 mm²/m
  const targetAsProvMin = As_governing_req + 100;

  let chosenBarDia = barDia;
  let chosenSpacing = 150;
  let As_prov = 0;

  // Try finding valid spacing from standard set [300, 250, 200, 175, 150, 100, 75, 50]
  for (let s of validSpacings) {
    const area = (1000 / s) * (Math.PI * Math.pow(chosenBarDia, 2) / 4) * (b / 1000);
    if (area >= targetAsProvMin) {
      chosenSpacing = s;
      As_prov = area;
      break;
    }
  }

  // Step up bar diameter if current diameter is insufficient
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
    margin: As_prov - As_governing_req,
    barDetail: `Y${chosenBarDia} @ ${chosenSpacing}mm c/c`
  };
}

/**
 * Solve Single Section Flexure
 */
function solveFlexureAutoSpacing(M, b, d, h, fcu, fy, initialBarDia) {
  if (M <= 0) {
    const As_min = (fy >= 400 ? 0.0013 : 0.0024) * b * h;
    const autoSteel = solveOptimalSpacing(As_min, b, d, initialBarDia);

    return {
      M: 0,
      K: 0,
      z: 0.95 * d,
      x: 0,
      As_req: 0,
      As_min,
      As_governing_req: As_min,
      As_prov: autoSteel.As_prov,
      margin: autoSteel.margin,
      barDia: autoSteel.barDia,
      spacing: autoSteel.spacing,
      barDetail: autoSteel.barDetail,
      pass: true
    };
  }

  const K = (M * 1e6) / (b * Math.pow(d, 2) * fcu);
  const K_prime = 0.156;

  let z = 0.95 * d;
  let x = 0;
  let As_req = 0;

  if (K <= K_prime) {
    const z_factor = 0.5 + Math.sqrt(Math.max(0, 0.25 - K / 0.9));
    z = Math.min(0.95 * d, d * z_factor);
    x = (d - z) / 0.45;
    As_req = (M * 1e6) / (0.95 * fy * z);
  } else {
    z = 0.775 * d;
    x = 0.5 * d;
    As_req = (K_prime * fcu * b * Math.pow(d, 2)) / (0.95 * fy * z);
  }

  const minPercentage = fy >= 400 ? 0.0013 : 0.0024;
  const As_min = minPercentage * b * h;
  const As_governing_req = Math.max(As_req, As_min);

  const autoSteel = solveOptimalSpacing(As_governing_req, b, d, initialBarDia);
  const margin = autoSteel.As_prov - As_governing_req;
  const pass = autoSteel.As_prov >= As_governing_req && margin >= 100 && K <= 0.4;

  return {
    M,
    K,
    K_prime,
    z,
    x,
    As_req,
    As_min,
    As_governing_req,
    As_prov: autoSteel.As_prov,
    margin,
    barDia: autoSteel.barDia,
    spacing: autoSteel.spacing,
    barDetail: autoSteel.barDetail,
    pass
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
    
    barDiaShort = 12,
    barDiaLong = 10,
    barDiaSupport = 12
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
  if (lyInput !== '' && !isNaN(Number(lyInput))) {
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

  const phiShort = Number(barDiaShort) || 12;
  const d_short = h - cover - phiShort / 2;
  const d_long = d_short - phiShort;

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
  // STEP 1: MOMENTS & UPWARD COEFFICIENT LOOKUP
  // -------------------------------------------------------------
  let Msx = 0;
  let Mhx = 0;
  let Msy = 0;
  let Mhy = 0;

  let momentCoeffs = getTable314Coeffs(panelCondition, lyOverLxRaw);
  let shearCoeffs = getTable315Coeffs(panelCondition, lyOverLxRaw);

  if (slabType === 'one_way') {
    momentCoeffs.bsx = 0.125;
    Msx = 0.125 * n * Math.pow(lx, 2);
    shearCoeffs.bvx = 0.5;
  } else if (slabType === 'cantilever') {
    momentCoeffs.bhx = 0.500;
    Mhx = 0.500 * n * Math.pow(lx, 2);
    shearCoeffs.bvx = 1.0;
  } else if (slabType === 'two_way_ss') {
    momentCoeffs = getTable314Coeffs('four_edges_discontinuous', lyOverLxRaw);
    shearCoeffs = getTable315Coeffs('four_edges_discontinuous', lyOverLxRaw);

    Msx = momentCoeffs.bsx * n * Math.pow(lx, 2);
    Msy = momentCoeffs.bsy * n * Math.pow(lx, 2);
  } else {
    // Two-Way Restrained (BS 8110 Table 3.14 & 3.15)
    Msx = momentCoeffs.bsx * n * Math.pow(lx, 2);
    Mhx = momentCoeffs.bhx * n * Math.pow(lx, 2);
    Msy = momentCoeffs.bsy * n * Math.pow(lx, 2);
    Mhy = momentCoeffs.bhy * n * Math.pow(lx, 2);
  }

  const M_max = Math.max(Msx, Mhx, Msy, Mhy);

  // -------------------------------------------------------------
  // STEP 2: FLEXURE & AUTOMATIC SPACING SOLVER
  // -------------------------------------------------------------
  const flexureShortMidspan = solveFlexureAutoSpacing(
    Msx, b, d_short, h, fcu, fy, Number(barDiaShort) || 12
  );

  const flexureShortSupport = solveFlexureAutoSpacing(
    Mhx, b, d_short, h, fcu, fy, Number(barDiaSupport) || 12
  );

  const flexureLongMidspan = solveFlexureAutoSpacing(
    Msy, b, d_long, h, fcu, fy, Number(barDiaLong) || 10
  );

  const flexureLongSupport = solveFlexureAutoSpacing(
    Mhy, b, d_long, h, fcu, fy, Number(barDiaSupport) || 12
  );

  const flexurePass = flexureShortMidspan.pass && flexureShortSupport.pass && flexureLongMidspan.pass && flexureLongSupport.pass;

  // -------------------------------------------------------------
  // STEP 3: SHEAR CHECK
  // -------------------------------------------------------------
  const Vx = (shearCoeffs.bvx || 0.5) * n * lx;
  const Vy = (shearCoeffs.bvy || 0.33) * n * lx;
  const V_max = Math.max(Vx, Vy);

  const v = (V_max * 1e3) / (b * d_short);
  const v_max = Math.min(0.8 * Math.sqrt(fcu), 5.0);

  const rebarRatioRaw = (100 * flexureShortMidspan.As_prov) / (b * d_short);
  const rebarRatioBounded = Math.min(3.0, Math.max(0.15, rebarRatioRaw));
  const depthFactor = Math.max(1.0, Math.pow(400 / d_short, 0.25));
  const fcuFactor = Math.pow(Math.min(40, fcu) / 25, 1 / 3);

  const vc = (0.79 / 1.25) * Math.pow(rebarRatioBounded, 1 / 3) * depthFactor * fcuFactor;
  const shearPass = v <= vc && v <= v_max;

  // -------------------------------------------------------------
  // STEP 4: DEFLECTION CHECK
  // -------------------------------------------------------------
  let basicSpanToDepth = 20;
  if (slabType === 'cantilever') basicSpanToDepth = 7;
  else if (slabType === 'two_way_restrained' || slabType === 'continuous') basicSpanToDepth = 26;
  else basicSpanToDepth = 20;

  const fs = (2 / 3) * fy * (flexureShortMidspan.As_governing_req / flexureShortMidspan.As_prov);
  const M_bd2 = (Msx * 1e6) / (b * Math.pow(d_short, 2));

  const F1_raw = 0.55 + (477 - fs) / (120 * (0.9 + M_bd2));
  const F1 = Math.min(2.0, Math.max(0.55, F1_raw));
  const F2 = 1.0;

  const allowableSpanToDepth = basicSpanToDepth * F1 * F2;
  const actualSpanToDepth = (lx * 1000) / d_short;
  const deflectionPass = actualSpanToDepth <= allowableSpanToDepth;

  const overallPass = flexurePass && shearPass && deflectionPass;

  return {
    isBlank: false,
    inputs: { ...inputs, b, lx, ly, lyOverLxRaw, h, cover, d_short, d_long, fcu, fy, n, Gk, Qk, effectiveRatio: momentCoeffs.effectiveRatio },
    n,
    V_max,
    Vx,
    Vy,
    M_max,
    moments: { Msx, Mhx, Msy, Mhy, momentCoeffs, shearCoeffs },
    flexureParts: {
      shortMidspan: flexureShortMidspan,
      shortSupport: flexureShortSupport,
      longMidspan: flexureLongMidspan,
      longSupport: flexureLongSupport
    },
    shearCheck: { v, vc, v_max, pass: shearPass },
    deflection: { basicSpanToDepth, fs, M_bd2, F1, F2, allowableSpanToDepth, actualSpanToDepth, pass: deflectionPass },
    overallPass,
    timestamp: new Date().toISOString()
  };
}

export const SLAB_PRESETS = {
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
    barDiaShort: 12,
    barDiaLong: 10,
    barDiaSupport: 12
  },
  two_way_restrained_interior: {
    name: 'Two-Way Restrained Slab (Interior Panel)',
    slabType: 'two_way_restrained',
    panelCondition: 'interior',
    lxInput: 4.2,
    lyInput: 5.1,
    hInput: 160,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 13.5,
    fcuInput: 30,
    fyInput: 460,
    barDiaShort: 12,
    barDiaLong: 10,
    barDiaSupport: 12
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
    barDiaShort: 12,
    barDiaLong: 10,
    barDiaSupport: 12
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
    barDiaShort: 12,
    barDiaLong: 10,
    barDiaSupport: 12
  }
};
