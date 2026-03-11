import React, { useState } from 'react';

export default function GoalGenerator({ onSave }) {
  const [year, setYear] = useState('');
  const [goal, setGoal] = useState('');
  const [verb, setVerb] = useState('');

  const generatedSentence = `나는 ${year || '____'}년에 ${goal || '____'}${goal.endsWith('을') || goal.endsWith('를') ? '' : '을/를'} ${verb || '____'}하였다.`;

  const handleSave = () => {
    if (!year || !goal || !verb) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    // Clean up the grammar slightly if possible, but keep it simple
    let particle = '';
    const lastChar = goal.charCodeAt(goal.length - 1);
    const hasBatchim = (lastChar - 0xAC00) % 28 !== 0;
    particle = hasBatchim ? '을' : '를';
    
    const finalSentence = `나는 ${year}년에 ${goal}${particle} ${verb}하였다.`;
    onSave(finalSentence);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>목표 문장 만들기</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>목표 연도</label>
          <input 
            type="text" 
            placeholder="예: 2026" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>목표 (명사형)</label>
          <input 
            type="text" 
            placeholder="예: 연수입 10억" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>동사 (과거형)</label>
          <input 
            type="text" 
            placeholder="예: 달성" 
            value={verb}
            onChange={(e) => setVerb(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
          />
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>* '하였다'가 자동으로 붙습니다. (예: '달성' 입력 시 '달성하였다')</p>
        </div>
        
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--accent)', textAlign: 'center' }}>
            {generatedSentence}
          </p>
        </div>

        <button 
          onClick={handleSave}
          style={{ 
            marginTop: '1rem', 
            backgroundColor: 'var(--accent)', 
            color: 'white', 
            border: 'none', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            fontWeight: 600 
          }}
        >
          이 목표로 시작하기
        </button>
      </div>
    </div>
  );
}
