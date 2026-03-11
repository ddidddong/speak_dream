import React, { useState, useEffect, useRef } from 'react';

export default function WorkArea({ goal, count, onIncrement, onReset }) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ko-KR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processResult(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        setFeedback('음성 인식 중 오류가 발생했습니다.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const processResult = (text) => {
    // Basic normalization for comparison
    const normalizedGoal = goal.replace(/\s/g, '').replace(/[.?!,]/g, '');
    const normalizedInput = text.replace(/\s/g, '').replace(/[.?!,]/g, '');

    if (normalizedInput === normalizedGoal) {
      onIncrement();
      setFeedback('성공! 잘하셨어요.');
      setTimeout(() => setFeedback(''), 1500);
    } else {
      setFeedback(`다시 말씀해 보세요: "${text}"`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (input.trim() === goal) {
        onIncrement();
        setInput('');
        setFeedback('기록되었습니다.');
        setTimeout(() => setFeedback(''), 1000);
      } else {
        setFeedback('문장을 정확하게 입력해주세요.');
        setTimeout(() => setFeedback(''), 3000);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
        return;
      }
      setFeedback('듣고 있습니다...');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const progress = (count / 100) * 100;

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {/* Target Sentence Card */}
      <div className="card no-mobile-radius" style={{ borderLeft: '4px solid var(--accent)', paddingBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>오늘의 목표</p>
        <h2 style={{ fontSize: '1.25rem', lineHeight: 1.4, wordBreak: 'keep-all' }}>{goal}</h2>
      </div>

      <div className="card no-mobile-radius">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem' }}>진행률</h3>
          <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.125rem' }}>{count} <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/ 100</span></span>
        </div>
        
        {/* Progress Bar */}
        <div style={{ height: '0.5rem', backgroundColor: 'var(--accent-light)', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${progress}%`, 
              backgroundColor: 'var(--accent)', 
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} 
          />
        </div>

        <div style={{ display: 'grid', gap: '1rem', textAlign: 'center' }}>
          <div style={{ height: '1.5rem', marginBottom: '0.5rem' }}>
            {feedback && <p style={{ margin: 0, fontSize: '0.875rem', color: isRecording ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 500 }}>{feedback}</p>}
          </div>

          {/* Voice Input Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <button
              onClick={toggleRecording}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: isRecording ? 'var(--accent)' : 'var(--bg-secondary)',
                border: `2px solid ${isRecording ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isRecording ? 'white' : 'var(--accent)',
                fontSize: '1.5rem',
                boxShadow: isRecording ? '0 0 15px var(--accent)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {isRecording ? '●' : '🎤'}
            </button>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>또는 아래에 직접 입력하세요</p>

          <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="문장을 입력하세요..."
            style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)', 
              fontSize: '1rem',
              outline: 'none',
              textAlign: 'center'
            }}
          />
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={onReset}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '0.8125rem', 
              textDecoration: 'none',
              opacity: 0.7
            }}
          >
            문장 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
