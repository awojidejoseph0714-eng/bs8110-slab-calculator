import React from 'react';
import { CheckCircle2, AlertTriangle, Save, FileSpreadsheet, Sliders } from 'lucide-react';

export default function ResultsSummary({ result, onSaveToHistory, onOpenParamsModal }) {
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

  return (
    <div className="framer-card">
      <div className="card-title-row">
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
            Slab Analysis & Design Verdict
          </div>
          <h2 className="card-heading" style={{ fontSize: '1.15rem', marginTop: '2px' }}>
            {inputs.slabType.toUpperCase().replace(/_/g, ' ')}
            {inputs.slabType === 'two_way_restrained' && ` (${inputs.panelCondition.replace(/_/g, ' ')})`}
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

      {/* Quick Summary Pill Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'var(--bg-card-alt)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        <div>Span lx: <strong>{inputs.lx}m</strong></div>
        <div>ly: <strong>{inputs.ly.toFixed(1)}m</strong></div>
        <div>Aspect ly/lx: <strong>{inputs.lyOverLxRaw.toFixed(2)}</strong></div>
        <div style={{ color: 'var(--text-main)', fontWeight: 700, border: '1px solid var(--border-subtle)', padding: '0 6px', borderRadius: '4px' }}>
          Table 3.14/3.15 Upward Lookup Ratio = {inputs.effectiveRatio}
        </div>
        <div>Thickness h: <strong>{inputs.h}mm</strong> (d={inputs.d_short}mm)</div>
        <div>UDL n: <strong>{result.n.toFixed(2)} kN/m²</strong></div>
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
                ? `Section satisfies BS 8110-1:1997 flexure, shear, deflection, and (As,prov - As,req >= 100 mm²/m) margin rule.`
                : `One or more structural checks failed. Review slab thickness or steel selection.`}
            </div>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', textAlign: 'right' }}>
          <div><strong>Max M:</strong> {result.M_max.toFixed(2)} kNm/m</div>
          <div><strong>Max V:</strong> {result.V_max.toFixed(2)} kN/m</div>
        </div>
      </div>

      {/* REINFORCEMENT & FLEXURE TABLE WITH (As_prov - As_req >= 100) MARGIN COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Panel Reinforcement & Steel Margin Breakdown (As_prov - As_req ≥ 100 mm²/m)
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card-alt)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px' }}>Location</th>
                <th style={{ padding: '8px 10px' }}>Moment (kNm/m)</th>
                <th style={{ padding: '8px 10px' }}>As req (mm²/m)</th>
                <th style={{ padding: '8px 10px' }}>Auto-Solved Bar & Spacing</th>
                <th style={{ padding: '8px 10px' }}>As prov (mm²/m)</th>
                <th style={{ padding: '8px 10px' }}>Margin (ΔAs ≥ 100)</th>
                <th style={{ padding: '8px 10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Short Span Midspan */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                  Short Span Midspan (+ve Msx)
                </td>
                <td style={{ padding: '8px 10px' }}>{moments.Msx.toFixed(2)}</td>
                <td style={{ padding: '8px 10px' }}>{Math.round(flexureParts.shortMidspan.As_governing_req)}</td>
                <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                  {flexureParts.shortMidspan.barDetail}
                </td>
                <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                  {Math.round(flexureParts.shortMidspan.As_prov)}
                </td>
                <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                  +{Math.round(flexureParts.shortMidspan.margin)} mm²/m
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <span className={`check-pill ${flexureParts.shortMidspan.pass ? 'pass' : 'fail'}`}>
                    {flexureParts.shortMidspan.pass ? 'PASS' : 'FAIL'}
                  </span>
                </td>
              </tr>

              {/* Long Span Midspan */}
              {inputs.slabType !== 'one_way' && inputs.slabType !== 'cantilever' && (
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                    Long Span Midspan (+ve Msy)
                  </td>
                  <td style={{ padding: '8px 10px' }}>{moments.Msy.toFixed(2)}</td>
                  <td style={{ padding: '8px 10px' }}>{Math.round(flexureParts.longMidspan.As_governing_req)}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                    {flexureParts.longMidspan.barDetail}
                  </td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                    {Math.round(flexureParts.longMidspan.As_prov)}
                  </td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                    +{Math.round(flexureParts.longMidspan.margin)} mm²/m
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <span className={`check-pill ${flexureParts.longMidspan.pass ? 'pass' : 'fail'}`}>
                      {flexureParts.longMidspan.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              )}

              {/* Support Hogging */}
              {(inputs.slabType === 'two_way_restrained' || inputs.slabType === 'cantilever') && (
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                    Support Continuous Edge (-ve Mhx)
                  </td>
                  <td style={{ padding: '8px 10px' }}>{moments.Mhx.toFixed(2)}</td>
                  <td style={{ padding: '8px 10px' }}>{Math.round(flexureParts.shortSupport.As_governing_req)}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                    {flexureParts.shortSupport.barDetail}
                  </td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                    {Math.round(flexureParts.shortSupport.As_prov)}
                  </td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                    +{Math.round(flexureParts.shortSupport.margin)} mm²/m
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <span className={`check-pill ${flexureParts.shortSupport.pass ? 'pass' : 'fail'}`}>
                      {flexureParts.shortSupport.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2 Main Checks: Shear & Deflection */}
      <div className="checks-grid">
        {/* SHEAR CARD */}
        <div className={`check-card ${shearCheck.pass ? 'pass' : 'fail'}`}>
          <div className="check-card-header">
            <span>Slab Shear Stress (v) — Table 3.15</span>
            <span className={`check-pill ${shearCheck.pass ? 'pass' : 'fail'}`}>
              {shearCheck.pass ? 'PASS' : 'FAIL'}
            </span>
          </div>

          <div>
            <div className="check-main-val">
              {shearCheck.v.toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>N/mm²</span>
            </div>
            <div className="check-sub-text">
              Concrete Capacity v_c = {shearCheck.vc.toFixed(2)} N/mm² (Max Shear V = {result.V_max.toFixed(1)} kN/m)
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            <div>v ≤ v_c → Satisfactory (No links required in solid slab)</div>
          </div>
        </div>

        {/* DEFLECTION CARD */}
        <div className={`check-card ${deflection.pass ? 'pass' : 'fail'}`}>
          <div className="check-card-header">
            <span>Deflection (Short Span/d)</span>
            <span className={`check-pill ${deflection.pass ? 'pass' : 'fail'}`}>
              {deflection.pass ? 'PASS' : 'FAIL'}
            </span>
          </div>

          <div>
            <div className="check-main-val">
              {deflection.actualSpanToDepth.toFixed(1)}{' '}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                / {deflection.allowableSpanToDepth.toFixed(1)}
              </span>
            </div>
            <div className="check-sub-text">
              Actual Span/d ≤ Allowable Span/d
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            <div><strong>Basic Ratio:</strong> {deflection.basicSpanToDepth} · <strong>F1 Factor:</strong> {deflection.F1.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
