import React from 'react';
import { CheckCircle2, AlertTriangle, Save, FileSpreadsheet, Sliders, Shield, Eye, Info } from 'lucide-react';

export default function ResultsSummary({ result, onSaveToHistory, onOpenParamsModal, onToggleShear, enableShearCheck }) {
  if (!result) return null;

  if (result.isBlank) {
    return (
      <div className="framer-card" style={{ alignItems: 'center', textAlign: 'center', padding: '48px 20px' }}>
        <FileSpreadsheet size={40} style={{ opacity: 0.4 }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '10px' }}>CrossCheck Session Awaiting Inputs</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '4px 0 20px' }}>
          {result.message}
        </p>
        <button className="btn-framer btn-primary" onClick={onOpenParamsModal}>
          <Sliders size={14} /> Configure Parameters
        </button>
      </div>
    );
  }

  const { moments, flexureParts, shearCheck, deflection, overallPass, inputs, hasOverReinforced } = result;

  const safeLx = Number(inputs?.lx) || 4.0;
  const safeLy = Number(inputs?.ly) || safeLx;
  const safeRatio = Number(inputs?.lyOverLxRaw) || 1.0;
  const safeDx = Number(inputs?.dx) || 125;
  const safeDy = Number(inputs?.dy) || 113;
  const safeN = Number(result?.n) || 12.0;

  const isOneWay = inputs?.slabType === 'OneWaySolid' || inputs?.slabType === 'one_way';
  const isCantilever = inputs?.slabType === 'Cantilever' || inputs?.slabType === 'cantilever';
  const isTwoWaySS = inputs?.slabType === 'TwoWaySimplySupported' || inputs?.slabType === 'two_way_ss';

  const sectionsList = [
    !isCantilever ? flexureParts?.shortMidspan : null,
    (flexureParts?.shortSupport && flexureParts.shortSupport.M > 0) || isCantilever ? flexureParts?.shortSupport : null,
    flexureParts?.longMidspan,
    flexureParts?.longSupport && flexureParts.longSupport.M > 0 ? flexureParts?.longSupport : null
  ].filter(Boolean);

  const shortDef = deflection?.shortSpan;
  const longDef = deflection?.longSpan;

  const clauseBadgeText = isTwoWaySS
    ? 'Table 3.13'
    : isOneWay
    ? 'Table 3.12'
    : isCantilever
    ? 'Cl 3.5.2'
    : 'Table 3.14';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. TOP VERDICT BANNER */}
      <div className="framer-card">
        <div className="card-title-row">
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
              CrossCheck Design Verdict
            </div>
            <h2 className="card-heading" style={{ fontSize: '1.15rem', marginTop: '2px' }}>
              {(inputs?.slabType || 'SLAB').toUpperCase().replace(/_/g, ' ')}
              {inputs?.slabType?.includes('Restrained') && ` (Case ${inputs?.caseNumber || 3})`}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-framer" onClick={onOpenParamsModal}>
              <Sliders size={14} /> Adjust Parameters
            </button>
            <button className="btn-framer btn-primary" onClick={onSaveToHistory}>
              <Save size={14} /> Save
            </button>
          </div>
        </div>

        {/* Parameter Recap Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'var(--bg-card-alt)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          <div>Span lx: <strong>{safeLx}m</strong></div>
          {!isOneWayOrCantilever && (
            <div>ly: <strong>{safeLy.toFixed(1)}m</strong> (ly/lx={safeRatio.toFixed(2)} → Table 3.14 ratio {inputs?.effectiveRatio || 1.0})</div>
          )}
          <div>h: <strong>{inputs?.h || 160}mm</strong> (dx={safeDx.toFixed(0)}mm, dy={safeDy.toFixed(0)}mm)</div>
          <div>UDL n: <strong>{safeN.toFixed(2)} kN/m²</strong></div>
          <div>fcu: <strong>{inputs?.fcu} N/mm²</strong> · fy: <strong>{inputs?.fy} N/mm²</strong></div>
        </div>

        {/* Over-Reinforced Prominent Flag */}
        {hasOverReinforced && (
          <div style={{ padding: '16px', background: 'var(--bg-primary)', border: '2px solid var(--text-main)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={24} style={{ minWidth: '24px', marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase' }}>
                OVER-REINFORCED SECTION DETECTED (K &gt; 0.156)
              </div>
              <div style={{ fontSize: '0.825rem', marginTop: '4px', opacity: 0.9 }}>
                Flexural factor K exceeds BS 8110 limit of 0.156. Reinforcement and spacing calculations are halted for affected direction(s). <strong>Compression steel or depth (h) redesign is required.</strong> Parameters remain live for immediate adjustment.
              </div>
            </div>
          </div>
        )}

        {/* Overall Verdict Banner */}
        <div className={`verdict-banner ${overallPass ? 'pass' : 'fail'}`}>
          <div className="verdict-status-badge">
            <div className="status-icon-circle">
              {overallPass ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <div className="verdict-title">
                {overallPass ? 'SLAB DESIGN SATISFACTORY' : 'SLAB REVISION REQUIRED'}
              </div>
              <div className="verdict-subtitle">
                {overallPass
                  ? `Full parity with BS 8110-1:1997 flexure, deflection, and detailing rules.`
                  : `One or more structural checks failed. Tap Adjust Parameters to refine inputs.`}
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', textAlign: 'right' }}>
            <div><strong>Max M:</strong> {(result?.M_max || 0).toFixed(2)} kNm/m</div>
          </div>
        </div>
      </div>

      {/* 2. BENDING MOMENTS */}
      <div className="framer-card">
        <div className="card-title-row">
          <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>1. Bending Moments (M = β · n · lx²)</h3>
          <span className="clause-badge">{clauseBadgeText}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          {/* Short Span Midspan */}
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--bg-card-alt)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)' }}>SHORT SPAN MIDSPAN (+ve Msx)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
              {(moments?.Msx || 0).toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kNm/m</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              βsx = {(moments?.momentCoeffs?.bsx || 0).toFixed(3)} × {safeN.toFixed(1)} × {safeLx}²
            </div>
          </div>

          {/* Short Span Support */}
          {(moments?.Mhx || 0) > 0 && (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--bg-card-alt)' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)' }}>SHORT SPAN SUPPORT (-ve Mhx)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {moments.Mhx.toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kNm/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                βhx = {(moments?.momentCoeffs?.bhx || 0).toFixed(3)} × {safeN.toFixed(1)} × {safeLx}²
              </div>
            </div>
          )}

          {/* Long Span Midspan */}
          {(moments?.Msy || 0) > 0 && (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--bg-card-alt)' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)' }}>LONG SPAN MIDSPAN (+ve Msy)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {moments.Msy.toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kNm/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                βsy = {(moments?.momentCoeffs?.bsy || 0).toFixed(3)} × {safeN.toFixed(1)} × {safeLx}²
              </div>
            </div>
          )}

          {/* Long Span Support */}
          {(moments?.Mhy || 0) > 0 && (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--bg-card-alt)' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)' }}>LONG SPAN SUPPORT (-ve Mhy)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {moments.Mhy.toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kNm/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                βhy = {(moments?.momentCoeffs?.bhy || 0).toFixed(3)} × {safeN.toFixed(1)} × {safeLx}²
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. FLEXURAL REINFORCEMENT SUMMARY */}
      <div className="framer-card">
        <div className="card-title-row">
          <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>2. Flexural Steel Area & BS 8110 Table Spacing</h3>
          <span className="clause-badge">Cl 3.4.4.4 / Cl 3.12.5</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sectionsList.map((sec, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                background: sec.overReinforced ? 'rgba(0, 0, 0, 0.04)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  {sec.locationName} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>(d = {(sec.d || 125).toFixed(0)}mm)</span>
                </div>
                <span className={`check-pill ${sec.pass ? 'pass' : 'fail'}`}>
                  {sec.pass ? 'PASS' : sec.overReinforced ? 'OVER-REINFORCED' : 'FAIL'}
                </span>
              </div>

              {sec.overReinforced ? (
                <div style={{ padding: '10px 12px', background: 'var(--bg-card-alt)', border: '1px solid var(--text-main)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <strong>OVER-REINFORCED (K &gt; 0.156):</strong> z, As and spacing calculations halted.<br />
                  {sec.overReinforcedMessage}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Separate As,calc vs As,min Notification Callout */}
                  {sec.isAsCalcInsufficient && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 10px', background: 'var(--bg-card-alt)', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      <Info size={16} style={{ minWidth: '16px', marginTop: '1px' }} />
                      <div>{sec.insufficientMessage}</div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'var(--bg-card-alt)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    <div>K factor: <strong>{sec.K.toFixed(3)}</strong></div>
                    <div>
                      Calculated z: <strong>{sec.z_raw.toFixed(1)}mm</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>({(sec.z_raw / sec.d).toFixed(3)}d)</span>
                    </div>
                    <div>
                      Design z used: <strong>{sec.z.toFixed(1)}mm</strong> {sec.isZCapped && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(capped 0.95d)</span>}
                    </div>
                    <div>As calc: <strong>{sec.As_calc.toFixed(2)} mm²/m</strong></div>
                    <div>As min: <strong>{sec.As_min.toFixed(2)} mm²/m</strong></div>
                    <div>Governing As req: <strong>{sec.As_req.toFixed(2)} mm²/m</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({sec.governingSource})</span></div>
                    <div>Solved Spacing (Table): <strong>{sec.barDetail}</strong></div>
                    <div>As prov (Table): <strong>{sec.As_prov.toFixed(1)} mm²/m</strong></div>
                    <div>Margin (ΔAs ≥ 100): <strong>+{sec.margin.toFixed(2)} mm²/m</strong></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. DEFLECTION CONTROL (SHORT & LONG SPAN MIDSPAN CHECKS) */}
      <div className="framer-card">
        <div className="card-title-row">
          <div>
            <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>3. Serviceability Deflection Control</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Evaluated directly at midspans using ultimate moments (no service load reduction factor)
            </div>
          </div>

          <span className={`check-pill ${deflection?.pass ? 'pass' : 'fail'}`}>
            {deflection?.pass ? 'PASS' : 'FAIL'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Short Span Deflection Card */}
          {shortDef && (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--bg-card-alt)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Short Span (lx = {shortDef.spanLength}m, dx = {shortDef.d.toFixed(0)}mm)
                </div>
                <span className={`check-pill ${shortDef.pass ? 'pass' : 'fail'}`}>
                  {shortDef.pass ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <div>Base Ratio: <strong>{deflection.basicSpanToDepth}</strong></div>
                <div>Ultimate Msx: <strong>{shortDef.M_midspan.toFixed(2)} kNm/m</strong></div>
                <div>Stress fs: <strong>{shortDef.fs.toFixed(1)} N/mm²</strong></div>
                <div>M / (b.d²): <strong>{shortDef.M_bd2.toFixed(3)} N/mm²</strong></div>
                <div>Factor F1: <strong>{shortDef.F1.toFixed(2)}</strong></div>
                <div>Allowable Span/d: <strong>{shortDef.allowableSpanToDepth.toFixed(1)}</strong></div>
                <div>Actual Span/d: <strong>{shortDef.actualSpanToDepth.toFixed(1)}</strong></div>
              </div>
            </div>
          )}

          {/* Long Span Deflection Card */}
          {longDef && (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--bg-card-alt)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Long Span (ly = {longDef.spanLength.toFixed(1)}m, dy = {longDef.d.toFixed(0)}mm)
                </div>
                <span className={`check-pill ${longDef.pass ? 'pass' : 'fail'}`}>
                  {longDef.pass ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <div>Base Ratio: <strong>{deflection.basicSpanToDepth}</strong></div>
                <div>Ultimate Msy: <strong>{longDef.M_midspan.toFixed(2)} kNm/m</strong></div>
                <div>Stress fs: <strong>{longDef.fs.toFixed(1)} N/mm²</strong></div>
                <div>M / (b.d²): <strong>{longDef.M_bd2.toFixed(3)} N/mm²</strong></div>
                <div>Factor F1: <strong>{longDef.F1.toFixed(2)}</strong></div>
                <div>Allowable Span/d: <strong>{longDef.allowableSpanToDepth.toFixed(1)}</strong></div>
                <div>Actual Span/d: <strong>{longDef.actualSpanToDepth.toFixed(1)}</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. OPTIONAL SHEAR CHECK */}
      <div className="framer-card">
        <div className="card-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} />
            <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>4. Optional Slab Shear Check</h3>
          </div>

          <button className={`btn-framer ${enableShearCheck ? 'btn-primary' : ''}`} onClick={onToggleShear}>
            <Eye size={14} /> {enableShearCheck ? 'Hide Shear Check' : 'Enable Shear Check'}
          </button>
        </div>

        {!enableShearCheck ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Shear is off by default (rarely governs in slabs under UDL). Tap <strong>Enable Shear Check</strong> above to compute Table 3.15 shear stress and capacity.
          </div>
        ) : (
          shearCheck && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', background: 'var(--bg-card-alt)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>
              <div>Design Shear V: <strong>{shearCheck.V_max.toFixed(2)} kN/m</strong></div>
              <div>Applied Stress v: <strong>{shearCheck.v.toFixed(3)} N/mm²</strong></div>
              <div>Concrete Capacity vc: <strong>{shearCheck.vc_capped.toFixed(3)} N/mm²</strong></div>
              <div>Verdict: <strong>{shearCheck.pass ? 'PASS (No links required)' : 'FAIL'}</strong></div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
