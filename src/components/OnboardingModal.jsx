import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export default function OnboardingModal({ isOpen, onDismiss }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="history-overlay" onClick={onDismiss} />
      <div className="modal-dialog" style={{ maxWidth: '420px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <ShieldCheck size={24} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Manual Design Cross-Checker</h2>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p>
            <strong>Personal Cross-Check Tool:</strong> Built to mirror your manual hand-calculations exactly so you can quickly catch arithmetic slips on site or at your desk.
          </p>
          <p>
            <strong>BS 8110 Rounding Convention:</strong> Aspect ratios ($r = l_y/l_x$) round UP to Table 3.14 standard ratios to match your manual calculation method.
          </p>
          <p>
            <strong>Always Accessible:</strong> Tap <em>Edit Parameters</em> anytime on the results screen to adjust your slab geometry or loads.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn-framer btn-primary" onClick={onDismiss} style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
            <Check size={16} /> Got it
          </button>
        </div>
      </div>
    </>
  );
}
