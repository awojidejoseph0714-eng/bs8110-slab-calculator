import React, { useState, useEffect, useMemo, Component } from 'react';
import Header from './components/Header';
import SlabParamsModal from './components/SlabParamsModal';
import ResultsSummary from './components/ResultsSummary';
import WorkingsAccordion from './components/WorkingsAccordion';
import CrossSectionCanvas from './components/CrossSectionCanvas';
import HistoryDrawer from './components/HistoryDrawer';
import PresetTemplatesModal from './components/PresetTemplatesModal';
import OnboardingModal from './components/OnboardingModal';
import { calculateBS8110Slab, SLAB_PRESETS, AppCalculationConstants } from './utils/bs8110Engine';
import { CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

const DEFAULT_SLAB_INPUTS = {
  slabType: 'TwoWayRestrained',
  caseNumber: 3,
  panelCondition: 'one_long_discontinuous',
  
  lxInput: 4.0,
  lyInput: 5.0,
  
  loadMode: 'direct_n',
  designLoadNInput: 12.0,
  gkInput: 6.1,
  qkInput: 1.5,
  
  bInput: 1000,
  hInput: 160,
  coverInput: 25,
  
  fcuInput: 30,
  fyInput: 460,
  
  targetPhiX: 12,
  targetPhiY: 10,
  enableShearCheck: false
};

const BLANK_SLAB_INPUTS = {
  slabType: 'TwoWayRestrained',
  caseNumber: 1,
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
  
  targetPhiX: '12',
  targetPhiY: '10',
  enableShearCheck: false
};

// React Error Boundary to prevent any blank white screen
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('crosscheck_slab_inputs');
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif', maxWidth: '500px', margin: '40px auto', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <AlertTriangle size={40} color="#ef4444" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Application Session Reset Required</h2>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' }}>
            A stored session parameter caused a display error. Tapping reset will restore default parameters cleanly.
          </p>
          <button
            onClick={this.handleReset}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            <RefreshCw size={16} /> Reset Parameters & Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainCalculatorApp() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('crosscheck_theme') || 'light';
  });

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('crosscheck_seen_onboarding') === 'true';
  });

  const [inputs, setInputs] = useState(() => {
    try {
      const saved = localStorage.getItem('crosscheck_slab_inputs') || localStorage.getItem('bs8110_slab_inputs');
      return saved ? { ...DEFAULT_SLAB_INPUTS, ...JSON.parse(saved) } : DEFAULT_SLAB_INPUTS;
    } catch (e) {
      return DEFAULT_SLAB_INPUTS;
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('crosscheck_slab_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('crosscheck_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('crosscheck_slab_inputs', JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem('crosscheck_slab_history', JSON.stringify(history));
  }, [history]);

  const calculationResult = useMemo(() => {
    try {
      return calculateBS8110Slab(inputs);
    } catch (err) {
      console.error("Calculation Error:", err);
      return calculateBS8110Slab(DEFAULT_SLAB_INPUTS);
    }
  }, [inputs]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const dismissOnboarding = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem('crosscheck_seen_onboarding', 'true');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewBlankAnalysis = () => {
    setInputs(BLANK_SLAB_INPUTS);
    setIsParamsModalOpen(true);
    showToast('Started new blank calculation');
  };

  const handleResetToDefaults = () => {
    setInputs(DEFAULT_SLAB_INPUTS);
    showToast('Reset parameters to defaults');
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

  const handleToggleShear = () => {
    setInputs((prev) => ({
      ...prev,
      enableShearCheck: !prev.enableShearCheck
    }));
    showToast(inputs.enableShearCheck ? 'Shear check disabled' : 'Shear check enabled');
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
    showToast('CrossCheck calculation saved to history!');
  };

  const handleLoadHistoryItem = (item) => {
    if (item && item.inputs) {
      setInputs(item.inputs);
      setIsHistoryOpen(false);
      showToast('Loaded calculation from history');
    }
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Deleted entry from history');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all saved CrossCheck history?')) {
      setHistory([]);
      showToast('Cleared history');
    }
  };

  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `crosscheck_slab_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported calculation history');
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

      {/* Document Stream Layout */}
      <main className="document-stream">
        {/* Results Summary Verdict & Panel Steel Breakdown */}
        <ResultsSummary
          result={calculationResult}
          onSaveToHistory={handleSaveToHistory}
          onOpenParamsModal={() => setIsParamsModalOpen(true)}
          onToggleShear={handleToggleShear}
          enableShearCheck={inputs.enableShearCheck}
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
        onResetToDefaults={handleResetToDefaults}
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

      {/* Onboarding Notice Modal */}
      <OnboardingModal
        isOpen={!hasSeenOnboarding}
        onDismiss={dismissOnboarding}
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

export default function App() {
  return (
    <ErrorBoundary>
      <MainCalculatorApp />
    </ErrorBoundary>
  );
}
