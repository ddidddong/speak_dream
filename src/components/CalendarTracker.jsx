import React from 'react';

export default function CalendarTracker({ stats }) {
  // Get last 28 days for a simple habit tracker view
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const getIntensity = (day) => {
    const count = stats[day] || 0;
    if (count >= 100) return 'var(--accent)';
    if (count > 5) return '#f87171'; // Lighter red
    if (count > 0) return '#fca5a5'; // Pale red
    return 'var(--bg-secondary)';
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h4 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>최근 28일간의 습관 기록</h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '0.5rem',
      }}>
        {days.map(day => (
          <div 
            key={day}
            style={{ 
              aspectRatio: '1', 
              backgroundColor: getIntensity(day),
              borderRadius: '0.25rem',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: stats[day] >= 100 ? 'white' : 'var(--text-secondary)'
            }}
            title={`${day}: ${stats[day] || 0}회`}
          >
            {day.split('-')[2]}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 미달성
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'var(--accent)', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 100회 달성
        </div>
      </div>
    </div>
  );
}
