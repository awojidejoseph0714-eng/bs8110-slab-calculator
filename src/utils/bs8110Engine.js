/**
 * CrossCheck / SlabCheck — BS 8110 Slab Calculation Engine & Constants
 * Hand-Calculation Parity Cross-Checker for Structural Engineers
 */

export const AppCalculationConstants = {
  standardSpacings_mm: [300, 250, 200, 175, 150, 125, 100, 75, 50],
  overReinforcedThresholdK: 0.156,
  leverArmCap: 0.95,
  minSteelFactorFy460: 0.0013, // 0.13% bd (using effective depth d)
  minSteelFactorFy250: 0.0024, // 0.24% bd (using effective depth d)
  assumedServiceLoadFactor: 1.5,
  bufferMargin_mm2: 100,
  validationBounds: {
    span_mm: { min: 500, max: 50000 },
    depthH_mm: { min: 50, max: 1000 },
    coverC_mm: { min: 10, max: 100 },
    barDiameter_mm: { min: 6, max: 40 },
    fcu_Nmm2: { min: 15, max: 80 },
    fy_Nmm2: { min: 250, max: 500 },
    loadN_kNm2: { min: 0.1, max: 100.0 }
  },
  defaultValues: {
    TwoWayRestrained: { lx: 4.0, ly: 5.0, h: 160, c: 25, barX: 12, barY: 10, fcu: 30, fy: 460, n: 12.0, caseNumber: 3 },
    TwoWaySimplySupported: { lx: 4.0, ly: 5.0, h: 160, c: 25, barX: 12, barY: 10, fcu: 30, fy: 460, n: 12.0 },
    OneWaySolid: { lx: 4.0, ly: 5.0, h: 160, c: 25, barX: 12, barY: 10, fcu: 30, fy: 460, n: 12.0 },
    Cantilever: { lx: 2.0, ly: 2.0, h: 160, c: 25, barX: 12, barY: 10, fcu: 30, fy: 460, n: 10.0 }
  }
};

// Sectional Areas per Metre Width for Various Bar Spacings (mm²/m) - Exact Table Transcribed
export const REBAR_AREA_TABLE = {
  6:  { 50: 566,  75: 377,  100: 283,  125: 226,  150: 189,  175: 162,  200: 142,  250: 113,  300: 94.3 },
  8:  { 50: 1010, 75: 671,  100: 503,  125: 402,  150: 335,  175: 287,  200: 252,  250: 201,  300: 168 },
  10: { 50: 1570, 75: 1050, 100: 785,  125: 628,  150: 523,  175: 449,  200: 393,  250: 314,  300: 262 },
  12: { 50: 2260, 75: 1510, 100: 1130, 125: 905,  150: 754,  175: 646,  200: 566,  250: 452,  300: 377 },
  16: { 50: 4020, 75: 2680, 100: 2010, 125: 1610, 150: 1340, 175: 1150, 200: 1010, 250: 804,  300: 670 },
  20: { 50: 6280, 75: 4190, 100: 3140, 125: 2510, 150: 2090, 175: 1800, 200: 1570, 250: 1260, 300: 1050 },
  25: { 50: 9820, 75: 6550, 100: 4910, 125: 3930, 150: 3270, 175: 2810, 200: 2450, 250: 1960, 300: 1640 },
  32: { 50: 16100, 75: 10700, 100: 8040, 125: 6430, 150: 5360, 175: 4600, 200: 4020, 250: 3220, 300: 2680 },
  40: { 50: 25100, 75: 16800, 100: 12600, 125: 10100, 150: 8380, 175: 7180, 200: 6280, 250: 5030, 300: 4190 }
};

// BS 8110 Table 3.14 Edge Condition Reference (Cases 1 - 9)
export const EDGE_CONDITION_CASES = [
  { caseNumber: 1, id: 'interior', name: 'Case 1: Interior Panel', description: 'Continuous over four edges' },
  { caseNumber: 2, id: 'one_short_discontinuous', name: 'Case 2: One Short Edge Discontinuous', description: 'One short edge discontinuous' },
  { caseNumber: 3, id: 'one_long_discontinuous', name: 'Case 3: One Long Edge Discontinuous', description: 'One long edge discontinuous' },
  { caseNumber: 4, id: 'two_adjacent_discontinuous', name: 'Case 4: Two Adjacent Edges Discontinuous', description: 'Corner panel (two adjacent edges discontinuous)' },
  { caseNumber: 5, id: 'two_short_discontinuous', name: 'Case 5: Two Short Edges Discontinuous', description: 'Two short edges discontinuous' },
  { caseNumber: 6, id: 'two_long_discontinuous', name: 'Case 6: Two Long Edges Discontinuous', description: 'Two long edges discontinuous' },
  { caseNumber: 7, id: 'three_edges_discontinuous_long_cont', name: 'Case 7: Three Edges Discontinuous (Long Cont.)', description: 'Three edges discontinuous, one long edge continuous' },
  { caseNumber: 8, id: 'three_edges_discontinuous_short_cont', name: 'Case 8: Three Edges Discontinuous (Short Cont.)', description: 'Three edges discontinuous, one short edge continuous' },
  { caseNumber: 9, id: 'four_edges_discontinuous', name: 'Case 9: Four Edges Discontinuous', description: 'Discontinuous over four edges' }
];

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
 * AUTOMATIC SPACING SOLVER FROM REBAR AREA TABLE
 * Selects area provided directly from the REBAR_AREA_TABLE column for desired bar diameter.
 * Finds closest area value to As_req that is MORE than As_req + 100 mm²/m (As_prov >= As_req + 100)
 * and satisfies maximum spacing limit s <= min(3h, 400mm).
 */
function solveOptimalSpacing(As_req, b, d, h, barDia) {
  const standardSpacings = AppCalculationConstants.standardSpacings_mm;
  const maxSpacingLimit = Math.min(400, Math.floor(3 * h));
  const validSpacings = standardSpacings.filter((s) => s <= maxSpacingLimit);

  const targetAsProvMin = As_req + AppCalculationConstants.bufferMargin_mm2;
  let chosenBarDia = barDia;
  let chosenSpacing = 150;
  let As_prov = 0;

  let tableForBar = REBAR_AREA_TABLE[chosenBarDia] || REBAR_AREA_TABLE[12];
  const candidateSpacings = [...validSpacings].sort((a, b) => b - a);

  for (let s of candidateSpacings) {
    const area = tableForBar[s];
    if (area && area >= targetAsProvMin) {
      chosenSpacing = s;
      As_prov = area;
      break;
    }
  }

  if (As_prov < targetAsProvMin) {
    const availableBars = [6, 8, 10, 12, 16, 20, 25, 32, 40];
    const currentIndex = availableBars.indexOf(barDia);

    for (let i = currentIndex + 1; i < availableBars.length; i++) {
      const nextBarDia = availableBars[i];
      const nextTable = REBAR_AREA_TABLE[nextBarDia];
      if (!nextTable) continue;

      for (let s of candidateSpacings) {
        const area = nextTable[s];
        if (area && area >= targetAsProvMin) {
          chosenBarDia = nextBarDia;
          chosenSpacing = s;
          As_prov = area;
          break;
        }
      }
      if (As_prov >= targetAsProvMin) break;
    }

    if (As_prov < targetAsProvMin) {
      chosenSpacing = 50;
      As_prov = (REBAR_AREA_TABLE[chosenBarDia] || {})[50] || 2260;
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
 * Solve Single Section Flexure with Separate As,calc & As,min (Using Effective Depth d for As,min = 0.13%bd or 0.24%bd)
 */
function solveFlexureSection({ locationName, directionName, M, b, d, h, fcu, fy, initialBarDia }) {
  // As,min factor: 0.24% bd for fy=250, 0.13% bd for fy=460 (d = effective depth for that section)
  const minPercentage = fy <= 250 ? AppCalculationConstants.minSteelFactorFy250 : AppCalculationConstants.minSteelFactorFy460;
  const minPercentText = fy <= 250 ? '0.24%' : '0.13%';
  const As_min = minPercentage * b * d; // Calculated using EFFECTIVE DEPTH d

  if (M <= 0) {
    const autoSteel = solveOptimalSpacing(As_min, b, d, h, initialBarDia);
    const workingLines = [
      `M = 0.00 kNm/m`,
      `As,calc = 0 mm²/m`,
      `As,min (${minPercentText} bd) = ${minPercentage} × 1000 × ${d.toFixed(0)} = ${Math.round(As_min)} mm²/m`,
      `Notice: Calculated As,req (0 mm²/m) is less than As,min (${Math.round(As_min)} mm²/m). Minimum code steel As,min will be used as As,req.`,
      `As,req = ${Math.round(As_min)} mm²/m (governed by As,min)`,
      `Area Provided (Table): ${autoSteel.barDetail} → As,prov = ${Math.round(autoSteel.As_prov)} mm²/m (closest area ≥ ${Math.round(As_min + 100)} mm²/m, s ≤ ${autoSteel.maxSpacingLimit}mm)`
    ];

    return {
      locationName,
      directionName,
      M: 0,
      d,
      K: 0,
      overReinforced: false,
      z: 0.95 * d,
      As_calc: 0,
      As_min,
      As_req: As_min,
      governingSource: 'Minimum',
      isAsCalcInsufficient: true,
      insufficientMessage: `Calculated As,calc (0 mm²/m) is insufficient (< As,min ${Math.round(As_min)} mm²/m). As,min = ${Math.round(As_min)} mm²/m will be used as As,req.`,
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
  if (K > AppCalculationConstants.overReinforcedThresholdK) {
    const workingLines = [
      K_working,
      `⚠️ OVER-REINFORCED SECTION: K (${K.toFixed(3)}) > 0.156 threshold per BS 8110 Cl 3.4.4.4.`,
      `Section requires compression reinforcement or depth (h) redesign. z, As and spacing calculations halted.`
    ];

    return {
      locationName,
      directionName,
      M,
      d,
      K,
      overReinforced: true,
      overReinforcedMessage: `K = ${K.toFixed(3)} > 0.156 (Compression steel or depth redesign required)`,
      z: null,
      As_calc: null,
      As_min,
      As_req: null,
      governingSource: null,
      isAsCalcInsufficient: false,
      insufficientMessage: null,
      As_prov: 0,
      margin: 0,
      barDia: initialBarDia,
      spacing: null,
      barDetail: `Over-reinforced (K > 0.156)`,
      workingLines,
      pass: false
    };
  }

  // z calculation capped at 0.95d
  const z_factor = 0.5 + Math.sqrt(Math.max(0, 0.25 - K / 0.9));
  const z = Math.min(AppCalculationConstants.leverArmCap * d, d * z_factor);
  const z_working = `z = d[0.5 + √(0.25 − ${K.toFixed(3)}/0.9)] = ${z.toFixed(1)}mm (capped at 0.95d = ${(0.95 * d).toFixed(1)}mm)`;

  // As,calc calculation separately
  const As_calc = (M * 1e6) / (0.95 * fy * z);
  const As_calc_working = `As,calc = (${M.toFixed(2)}×10⁶) / (0.95×${fy}×${z.toFixed(1)}) = ${Math.round(As_calc)} mm²/m`;

  // As,min calculation using EFFECTIVE DEPTH d
  const As_min_working = `As,min (${minPercentText} bd) = ${minPercentage} × 1000 × ${d.toFixed(0)} = ${Math.round(As_min)} mm²/m`;

  // Check if As,calc is insufficient
  const isAsCalcInsufficient = As_calc < As_min;
  const As_req = Math.max(As_calc, As_min);
  const governingSource = isAsCalcInsufficient ? 'Minimum (As,min)' : 'Calculated (As,calc)';

  let comparisonWorking = '';
  let insufficientMessage = '';

  if (isAsCalcInsufficient) {
    insufficientMessage = `Calculated As,calc (${Math.round(As_calc)} mm²/m) is insufficient (< As,min ${Math.round(As_min)} mm²/m). Minimum code steel As,min = ${Math.round(As_min)} mm²/m will be used as As,req.`;
    comparisonWorking = `Notice: Calculated As,calc (${Math.round(As_calc)} mm²/m) is insufficient because it is less than As,min (${Math.round(As_min)} mm²/m). Minimum steel As,min will be used as As,req.`;
  } else {
    insufficientMessage = `Calculated As,calc (${Math.round(As_calc)} mm²/m) is sufficient (≥ As,min ${Math.round(As_min)} mm²/m). As,req = ${Math.round(As_calc)} mm²/m.`;
    comparisonWorking = `As,calc (${Math.round(As_calc)} mm²/m) ≥ As,min (${Math.round(As_min)} mm²/m) → As,calc governs as As,req.`;
  }

  const As_req_working = `As,req = ${Math.round(As_req)} mm²/m   (governed by ${governingSource})`;

  // Spacing & As,prov directly from BS 8110 Rebar Area Table
  const autoSteel = solveOptimalSpacing(As_req, b, d, h, initialBarDia);
  const spacing_working = `Area Provided (BS 8110 Table): ${autoSteel.barDetail} → As,prov = ${Math.round(autoSteel.As_prov)} mm²/m (closest table value ≥ ${Math.round(As_req + 100)} mm²/m, s ≤ ${autoSteel.maxSpacingLimit}mm)`;

  const workingLines = [
    K_working,
    z_working,
    As_calc_working,
    As_min_working,
    comparisonWorking,
    As_req_working,
    spacing_working
  ];

  return {
    locationName,
    directionName,
    M,
    d,
    K,
    overReinforced: false,
    z,
    As_calc,
    As_min,
    As_req,
    governingSource,
    isAsCalcInsufficient,
    insufficientMessage,
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
 * Dedicated CrossCheck BS 8110 Slab Engine
 */
export function calculateBS8110Slab(inputs) {
  if (!inputs) return null;

  const {
    slabType = 'TwoWayRestrained',
    caseNumber = 3,
    panelCondition = 'one_long_discontinuous',
    
    lxInput = 4.0,
    lyInput = 5.0,
    lyOverLxInput = '',
    
    loadMode = 'direct_n',
    designLoadNInput = 12.0,
    gkInput = 6.1,
    qkInput = 1.5,
    
    bInput = 1000,
    hInput = 160,
    coverInput = 25,
    
    fcuInput = 30,
    fyInput = 460,
    
    targetPhiX = 12,
    targetPhiY = 10,
    enableShearCheck = false
  } = inputs;

  const isLxEmpty = lxInput === '';
  const isHEmpty = hInput === '';
  const isLoadEmpty = loadMode === 'direct_n' ? designLoadNInput === '' : (gkInput === '' || qkInput === '');

  if (isLxEmpty || isHEmpty || isLoadEmpty) {
    return {
      isBlank: true,
      message: 'Please enter short span (lx), depth (h), and design load (n) to compute.'
    };
  }

  const b = 1000;
  const lx = Math.max(0.5, Number(lxInput) || 4.0);
  
  let ly = lx;
  if (slabType === 'OneWaySolid' || slabType === 'Cantilever' || slabType === 'one_way' || slabType === 'cantilever') {
    ly = lx;
  } else if (lyInput !== '' && !isNaN(Number(lyInput))) {
    ly = Math.max(lx, Number(lyInput));
  } else if (lyOverLxInput !== '' && !isNaN(Number(lyOverLxInput))) {
    ly = lx * Math.max(1.0, Number(lyOverLxInput));
  } else {
    ly = lx * 1.25;
  }
  
  const lyOverLxRaw = ly / lx;
  const h = Math.max(50, Number(hInput) || 160);
  const cover = Math.max(10, Number(coverInput) || 25);
  
  const fcu = Math.min(80, Math.max(15, Number(fcuInput) || 30));
  const fy = Math.min(500, Math.max(250, Number(fyInput) || 460));

  const phiX = Number(targetPhiX) || 12;
  const phiY = Number(targetPhiY) || 10;

  // DIRECTIONAL DEPTH TRACKING: dx vs dy
  const dx = h - cover - phiX / 2;
  const dy = dx - phiX;

  let n = 0;
  if (loadMode === 'gk_qk') {
    const Gk = Number(gkInput) || 0;
    const Qk = Number(qkInput) || 0;
    n = 1.4 * Gk + 1.6 * Qk;
  } else {
    n = Math.max(0.1, Number(designLoadNInput) || 12.0);
  }

  // Map caseNumber to panelCondition
  let resolvedCondition = panelCondition;
  if (caseNumber && EDGE_CONDITION_CASES[caseNumber - 1]) {
    resolvedCondition = EDGE_CONDITION_CASES[caseNumber - 1].id;
  }

  // -------------------------------------------------------------
  // STEP 1: BENDING MOMENTS
  // -------------------------------------------------------------
  let Msx = 0;
  let Mhx = 0;
  let Msy = 0;
  let Mhy = 0;

  let momentCoeffs = { bhx: 0, bsx: 0, bhy: 0, bsy: 0, effectiveRatio: 1.0 };
  let shearCoeffs = { bvx: 0, bvy: 0, effectiveRatio: 1.0 };

  const isOneWay = slabType === 'OneWaySolid' || slabType === 'one_way';
  const isCantilever = slabType === 'Cantilever' || slabType === 'cantilever';
  const isTwoWaySS = slabType === 'TwoWaySimplySupported' || slabType === 'two_way_ss';
  const isTwoWayRestrained = slabType === 'TwoWayRestrained' || slabType === 'two_way_restrained';

  if (isOneWay) {
    momentCoeffs.bsx = 0.125;
    Msx = 0.125 * n * Math.pow(lx, 2);
  } else if (isCantilever) {
    momentCoeffs.bhx = 0.500;
    Mhx = 0.500 * n * Math.pow(lx, 2);
  } else if (isTwoWaySS) {
    momentCoeffs = getTable314Coeffs('four_edges_discontinuous', lyOverLxRaw);
    shearCoeffs = getTable315Coeffs('four_edges_discontinuous', lyOverLxRaw);
    Msx = momentCoeffs.bsx * n * Math.pow(lx, 2);
    Msy = momentCoeffs.bsy * n * Math.pow(lx, 2);
  } else {
    // Two-Way Restrained (BS 8110 Table 3.14)
    momentCoeffs = getTable314Coeffs(resolvedCondition, lyOverLxRaw);
    shearCoeffs = getTable315Coeffs(resolvedCondition, lyOverLxRaw);
    Msx = momentCoeffs.bsx * n * Math.pow(lx, 2);
    Mhx = momentCoeffs.bhx * n * Math.pow(lx, 2);
    Msy = momentCoeffs.bsy * n * Math.pow(lx, 2);
    Mhy = momentCoeffs.bhy * n * Math.pow(lx, 2);
  }

  const M_max = Math.max(Msx, Mhx, Msy, Mhy);

  // -------------------------------------------------------------
  // STEP 2: FLEXURE DESIGN PER DIRECTION (dx vs dy)
  // -------------------------------------------------------------
  const flexureShortMidspan = solveFlexureSection({
    locationName: 'Short Span Midspan (+ve Msx)',
    directionName: 'ShortSpan',
    M: Msx, b, d: dx, h, fcu, fy, initialBarDia: phiX
  });

  const flexureShortSupport = solveFlexureSection({
    locationName: 'Short Span Support (-ve Mhx)',
    directionName: 'ShortSpan',
    M: Mhx, b, d: dx, h, fcu, fy, initialBarDia: phiX
  });

  const flexureLongMidspan = solveFlexureSection({
    locationName: 'Long Span Midspan (+ve Msy)',
    directionName: 'LongSpan',
    M: Msy, b, d: dy, h, fcu, fy, initialBarDia: phiY
  });

  const flexureLongSupport = solveFlexureSection({
    locationName: 'Long Span Support (-ve Mhy)',
    directionName: 'LongSpan',
    M: Mhy, b, d: dy, h, fcu, fy, initialBarDia: phiY
  });

  const flexurePass = flexureShortMidspan.pass && flexureShortSupport.pass && flexureLongMidspan.pass && flexureLongSupport.pass;
  const hasOverReinforced = flexureShortMidspan.overReinforced || flexureShortSupport.overReinforced || flexureLongMidspan.overReinforced || flexureLongSupport.overReinforced;

  // -------------------------------------------------------------
  // STEP 3: OPTIONAL SHEAR CHECK (OFF BY DEFAULT)
  // -------------------------------------------------------------
  let shearCheck = null;
  if (enableShearCheck && (isTwoWayRestrained || isTwoWaySS)) {
    const Vx = (shearCoeffs.bvx || 0.5) * n * lx;
    const Vy = (shearCoeffs.bvy || 0.33) * n * lx;
    const V_max = Math.max(Vx, Vy);

    const v = (V_max * 1e3) / (b * dx);
    const v_max_cap = Math.min(0.8 * Math.sqrt(fcu), 5.0);

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
        `Vx = βvx × n × lx = ${Vx.toFixed(2)} kN/m, Vy = βvy × n × lx = ${Vy.toFixed(2)} kN/m → Design Shear V = ${V_max.toFixed(2)} kN/m`,
        `Applied shear stress v = (${V_max.toFixed(2)}×10³) / (1000×${dx.toFixed(0)}) = ${v.toFixed(3)} N/mm²`,
        `Design concrete shear capacity vc = ${vc.toFixed(3)} N/mm² (limit cap min(0.8√fcu, 5.0) = ${v_max_cap.toFixed(2)} N/mm²)`,
        `Shear Check: v (${v.toFixed(3)}) ≤ vc (${vc_capped.toFixed(3)}) → ${shearPass ? 'PASS (No shear links required)' : 'FAIL'}`
      ]
    };
  }

  // -------------------------------------------------------------
  // STEP 4: SERVICEABILITY DEFLECTION CHECK
  // -------------------------------------------------------------
  let basicSpanToDepth = 26;
  if (isTwoWaySS || isOneWay) {
    basicSpanToDepth = 20;
  } else if (isCantilever) {
    basicSpanToDepth = 7;
  }

  const ns = n / AppCalculationConstants.assumedServiceLoadFactor;
  const Msx_service = (momentCoeffs.bsx || 0.125) * ns * Math.pow(lx, 2);

  const fs = (2 / 3) * fy * (flexureShortMidspan.As_req / flexureShortMidspan.As_prov);
  const M_bd2_service = (Msx_service * 1e6) / (b * Math.pow(dx, 2));

  const F1_raw = 0.55 + (477 - fs) / (120 * (0.9 + M_bd2_service));
  const F1 = Math.min(2.0, Math.max(0.55, F1_raw));
  const F2 = 1.0;

  const allowableSpanToDepth = basicSpanToDepth * F1 * F2;
  const actualSpanToDepth = (lx * 1000) / dx;
  const deflectionPass = actualSpanToDepth <= allowableSpanToDepth;

  const deflection = {
    basicSpanToDepth,
    ns,
    Msx_service,
    fs,
    M_bd2_service,
    F1,
    F2,
    allowableSpanToDepth,
    actualSpanToDepth,
    pass: deflectionPass,
    workingLines: [
      `Base span/d ratio = ${basicSpanToDepth} (${isTwoWayRestrained ? 'Two-Way Restrained' : isTwoWaySS ? 'Two-Way Simply Supported' : isOneWay ? 'One-Way Solid' : 'Cantilever'})`,
      `Assumed Service Load ns = n / 1.5 = ${n.toFixed(2)} / 1.5 = ${ns.toFixed(2)} kN/m²`,
      `Service Moment Msx,service = βsx × ns × lx² = ${Msx_service.toFixed(2)} kNm/m`,
      `Service Tension Stress fs = (2/3) × ${fy} × (${Math.round(flexureShortMidspan.As_req)} / ${Math.round(flexureShortMidspan.As_prov)}) = ${fs.toFixed(1)} N/mm²`,
      `M_service / (b.d²) = (${Msx_service.toFixed(2)}×10⁶) / (1000×${dx.toFixed(0)}²) = ${M_bd2_service.toFixed(3)} N/mm²`,
      `Modification Factor F1 = 0.55 + (477 - ${fs.toFixed(1)}) / [120 × (0.9 + ${M_bd2_service.toFixed(3)})] = ${F1_raw.toFixed(2)} (capped max 2.0 → ${F1.toFixed(2)})`,
      `Allowable span/d = ${basicSpanToDepth} × ${F1.toFixed(2)} = ${allowableSpanToDepth.toFixed(2)}`,
      `Actual span/d = (${lx}×1000) / ${dx.toFixed(0)} = ${actualSpanToDepth.toFixed(2)}`,
      `Deflection Check: Actual (${actualSpanToDepth.toFixed(1)}) ≤ Allowable (${allowableSpanToDepth.toFixed(1)}) → ${deflectionPass ? 'PASS (Deflection Adequate)' : 'FAIL'}`
    ]
  };

  const overallPass = flexurePass && !hasOverReinforced && (shearCheck ? shearCheck.pass : true) && deflectionPass;

  return {
    isBlank: false,
    inputs: { ...inputs, b, lx, ly, lyOverLxRaw, h, cover, dx, dy, fcu, fy, n, targetPhiX: phiX, targetPhiY: phiY, effectiveRatio: momentCoeffs.effectiveRatio, caseNumber: caseNumber || 3 },
    n,
    ns,
    M_max,
    hasOverReinforced,
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
  TwoWayRestrained: {
    name: 'Two-Way Restrained Slab (Case 3)',
    slabType: 'TwoWayRestrained',
    caseNumber: 3,
    panelCondition: 'one_long_discontinuous',
    lxInput: 4.0,
    lyInput: 5.0,
    hInput: 160,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 12.0,
    fcuInput: 30,
    fyInput: 460,
    targetPhiX: 12,
    targetPhiY: 10
  },
  TwoWaySimplySupported: {
    name: 'Two-Way Simply Supported Slab',
    slabType: 'TwoWaySimplySupported',
    caseNumber: 9,
    panelCondition: 'four_edges_discontinuous',
    lxInput: 4.0,
    lyInput: 5.0,
    hInput: 160,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 12.0,
    fcuInput: 30,
    fyInput: 460,
    targetPhiX: 12,
    targetPhiY: 10
  },
  OneWaySolid: {
    name: 'One-Way Solid Floor Slab',
    slabType: 'OneWaySolid',
    lxInput: 4.0,
    lyInput: 5.0,
    hInput: 160,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 12.0,
    fcuInput: 30,
    fyInput: 460,
    targetPhiX: 12,
    targetPhiY: 10
  },
  Cantilever: {
    name: 'Cantilever Balcony Slab',
    slabType: 'Cantilever',
    lxInput: 2.0,
    lyInput: 2.0,
    hInput: 160,
    coverInput: 25,
    loadMode: 'direct_n',
    designLoadNInput: 10.0,
    fcuInput: 30,
    fyInput: 460,
    targetPhiX: 12,
    targetPhiY: 10
  }
};
