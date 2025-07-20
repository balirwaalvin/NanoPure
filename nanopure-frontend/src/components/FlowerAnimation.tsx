import React, { useEffect } from 'react';

const petalColors = ['#63B3ED', '#2F855A', '#1A365D', '#FFD6E0', '#F7C873'];

const FlowerAnimation: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #f7fafc 100%)'
    }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        <g>
          {[...Array(8)].map((_, i) => (
            <ellipse
              key={i}
              cx="110"
              cy="60"
              rx="30"
              ry="70"
              fill={petalColors[i % petalColors.length]}
              opacity="0.7"
              transform={`rotate(${i * 45} 110 110)`}
              style={{
                transformOrigin: '110px 110px',
                animation: `petal-bloom 1.2s ${i * 0.1}s cubic-bezier(0.4,2,0.6,1) both`
              }}
            />
          ))}
          <circle cx="110" cy="110" r="38" fill="#FFD6E0" style={{ filter: 'blur(1px)' }} />
          <circle cx="110" cy="110" r="28" fill="#2F855A" />
          <circle cx="110" cy="110" r="16" fill="#fff" />
        </g>
        <style>{`
          @keyframes petal-bloom {
            0% { opacity: 0; transform: scale(0.2) rotate(var(--angle, 0deg)); }
            80% { opacity: 1; transform: scale(1.1) rotate(var(--angle, 0deg)); }
            100% { opacity: 0.7; transform: scale(1) rotate(var(--angle, 0deg)); }
          }
        `}</style>
      </svg>
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 32,
        color: '#2F855A',
        fontWeight: 700,
        textShadow: '0 2px 8px #fff',
        letterSpacing: 1
      }}>
        Welcome!
      </div>
    </div>
  );
};

export default FlowerAnimation; 