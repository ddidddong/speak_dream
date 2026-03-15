import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_STORAGE_KEY = 'goal_100_data_v2';

export default function useGoalPersistence() {
  const { user } = useAuth();
  
  // Use a different storage key per user, or a general guest key if not logged in
  const STORAGE_KEY = user ? `${BASE_STORAGE_KEY}_${user.uid}` : `${BASE_STORAGE_KEY}_guest`;

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().split('T')[0];
    
    // When no user is logged in, force a fresh state so they don't see old cached data
    if (!user) {
      return {
        goal: '',
        count: 0,
        targetReps: 100,
        lastSessionDate: today,
        stats: {}, 
        history: []
      };
    }

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
      stats: {}, 
      history: []
    };
  });

  // Re-read from storage when the user or storage key changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!user) {
      setData({
        goal: '',
        count: 0,
        targetReps: 100,
        lastSessionDate: today,
        stats: {}, 
        history: []
      });
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const lastSessionDate = parsed.lastSessionDate || today;
      if (lastSessionDate !== today) {
        setData({
          ...parsed,
          count: 0,
          lastSessionDate: today
        });
      } else {
        setData(parsed);
      }
    } else {
      setData({
        goal: '',
        count: 0,
        targetReps: 100,
        lastSessionDate: today,
        stats: {}, 
        history: []
      });
    }
  }, [STORAGE_KEY, user]);

  useEffect(() => {
    // Only save to local storage if user is logged in
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, STORAGE_KEY, user]);

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
