import React from 'react';
import { X, Trash2, Download, ArrowUpRight, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onLoadHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
  onExportHistory
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="history-overlay" onClick={onClose} />
      <div className="history-drawer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} className="text-blue-400" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Calculation History</h2>
          </div>
          <button className="btn-framer btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {history.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
            No saved calculations yet. Click "Save Result" after calculating to keep track of your designs.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-framer"
                style={{ flex: 1, fontSize: '0.775rem', justifyContent: 'center' }}
                onClick={onExportHistory}
              >
                <Download size={14} />
                Export CSV / JSON
              </button>
              <button
                className="btn-framer btn-ghost"
                style={{ fontSize: '0.775rem', color: '#ef4444' }}
                onClick={onClearHistory}
              >
                <Trash2 size={14} />
                Clear All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  className="history-item-card"
                  onClick={() => onLoadHistoryItem(item)}
                >
                  <div className="history-item-header">
                    <div className="history-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.result.overallPass ? (
                        <ShieldCheck size={16} className="text-emerald-400" />
                      ) : (
                        <AlertTriangle size={16} className="text-red-400" />
                      )}
                      <span>
                        {item.inputs.elementCategory === 'slab'
                          ? `Slab (${item.inputs.slabType})`
                          : `Beam (${item.inputs.beamType})`}
                      </span>
                    </div>

                    <span className="history-time">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    M = {item.result.moment.toFixed(1)} kNm · V = {item.result.shear.toFixed(1)} kN
                    <br />
                    Span lx = {item.inputs.lxInput}m · d = {item.inputs.dInput}mm · b = {item.inputs.bInput}mm
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px' }}>
                    <span
                      className={`check-pill ${item.result.overallPass ? 'pass' : 'fail'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {item.result.overallPass ? 'SATISFACTORY' : 'REVISION REQ.'}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-framer btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '0.725rem' }}
                        onClick={() => onLoadHistoryItem(item)}
                        title="Load into Calculator"
                      >
                        Load <ArrowUpRight size={12} />
                      </button>
                      <button
                        className="btn-framer btn-ghost"
                        style={{ padding: '4px', color: '#ef4444' }}
                        onClick={() => onDeleteHistoryItem(item.id)}
                        title="Delete entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
