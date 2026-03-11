import React from 'react';
import useGoalPersistence from './hooks/useGoalPersistence';
import GoalGenerator from './components/GoalGenerator';
import WorkArea from './components/WorkArea';
import History from './components/History';
import Info from './components/Info';

function App() {
  const { goal, count, history, setGoal, incrementCount, resetGoal } = useGoalPersistence();

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.025em' }}>
          Goal 100
        </h1>
        <p style={{ marginTop: '0.5rem', fontWeight: 500 }}>
          목표를 무의식에 새기는 100번의 반복
        </p>
      </header>

      <main>
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

        <History history={history} />
        <Info />
      </main>

      <footer style={{ marginTop: '5rem', paddingBottom: '3rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <p style={{ fontSize: '0.875rem' }}>© 2026 Goal 100. 미래를 만드는 가장 확실한 방법.</p>
      </footer>
    </div>
  );
}

export default App;
