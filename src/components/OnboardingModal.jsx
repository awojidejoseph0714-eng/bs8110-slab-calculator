import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export default function OnboardingModal({ isOpen, onDismiss }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="history-overlay" onClick={onDismiss} />
      <div className="modal-dialog" style={{ maxWidth: '440px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <ShieldCheck size={26} />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>CrossCheck</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              BS 8110 Hand-Calculation Parity Tool
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p>
            <strong>Hand-Calculation Cross-Checker:</strong> Rapidly cross-check BS 8110 slab design calculations against hand-written workings on site or at your desk.
          </p>
          <p>
            <strong>Strict Method Parity:</strong> Mirrors hand-calculation methods exactly—including BS 8110 upward aspect ratio rounding conventions. When numbers disagree with manual workings, the mismatch indicates an arithmetic slip, never a code principle disagreement.
          </p>
          <p>
            <strong>Mobile-First Design:</strong> Optimized for thumb navigation, large touch targets, and full line-by-line derivation transparency.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn-framer btn-primary" onClick={onDismiss} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            <Check size={16} /> Got it
          </button>
        </div>
      </div>
    </>
  );
}
