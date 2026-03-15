import React, { useState } from 'react';

export default function GoalGenerator({ onSave }) {
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [goal, setGoal] = useState('');
  const [verb, setVerb] = useState('');
  const [freeSentence, setFreeSentence] = useState('');
  const [targetReps, setTargetReps] = useState(100);
  const [customReps, setCustomReps] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const presets = [100, 21, 50, 300];

  const formatDate = (dateStr) => {
    if (!dateStr) return '____년 __월 __일';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const generatedSentence = isFreeMode 
    ? freeSentence || ''
    : (!targetDate && !goal && !verb) 
      ? '' 
      : `나는 ${formatDate(targetDate)}에 ${goal || '____'}${goal.endsWith('을') || goal.endsWith('를') ? '' : '을/를'} ${verb || '____'}하였다.`;

  const handleSave = () => {
    const finalReps = isCustomMode ? parseInt(customReps, 10) : targetReps;

    if (isCustomMode && (isNaN(finalReps) || finalReps <= 0)) {
      alert('유효한 목표 횟수를 입력해주세요.');
      return;
    }

    if (isFreeMode) {
      if (!freeSentence.trim()) {
        alert('목표 문장을 입력해주세요.');
        return;
      }
      onSave(freeSentence.trim(), finalReps);
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
      onSave(finalSentence, finalReps);
    }
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>목표 문장 만들기</h2>
          <button 
            onClick={() => setShowGuide(true)}
            style={{ 
              background: 'var(--bg-secondary)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            title="목표 작성 가이드"
          >
            ?
          </button>
        </div>
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
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'var(--bg-primary)' }}
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

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>일일 목표 횟수</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {presets.map(num => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setTargetReps(num);
                setIsCustomMode(false);
              }}
              style={{
                flex: 1,
                minWidth: '60px',
                padding: '0.6rem 0',
                borderRadius: '0.5rem',
                border: `2px solid ${targetReps === num && !isCustomMode ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: targetReps === num && !isCustomMode ? 'var(--accent-light)' : 'var(--bg-primary)',
                color: targetReps === num && !isCustomMode ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              {num}회
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCustomMode(true)}
            style={{
              flex: 1,
              minWidth: '60px',
              padding: '0.6rem 0',
              borderRadius: '0.5rem',
              border: `2px solid ${isCustomMode ? 'var(--accent)' : 'var(--border)'}`,
              backgroundColor: isCustomMode ? 'var(--accent-light)' : 'var(--bg-primary)',
              color: isCustomMode ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            직접 입력
          </button>
        </div>

        {isCustomMode && (
          <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.2s ease-out' }}>
            <input 
              type="number"
              value={customReps}
              onChange={(e) => setCustomReps(e.target.value)}
              placeholder="예: 150"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--accent)', 
                fontSize: '1rem',
                outline: 'none',
                textAlign: 'center'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', textAlign: 'center' }}>
              원하는 목표 횟수를 숫자로 입력해주세요.
            </p>
          </div>
        )}
        </div>
        
        {generatedSentence && (
          <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--accent)', textAlign: 'center', fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
              {generatedSentence}
            </p>
          </div>
        )}

        <button 
          onClick={handleSave}
          style={{ 
            marginTop: '0.5rem', 
            backgroundColor: 'var(--accent)', 
            color: 'white', 
            border: 'none', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            fontWeight: 700 
          }}
        >
          이 목표로 시작하기
        </button>
      </div>

      {showGuide && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(4px)',
          zIndex: 9999, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ 
            background: 'var(--bg-primary)', 
            borderRadius: '1.5rem', 
            padding: '2rem', 
            maxWidth: '400px', 
            width: '90%', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            transform: 'translateY(0)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowGuide(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent)' }}>💡 목표 작성 가이드</h3>
            <p style={{ marginBottom: '1rem', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              효과적인 각인을 위해 다음 공식을 따라 문장을 만들어보세요.
            </p>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)', marginBottom: '1rem' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>
                나는 + [날짜] + [목표] + [과거형 문장]
              </p>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              예: "나는 2026년 12월 31일에 연수입 10억을 달성하였다."
            </p>

            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>🧠 왜 100번 반복해서 쓰는가?</h3>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              이 행동의 목적은 <strong>목표를 반복적으로 쓰고 읽으며 무의식에 목표를 각인</strong>하기 위함입니다.
            </p>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              반복은 뇌가 해당 목표를 매우 중요한 정보로 인식하게 만듭니다. 이를 통해 우리의 행동과 선택이 자연스럽게 목표 중심으로 변화하도록 돕는 강력한 심리적 도구입니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
