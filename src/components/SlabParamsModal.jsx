import React, { useState } from 'react';
import { X, Check, RotateCcw, Layers, AlertTriangle } from 'lucide-react';
import EdgeConditionDiagram from './EdgeConditionDiagram';
import { EDGE_CONDITION_CASES } from '../utils/bs8110Engine';

export default function SlabParamsModal({
  isOpen,
  onClose,
  inputs,
  onChange,
  onApplyPreset,
  onResetToDefaults
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customFcu, setCustomFcu] = useState(false);
  const [customFy, setCustomFy] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    onChange({ ...inputs, [field]: value });
  };

  const handleSlabTypeChange = (newType) => {
    const defaultCase = newType === 'TwoWayRestrained' || newType === 'two_way_restrained' ? 3 : 9;
    onChange({
      ...inputs,
      slabType: newType,
      caseNumber: defaultCase
    });
  };

  const handleFcuChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setCustomFcu(true);
    } else {
      setCustomFcu(false);
      handleInputChange('fcuInput', Number(val));
    }
  };

  const handleFyChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setCustomFy(true);
    } else {
      setCustomFy(false);
      handleInputChange('fyInput', Number(val));
    }
  };

  const isRestrained = inputs.slabType === 'TwoWayRestrained' || inputs.slabType === 'two_way_restrained';
  const isOneWayOrCantilever = inputs.slabType === 'OneWaySolid' || inputs.slabType === 'one_way' || inputs.slabType === 'Cantilever' || inputs.slabType === 'cantilever';

  // Derived effective depths live display
  const dx = Math.max(0, (Number(inputs.hInput) || 160) - (Number(inputs.coverInput) || 25) - (Number(inputs.targetPhiX) || 12) / 2);
  const dy = Math.max(0, dx - (Number(inputs.targetPhiX) || 12));

  return (
    <>
      <div className="history-overlay" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
        <div className="card-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} />
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Parameter Configuration</h2>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                CrossCheck Interactive Input Engine
              </div>
            </div>
          </div>
          <button className="btn-framer btn-ghost" onClick={onClose} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* 1. SLAB TYPE SELECTION */}
        <div className="form-section">
          <div className="section-subheading">1. Slab System Selection</div>

          <div className="input-field-group">
            <label className="input-label">Slab System</label>
            <select
              className="framer-select"
              value={inputs.slabType}
              onChange={(e) => handleSlabTypeChange(e.target.value)}
            >
              <option value="TwoWayRestrained">Two-Way Restrained Slab (Corners Held Down)</option>
              <option value="TwoWaySimplySupported">Two-Way Simply Supported (Corners Free)</option>
              <option value="OneWaySolid">One-Way Solid Slab</option>
              <option value="Cantilever">Cantilever Slab</option>
            </select>
          </div>

          {(inputs.slabType === 'OneWaySolid' || inputs.slabType === 'one_way') && (
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

          {/* Restrained Edge Condition Picker (Case 1 - 9) */}
          {isRestrained && (
            <div className="input-field-group">
              <label className="input-label">Panel Edge Condition (BS 8110 Table 3.14)</label>
              <select
                className="framer-select"
                value={inputs.caseNumber || 3}
                onChange={(e) => handleInputChange('caseNumber', Number(e.target.value))}
              >
                {EDGE_CONDITION_CASES.map((c) => (
                  <option key={c.caseNumber} value={c.caseNumber}>
                    Case {c.caseNumber}: {c.description}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 2. GEOMETRY & DERIVED DEPTHS */}
        <div className="form-section">
          <div className="section-subheading">2. Panel Geometry & Detailing</div>

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

            {!isOneWayOrCantilever && (
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
            )}
          </div>

          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">
                <span>Overall Depth (h)</span>
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
                <span>Nominal Cover (c)</span>
                <span className="input-unit">mm</span>
              </label>
              <input
                type="number"
                step="5"
                min="10"
                className="framer-input"
                value={inputs.coverInput}
                onChange={(e) => handleInputChange('coverInput', e.target.value)}
              />
            </div>
          </div>

          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">Short Span Bar (Φx)</label>
              <select
                className="framer-select"
                value={inputs.targetPhiX || 12}
                onChange={(e) => handleInputChange('targetPhiX', Number(e.target.value))}
              >
                <option value="8">Y8 (8mm)</option>
                <option value="10">Y10 (10mm)</option>
                <option value="12">Y12 (12mm)</option>
                <option value="16">Y16 (16mm)</option>
                <option value="20">Y20 (20mm)</option>
              </select>
            </div>

            {!isOneWayOrCantilever && (
              <div className="input-field-group">
                <label className="input-label">Long Span Bar (Φy)</label>
                <select
                  className="framer-select"
                  value={inputs.targetPhiY || 10}
                  onChange={(e) => handleInputChange('targetPhiY', Number(e.target.value))}
                >
                  <option value="8">Y8 (8mm)</option>
                  <option value="10">Y10 (10mm)</option>
                  <option value="12">Y12 (12mm)</option>
                  <option value="16">Y16 (16mm)</option>
                </select>
              </div>
            )}
          </div>

          {/* Derived Depths Display */}
          <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-card-alt)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <div><strong>Derived dx:</strong> {dx.toFixed(1)} mm</div>
            {!isOneWayOrCantilever && (
              <div><strong>Derived dy:</strong> {dy.toFixed(1)} mm <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>(dx - Φx)</span></div>
            )}
          </div>
        </div>

        {/* 3. MATERIALS & LOADING */}
        <div className="form-section">
          <div className="section-subheading">3. Materials & Design Loading</div>

          <div className="input-grid-2">
            <div className="input-field-group">
              <label className="input-label">Concrete (fcu)</label>
              {!customFcu ? (
                <select
                  className="framer-select"
                  value={inputs.fcuInput}
                  onChange={handleFcuChange}
                >
                  <option value="20">C20 (20 N/mm²)</option>
                  <option value="25">C25 (25 N/mm²)</option>
                  <option value="30">C30 (30 N/mm²)</option>
                  <option value="35">C35 (35 N/mm²)</option>
                  <option value="40">C40 (40 N/mm²)</option>
                  <option value="Other">Other (Custom N/mm²)...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="number"
                    min="15"
                    max="80"
                    className="framer-input"
                    value={inputs.fcuInput}
                    onChange={(e) => handleInputChange('fcuInput', e.target.value)}
                  />
                  <button className="btn-framer" onClick={() => setCustomFcu(false)}>Preset</button>
                </div>
              )}
            </div>

            <div className="input-field-group">
              <label className="input-label">Steel Strength (fy)</label>
              {!customFy ? (
                <select
                  className="framer-select"
                  value={inputs.fyInput}
                  onChange={handleFyChange}
                >
                  <option value="460">High Yield (460 N/mm²)</option>
                  <option value="250">Mild Steel (250 N/mm²)</option>
                  <option value="Other">Other (Custom N/mm²)...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="number"
                    min="250"
                    max="500"
                    className="framer-input"
                    value={inputs.fyInput}
                    onChange={(e) => handleInputChange('fyInput', e.target.value)}
                  />
                  <button className="btn-framer" onClick={() => setCustomFy(false)}>Preset</button>
                </div>
              )}
            </div>
          </div>

          <div className="input-field-group">
            <label className="input-label">
              <span>Ultimate Design Load (n)</span>
              <span className="input-unit">kN/m²</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0.1"
              placeholder="e.g. 12.0"
              className="framer-input"
              value={inputs.designLoadNInput}
              onChange={(e) => handleInputChange('designLoadNInput', e.target.value)}
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-framer btn-ghost" onClick={() => setShowResetConfirm(true)}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button className="btn-framer btn-primary" onClick={onClose}>
            <Check size={14} /> Apply Parameters
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <>
          <div className="history-overlay" style={{ zIndex: 120 }} onClick={() => setShowResetConfirm(false)} />
          <div className="modal-dialog" style={{ zIndex: 121, maxWidth: '400px', textAlign: 'center' }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 8px', color: 'var(--text-main)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Reset Session Parameters?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 16px' }}>
              Are you sure you want to reset? All current inputs will be restored to defaults.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn-framer" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button
                className="btn-framer btn-primary"
                onClick={() => {
                  onResetToDefaults();
                  setShowResetConfirm(false);
                }}
              >
                Reset Parameters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
