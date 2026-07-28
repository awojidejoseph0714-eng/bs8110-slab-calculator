import React from 'react';
import { Sliders, History, Download, Sun, Moon, Sparkles, FilePlus, Save } from 'lucide-react';

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
        <div className="brand-icon-wrapper">
          <span>BS</span>
        </div>
        <div>
          <h1 className="brand-h1">BS 8110 Slab Studio</h1>
          <span className="brand-badge">Notion Minimal · BS 8110-1:1997</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn-framer btn-primary"
          onClick={onOpenParamsModal}
          title="Open Modal to Edit Slab Parameters"
        >
          <Sliders size={14} />
          <span>Edit Parameters</span>
        </button>

        <button
          className="btn-framer"
          onClick={onSaveAnalysis}
          title="Save analysis result to history"
        >
          <Save size={14} />
          <span>Save</span>
        </button>

        <button
          className="btn-framer btn-ghost"
          onClick={onNewBlankAnalysis}
          title="Start a new blank analysis session"
        >
          <FilePlus size={14} />
          <span>New</span>
        </button>

        <button
          className="btn-framer btn-ghost"
          onClick={onOpenPresets}
          title="Load Standard Preset Templates"
        >
          <Sparkles size={14} />
          <span>Presets</span>
        </button>

        <button
          className="btn-framer btn-ghost"
          onClick={onOpenHistory}
          title="Saved Calculation History"
        >
          <History size={14} />
          <span>History ({historyCount})</span>
        </button>

        <button
          className="btn-framer btn-ghost"
          onClick={onPrintReport}
          title="Export PDF / Print Report"
        >
          <Download size={14} />
        </button>

        <button
          className="btn-framer btn-ghost"
          onClick={toggleTheme}
          title="Toggle Light/Dark B/W Theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
