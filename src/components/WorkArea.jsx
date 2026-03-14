import React, { useState, useEffect, useRef } from 'react';
import GoalGenerator from './GoalGenerator';

export default function WorkArea({ goal, count, targetReps = 100, onIncrement, onReset, onSaveGoal }) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const goalRef = useRef(goal);
  
  useEffect(() => {
    goalRef.current = goal;
  }, [goal]);

  const handleSaveGoal = (newGoal, newTargetReps) => {
    onSaveGoal(newGoal, newTargetReps);
    setIsEditing(false);
  };

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

  if (isEditing) {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-out', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-brand)', fontWeight: 400, color: 'var(--accent)' }}>목표 수정하기</h2>
          <button 
            onClick={() => setIsEditing(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}
          >
            취소
          </button>
        </div>
        <GoalGenerator onSave={handleSaveGoal} />
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '1.25rem', padding: '0.5rem' }}>
      {/* Target Sentence Card */}
      <div style={{ 
        position: 'relative',
        padding: '1.5rem 1.75rem', 
        background: 'linear-gradient(135deg, rgba(235, 76, 60, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)', 
        borderRadius: '1.25rem', 
        borderLeft: '4px solid var(--accent)',
        boxShadow: '0 8px 32px rgba(222, 72, 58, 0.08), inset 0 2px 4px rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Glow behind the text */}
        <div style={{ position:'absolute', top:'-30px', left:'-20px', width:'120px', height:'120px', background:'var(--accent)', opacity:'0.06', filter:'blur(30px)', borderRadius:'50%', pointerEvents:'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ display:'block', width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'var(--accent)', boxShadow:'0 0 8px rgba(222, 72, 58, 0.6)' }}></span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent)', margin: 0, letterSpacing: '0.02em', textTransform: 'uppercase' }}>오늘의 목표</p>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            style={{ 
              background: 'rgba(0,0,0,0.03)', 
              border: 'none', 
              fontSize: '0.875rem', 
              padding: '0.3rem',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              marginTop: '-0.25rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'rotate(15deg)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'rotate(0deg)'; }}
            title="목표 수정"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
          </button>
        </div>
        <h2 style={{ 
          position: 'relative',
          fontSize: '1.4rem', 
          lineHeight: 1.5, 
          wordBreak: 'keep-all', 
          margin: 0,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #111111 0%, #555555 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
          zIndex: 1
        }}>{goal}</h2>
      </div>

      <div style={{ 
        background: isRecording 
          ? 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1506744626753-14074211516e?auto=format&fit=crop&q=80&w=1000") center/cover no-repeat'
          : '#ffffff',
        borderRadius: '1.5rem',
        padding: '2rem 1.5rem',
        border: isRecording ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isRecording 
          ? '0 24px 48px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)' 
          : '0 16px 40px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.8)',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', transition: 'color 0.5s ease' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', color: isRecording ? 'rgba(255,255,255,0.9)' : 'inherit', transition: 'color 0.5s ease' }}>진행률</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
            <span style={{ fontWeight: 900, color: isRecording ? '#ffffff' : 'var(--accent)', fontSize: '1.5rem', letterSpacing: '-0.03em', transition: 'color 0.5s ease' }}>{count}</span>
            <span style={{ color: isRecording ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 600, transition: 'color 0.5s ease' }}>/ {targetReps}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ height: '14px', backgroundColor: isRecording ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.04)', borderRadius: '7px', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)', transition: 'background-color 0.5s ease' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${progress}%`, 
              background: 'linear-gradient(90deg, var(--accent) 0%, #ff6b6b 50%, #ff8e53 100%)', 
              borderRadius: '7px',
              transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(222, 72, 58, 0.4)'
            }} 
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              transform: 'skewX(-20deg) translateX(-150%)',
              animation: 'shimmer 2.5s infinite ease-in-out'
            }} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ minHeight: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {feedback ? (
              <p style={{ 
                margin: 0, 
                fontSize: '1.0625rem', 
                color: feedback.includes('성공') ? (isRecording ? '#4ade80' : 'var(--accent)') : (isRecording ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)'), 
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: feedback.includes('성공') ? (isRecording ? 'rgba(74, 222, 128, 0.15)' : 'var(--accent-light)') : (isRecording ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'),
                padding: '0.4rem 1rem',
                borderRadius: '2rem',
                animation: 'fadeInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transition: 'all 0.5s ease'
              }}>
                {feedback}
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: '0.9375rem', color: isRecording ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', fontWeight: 600, letterSpacing: '-0.01em', transition: 'color 0.5s ease' }}>
                {isRecording ? "소리내어 목표를 선언해보세요" : "마이크를 누르고 말하거나, 아래에 입력하세요"}
              </p>
            )}
          </div>

          {/* Voice Input Button */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            {/* Pulsing indicator behind button */}
            {isRecording && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                background: 'var(--accent)',
                borderRadius: '50%',
                opacity: 0.2,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
              }} />
            )}
            <button
              onClick={toggleRecording}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: isRecording 
                  ? 'linear-gradient(135deg, var(--accent) 0%, #ff5e5e 100%)' 
                  : 'linear-gradient(135deg, #ffffff 0%, #f4f4f4 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isRecording ? 'white' : 'var(--text-primary)',
                boxShadow: isRecording 
                  ? '0 12px 32px rgba(222, 72, 58, 0.4), inset 0 -4px 8px rgba(0,0,0,0.1)' 
                  : '0 8px 24px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.8), border 1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                zIndex: 2,
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { 
                if (!isRecording) {
                  e.currentTarget.style.transform = 'translateY(-4px)'; 
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                }
              }}
              onMouseOut={(e) => { 
                if (!isRecording) {
                  e.currentTarget.style.transform = 'translateY(0)'; 
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                }
              }}
            >
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isRecording ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                )}
              </span>
            </button>
          </div>

          {!isRecording && (
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="직접 문장을 입력할 수도 있어요!"
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                border: '2px solid rgba(0,0,0,0.04)', 
                backgroundColor: '#faf9f8',
                fontSize: '1.0625rem',
                outline: 'none',
                textAlign: 'center',
                fontWeight: 500,
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(222, 72, 58, 0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.backgroundColor = '#faf9f8'; e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
            />
          )}
        </div>

        {/* Session Log */}
        {!isRecording && sessionHistory.length > 0 && (
          <div style={{ marginTop: '2.5rem', textAlign: 'left', animation: 'fadeIn 0.4s ease-out' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>실시간 기록</h4>
            <div style={{ 
              maxHeight: '160px', 
              overflowY: 'auto', 
              display: 'grid', 
              gap: '0.625rem',
              paddingRight: '0.5rem',
              scrollbarWidth: 'thin'
            }}>
              {sessionHistory.map((item, i) => (
                <div key={i} style={{ 
                  fontSize: '0.9375rem', 
                  color: 'var(--text-primary)',
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: '0.75rem',
                  alignItems: 'flex-start',
                  border: '1px solid rgba(0,0,0,0.03)',
                  animation: i === 0 ? 'slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
                }}>
                  <span style={{ color: 'white', backgroundColor: 'var(--accent)', borderRadius: '1rem', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 800 }}>{item.count}</span>
                  <span style={{ lineBreak: 'anywhere', fontWeight: 500, lineHeight: 1.4 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isRecording && (
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={onReset}
              style={{ 
                background: 'rgba(0,0,0,0.04)', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem', 
                padding: '0.5rem 1.25rem',
                borderRadius: '2rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(222, 72, 58, 0.1)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
              기록 초기화
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
