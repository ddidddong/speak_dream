import React from 'react';

export default function Info() {
  return (
    <div style={{ display: 'grid', gap: '2rem', marginTop: '3rem' }}>
      <section className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>💡 목표 작성 가이드</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          효과적인 각인을 위해 다음 공식을 따라 문장을 만들어보세요.
        </p>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1.125rem', color: 'var(--accent)' }}>
            나는 + [날짜] + [목표] + [과거형 문장]
          </p>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          예: "나는 2026년 12월 31일에 연수입 10억을 달성하였다."
        </p>
      </section>

      <section className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>🧠 왜 100번 반복해서 쓰는가?</h3>
        <p>
          이 행동의 목적은 <strong>목표를 반복적으로 쓰고 읽으며 무의식에 목표를 각인</strong>하기 위함입니다.
        </p>
        <p>
          반복은 뇌가 해당 목표를 매우 중요한 정보로 인식하게 만듭니다. 이를 통해 우리의 행동과 선택이 자연스럽게 목표 중심으로 변화하도록 돕는 강력한 심리적 도구입니다.
        </p>
        <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
          "생각이 머물고 에너지가 집중되는 곳에 실체가 나타납니다."
        </p>
      </section>
    </div>
  );
}
