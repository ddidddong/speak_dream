import React, { useState } from 'react';

export default function MonthlyCalendar({ stats }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const getIntensity = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = stats[dateStr] || 0;
    if (count >= 100) return 'var(--accent)';
    if (count > 50) return '#f87171'; // Lighter red
    if (count > 0) return '#fca5a5'; // Pale red
    return 'var(--bg-secondary)';
  };

  const days = [];
  // Empty slots for the first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} style={{ aspectRatio: '1' }} />);
  }

  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const count = stats[dateStr] || 0;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div 
        key={d}
        style={{ 
          aspectRatio: '1', 
          backgroundColor: getIntensity(d),
          borderRadius: '0.5rem',
          border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: count >= 100 ? 'white' : 'var(--text-primary)',
          cursor: 'default',
          position: 'relative',
          transition: 'transform 0.2s ease'
        }}
        title={`${dateStr}: ${count}회`}
      >
        {d}
        {count >= 100 && (
          <span style={{ fontSize: '0.625rem', marginTop: '2px' }}>⭐</span>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, fontFamily: 'var(--font-brand)' }}>
          {year}년 {monthNames[month]}
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} className="btn-nav">◀</button>
          <button onClick={nextMonth} className="btn-nav">▶</button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '0.4rem',
      }}>
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', paddingBottom: '0.5rem' }}>
            {d}
          </div>
        ))}
        {days}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 미기록
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#fca5a5', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 시도중
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'var(--accent)', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 100회 완료
        </div>
      </div>

      <style>{`
        .btn-nav {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          padding: 0.4rem 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-nav:hover {
          background: var(--bg-secondary);
        }
      `}</style>
    </div>
  );
}
