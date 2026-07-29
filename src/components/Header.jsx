import React, { useState } from 'react';
import { Sliders, Plus, History, Sun, Moon, Printer, Sparkles, Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAction = (actionFn) => {
    setIsMobileMenuOpen(false);
    if (actionFn) actionFn();
  };

  return (
    <header className="framer-header">
      <div className="header-top-row">
        <div className="brand-title-group">
          <img src="/logo.svg" alt="SlabCheck Logo" style={{ width: '36px', height: '36px', borderRadius: '6px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 className="brand-h1">SlabCheck</h1>
              <span className="brand-badge">BS 8110</span>
            </div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              HAND-CALC VERIFIED
            </div>
          </div>
        </div>

        {/* Mobile Actions Right Group */}
        <div className="mobile-header-right">
          <button className="btn-framer btn-primary btn-mobile-edit" onClick={onOpenParamsModal}>
            <Sliders size={14} /> Edit Params
          </button>
          
          <button
            className="btn-framer btn-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Desktop Action Buttons Bar */}
      <div className="header-actions desktop-actions-row">
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

      {/* Mobile Slide-Down Hamburger Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <button className="mobile-menu-item primary" onClick={() => handleAction(onOpenParamsModal)}>
            <Sliders size={16} /> Edit Parameters
          </button>

          <button className="mobile-menu-item" onClick={() => handleAction(onOpenPresets)}>
            <Sparkles size={16} /> Load Presets
          </button>

          <button className="mobile-menu-item" onClick={() => handleAction(onNewBlankAnalysis)}>
            <Plus size={16} /> Start New Slab
          </button>

          <button className="mobile-menu-item" onClick={() => handleAction(onOpenHistory)}>
            <History size={16} /> Saved History ({historyCount})
          </button>

          <button className="mobile-menu-item" onClick={() => handleAction(onPrintReport)}>
            <Printer size={16} /> Print Report
          </button>

          <button className="mobile-menu-item" onClick={() => handleAction(toggleTheme)}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>Toggle Theme ({theme === 'light' ? 'Dark' : 'Light'})</span>
          </button>
        </div>
      )}
    </header>
  );
}
