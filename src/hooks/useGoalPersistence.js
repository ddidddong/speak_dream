import { useState, useEffect } from 'react';

const STORAGE_KEY = 'goal_100_data_v2';

export default function useGoalPersistence() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().split('T')[0];
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset daily count if it's a new day (but keep record in stats)
      const lastSessionDate = parsed.lastSessionDate || today;
      if (lastSessionDate !== today) {
        return {
          ...parsed,
          count: 0,
          lastSessionDate: today
        };
      }
      return parsed;
    }

    return {
      goal: '',
      count: 0,
      targetReps: 100,
      lastSessionDate: today,
      stats: {}, // { "2024-03-12": 100 }
      history: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setGoal = (newGoal, targetReps = 100) => {
    setData(prev => ({ ...prev, goal: newGoal, count: 0, targetReps }));
  };

  const incrementCount = () => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const newCount = prev.count + 1;
      const newStats = { ...prev.stats, [today]: newCount };
      
      let newHistory = prev.history;
      if (newCount === (prev.targetReps || 100)) {
        newHistory = [
          { date: new Date().toISOString(), goal: prev.goal },
          ...prev.history
        ].slice(0, 50);
      }
      
      return { 
        ...prev, 
        count: newCount, 
        stats: newStats,
        history: newHistory 
      };
    });
  };

  const resetGoal = () => {
    setData(prev => ({
      ...prev,
      goal: '',
      count: 0
    }));
  };

  return {
    goal: data.goal,
    count: data.count,
    targetReps: data.targetReps || 100,
    stats: data.stats,
    history: data.history,
    setGoal,
    incrementCount,
    resetGoal
  };
}
