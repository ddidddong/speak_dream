import React, { useState } from 'react';

export default function GoalGenerator({ onSave }) {
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [goal, setGoal] = useState('');
  const [verb, setVerb] = useState('');
  const [freeSentence, setFreeSentence] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '____년 __월 __일';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const generatedSentence = isFreeMode 
    ? freeSentence || '자유롭게 목표 문장을 입력해주세요.'
    : `나는 ${formatDate(targetDate)}에 ${goal || '____'}${goal.endsWith('을') || goal.endsWith('를') ? '' : '을/를'} ${verb || '____'}하였다.`;

  const handleSave = () => {
    if (isFreeMode) {
      if (!freeSentence.trim()) {
        alert('목표 문장을 입력해주세요.');
        return;
      }
      onSave(freeSentence.trim());
    } else {
      if (!targetDate || !goal || !verb) {
        alert('모든 필드를 입력해주세요.');
        return;
      }
      let particle = '';
      const lastChar = goal.charCodeAt(goal.length - 1);
      const hasBatchim = (lastChar - 0xAC00) % 28 !== 0;
      particle = hasBatchim ? '을' : '를';
      
      const finalSentence = `나는 ${formatDate(targetDate)}에 ${goal}${particle} ${verb}하였다.`;
      onSave(finalSentence);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>목표 문장 만들기</h2>
        <button 
          onClick={() => setIsFreeMode(!isFreeMode)}
          style={{ 
            fontSize: '0.75rem', 
            padding: '0.4rem 0.8rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border)',
            backgroundColor: isFreeMode ? 'var(--accent-light)' : 'transparent',
            color: isFreeMode ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: 600
          }}
        >
          {isFreeMode ? '템플릿 모드' : '자유 문장'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {!isFreeMode ? (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>목표 달성 날짜</label>
              <input 
                type="date" 
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'white' }}
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
          </>
        ) : (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>자유 문장 입력</label>
            <textarea 
              placeholder="직접 문장을 입력해주세요. (예: 나는 매일 성장하고 있다.)" 
              value={freeSentence}
              onChange={(e) => setFreeSentence(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', height: '100px', resize: 'none' }}
            />
          </div>
        )}
        
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
