import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function WorkingsAccordion({ result }) {
  const [openSections, setOpenSections] = useState({
    moments: true,
    flexure: true,
    shear: true,
    deflection: true
  });

  if (!result || result.isBlank) return null;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const { inputs, moments, flexureParts, shearCheck, deflection } = result;

  return (
    <div className="framer-card">
      <div className="card-title-row">
        <h2 className="card-heading">
          <BookOpen size={18} />
          <span>Step-by-Step BS 8110 Slab Workings</span>
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          BS 8110-1:1997 Report
        </span>
      </div>

      <div className="accordion-wrapper">
        {/* STEP 1: UPWARD RATIO LOOKUP & MOMENTS */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection('moments')}
          >
            <div className="accordion-title-left">
              <span className="step-number-badge">1</span>
              <div>
                <span>Upward Ratio Lookup & BS 8110 Bending Moments</span>
                <span className="clause-badge">Table 3.14</span>
              </div>
            </div>
            {openSections.moments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSections.moments && (
            <div className="accordion-content">
              <div className="math-step-block">
                <div className="math-step-title">1.1 Aspect Ratio & Upward Table Lookup Rule</div>
                <div className="math-formula">
                  Actual ratio ly/lx = {inputs.ly.toFixed(2)} / {inputs.lx} = {inputs.lyOverLxRaw.toFixed(3)}
                  <br />
                  Upward Lookup Rule: Rounded UPWARD to nearest standard table ratio ={' '}
                  <strong>{inputs.upwardRatio}</strong>
                </div>
                <div className="math-explanation">
                  No interpolation applied per design rules. BS 8110 Table 3.14 coefficients evaluated at ratio ={' '}
                  <strong>{inputs.upwardRatio}</strong>.
                </div>
              </div>

              <div className="math-step-block">
                <div className="math-step-title">1.2 Calculated Moments for Short & Long Spans</div>
                <div className="math-formula">
                  Short Span Midspan (+ve Msx): βsx = {moments.momentCoeffs.bsx.toFixed(3)} → Msx = βsx × n × lx² ={' '}
                  <strong>{moments.Msx.toFixed(2)} kNm/m</strong>
                </div>
                {moments.Mhx > 0 && (
                  <div className="math-formula">
                    Short Span Support (-ve Mhx): βhx = {moments.momentCoeffs.bhx.toFixed(3)} → Mhx = βhx × n × lx² ={' '}
                    <strong>{moments.Mhx.toFixed(2)} kNm/m</strong>
                  </div>
                )}
                {moments.Msy > 0 && (
                  <div className="math-formula">
                    Long Span Midspan (+ve Msy): βsy = {moments.momentCoeffs.bsy.toFixed(3)} → Msy = βsy × n × lx² ={' '}
                    <strong>{moments.Msy.toFixed(2)} kNm/m</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: FLEXURE & AUTOMATIC SPACING SOLVER */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection('flexure')}
          >
            <div className="accordion-title-left">
              <span className="step-number-badge">2</span>
              <div>
                <span>Flexure Design & Automatic Steel Spacing Solver</span>
                <span className="clause-badge">Cl 3.4.4.4</span>
              </div>
            </div>
            {openSections.flexure ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSections.flexure && (
            <div className="accordion-content">
              {/* Short Span Midspan */}
              <div className="math-step-block">
                <div className="math-step-title">2.1 Short Span Midspan (+ve Msx = {moments.Msx.toFixed(2)} kNm/m)</div>
                <div className="math-formula">
                  K = Msx / (b × d² × fcu) = ({moments.Msx.toFixed(2)} × 10⁶) / (1000 × {inputs.d_short}² × {inputs.fcu}) ={' '}
                  <strong>{flexureParts.shortMidspan.K.toFixed(4)}</strong> (≤ 0.156)
                </div>
                <div className="math-formula">
                  As,req = Msx / (0.95 × fy × z) ={' '}
                  <strong>{Math.round(flexureParts.shortMidspan.As_req)} mm²/m</strong> (Min As = {Math.round(flexureParts.shortMidspan.As_min)} mm²/m)
                </div>
                <div className="math-explanation">
                  Automatic Spacing Solver Result:{' '}
                  <strong>{flexureParts.shortMidspan.barDetail}</strong> (As,prov ={' '}
                  <strong>{Math.round(flexureParts.shortMidspan.As_prov)} mm²/m</strong> ≥ As,req) →{' '}
                  <strong>{flexureParts.shortMidspan.pass ? 'PASS' : 'FAIL'}</strong>
                </div>
              </div>

              {/* Long Span Midspan */}
              {moments.Msy > 0 && (
                <div className="math-step-block">
                  <div className="math-step-title">2.2 Long Span Midspan (+ve Msy = {moments.Msy.toFixed(2)} kNm/m)</div>
                  <div className="math-formula">
                    As,req = Msy / (0.95 × fy × z) ={' '}
                    <strong>{Math.round(flexureParts.longMidspan.As_req)} mm²/m</strong>
                  </div>
                  <div className="math-explanation">
                    Automatic Spacing Solver Result:{' '}
                    <strong>{flexureParts.longMidspan.barDetail}</strong> (As,prov ={' '}
                    <strong>{Math.round(flexureParts.longMidspan.As_prov)} mm²/m</strong>) →{' '}
                    <strong>{flexureParts.longMidspan.pass ? 'PASS' : 'FAIL'}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 3: SHEAR WORKINGS WITH TABLE 3.15 */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection('shear')}
          >
            <div className="accordion-title-left">
              <span className="step-number-badge">3</span>
              <div>
                <span>Slab Shear Check (BS 8110 Table 3.15)</span>
                <span className="clause-badge">Table 3.15 / Cl 3.5.5</span>
              </div>
            </div>
            {openSections.shear ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSections.shear && (
            <div className="accordion-content">
              <div className="math-step-block">
                <div className="math-step-title">3.1 Shear Force Coefficients & Shear Stress (v)</div>
                <div className="math-formula">
                  Table 3.15 Shear Coeffs (Upward ratio {inputs.upwardRatio}): βvx = {moments.shearCoeffs.bvx.toFixed(2)}, βvy = {moments.shearCoeffs.bvy.toFixed(2)}
                  <br />
                  Vx = βvx × n × lx = {result.Vx.toFixed(2)} kN/m, Vy = βvy × n × lx = {result.Vy.toFixed(2)} kN/m → Max Shear V ={' '}
                  <strong>{result.V_max.toFixed(2)} kN/m</strong>
                </div>
                <div className="math-formula">
                  Design Shear Stress v = (V × 10³) / (b × d) = ({result.V_max.toFixed(2)} × 10³) / (1000 × {inputs.d_short}) ={' '}
                  <strong>{shearCheck.v.toFixed(3)} N/mm²</strong>
                </div>
                <div className="math-formula">
                  Concrete Capacity vc = (0.79 / 1.25) × (100As/bd)^(1/3) × (400/d)^(1/4) × (fcu/25)^(1/3) ={' '}
                  <strong>{shearCheck.vc.toFixed(3)} N/mm²</strong>
                </div>
                <div className="math-explanation">
                  v ({shearCheck.v.toFixed(3)}) ≤ vc ({shearCheck.vc.toFixed(3)}) →{' '}
                  <strong>{shearCheck.pass ? 'PASS (No shear links required)' : 'FAIL'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 4: DEFLECTION WORKINGS */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection('deflection')}
          >
            <div className="accordion-title-left">
              <span className="step-number-badge">4</span>
              <div>
                <span>Span/d Deflection Control</span>
                <span className="clause-badge">Cl 3.4.6.5</span>
              </div>
            </div>
            {openSections.deflection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSections.deflection && (
            <div className="accordion-content">
              <div className="math-step-block">
                <div className="math-step-title">4.1 Span/d Comparison</div>
                <div className="math-formula">
                  Allowable Span/d = Basic ({deflection.basicSpanToDepth}) × F1 ({deflection.F1.toFixed(2)}) ={' '}
                  <strong>{deflection.allowableSpanToDepth.toFixed(2)}</strong>
                </div>
                <div className="math-formula">
                  Actual Span/d = ({inputs.lx} × 1000) / {inputs.d_short} ={' '}
                  <strong>{deflection.actualSpanToDepth.toFixed(2)}</strong>
                </div>
                <div className="math-explanation">
                  Actual Span/d ({deflection.actualSpanToDepth.toFixed(1)}) {deflection.pass ? '≤' : '>'} Allowable Span/d ({deflection.allowableSpanToDepth.toFixed(1)}) →{' '}
                  <strong>{deflection.pass ? 'PASS (DEFLECTION SATISFACTORY)' : 'FAIL'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
