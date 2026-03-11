import { useState, useEffect } from 'react';

const STORAGE_KEY = 'goal_100_data';

export default function useGoalPersistence() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      goal: '',
      count: 0,
      history: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setGoal = (newGoal) => {
    setData(prev => ({ ...prev, goal: newGoal, count: 0 }));
  };

  const incrementCount = () => {
    setData(prev => {
      const newCount = prev.count + 1;
      if (newCount >= 100) {
        // Achievement unlocked!
        const newHistory = [
          { date: new Date().toISOString(), goal: prev.goal },
          ...prev.history
        ].slice(0, 50); // Keep last 50
        return { ...prev, count: 0, history: newHistory };
      }
      return { ...prev, count: newCount };
    });
  };

  const resetGoal = () => {
    setData({
      goal: '',
      count: 0,
      history: data.history
    });
  };

  return {
    goal: data.goal,
    count: data.count,
    history: data.history,
    setGoal,
    incrementCount,
    resetGoal
  };
}
