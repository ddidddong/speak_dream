import React from 'react';

export default function LandingPage({ onStart }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '2rem',
      textAlign: 'center',
      animation: 'fadeIn 0.8s ease-out'
    }}>
      <div style={{ maxWidth: '400px', width: '100%', marginBottom: '2rem' }}>
        <img 
          src="./landing-hero.png" 
          alt="SpeakDream Hero" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(222, 72, 58, 0.1)'
          }} 
        />
      </div>

      <h1 style={{ 
        fontSize: '2.5rem', 
        lineHeight: 1.2, 
        marginBottom: '1rem',
        wordBreak: 'keep-all',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-brand)',
        fontWeight: 400
      }}>
        SpeakDream<br/>
        <span style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'block', marginTop: '0.5rem' }}>스픽드림: 꿈을 현실로</span>
      </h1>
      
      <p style={{ 
        fontSize: '1.125rem', 
        color: 'var(--text-secondary)', 
        marginBottom: '3rem',
        wordBreak: 'keep-all'
      }}>
        매일 100번의 확언을 통해<br/>
        당신의 꿈을 현실로 만드세요.
      </p>

      <button 
        onClick={onStart}
        className="btn-primary"
        style={{ 
          width: '100%', 
          maxWidth: '300px', 
          padding: '1.25rem',
          fontSize: '1.125rem',
          boxShadow: '0 4px 14px 0 rgba(222, 72, 58, 0.39)',
          borderRadius: '2rem'
        }}
      >
        지금 시작하기
      </button>

      <footer style={{ marginTop: '4rem', opacity: 0.5, fontSize: '0.75rem' }}>
        기록된 모든 데이터는 브라우저에 안전하게 저장됩니다.
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
