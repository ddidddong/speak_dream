import React, { useState, useEffect, useRef } from 'react';

export default function WorkArea({ goal, count, targetReps = 100, onIncrement, onReset }) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
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

  // Levenshtein distance for fuzzy matching
  const getLevenshteinDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const calculateSimilarity = (s1, s2) => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - getLevenshteinDistance(longer, shorter)) / longer.length;
  };

  const processResult = (text) => {
    const normalize = (str) => {
      if (!str) return '';
      return str
        .replace(/\s+/g, '')
        .replace(/[.?!,]/g, '')
        .replace(/[~`@#$%^&*()_+={}\[\]|\\:;"'<>,/]/g, '')
        .trim();
    };
    
    const normalizedGoal = normalize(goalRef.current);
    const normalizedInput = normalize(text);
    const similarity = calculateSimilarity(normalizedInput, normalizedGoal);

    // 80% similarity or inclusion match
    if (similarity >= 0.8 || normalizedInput.includes(normalizedGoal) || normalizedGoal.includes(normalizedInput)) {
      const nextCount = count + 1;
      onIncrement();
      setSessionHistory(prev => [{ text: goalRef.current, count: nextCount }, ...prev].slice(0, 10));
      setFeedback(`${nextCount}번째 성공! 기록되었습니다.`);
      setTimeout(() => setFeedback(''), 1500);
    } else {
      setFeedback(`인식 결과: "${text}" (80% 이상 일치해야 합니다)`);
      setTimeout(() => setFeedback(''), 4000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const normalize = (str) => str.replace(/\s+/g, '').replace(/[.?!,]/g, '').trim();
      const similarity = calculateSimilarity(normalize(input), normalize(goal));

      if (similarity >= 0.8) {
        const nextCount = count + 1;
        onIncrement();
        setSessionHistory(prev => [{ text: goal, count: nextCount }, ...prev].slice(0, 10));
        setInput('');
        setFeedback(`${nextCount}번째 성공! 기록되었습니다.`);
        setTimeout(() => setFeedback(''), 1000);
      } else {
        setFeedback('문장을 정확하게 입력해주세요 (80% 이상 일치 필요).');
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

  const progress = (count / targetReps) * 100;

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
          <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.125rem' }}>{count} <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/ {targetReps}</span></span>
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
          <div style={{ minHeight: '1.5rem', marginBottom: '0.5rem' }}>
            {feedback ? (
              <p style={{ 
                margin: 0, 
                fontSize: '1rem', 
                color: feedback.includes('성공') ? 'var(--accent)' : 'var(--text-secondary)', 
                fontWeight: 700,
                fontFamily: 'var(--font-brand)'
              }}>
                {feedback}
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                말하기 또는 아래에 직접 입력
              </p>
            )}
          </div>

          {/* Voice Input Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
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

        {/* Session Log */}
        {sessionHistory.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>최근 기록</h4>
            <div style={{ 
              maxHeight: '120px', 
              overflowY: 'auto', 
              display: 'grid', 
              gap: '0.5rem',
              paddingRight: '0.5rem'
            }}>
              {sessionHistory.map((item, i) => (
                <div key={i} style={{ 
                  fontSize: '0.8125rem', 
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '0.4rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{item.count}.</span>
                  <span style={{ lineBreak: 'anywhere' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
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
