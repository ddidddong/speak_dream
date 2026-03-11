import React from 'react';
import CalendarTracker from './CalendarTracker';

export default function MyPage({ goal, stats, history, onReset }) {
  const completionCount = Object.values(stats).filter(count => count >= 100).length;
  const totalReps = Object.values(stats).reduce((acc, curr) => acc + curr, 0);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <section className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>나의 통계</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600 }}>누적 완료</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{completionCount}회</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>총 반복 횟수</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalReps}</p>
          </div>
        </div>
        
        <CalendarTracker stats={stats} />
      </section>

      <section className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>현재 목표 설정</h3>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>활성 문장</p>
          <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {goal || '설정된 목표가 없습니다.'}
          </p>
        </div>
        <button 
          onClick={onReset}
          style={{ 
            marginTop: '1.5rem', 
            width: '100%', 
            padding: '1rem', 
            backgroundColor: 'transparent', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          목표 수정하기
        </button>
      </section>

      {history.length > 0 && (
        <section className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>상세 히스토리</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {history.map((item, index) => (
              <div key={index} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.goal}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                  </p>
                </div>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.875rem' }}>완료</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
