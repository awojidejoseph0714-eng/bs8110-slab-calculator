import React from 'react';
import { Sliders, FilePlus, Eraser, Sparkles, Save, Layers, Box, Zap, Shield } from 'lucide-react';

export default function InputPanel({ inputs, onChange, onApplyPreset, onNewBlank, onClearInputs, onSave }) {
  const handleInputChange = (field, value) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="framer-card">
      <div className="card-title-row">
        <h2 className="card-heading">
          <Layers size={18} className="text-blue-600" />
          <span>Slab Design Parameters</span>
        </h2>
        <span className="brand-badge">BS 8110-1:1997</span>
      </div>

      {/* Top Action Bar */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn-framer btn-primary"
          style={{ flex: 1, fontSize: '0.775rem', justifyContent: 'center' }}
          onClick={onNewBlank}
        >
          <FilePlus size={14} />
          New (Blank)
        </button>
        <button
          className="btn-framer"
          style={{ flex: 1, fontSize: '0.775rem', justifyContent: 'center' }}
          onClick={onClearInputs}
        >
          <Eraser size={14} />
          Clear
        </button>
        <button
          className="btn-framer"
          style={{ flex: 1, fontSize: '0.775rem', justifyContent: 'center' }}
          onClick={onSave}
        >
          <Save size={14} />
          Save
        </button>
      </div>

      {/* Quick Preset Selector */}
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
        <div className="section-subheading">1. Slab Classification & Edge Conditions</div>

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

        {(inputs.slabType === 'one_way' || inputs.slabType === 'OneWaySolid') && (
          <div className="input-field-group">
            <label className="input-label">One-Way Support Condition (BS 8110 Table 3.12)</label>
            <select
              className="framer-select"
              value={inputs.oneWayCondition || 'simply_supported'}
              onChange={(e) => handleInputChange('oneWayCondition', e.target.value)}
            >
              <option value="simply_supported">Simply Supported Single Span (M = 0.125 n lx²)</option>
              <option value="continuous_end_span">Continuous - End Span (M = 0.086 n lx²)</option>
              <option value="continuous_interior_span">Continuous - Interior Span (M = 0.063 n lx²)</option>
            </select>
          </div>
        )}

        {(inputs.slabType === 'two_way_restrained' || inputs.slabType === 'TwoWayRestrained') && (
          <div className="input-field-group">
            <label className="input-label">Panel Edge Condition (BS 8110 Table 3.14)</label>
            <select
              className="framer-select"
              value={inputs.panelCondition}
              onChange={(e) => handleInputChange('panelCondition', e.target.value)}
            >
              <option value="interior">Interior Panel (Continuous on all 4 edges)</option>
              <option value="one_short_discontinuous">One Short Edge Discontinuous</option>
              <option value="one_long_discontinuous">One Long Edge Discontinuous</option>
              <option value="two_adjacent_discontinuous">Two Adjacent Edges Discontinuous (Corner Panel)</option>
              <option value="two_short_discontinuous">Two Short Edges Discontinuous</option>
              <option value="two_long_discontinuous">Two Long Edges Discontinuous</option>
              <option value="three_edges_discontinuous_long_cont">Three Edges Discontinuous (Long Edge Continuous)</option>
              <option value="three_edges_discontinuous_short_cont">Three Edges Discontinuous (Short Edge Continuous)</option>
            </select>
          </div>
        )}
      </div>

      {/* 2. GEOMETRY & LOADING */}
      <div className="form-section">
        <div className="section-subheading">2. Panel Geometry & Design Loading</div>

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
              placeholder="e.g. 4.2"
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
              placeholder="e.g. 5.5"
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
              placeholder="e.g. 160"
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
            <div className="tab-group-minimal" style={{ fontSize: '0.675rem' }}>
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
            <div className="input-wrapper">
              <input
                type="number"
                step="0.5"
                min="0.1"
                placeholder="e.g. 13.5"
                className="framer-input"
                value={inputs.designLoadNInput}
                onChange={(e) => handleInputChange('designLoadNInput', e.target.value)}
              />
              <span style={{ position: 'absolute', right: '12px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                kN/m²
              </span>
            </div>
          ) : (
            <div className="input-grid-2">
              <div className="input-field-group">
                <label className="input-label">
                  <span>Dead Load (Gk)</span>
                  <span className="input-unit">kN/m²</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 6.5"
                  className="framer-input"
                  value={inputs.gkInput}
                  onChange={(e) => handleInputChange('gkInput', e.target.value)}
                />
              </div>
              <div className="input-field-group">
                <label className="input-label">
                  <span>Live Load (Qk)</span>
                  <span className="input-unit">kN/m²</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 2.5"
                  className="framer-input"
                  value={inputs.qkInput}
                  onChange={(e) => handleInputChange('qkInput', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MATERIAL STRENGTHS */}
      <div className="form-section">
        <div className="section-subheading">3. Materials (BS 8110 Bounded)</div>
        <div className="input-grid-2">
          <div className="input-field-group">
            <label className="input-label">
              <span>Concrete (fcu)</span>
              <span className="input-unit">15-40 N/mm²</span>
            </label>
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
            <label className="input-label">
              <span>Steel (fy)</span>
              <span className="input-unit">250-460 N/mm²</span>
            </label>
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

      {/* 4. PROVIDED REINFORCEMENT FOR EACH PART */}
      <div className="form-section">
        <div className="section-subheading">4. Provided Reinforcement per Panel Part</div>

        {/* Short Span Sagging */}
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
          <div className="input-field-group">
            <label className="input-label">Short Spacing (s)</label>
            <select
              className="framer-select"
              value={inputs.spacingShort}
              onChange={(e) => handleInputChange('spacingShort', e.target.value)}
            >
              <option value="100">100mm</option>
              <option value="125">125mm</option>
              <option value="150">150mm</option>
              <option value="175">175mm</option>
              <option value="200">200mm</option>
              <option value="250">250mm</option>
            </select>
          </div>
        </div>

        {/* Long Span Sagging */}
        {inputs.slabType !== 'one_way' && inputs.slabType !== 'cantilever' && (
          <div className="input-grid-2">
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
            <div className="input-field-group">
              <label className="input-label">Long Spacing (s)</label>
              <select
                className="framer-select"
                value={inputs.spacingLong}
                onChange={(e) => handleInputChange('spacingLong', e.target.value)}
              >
                <option value="125">125mm</option>
                <option value="150">150mm</option>
                <option value="175">175mm</option>
                <option value="200">200mm</option>
                <option value="250">250mm</option>
                <option value="300">300mm</option>
              </select>
            </div>
          </div>
        )}

        {/* Support Steel (Hogging) */}
        {inputs.slabType === 'two_way_restrained' && (
          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">Support Bar (Φ)</label>
              <select
                className="framer-select"
                value={inputs.barDiaSupport}
                onChange={(e) => handleInputChange('barDiaSupport', e.target.value)}
              >
                <option value="10">Y10</option>
                <option value="12">Y12</option>
                <option value="16">Y16</option>
              </select>
            </div>
            <div className="input-field-group">
              <label className="input-label">Support Spacing (s)</label>
              <select
                className="framer-select"
                value={inputs.spacingSupport}
                onChange={(e) => handleInputChange('spacingSupport', e.target.value)}
              >
                <option value="100">100mm</option>
                <option value="125">125mm</option>
                <option value="150">150mm</option>
                <option value="175">175mm</option>
                <option value="200">200mm</option>
                <option value="250">250mm</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
