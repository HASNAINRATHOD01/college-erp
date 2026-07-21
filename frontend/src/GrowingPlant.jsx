import React from 'react';

/**
 * GrowingPlant Component
 * @param {string} role - 'admin' | 'faculty' | 'student'
 * @param {boolean} collapsed - whether the sidebar containing it is collapsed
 */
export default function GrowingPlant({ role = 'faculty', collapsed = false }) {
  // Define flower colors based on role
  let flowerColor1 = '#ff7675'; // Faculty: Pink
  let flowerColor2 = '#ffffff'; // Faculty: White
  
  if (role === 'admin') {
    flowerColor1 = '#a29bfe'; // Admin: Purple
    flowerColor2 = '#ffbe76'; // Admin: Coral/Orange
  } else if (role === 'student') {
    flowerColor1 = '#ef4444'; // Student: Red
    flowerColor2 = '#f97316'; // Student: Orange
  }

  return (
    <div 
      className={`growing-plant-wrapper ${collapsed ? 'collapsed' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px',
        margin: '15px auto 5px auto',
        width: '100%',
        transition: 'all 0.3s ease',
        position: 'relative',
        pointerEvents: 'none',
      }}
    >
      <style>{`
        /* Scaled down dimensions for the vine */
        .plant-svg {
          width: ${collapsed ? '32px' : '60px'};
          height: ${collapsed ? '45px' : '85px'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
        }

        /* Animations */
        .pot {
          transform-origin: 50px 92px;
          animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .stem-main {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: growStem 2s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
        }

        .stem-branch {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
        }

        .branch-1 { animation: growStem 1s cubic-bezier(0.4, 0, 0.2, 1) 1s forwards; }
        .branch-2 { animation: growStem 1s cubic-bezier(0.4, 0, 0.2, 1) 1.2s forwards; }
        .branch-3 { animation: growStem 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1.4s forwards; }
        .branch-4 { animation: growStem 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1.6s forwards; }
        .branch-5 { animation: growStem 1s cubic-bezier(0.4, 0, 0.2, 1) 1.8s forwards; }
        .branch-6 { animation: growStem 1s cubic-bezier(0.4, 0, 0.2, 1) 2.0s forwards; }

        /* Leaves - inside/outside styling via fill/stroke */
        .leaf {
          transform: scale(0);
          animation: bloomLeaf 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .leaf-1 { transform-origin: 36px 76px; animation-delay: 1.4s; }
        .leaf-2 { transform-origin: 64px 62px; animation-delay: 1.6s; }
        .leaf-3 { transform-origin: 34px 48px; animation-delay: 1.8s; }
        .leaf-4 { transform-origin: 66px 34px; animation-delay: 2.0s; }
        .leaf-5 { transform-origin: 38px 22px; animation-delay: 2.2s; }
        .leaf-6 { transform-origin: 60px 18px; animation-delay: 2.4s; }

        /* Flowers blooming */
        .flower-bloom {
          transform: scale(0) rotate(0deg);
          animation: bloomFlower 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .flower-top { transform-origin: 50px 10px; animation-delay: 2.5s; }
        .flower-mid-left { transform-origin: 22px 42px; animation-delay: 2.3s; }
        .flower-mid-right { transform-origin: 78px 28px; animation-delay: 2.4s; }

        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes growStem {
          to { stroke-dashoffset: 0; }
        }

        @keyframes bloomLeaf {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }

        @keyframes bloomFlower {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>

      {/* Potted Vine SVG */}
      <svg className="plant-svg" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soil Pot */}
        <g className="pot">
          <ellipse cx="50" cy="95" rx="14" ry="3" fill="#8B4513" />
          <path d="M38 95 L41 107 C41 108.5, 59 108.5, 59 107 L62 95 Z" fill="#5C2D0C" stroke="#3d1c07" strokeWidth="1" />
          <rect x="36" y="93" width="28" height="2" rx="1" fill="#8B4513" />
        </g>

        {/* Vine Stem system - Wavy and climbing */}
        {/* Main Stem vine */}
        <path className="stem-main" d="M50 95 Q40 75 52 55 T48 20 Q50 15 50 10" stroke="#2ed573" strokeWidth="2" strokeLinecap="round" />
        
        {/* Shorter Branch vines */}
        <path className="stem-branch branch-1" d="M47 80 Q32 75 22 62" stroke="#2ed573" strokeWidth="1.5" strokeLinecap="round" />
        <path className="stem-branch branch-2" d="M50 68 Q68 62 78 48" stroke="#2ed573" strokeWidth="1.5" strokeLinecap="round" />
        <path className="stem-branch branch-3" d="M48 50 Q30 45 22 42" stroke="#2ed573" strokeWidth="1.5" strokeLinecap="round" />
        <path className="stem-branch branch-4" d="M51 38 Q68 34 78 28" stroke="#2ed573" strokeWidth="1.5" strokeLinecap="round" />
        <path className="stem-branch branch-5" d="M49 26 Q35 22 30 18" stroke="#2ed573" strokeWidth="1.2" strokeLinecap="round" />
        <path className="stem-branch branch-6" d="M50 18 Q62 15 65 10" stroke="#2ed573" strokeWidth="1.2" strokeLinecap="round" />

        {/* Leaves - Outside (Stroke #064e3b) / Inside (Fill #7bed9f - bright pastel green) */}
        <path className="leaf leaf-1" d="M42 78 Q28 78 36 72 Q44 72 42 78 Z" fill="#7bed9f" stroke="#064e3b" strokeWidth="1.2" />
        <path className="leaf leaf-2" d="M58 64 Q72 64 64 58 Q56 58 58 64 Z" fill="#7bed9f" stroke="#064e3b" strokeWidth="1.2" />
        <path className="leaf leaf-3" d="M40 50 Q26 48 34 44 Q42 44 40 50 Z" fill="#7bed9f" stroke="#064e3b" strokeWidth="1.2" />
        <path className="leaf leaf-4" d="M60 36 Q74 34 66 30 Q58 30 60 36 Z" fill="#7bed9f" stroke="#064e3b" strokeWidth="1.2" />
        <path className="leaf leaf-5" d="M42 24 Q30 20 38 16 Q46 18 42 24 Z" fill="#7bed9f" stroke="#064e3b" strokeWidth="1.2" />
        <path className="leaf leaf-6" d="M58 20 Q70 16 62 12 Q54 14 58 20 Z" fill="#7bed9f" stroke="#064e3b" strokeWidth="1.2" />

        {/* Flowers - Petals are uniform single color for each flower */}
        
        {/* Left Flower (uniform color2 - e.g. white/vanilla) */}
        <g className="flower-bloom flower-mid-left">
          <circle cx="22" cy="36" r="3" fill={flowerColor2} />
          <circle cx="16" cy="42" r="3" fill={flowerColor2} />
          <circle cx="22" cy="48" r="3" fill={flowerColor2} />
          <circle cx="28" cy="42" r="3" fill={flowerColor2} />
          <circle cx="22" cy="42" r="2.2" fill="#ffa502" />
        </g>

        {/* Right Flower (uniform color1 - e.g. pink/purple/peach) */}
        <g className="flower-bloom flower-mid-right">
          <circle cx="78" cy="22" r="3" fill={flowerColor1} />
          <circle cx="72" cy="28" r="3" fill={flowerColor1} />
          <circle cx="78" cy="34" r="3" fill={flowerColor1} />
          <circle cx="84" cy="28" r="3" fill={flowerColor1} />
          <circle cx="78" cy="28" r="2.2" fill="#ffa502" />
        </g>

        {/* Top Flower (uniform color1 - e.g. pink/purple/peach) */}
        <g className="flower-bloom flower-top">
          <circle cx="50" cy="4" r="3.5" fill={flowerColor1} />
          <circle cx="44" cy="10" r="3.5" fill={flowerColor1} />
          <circle cx="50" cy="16" r="3.5" fill={flowerColor1} />
          <circle cx="56" cy="10" r="3.5" fill={flowerColor1} />
          <circle cx="50" cy="10" r="2.5" fill="#ffa502" />
        </g>
      </svg>
    </div>
  );
}
