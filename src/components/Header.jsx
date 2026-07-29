import React from 'react';
import { Sliders, Plus, History, Sun, Moon, Printer, Sparkles } from 'lucide-react';

export default function Header({
  theme,
  toggleTheme,
  onOpenParamsModal,
  onNewBlankAnalysis,
  onSaveAnalysis,
  onOpenHistory,
  historyCount,
  onOpenPresets,
  onPrintReport
}) {
  return (
    <header className="framer-header">
      <div className="brand-title-group">
        <div className="brand-icon-wrapper">CC</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="brand-h1">CrossCheck</h1>
            <span className="brand-badge">BS 8110-1:1997</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Hand-Calculation Parity Tool
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn-framer btn-primary" onClick={onOpenParamsModal} title="Edit Slab Parameters">
          <Sliders size={14} /> Edit Params
        </button>

        <button className="btn-framer" onClick={onOpenPresets} title="Load Preset Templates">
          <Sparkles size={14} /> Presets
        </button>

        <button className="btn-framer" onClick={onNewBlankAnalysis} title="Start New Calculation">
          <Plus size={14} /> New Slab
        </button>

        <button className="btn-framer" onClick={onOpenHistory} title="View Saved Workbooks">
          <History size={14} /> History ({historyCount})
        </button>

        <button className="btn-framer btn-ghost" onClick={onPrintReport} title="Print Calculation Sheet">
          <Printer size={14} />
        </button>

        <button className="btn-framer btn-ghost" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>
    </header>
  );
}
