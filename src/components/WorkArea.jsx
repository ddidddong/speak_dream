import React, { useState, useEffect, useRef } from 'react';

export default function WorkArea({ goal, count, onIncrement, onReset }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (input.trim() === goal) {
        onIncrement();
        setInput('');
      } else {
        // Optional: Provide feedback if it doesn't match?
        // For now, let's be strict but encouraging.
        alert('문장을 정확하게 입력해주세요.');
      }
    }
  };

  const progress = (count / 100) * 100;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Sticky Header */}
      <div className="card" style={{ position: 'sticky', top: '1rem', zIndex: 10, borderLeft: '4px solid var(--accent)' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.5rem' }}>오늘의 목표 문장</p>
        <h2 style={{ fontSize: '1.5rem', lineHeight: 1.3 }}>{goal}</h2>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>진행률</h3>
          <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{count} / 100</span>
        </div>
        
        {/* Progress Bar */}
        <div style={{ height: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${progress}%`, 
              backgroundColor: 'var(--accent)', 
              transition: 'width 0.3s ease-out' 
            }} 
          />
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>아래에 문장을 똑같이 입력하고 Enter를 누르세요.</label>
          <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="목표 문장을 입력하세요..."
            autoFocus
            style={{ 
              width: '100%', 
              padding: '1.25rem', 
              borderRadius: 'var(--radius-md)', 
              border: '2px solid var(--border)', 
              fontSize: '1.125rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onReset}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem', 
              textDecoration: 'underline' 
            }}
          >
            목표 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
