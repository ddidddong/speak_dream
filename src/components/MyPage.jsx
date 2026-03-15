import React, { useState } from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import GoalGenerator from './GoalGenerator';

export default function MyPage({ goal, count, targetReps = 100, stats, history, onSaveGoal, onResetGoal }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 10;
  
  const completionCount = Object.values(stats).filter(val => val >= targetReps).length;
  const totalReps = Object.values(stats).reduce((acc, curr) => acc + curr, 0);

  // Extract target date from goal string
  const dateMatch = goal ? goal.match(/(\d{4}년 \d{1,2}월 \d{1,2}일)/) : null;
  const targetDateInfo = dateMatch ? dateMatch[0] : null;

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistory = history.slice(indexOfFirstItem, indexOfLastItem);

  const handleSaveGoal = (newGoal, newTargetReps) => {
    onSaveGoal(newGoal, newTargetReps);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <GoalGenerator onSave={handleSaveGoal} />
        <button 
          onClick={() => setIsEditing(false)}
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
          취소하고 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <section style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', padding: '0 0.25rem' }}>
          <div style={{ width: '4px', height: '1.375rem', background: 'linear-gradient(180deg, var(--accent) 0%, #FF8C40 100%)', borderRadius: '4px', boxShadow: '0 0 8px rgba(242, 78, 7, 0.4)' }} />
          <h3 style={{ fontSize: '1.375rem', margin: 0, fontFamily: 'var(--font-brand)', fontWeight: 400, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>나의 습관 캘린더</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.75rem' }}>
          <div style={{ 
            padding: '1.5rem 1rem', 
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)', 
            borderRadius: '1.25rem', 
            textAlign: 'center',
            boxShadow: '0 10px 24px rgba(242, 78, 7, 0.08), inset 0 2px 4px rgba(255,255,255,0.8)',
            border: '1px solid rgba(242, 78, 7, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'default'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(242, 78, 7, 0.12)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(242, 78, 7, 0.08)'; }}>
            <p style={{ position: 'relative', margin: '0 0 0.5rem 0', fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>🔥 완료한 날</p>
            <p style={{ position: 'relative', margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-brand)', lineHeight: 1, textShadow: '0 2px 8px rgba(242, 78, 7, 0.2)' }}>{completionCount}<span style={{fontSize:'1rem', fontWeight:600, marginLeft:'4px', color:'var(--text-secondary)'}}>일</span></p>
            <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', background:'var(--accent)', opacity:'0.06', borderRadius:'50%', filter:'blur(10px)' }} />
          </div>
          <div style={{ 
            padding: '1.5rem 1rem', 
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)', 
            borderRadius: '1.25rem', 
            textAlign: 'center', 
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.04), inset 0 2px 4px rgba(255,255,255,0.8)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'default'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.06)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.04)'; }}>
            <p style={{ position: 'relative', margin: '0 0 0.5rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>⚡️ 총 반복</p>
            <p style={{ position: 'relative', margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-brand)', lineHeight: 1 }}>{totalReps}<span style={{fontSize:'1rem', fontWeight:600, marginLeft:'4px', color:'var(--text-secondary)'}}>회</span></p>
            <div style={{ position:'absolute', bottom:'-20px', left:'-20px', width:'80px', height:'80px', background:'var(--text-secondary)', opacity:'0.03', borderRadius:'50%', filter:'blur(10px)' }} />
          </div>
        </div>
        
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <MonthlyCalendar stats={stats} />
        </div>
      </section>

      <section style={{ position: 'relative', marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '4px', height: '1.375rem', background: 'linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%)', borderRadius: '4px', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }} />
            <h3 style={{ fontSize: '1.375rem', margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }}>오늘의 목표</h3>
          </div>
          {goal && (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ 
                background: 'rgba(0,0,0,0.04)', 
                border: 'none', 
                fontSize: '0.875rem', 
                padding: '0.4rem 0.875rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              수정
            </button>
          )}
        </div>
        
        {targetDateInfo && (
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', padding: '0 0.25rem' }}>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem', 
              padding: '0.375rem 0.875rem', 
              background: 'linear-gradient(90deg, #202020 0%, #3a3a3a 100%)', 
              borderRadius: '2rem', 
              color: 'white', 
              fontWeight: 700,
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}>
              <span style={{ display:'block', width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#22c55e', boxShadow:'0 0 8px #22c55e' }}></span>
              Target Day: {targetDateInfo}
            </div>
          </div>
        )}

        {goal ? (
          <div style={{ 
            position: 'relative',
            padding: '2rem 1.75rem', 
            background: 'linear-gradient(145deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)', 
            borderRadius: '1.5rem', 
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
            overflow: 'hidden'
          }}>
            {/* Ambient Background Glow */}
            <div style={{ position:'absolute', top:'-40px', right:'-20px', width:'150px', height:'150px', background:'var(--accent)', opacity:'0.05', filter:'blur(40px)', borderRadius:'50%', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'-50px', left:'-30px', width:'200px', height:'200px', background:'var(--accent)', opacity:'0.04', filter:'blur(40px)', borderRadius:'50%', pointerEvents:'none' }} />
            
            <p style={{ 
              position: 'relative',
              margin: '0', 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #111111 0%, #555555 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.4, 
              wordBreak: 'keep-all',
              letterSpacing: '-0.03em',
              zIndex: 1
            }}>
              "{goal}"
            </p>
            <div style={{ position: 'relative', marginTop: '2.5rem', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Progress
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em' }}>{Math.floor(Math.min((count / targetReps) * 100, 100))}%</span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    ({count}/{targetReps})
                    </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '16px', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ 
                  width: `${Math.min((count / targetReps) * 100, 100)}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, var(--accent) 0%, #f77f3e 50%, #ff9d61 100%)', 
                  borderRadius: '8px',
                  transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(242, 78, 7, 0.4)'
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    transform: 'skewX(-20deg) translateX(-150%)',
                    animation: 'shimmer 2.5s infinite ease-in-out'
                  }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1.5rem',
            background: 'linear-gradient(145deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            borderRadius: '1.5rem',
            border: '2px dashed rgba(0,0,0,0.08)',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🎯</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.01em' }}>아직 설정된 목표가 없어요.</p>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '3rem',
                background: 'linear-gradient(135deg, #202020 0%, #404040 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
            >
              🚀 첫 목표 세우기
            </button>
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="card no-mobile-radius">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '4px', height: '1.125rem', backgroundColor: 'var(--text-primary)', borderRadius: '2px' }} />
            <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>히스토리</h3>
          </div>
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
        @keyframes shimmer {
          0% { transform: skewX(-20deg) translateX(-150%); }
          50% { transform: skewX(-20deg) translateX(150%); }
          100% { transform: skewX(-20deg) translateX(150%); }
        }
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
