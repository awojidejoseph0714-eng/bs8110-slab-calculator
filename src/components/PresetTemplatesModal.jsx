import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { SLAB_PRESETS } from '../utils/bs8110Engine';

export default function PresetTemplatesModal({ isOpen, onClose, onSelectPreset }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="history-overlay" onClick={onClose} />
      <div
        className="framer-card"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '540px',
          maxWidth: '92vw',
          zIndex: 101,
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-active)'
        }}
      >
        <div className="card-title-row">
          <h2 className="card-heading">
            <Sparkles size={18} className="text-blue-500" />
            <span>BS 8110 Slab Presets</span>
          </h2>
          <button className="btn-framer btn-ghost" onClick={onClose} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(SLAB_PRESETS).map(([key, preset]) => (
            <div
              key={key}
              className="history-item-card"
              onClick={() => {
                onSelectPreset(key);
                onClose();
              }}
              style={{ padding: '14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {preset.name}
                </h3>
                <span className="brand-badge" style={{ fontSize: '0.65rem' }}>
                  SLAB
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Span: {preset.lxInput}m × {preset.lyInput}m · Thickness h = {preset.hInput}mm · fcu = {preset.fcuInput} N/mm² · fy = {preset.fyInput} N/mm²
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                <span>Load Template</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
