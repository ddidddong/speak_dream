import React, { useState } from 'react';
import useGoalPersistence from './hooks/useGoalPersistence';
import GoalGenerator from './components/GoalGenerator';
import WorkArea from './components/WorkArea';
import MyPage from './components/MyPage';
import Info from './components/Info';

function App() {
  const { goal, count, stats, history, setGoal, incrementCount, resetGoal } = useGoalPersistence();
  const [view, setView] = useState('home'); // 'home' or 'mypage'

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.025em' }}>
          Goal 100
        </h1>
        <p style={{ marginTop: '0.5rem', fontWeight: 500 }}>
          목표를 무의식에 새기는 100번의 반복
        </p>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setView('home')}
          style={{ 
            padding: '0.5rem 1.5rem', 
            borderRadius: '2rem', 
            border: 'none',
            backgroundColor: view === 'home' ? 'var(--accent)' : 'var(--bg-primary)',
            color: view === 'home' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          쓰기
        </button>
        <button 
          onClick={() => setView('mypage')}
          style={{ 
            padding: '0.5rem 1.5rem', 
            borderRadius: '2rem', 
            border: 'none',
            backgroundColor: view === 'mypage' ? 'var(--accent)' : 'var(--bg-primary)',
            color: view === 'mypage' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          마이페이지
        </button>
      </nav>

      <main>
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
            stats={stats} 
            history={history} 
            onReset={() => {
              resetGoal();
              setView('home');
            }} 
          />
        )}
      </main>

      <footer style={{ marginTop: '5rem', paddingBottom: '3rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <p style={{ fontSize: '0.875rem' }}>© 2026 Goal 100. 미래를 만드는 가장 확실한 방법.</p>
      </footer>
    </div>
  );
}

export default App;
