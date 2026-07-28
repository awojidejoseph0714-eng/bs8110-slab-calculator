import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SlabParamsModal from './components/SlabParamsModal';
import ResultsSummary from './components/ResultsSummary';
import WorkingsAccordion from './components/WorkingsAccordion';
import CrossSectionCanvas from './components/CrossSectionCanvas';
import HistoryDrawer from './components/HistoryDrawer';
import PresetTemplatesModal from './components/PresetTemplatesModal';
import { calculateBS8110Slab, SLAB_PRESETS } from './utils/bs8110Engine';
import { CheckCircle2 } from 'lucide-react';

const DEFAULT_SLAB_INPUTS = {
  slabType: 'two_way_restrained',
  panelCondition: 'interior',
  
  lxInput: 4.2,
  lyInput: 5.2,
  
  loadMode: 'direct_n',
  designLoadNInput: 12.5,
  gkInput: 6.5,
  qkInput: 2.5,
  
  bInput: 1000,
  hInput: 160,
  coverInput: 25,
  
  fcuInput: 30,
  fyInput: 460,
  
  barDiaShort: 12,
  spacingShort: 150,
  
  barDiaLong: 10,
  spacingLong: 200,
  
  barDiaSupport: 12,
  spacingSupport: 150
};

const BLANK_SLAB_INPUTS = {
  slabType: 'two_way_restrained',
  panelCondition: 'interior',
  
  lxInput: '',
  lyInput: '',
  
  loadMode: 'direct_n',
  designLoadNInput: '',
  gkInput: '',
  qkInput: '',
  
  bInput: 1000,
  hInput: '',
  coverInput: '25',
  
  fcuInput: '30',
  fyInput: '460',
  
  barDiaShort: '12',
  spacingShort: '150',
  
  barDiaLong: '10',
  spacingLong: '200',
  
  barDiaSupport: '12',
  spacingSupport: '150'
};

export default function App() {
  // Theme state: DEFAULT IS LIGHT MODE (B/W)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bs8110_theme') || 'light';
  });

  const [inputs, setInputs] = useState(() => {
    const saved = localStorage.getItem('bs8110_slab_inputs');
    return saved ? JSON.parse(saved) : DEFAULT_SLAB_INPUTS;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('bs8110_slab_history');
    return saved ? JSON.parse(saved) : [];
  });

  // UI Modal & Drawer States
  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bs8110_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bs8110_slab_inputs', JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem('bs8110_slab_history', JSON.stringify(history));
  }, [history]);

  const calculationResult = useMemo(() => {
    return calculateBS8110Slab(inputs);
  }, [inputs]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewBlankAnalysis = () => {
    setInputs(BLANK_SLAB_INPUTS);
    setIsParamsModalOpen(true);
    showToast('Started new blank slab analysis');
  };

  const handleClearCurrentInputs = () => {
    setInputs(BLANK_SLAB_INPUTS);
    showToast('Cleared slab inputs');
  };

  const handleApplyPreset = (presetKey) => {
    const preset = SLAB_PRESETS[presetKey];
    if (preset) {
      setInputs((prev) => ({
        ...prev,
        ...preset
      }));
      showToast(`Loaded ${preset.name}`);
    }
  };

  const handleSaveToHistory = () => {
    if (!calculationResult || calculationResult.isBlank) {
      showToast('Cannot save blank analysis. Fill inputs first.');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      inputs: { ...inputs },
      result: calculationResult
    };

    setHistory((prev) => [newEntry, ...prev]);
    showToast('Slab analysis saved to history!');
  };

  const handleLoadHistoryItem = (item) => {
    if (item && item.inputs) {
      setInputs(item.inputs);
      setIsHistoryOpen(false);
      showToast('Loaded slab analysis from history');
    }
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Deleted entry from history');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all saved slab history?')) {
      setHistory([]);
      showToast('Cleared history');
    }
  };

  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bs8110_slab_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported slab history');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenParamsModal={() => setIsParamsModalOpen(true)}
        onNewBlankAnalysis={handleNewBlankAnalysis}
        onSaveAnalysis={handleSaveToHistory}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onPrintReport={handlePrintReport}
      />

      {/* Notion-style Clean Document Stream */}
      <main className="document-stream">
        {/* Results Summary Verdict & Panel Steel Breakdown */}
        <ResultsSummary
          result={calculationResult}
          onSaveToHistory={handleSaveToHistory}
          onOpenParamsModal={() => setIsParamsModalOpen(true)}
        />

        {/* 2D Slab Diagram */}
        <CrossSectionCanvas result={calculationResult} />

        {/* Step-by-Step Manual Design Workings */}
        <WorkingsAccordion result={calculationResult} />
      </main>

      {/* Input Parameters Modal */}
      <SlabParamsModal
        isOpen={isParamsModalOpen}
        onClose={() => setIsParamsModalOpen(false)}
        inputs={inputs}
        onChange={setInputs}
        onApplyPreset={handleApplyPreset}
        onNewBlank={handleNewBlankAnalysis}
        onClearInputs={handleClearCurrentInputs}
      />

      {/* Saved History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadHistoryItem={handleLoadHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        onExportHistory={handleExportHistory}
      />

      {/* Preset Selector Modal */}
      <PresetTemplatesModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleApplyPreset}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
