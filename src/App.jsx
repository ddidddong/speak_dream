import React, { useState } from 'react';
import useGoalPersistence from './hooks/useGoalPersistence';
import GoalGenerator from './components/GoalGenerator';
import WorkArea from './components/WorkArea';
import MyPage from './components/MyPage';
import Info from './components/Info';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { goal, count, targetReps, stats, history, setGoal, incrementCount, resetGoal } = useGoalPersistence();
  const [activeTab, setActiveTab] = useState('work'); // 'work' or 'mypage'
  const { user, login, logout } = useAuth();
  const [hasStarted, setHasStarted] = useState(() => {
    // If there's already a goal, skip landing
    return !!goal;
  });

  if (!hasStarted && !goal) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <header style={{ 
        padding: '1rem 1.25rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{ 
          fontSize: '1.25rem', 
          fontFamily: 'var(--font-brand)', 
          color: 'var(--accent)',
          margin: 0,
          fontWeight: 400
        }}>
          SpeakDream
        </h1>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-light)' }} 
              />
            )}
            <button 
              onClick={logout}
              style={{ 
                background: 'none', 
                border: '1px solid var(--border)', 
                padding: '0.4rem 0.75rem', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border)', 
              padding: '0.4rem 0.85rem', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span style={{ fontSize: '1rem' }}>G</span> 로그인
          </button>
        )}
      </header>

      <p style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '0.875rem', padding: '0 1.25rem', color: 'var(--text-secondary)' }}>
        스픽드림: 무의식에 새기는 확언의 힘
      </p>

      <main>
        {activeTab === 'work' ? (
          <>
            {!goal ? (
              <GoalGenerator onSave={setGoal} />
            ) : (
              <WorkArea 
                goal={goal} 
                count={count} 
                targetReps={targetReps}
                onIncrement={incrementCount} 
                onReset={resetGoal} 
                onSaveGoal={setGoal}
              />
            )}
            <Info />
            <footer style={{ marginTop: '2rem', padding: '2rem 0', textAlign: 'center', opacity: 0.5 }}>
              <p style={{ fontSize: '0.75rem' }}>© 2026 SpeakDream. Always keep going.</p>
            </footer>
          </>
        ) : (
          <>
            <MyPage 
              goal={goal} 
              count={count}
              targetReps={targetReps}
              stats={stats} 
              history={history} 
              onSaveGoal={setGoal}
              onResetGoal={resetGoal}
            />
            <footer style={{ marginTop: '1rem', padding: '1rem', textAlign: 'center', opacity: 0.5 }}>
              <p style={{ fontSize: '0.75rem' }}>© 2026 SpeakDream. Always keep going.</p>
            </footer>
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        display: 'flex', 
        justifyContent: 'space-around', 
        padding: '0.75rem 0',
        borderTop: '1px solid var(--border)',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}>
        <button 
          onClick={() => setActiveTab('work')}
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeTab === 'work' ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>✍️</span>
          쓰기/녹음
        </button>
        <button 
          onClick={() => setActiveTab('mypage')}
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeTab === 'mypage' ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>📊</span>
          마이페이지
        </button>
      </nav>

      {/* Footer previously here - now inside main */}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
