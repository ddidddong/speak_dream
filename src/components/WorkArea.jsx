import React, { useState, useEffect, useRef } from 'react';

export default function WorkArea({ goal, count, onIncrement, onReset }) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const goalRef = useRef(goal);
  
  useEffect(() => {
    goalRef.current = goal;
  }, [goal]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ko-KR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setFeedback('듣고 있습니다... 말씀해 주세요.');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processResult(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        setIsRecording(false);
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setFeedback('마이크 권한이 필요합니다.');
        } else {
          setFeedback('음성 인식 중 오류가 발생했습니다.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const processResult = (text) => {
    // Robust normalization for Korean comparison
    const normalize = (str) => {
      if (!str) return '';
      return str
        .replace(/\s+/g, '') // Remove all whitespace
        .replace(/[.?!,]/g, '') // Remove punctuation
        .replace(/[~`@#$%^&*()_+={}\[\]|\\:;"'<>,/]/g, '') // Remove special chars
        .trim();
    };
    
    const normalizedGoal = normalize(goalRef.current);
    const normalizedInput = normalize(text);

    if (normalizedInput === normalizedGoal || normalizedInput.includes(normalizedGoal) || normalizedGoal.includes(normalizedInput)) {
      onIncrement();
      setFeedback('성공! 기록되었습니다.');
      setTimeout(() => setFeedback(''), 1500);
    } else {
      setFeedback(`인식 결과: "${text}" (다시 시도해 보세요)`);
      setTimeout(() => setFeedback(''), 4000);
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
        alert('이 브라우저는 음성 인식을 지원하지 않습니다. 크롬 브라우저 사용을 권장합니다.');
        return;
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        recognitionRef.current.stop();
      }
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
              className={isRecording ? 'pulse' : ''}
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
                boxShadow: isRecording ? '0 0 20px rgba(222, 72, 58, 0.4)' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                {isRecording ? '■' : '🎤'}
              </span>
            </button>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>말하기 또는 아래에 직접 입력</p>

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

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(222, 72, 58, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(222, 72, 58, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(222, 72, 58, 0); }
        }
        .pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
