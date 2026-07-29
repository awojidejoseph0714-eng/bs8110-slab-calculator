import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Shield } from 'lucide-react';

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

  const safeLx = Number(inputs?.lx) || 4.0;
  const safeLy = Number(inputs?.ly) || safeLx;
  const safeRatio = Number(inputs?.lyOverLxRaw) || 1.0;
  const effectiveRatio = inputs?.effectiveRatio || 1.0;
  const safeDx = Number(inputs?.dx) || 125;

  return (
    <div className="framer-card">
      <div className="card-title-row">
        <h2 className="card-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  Actual ratio ly/lx = {safeLy.toFixed(2)} / {safeLx} = {safeRatio.toFixed(3)}
                  <br />
                  Upward Lookup Rule: Rounded UPWARD to nearest standard table ratio ={' '}
                  <strong>{effectiveRatio}</strong>
                </div>
                <div className="math-explanation">
                  No interpolation applied per design rules. BS 8110 Table 3.14 coefficients evaluated at ratio ={' '}
                  <strong>{effectiveRatio}</strong>.
                </div>
              </div>

              <div className="math-step-block">
                <div className="math-step-title">1.2 Calculated Moments for Short & Long Spans</div>
                <div className="math-formula">
                  Short Span Midspan (+ve Msx): βsx = {(moments?.momentCoeffs?.bsx || 0).toFixed(3)} → Msx = βsx × n × lx² ={' '}
                  <strong>{(moments?.Msx || 0).toFixed(2)} kNm/m</strong>
                </div>
                {(moments?.Mhx || 0) > 0 && (
                  <div className="math-formula">
                    Short Span Support (-ve Mhx): βhx = {(moments?.momentCoeffs?.bhx || 0).toFixed(3)} → Mhx = βhx × n × lx² ={' '}
                    <strong>{moments.Mhx.toFixed(2)} kNm/m</strong>
                  </div>
                )}
                {(moments?.Msy || 0) > 0 && (
                  <div className="math-formula">
                    Long Span Midspan (+ve Msy): βsy = {(moments?.momentCoeffs?.bsy || 0).toFixed(3)} → Msy = βsy × n × lx² ={' '}
                    <strong>{moments.Msy.toFixed(2)} kNm/m</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: FLEXURE & WORKED EQUATIONS */}
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
              {flexureParts?.shortMidspan && (
                <div className="math-step-block">
                  <div className="math-step-title">2.1 Short Span Midspan (+ve Msx = {(moments?.Msx || 0).toFixed(2)} kNm/m)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-card-alt)', padding: '8px 10px', borderRadius: '4px' }}>
                    {(flexureParts.shortMidspan.workingLines || []).map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long Span Midspan */}
              {flexureParts?.longMidspan && (moments?.Msy || 0) > 0 && (
                <div className="math-step-block">
                  <div className="math-step-title">2.2 Long Span Midspan (+ve Msy = {(moments?.Msy || 0).toFixed(2)} kNm/m)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-card-alt)', padding: '8px 10px', borderRadius: '4px' }}>
                    {(flexureParts.longMidspan.workingLines || []).map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
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
              {!shearCheck ? (
                <div className="math-step-block">
                  <div className="math-explanation">
                    <Shield size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Shear check is optional and turned off by default (BS 8110 slab shear rarely governs under UDL). Tap <strong>Check Shear</strong> on the main card above to enable Table 3.15 calculations.
                  </div>
                </div>
              ) : (
                <div className="math-step-block">
                  <div className="math-step-title">3.1 Shear Force Coefficients & Shear Stress (v)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-card-alt)', padding: '8px 10px', borderRadius: '4px' }}>
                    {(shearCheck.workingLines || []).map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
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

          {openSections.deflection && deflection && (
            <div className="accordion-content">
              <div className="math-step-block">
                <div className="math-step-title">4.1 Span/d Comparison</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-card-alt)', padding: '8px 10px', borderRadius: '4px' }}>
                  {(deflection.workingLines || []).map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
