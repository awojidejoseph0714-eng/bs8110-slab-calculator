import React from 'react';
import { CheckCircle2, AlertTriangle, Save, FileSpreadsheet, Sliders, Shield, Eye } from 'lucide-react';

export default function ResultsSummary({ result, onSaveToHistory, onOpenParamsModal, onToggleShear, enableShearCheck }) {
  if (!result) return null;

  if (result.isBlank) {
    return (
      <div className="framer-card" style={{ alignItems: 'center', textAlign: 'center', padding: '48px 20px' }}>
        <FileSpreadsheet size={40} style={{ opacity: 0.4 }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '10px' }}>Blank Slab Session</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '4px 0 20px' }}>
          {result.message}
        </p>
        <button className="btn-framer btn-primary" onClick={onOpenParamsModal}>
          <Sliders size={14} /> Enter Parameters
        </button>
      </div>
    );
  }

  const { moments, flexureParts, shearCheck, deflection, overallPass, inputs } = result;

  const safeLx = Number(inputs?.lx) || 4.0;
  const safeLy = Number(inputs?.ly) || safeLx;
  const safeRatio = Number(inputs?.lyOverLxRaw) || 1.0;
  const safeDx = Number(inputs?.dx) || (Number(inputs?.h) - Number(inputs?.cover) - 6) || 125;
  const safeDy = Number(inputs?.dy) || (safeDx - 12) || 113;
  const safeN = Number(result?.n) || 12.0;

  const sectionsList = [
    flexureParts?.shortMidspan,
    inputs?.slabType === 'two_way_restrained' || inputs?.slabType === 'cantilever' ? flexureParts?.shortSupport : null,
    inputs?.slabType !== 'one_way' && inputs?.slabType !== 'cantilever' ? flexureParts?.longMidspan : null,
    inputs?.slabType === 'two_way_restrained' ? flexureParts?.longSupport : null
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. TOP SUMMARY CARD */}
      <div className="framer-card">
        <div className="card-title-row">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
              Slab Analysis & Design Verdict
            </div>
            <h2 className="card-heading" style={{ fontSize: '1.15rem', marginTop: '2px' }}>
              {(inputs?.slabType || 'SLAB').toUpperCase().replace(/_/g, ' ')}
              {inputs?.slabType === 'two_way_restrained' && ` (${(inputs?.panelCondition || '').replace(/_/g, ' ')})`}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-framer" onClick={onOpenParamsModal}>
              <Sliders size={14} /> Edit Parameters
            </button>
            <button className="btn-framer btn-primary" onClick={onSaveToHistory}>
              <Save size={14} /> Save
            </button>
          </div>
        </div>

        {/* Quick Parameter Summary Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'var(--bg-card-alt)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          <div>Span lx: <strong>{safeLx}m</strong></div>
          {inputs?.slabType !== 'one_way' && inputs?.slabType !== 'cantilever' && (
            <div>ly: <strong>{safeLy.toFixed(1)}m</strong> (ly/lx={safeRatio.toFixed(2)} → Table 3.14 ratio {inputs?.effectiveRatio || 1.0})</div>
          )}
          <div>Thickness h: <strong>{inputs?.h || 150}mm</strong> (dx={safeDx.toFixed(0)}mm, dy={safeDy.toFixed(0)}mm)</div>
          <div>UDL n: <strong>{safeN.toFixed(2)} kN/m²</strong></div>
          <div>fcu: <strong>{inputs?.fcu} N/mm²</strong> · fy: <strong>{inputs?.fy} N/mm²</strong></div>
        </div>

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
                  ? `Satisfies BS 8110-1:1997 flexure, deflection, and spacing buffer rules.`
                  : `One or more structural checks failed. Review section depth or steel details.`}
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
          <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>1. Panel Bending Moments (M = β · n · lx²)</h3>
          <span className="clause-badge">BS 8110 Table 3.14</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {/* Short Span Midspan */}
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--bg-card-alt)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>SHORT SPAN MIDSPAN (+ve Msx)</div>
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
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>SHORT SPAN SUPPORT (-ve Mhx)</div>
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
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>LONG SPAN MIDSPAN (+ve Msy)</div>
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
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>LONG SPAN SUPPORT (-ve Mhy)</div>
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

      {/* 3. FLEXURAL REINFORCEMENT DESIGN */}
      <div className="framer-card">
        <div className="card-title-row">
          <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>2. Flexural Steel Design (Full Worked Equations)</h3>
          <span className="clause-badge">BS 8110 Cl 3.4.4.4</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sectionsList.map((sec, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                background: sec.overReinforced ? 'rgba(255, 0, 0, 0.04)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {sec.locationName} (d = {(sec.d || 125).toFixed(0)}mm)
                </div>
                <span className={`check-pill ${sec.pass ? 'pass' : 'fail'}`}>
                  {sec.pass ? 'PASS' : sec.overReinforced ? 'OVER-REINFORCED' : 'FAIL'}
                </span>
              </div>

              {sec.overReinforced ? (
                <div style={{ padding: '10px 12px', background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <strong>OVER-REINFORCED SECTION (K &gt; 0.156):</strong> {sec.workingLines[0]}<br />
                  {sec.workingLines[1]}<br />
                  {sec.workingLines[2]}
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card-alt)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  {(sec.workingLines || []).map((line, lIdx) => (
                    <div key={lIdx} style={{ whiteSpace: 'pre-wrap' }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. DEFLECTION CONTROL CHECK */}
      <div className="framer-card">
        <div className="card-title-row">
          <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>3. Deflection Control Check (Span / Effective Depth)</h3>
          <span className={`check-pill ${deflection?.pass ? 'pass' : 'fail'}`}>
            {deflection?.pass ? 'PASS' : 'FAIL'}
          </span>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card-alt)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          {(deflection?.workingLines || []).map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>

      {/* 5. OPTIONAL SHEAR CHECK */}
      <div className="framer-card">
        <div className="card-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} />
            <h3 className="card-heading" style={{ fontSize: '1.05rem' }}>4. Slab Shear Check (BS 8110 Table 3.15)</h3>
          </div>

          <button className={`btn-framer ${enableShearCheck ? 'btn-primary' : ''}`} onClick={onToggleShear}>
            <Eye size={14} /> {enableShearCheck ? 'Hide Shear Check' : 'Check Shear'}
          </button>
        </div>

        {!enableShearCheck ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Slab shear rarely governs under uniform loads. Tap <strong>Check Shear</strong> above to reveal Table 3.15 shear stress calculations.
          </div>
        ) : (
          shearCheck && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card-alt)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginTop: '8px' }}>
              {(shearCheck.workingLines || []).map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
