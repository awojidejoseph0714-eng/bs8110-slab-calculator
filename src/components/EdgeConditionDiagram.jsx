import React from 'react';

const PANEL_CONDITIONS = [
  { id: 'interior', name: 'Interior Panel', desc: 'Fully continuous on all 4 edges' },
  { id: 'one_short_discontinuous', name: 'One Short Edge Discontinuous', desc: '1 short edge discontinuous' },
  { id: 'one_long_discontinuous', name: 'One Long Edge Discontinuous', desc: '1 long edge discontinuous' },
  { id: 'two_adjacent_discontinuous', name: 'Two Adjacent Edges Discontinuous', desc: 'Corner panel (2 adjacent edges discontinuous)' },
  { id: 'two_short_discontinuous', name: 'Two Short Edges Discontinuous', desc: 'Opposite short edges discontinuous' },
  { id: 'two_long_discontinuous', name: 'Two Long Edges Discontinuous', desc: 'Opposite long edges discontinuous' },
  { id: 'three_edges_discontinuous_long_cont', name: 'Three Edges Discontinuous (Long Cont.)', desc: '3 edges discontinuous, 1 long edge continuous' },
  { id: 'three_edges_discontinuous_short_cont', name: 'Three Edges Discontinuous (Short Cont.)', desc: '3 edges discontinuous, 1 short edge continuous' },
  { id: 'four_edges_discontinuous', name: 'Four Edges Discontinuous', desc: 'Discontinuous on all 4 edges' }
];

export default function EdgeConditionDiagram({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
        Panel Edge Condition (BS 8110 Table 3.14)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
        {PANEL_CONDITIONS.map((cond) => {
          const isSelected = selected === cond.id;
          return (
            <button
              key={cond.id}
              type="button"
              className={`btn-framer ${isSelected ? 'btn-primary' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '8px 12px',
                textAlign: 'left',
                height: 'auto',
                border: isSelected ? '2px solid var(--text-main)' : '1px solid var(--border-subtle)'
              }}
              onClick={() => onSelect(cond.id)}
            >
              <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{cond.name}</div>
              <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                {cond.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
