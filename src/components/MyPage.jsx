import React, { useState } from 'react';
import MonthlyCalendar from './MonthlyCalendar';

export default function MyPage({ goal, count, stats, history, onReset }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const completionCount = Object.values(stats).filter(count => count >= 100).length;
  const totalReps = Object.values(stats).reduce((acc, curr) => acc + curr, 0);

  // Extract target date from goal string (e.g., "나는 2026년 12월 31일에...")
  const dateMatch = goal.match(/(\d{4}년 \d{1,2}월 \d{1,2}일)/);
  const targetDateInfo = dateMatch ? dateMatch[0] : null;

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistory = history.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: 'grid', gap: '0.75rem', paddingBottom: '5rem' }}>
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
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>현재 목표 및 진척도</h3>
        
        {targetDateInfo && (
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 600 }}>
              목표일: {targetDateInfo}
            </span>
          </div>
        )}

        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
          {goal ? (
            <>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                {goal}
              </p>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>오늘의 진척도</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>{count} / 100</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min(count, 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--accent)', 
                    transition: 'width 0.3s ease' 
                  }} />
                </div>
              </div>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
              현재 진행 중인 목표가 없습니다.
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <button 
            onClick={onReset}
            style={{ 
              width: '100%', 
              padding: '0.85rem', 
              backgroundColor: 'var(--accent)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9375rem',
              boxShadow: '0 4px 12px rgba(222, 72, 58, 0.2)'
            }}
          >
            {goal ? '+ 새로운 목표 추가하기' : '첫 목표 만들기'}
          </button>
          
          {goal && (
            <button 
              onClick={onReset}
              style={{ 
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
              현재 목표 수정하기
            </button>
          )}
        </div>
      </section>

      {history.length > 0 && (
        <section className="card no-mobile-radius">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>상세 히스토리</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {currentHistory.map((item, index) => (
              <div key={index} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem', wordBreak: 'keep-all', color: 'var(--text-primary)' }}>{item.goal}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent)',
                    borderRadius: '0.25rem',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-pagination"
              >
                이전
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-pagination"
              >
                다음
              </button>
            </div>
          )}
        </section>
      )}

      <style>{`
        .btn-pagination {
          padding: 0.4rem 1rem;
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          background-color: white;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.8125rem;
          cursor: pointer;
        }
        .btn-pagination:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .btn-pagination:not(:disabled):hover {
          background-color: var(--bg-secondary);
        }
      `}</style>
    </div>
  );
}
