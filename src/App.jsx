import React, { useState } from 'react';
import useGoalPersistence from './hooks/useGoalPersistence';
import GoalGenerator from './components/GoalGenerator';
import WorkArea from './components/WorkArea';
import MyPage from './components/MyPage';
import Info from './components/Info';
import LandingPage from './components/LandingPage';

function App() {
  const { goal, count, stats, history, setGoal, incrementCount, resetGoal } = useGoalPersistence();
  const [view, setView] = useState('home'); // 'home' or 'mypage'
  const [hasStarted, setHasStarted] = useState(() => {
    // If there's already a goal, skip landing
    return !!goal;
  });

  if (!hasStarted && !goal) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ padding: '2rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 400, 
          color: 'var(--accent)', 
          fontFamily: 'var(--font-brand)',
          letterSpacing: '0.05em' 
        }}>
          SpeakDream
        </h1>
        <p style={{ marginTop: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
          스픽드림: 무의식에 새기는 확언의 힘
        </p>
      </header>

      <main style={{ padding: '0 0.5rem' }}>
        {view === 'home' ? (
          <>
            {!goal ? (
              <GoalGenerator onSave={setGoal} />
            ) : (
              <WorkArea 
                goal={goal} 
                count={count} 
                onIncrement={incrementCount} 
                onReset={resetGoal} 
              />
            )}
            <Info />
          </>
        ) : (
          <MyPage 
            goal={goal} 
            count={count}
            stats={stats} 
            history={history} 
            onReset={() => {
              resetGoal();
              setView('home');
            }} 
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'white', 
        display: 'flex', 
        justifyContent: 'space-around', 
        padding: '0.75rem 0',
        borderTop: '1px solid var(--border)',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}>
        <button 
          onClick={() => setView('home')}
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: view === 'home' ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        >
          <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>✍️</span>
          쓰기/녹음
        </button>
        <button 
          onClick={() => setView('mypage')}
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: view === 'mypage' ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        >
          <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>📊</span>
          마이페이지
        </button>
      </nav>

      <footer style={{ marginTop: '3rem', padding: '2rem 1rem', textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontSize: '0.75rem' }}>© 2026 SpeakDream. Always keep going.</p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
