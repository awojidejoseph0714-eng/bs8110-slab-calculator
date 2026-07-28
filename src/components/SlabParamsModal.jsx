import React from 'react';
import { X, Check, Eraser, Layers } from 'lucide-react';

export default function SlabParamsModal({
  isOpen,
  onClose,
  inputs,
  onChange,
  onApplyPreset,
  onNewBlank,
  onClearInputs
}) {
  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <>
      <div className="history-overlay" onClick={onClose} />
      <div className="modal-dialog">
        <div className="card-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Edit Slab Design Parameters</h2>
          </div>
          <button className="btn-framer btn-ghost" onClick={onClose} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="form-section">
          <div className="section-subheading">Standard Slab Presets</div>
          <div className="input-grid-2">
            <button
              className="btn-framer"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              onClick={() => onApplyPreset('one_way_solid')}
            >
              1-Way Solid Slab
            </button>
            <button
              className="btn-framer"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              onClick={() => onApplyPreset('two_way_restrained_interior')}
            >
              2-Way Restrained (Interior)
            </button>
            <button
              className="btn-framer"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              onClick={() => onApplyPreset('two_way_ss')}
            >
              2-Way Simply Supported
            </button>
            <button
              className="btn-framer"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              onClick={() => onApplyPreset('cantilever_balcony')}
            >
              Cantilever Balcony
            </button>
          </div>
        </div>

        {/* 1. SLAB TYPE & PANEL CONDITIONS */}
        <div className="form-section">
          <div className="section-subheading">1. Slab Type & Edge Conditions</div>

          <div className="input-field-group">
            <label className="input-label">Slab Type</label>
            <select
              className="framer-select"
              value={inputs.slabType}
              onChange={(e) => handleInputChange('slabType', e.target.value)}
            >
              <option value="two_way_restrained">Two-Way Restrained Slab (Corners Held Down)</option>
              <option value="two_way_ss">Two-Way Simply Supported (Corners Free)</option>
              <option value="one_way">One-Way Spanning Solid Slab</option>
              <option value="cantilever">Cantilever Slab</option>
            </select>
          </div>

          {inputs.slabType === 'two_way_restrained' && (
            <div className="input-field-group">
              <label className="input-label">Panel Edge Condition (BS 8110 Table 3.14)</label>
              <select
                className="framer-select"
                value={inputs.panelCondition}
                onChange={(e) => handleInputChange('panelCondition', e.target.value)}
              >
                <option value="one_long_discontinuous">One Long Edge Discontinuous</option>
                <option value="interior">Interior Panel (Continuous on all 4 edges)</option>
                <option value="one_short_discontinuous">One Short Edge Discontinuous</option>
                <option value="two_adjacent_discontinuous">Two Adjacent Edges Discontinuous (Corner Panel)</option>
                <option value="two_short_discontinuous">Two Short Edges Discontinuous</option>
                <option value="two_long_discontinuous">Two Long Edges Discontinuous</option>
                <option value="three_edges_discontinuous_long_cont">Three Edges Discontinuous (Long Edge Continuous)</option>
                <option value="three_edges_discontinuous_short_cont">Three Edges Discontinuous (Short Edge Continuous)</option>
              </select>
            </div>
          )}

          {/* Table 3.14 Lookup Mode Selector */}
          <div className="input-field-group">
            <label className="input-label">Table 3.14/3.15 Coefficient Mode</label>
            <select
              className="framer-select"
              value={inputs.lookupMode || 'linear'}
              onChange={(e) => handleInputChange('lookupMode', e.target.value)}
            >
              <option value="linear">Linear Interpolation (BS 8110 Standard / manual-design.vercel.app)</option>
              <option value="upward">Upward Ratio Lookup (Nearest Ceiling Ratio)</option>
            </select>
          </div>
        </div>

        {/* 2. GEOMETRY & LOADING */}
        <div className="form-section">
          <div className="section-subheading">2. Panel Geometry & Loading</div>

          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">
                <span>Short Span (lx)</span>
                <span className="input-unit">m</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                placeholder="e.g. 4.0"
                className="framer-input"
                value={inputs.lxInput}
                onChange={(e) => handleInputChange('lxInput', e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <label className="input-label">
                <span>Long Span (ly)</span>
                <span className="input-unit">m</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                placeholder="e.g. 5.0"
                className="framer-input"
                value={inputs.lyInput}
                onChange={(e) => handleInputChange('lyInput', e.target.value)}
              />
            </div>
          </div>

          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">
                <span>Slab Thickness (h)</span>
                <span className="input-unit">mm</span>
              </label>
              <input
                type="number"
                step="5"
                min="50"
                placeholder="e.g. 150"
                className="framer-input"
                value={inputs.hInput}
                onChange={(e) => handleInputChange('hInput', e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <label className="input-label">
                <span>Nominal Cover</span>
                <span className="input-unit">mm</span>
              </label>
              <input
                type="number"
                step="5"
                min="15"
                className="framer-input"
                value={inputs.coverInput}
                onChange={(e) => handleInputChange('coverInput', e.target.value)}
              />
            </div>
          </div>

          {/* Loading Mode */}
          <div className="input-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>Design Loading (n)</label>
              <div className="tab-group-minimal">
                <button
                  className={`tab-btn ${inputs.loadMode === 'direct_n' ? 'active' : ''}`}
                  onClick={() => handleInputChange('loadMode', 'direct_n')}
                >
                  Direct UDL n
                </button>
                <button
                  className={`tab-btn ${inputs.loadMode === 'gk_qk' ? 'active' : ''}`}
                  onClick={() => handleInputChange('loadMode', 'gk_qk')}
                >
                  1.4Gk + 1.6Qk
                </button>
              </div>
            </div>

            {inputs.loadMode === 'direct_n' ? (
              <div className="input-field-group">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  placeholder="e.g. 12.0 (kN/m²)"
                  className="framer-input"
                  value={inputs.designLoadNInput}
                  onChange={(e) => handleInputChange('designLoadNInput', e.target.value)}
                />
              </div>
            ) : (
              <div className="input-grid-2">
                <div className="input-field-group">
                  <label className="input-label">Dead Load (Gk)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.1 kN/m²"
                    className="framer-input"
                    value={inputs.gkInput}
                    onChange={(e) => handleInputChange('gkInput', e.target.value)}
                  />
                </div>
                <div className="input-field-group">
                  <label className="input-label">Live Load (Qk)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 1.5 kN/m²"
                    className="framer-input"
                    value={inputs.qkInput}
                    onChange={(e) => handleInputChange('qkInput', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. MATERIALS */}
        <div className="form-section">
          <div className="section-subheading">3. Material Strengths</div>
          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">Concrete (fcu 15-40)</label>
              <select
                className="framer-select"
                value={inputs.fcuInput}
                onChange={(e) => handleInputChange('fcuInput', e.target.value)}
              >
                <option value="20">C20 (20 N/mm²)</option>
                <option value="25">C25 (25 N/mm²)</option>
                <option value="30">C30 (30 N/mm²)</option>
                <option value="35">C35 (35 N/mm²)</option>
                <option value="40">C40 (40 N/mm²)</option>
              </select>
            </div>

            <div className="input-field-group">
              <label className="input-label">Steel (fy 250-460)</label>
              <select
                className="framer-select"
                value={inputs.fyInput}
                onChange={(e) => handleInputChange('fyInput', e.target.value)}
              >
                <option value="460">High Yield (460 N/mm²)</option>
                <option value="250">Mild Steel (250 N/mm²)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. REINFORCEMENT BAR DIAMETERS */}
        <div className="form-section">
          <div className="section-subheading">4. Bar Diameter Selection (Spacing Solved Automatically)</div>

          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">Short Span Bar (Φ)</label>
              <select
                className="framer-select"
                value={inputs.barDiaShort}
                onChange={(e) => handleInputChange('barDiaShort', e.target.value)}
              >
                <option value="10">Y10</option>
                <option value="12">Y12</option>
                <option value="16">Y16</option>
              </select>
            </div>

            {inputs.slabType !== 'one_way' && inputs.slabType !== 'cantilever' && (
              <div className="input-field-group">
                <label className="input-label">Long Span Bar (Φ)</label>
                <select
                  className="framer-select"
                  value={inputs.barDiaLong}
                  onChange={(e) => handleInputChange('barDiaLong', e.target.value)}
                >
                  <option value="10">Y10</option>
                  <option value="12">Y12</option>
                  <option value="16">Y16</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-framer btn-ghost" onClick={onClearInputs}>
            <Eraser size={14} /> Clear
          </button>
          <button className="btn-framer btn-primary" onClick={onClose}>
            <Check size={14} /> Done Editing
          </button>
        </div>
      </div>
    </>
  );
}
