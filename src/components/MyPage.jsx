import React from 'react';
import MonthlyCalendar from './MonthlyCalendar';

export default function MyPage({ goal, stats, history, onReset }) {
  const completionCount = Object.values(stats).filter(count => count >= 100).length;
  const totalReps = Object.values(stats).reduce((acc, curr) => acc + curr, 0);

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <section className="card no-mobile-radius">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'var(--font-brand)', fontWeight: 400 }}>나의 습관 캘린더</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>완료한 날</p>
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-brand)' }}>{completionCount}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>총 반복</p>
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>{totalReps}</p>
          </div>
        </div>
        
        <MonthlyCalendar stats={stats} />
      </section>

      <section className="card no-mobile-radius">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>현재 목표</h3>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, wordBreak: 'keep-all' }}>
            {goal || '설정된 목표가 없습니다.'}
          </p>
        </div>
        <button 
          onClick={onReset}
          style={{ 
            marginTop: '1rem', 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: 'transparent', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          목표 수정하기
        </button>
      </section>

      {history.length > 0 && (
        <section className="card no-mobile-radius">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>상세 히스토리</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {history.map((item, index) => (
              <div key={index} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem', wordBreak: 'keep-all' }}>{item.goal}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8125rem' }}>Success</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
