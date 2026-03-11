import React from 'react';

export default function History({ history }) {
  if (history.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>최근 완료 기록</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {history.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.925rem' }}>{item.goal}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
              </p>
            </div>
            <div style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
              100회 완료
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
