import React from 'react';

export default function CrossSectionCanvas({ result }) {
  if (!result || result.isBlank) {
    return (
      <div className="canvas-wrapper" style={{ opacity: 0.6 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Slab Panel & Cross-Section Visualizer (Awaiting Inputs)
        </div>
        <svg width={340} height={160} viewBox="0 0 340 160">
          <rect width={340} height={160} fill="none" stroke="var(--border-subtle)" strokeDasharray="4 4" rx="8" />
          <text x={170} y={80} fill="var(--text-dim)" fontSize="12" textAnchor="middle" fontFamily="var(--font-mono)">
            Fill slab parameters to render diagram
          </text>
        </svg>
      </div>
    );
  }

  const { inputs, moments, flexureParts } = result;

  const canvasW = 340;
  const canvasH = 220;

  // Plan View Panel dimensions
  const planW = 200;
  const planH = 140;
  const planX = 20;
  const planY = 30;

  // Cross section height
  const secX = 240;
  const secY = 30;
  const secW = 80;
  const secH = 140;

  return (
    <div className="canvas-wrapper">
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
        Slab Panel Layout (Plan View & Cross-Section)
      </div>

      <svg width={canvasW} height={canvasH} viewBox={`0 0 ${canvasW} ${canvasH}`}>
        <rect width={canvasW} height={canvasH} fill="none" stroke="var(--border-subtle)" rx="8" />

        {/* 1. PLAN VIEW OF SLAB PANEL */}
        <g>
          {/* Slab Boundary */}
          <rect
            x={planX}
            y={planY}
            width={planW}
            height={planH}
            fill="rgba(37, 99, 235, 0.05)"
            stroke="#2563eb"
            strokeWidth="2"
            rx="4"
          />

          {/* Short Span Reinforcement (Horizontal bars) */}
          <line x1={planX + 15} y1={planY + 40} x2={planX + planW - 15} y2={planY + 40} stroke="#10b981" strokeWidth="2" />
          <line x1={planX + 15} y1={planY + 70} x2={planX + planW - 15} y2={planY + 70} stroke="#10b981" strokeWidth="2" />
          <line x1={planX + 15} y1={planY + 100} x2={planX + planW - 15} y2={planY + 100} stroke="#10b981" strokeWidth="2" />

          {/* Long Span Reinforcement (Vertical bars) */}
          {inputs.slabType !== 'one_way' && inputs.slabType !== 'cantilever' && (
            <>
              <line x1={planX + 50} y1={planY + 15} x2={planX + 50} y2={planY + planH - 15} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1={planX + 100} y1={planY + 15} x2={planX + 100} y2={planY + planH - 15} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1={planX + 150} y1={planY + 15} x2={planX + 150} y2={planY + planH - 15} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
            </>
          )}

          {/* Labels */}
          <text x={planX + planW / 2} y={planY - 8} fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle">
            lx = {inputs.lx} m
          </text>
          <text x={planX - 8} y={planY + planH / 2} fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" transform={`rotate(-90 ${planX - 8} ${planY + planH / 2})`}>
            ly = {inputs.ly.toFixed(1)} m
          </text>

          <text x={planX + planW / 2} y={planY + planH / 2} fill="var(--accent-blue)" fontSize="11" fontWeight="700" textAnchor="middle">
            {inputs.slabType.toUpperCase().replace(/_/g, ' ')}
          </text>
        </g>

        {/* 2. CROSS SECTION PROFILE */}
        <g>
          <rect
            x={secX}
            y={secY}
            width={secW}
            height={secH}
            fill="rgba(37, 99, 235, 0.08)"
            stroke="#2563eb"
            strokeWidth="1.5"
            rx="3"
          />

          {/* Main Rebar dots */}
          <circle cx={secX + 20} cy={secY + secH - 20} r="4" fill="#10b981" />
          <circle cx={secX + 40} cy={secY + secH - 20} r="4" fill="#10b981" />
          <circle cx={secX + 60} cy={secY + secH - 20} r="4" fill="#10b981" />

          {/* Top Hogging Rebar (if applicable) */}
          {moments.Mhx > 0 && (
            <>
              <circle cx={secX + 20} cy={secY + 20} r="4" fill="#6366f1" />
              <circle cx={secX + 60} cy={secY + 20} r="4" fill="#6366f1" />
            </>
          )}

          <text x={secX + secW / 2} y={secY + secH + 16} fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
            h = {inputs.h} mm
          </text>
        </g>
      </svg>
    </div>
  );
}
