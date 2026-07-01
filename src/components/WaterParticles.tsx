import { useMemo } from 'react';

export default function WaterParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 12,
      drift: Math.random() * 60 - 30,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <style>{`
        .water-particle {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(180,220,255,0.5) 40%, transparent 70%);
          animation: water-float var(--dur) ease-in-out var(--del) infinite;
        }
        @keyframes water-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          8% { opacity: 0.9; }
          85% { opacity: 0.5; }
          100% {
            transform: translateY(calc(-100vh - 40px)) translateX(var(--drift));
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="water-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: `0 0 ${p.size * 3}px rgba(180,220,255,0.6)`,
            ['--drift' as string]: `${p.drift}px`,
            ['--dur' as string]: `${p.duration}s`,
            ['--del' as string]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
