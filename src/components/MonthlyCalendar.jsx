import React, { useState } from 'react';

export default function MonthlyCalendar({ stats }) {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const years = [];
  const nowYear = new Date().getFullYear();
  for (let y = nowYear - 5; y <= nowYear + 5; y++) {
    years.push(y);
  }

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentMonth, 1));
    setShowYearPicker(false);
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentYear, monthIndex, 1));
    setShowMonthPicker(false);
  };

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // Calculate Monthly Aggregate
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthlyTotal = Object.entries(stats)
    .filter(([date]) => date.startsWith(monthPrefix))
    .reduce((sum, [, count]) => sum + count, 0);

  // Calculate Yearly Aggregate
  const yearlyTotal = Object.entries(stats)
    .filter(([date]) => date.startsWith(`${currentYear}-`))
    .reduce((sum, [, count]) => sum + count, 0);

  const getIntensity = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = stats[dateStr] || 0;
    if (count >= 100) return 'var(--accent)';
    if (count > 50) return '#f87171';
    if (count > 0) return '#fca5a5';
    return 'var(--bg-secondary)';
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} style={{ aspectRatio: '1' }} />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
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
          cursor: 'pointer',
          position: 'relative',
        }}
        title={`${dateStr}: ${count}회`}
      >
        {d}
        {count >= 100 && (
          <span style={{ fontSize: '0.5rem', marginTop: '2px' }}>⭐</span>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.5rem', position: 'relative' }}>
      {/* Aggregate Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{currentMonth + 1}월 합계</p>
          <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>{monthlyTotal}회</p>
        </div>
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{currentYear}년 전체</p>
          <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>{yearlyTotal}회</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Custom Year Picker Trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}
              style={{ 
                padding: '0.45rem 0.75rem', 
                borderRadius: '0.625rem', 
                border: '1px solid var(--border)', 
                fontSize: '1rem', 
                fontWeight: 700, 
                fontFamily: 'var(--font-brand)',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: showYearPicker ? 'var(--accent)' : 'var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              {currentYear}년 <span style={{ fontSize: '0.6rem', transform: showYearPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </button>
            {showYearPicker && (
              <div 
                className="picker-grid"
                style={{ 
                  position: 'absolute', 
                  top: '110%', 
                  left: 0, 
                  backgroundColor: 'white', 
                  border: '1px solid var(--border)', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                  zIndex: 200,
                  padding: '0.75rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  width: '200px'
                }}
              >
                {years.map(y => (
                  <button 
                    key={y} 
                    onClick={() => handleYearSelect(y)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.4rem',
                      border: y === currentYear ? '1.5px solid var(--accent)' : '1px solid #eee',
                      backgroundColor: y === currentYear ? 'var(--accent-light)' : 'transparent',
                      color: y === currentYear ? 'var(--accent)' : 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-brand)'
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Month Picker Trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}
              style={{ 
                padding: '0.45rem 0.75rem', 
                borderRadius: '0.625rem', 
                border: '1px solid var(--border)', 
                fontSize: '1rem', 
                fontWeight: 700, 
                fontFamily: 'var(--font-brand)',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: showMonthPicker ? 'var(--accent)' : 'var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              {currentMonth + 1}월 <span style={{ fontSize: '0.6rem', transform: showMonthPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </button>
            {showMonthPicker && (
              <div 
                className="picker-grid"
                style={{ 
                  position: 'absolute', 
                  top: '110%', 
                  left: 0, 
                  backgroundColor: 'white', 
                  border: '1px solid var(--border)', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                  zIndex: 200,
                  padding: '0.75rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  width: '240px'
                }}
              >
                {monthNames.map((m, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleMonthSelect(i)}
                    style={{
                      padding: '0.6rem 0',
                      borderRadius: '0.5rem',
                      border: i === currentMonth ? '1.5px solid var(--accent)' : '1px solid #eee',
                      backgroundColor: i === currentMonth ? 'var(--accent-light)' : 'transparent',
                      color: i === currentMonth ? 'var(--accent)' : 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-brand)'
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))} className="btn-nav">◀</button>
          <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))} className="btn-nav">▶</button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '0.4rem',
      }}>
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', paddingBottom: '0.25rem' }}>
            {d}
          </div>
        ))}
        {days}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <div style={{ width: '0.6rem', height: '0.6rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 미기록
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <div style={{ width: '0.6rem', height: '0.6rem', backgroundColor: '#fca5a5', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 진행중
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <div style={{ width: '0.6rem', height: '0.6rem', backgroundColor: 'var(--accent)', border: '1px solid var(--border)', borderRadius: '0.125rem' }} /> 완수
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
          cursor: pointer;
        }
        .btn-nav:hover {
          background: var(--bg-secondary);
        }
      `}</style>
    </div>
  );
}
