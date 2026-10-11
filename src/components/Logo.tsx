import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision SVG medallion based on the official Academy badge */}
      <div className={`relative shrink-0 ${sizeMap[size]}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="badgeDark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f192c" />
              <stop offset="70%" stopColor="#09101d" />
              <stop offset="100%" stopColor="#050a14" />
            </radialGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="goldRing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Scalloped outer edge circle */}
          <path
            d="M 100 8 
               C 106 8, 111 12, 115 15 C 122 13, 128 15, 134 20 C 140 21, 145 25, 149 31 C 156 34, 160 39, 163 46 C 168 50, 172 56, 173 63 C 179 69, 180 76, 180 84 C 183 91, 183 98, 182 105 C 184 113, 182 120, 178 127 C 177 134, 173 141, 167 146 C 164 153, 159 159, 153 163 C 148 169, 142 173, 134 175 C 129 180, 122 183, 115 184 C 108 188, 101 189, 93 188 C 86 189, 79 188, 73 184 C 66 183, 59 180, 54 175 C 47 172, 41 168, 36 162 C 30 157, 26 151, 23 144 C 18 138, 15 131, 14 124 C 11 117, 10 110, 12 102 C 10 95, 12 87, 16 80 C 18 73, 22 66, 27 60 C 31 54, 37 49, 43 45 C 48 39, 54 35, 61 32 C 67 27, 74 24, 82 22 C 87 17, 93 14, 100 8 Z"
            fill="#09101d"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner ring */}
          <circle cx="100" cy="100" r="76" fill="url(#badgeDark)" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="73" fill="none" stroke="url(#goldRing)" strokeWidth="1" strokeDasharray="2,3" opacity="0.6" />

          {/* Golden Laurel Wreath (Left & Right) */}
          <g fill="url(#goldGradient)" opacity="0.95">
            {/* Left Laurel Leaves */}
            <path d="M 46 128 C 43 124 38 116 40 108 C 42 113 46 118 46 128 Z" />
            <path d="M 40 108 C 36 102 33 93 37 85 C 40 90 42 96 40 108 Z" />
            <path d="M 37 85 C 34 78 35 68 41 62 C 43 68 43 74 37 85 Z" />
            <path d="M 43 62 C 43 54 48 46 56 42 C 55 49 53 54 43 62 Z" />
            <path d="M 57 44 C 60 38 67 32 76 30 C 72 36 69 40 57 44 Z" />
            <path d="M 77 31 C 82 27 90 25 98 25 C 93 29 89 31 77 31 Z" />

            {/* Right Laurel Leaves */}
            <path d="M 154 128 C 157 124 162 116 160 108 C 158 113 154 118 154 128 Z" />
            <path d="M 160 108 C 164 102 167 93 163 85 C 160 90 158 96 160 108 Z" />
            <path d="M 163 85 C 166 78 165 68 159 62 C 157 68 157 74 163 85 Z" />
            <path d="M 157 62 C 157 54 152 46 144 42 C 145 49 147 54 157 62 Z" />
            <path d="M 143 44 C 140 38 133 32 124 30 C 128 36 131 40 143 44 Z" />
            <path d="M 123 31 C 118 27 110 25 102 25 C 107 29 111 31 123 31 Z" />

            {/* Laurel Stem */}
            <path d="M 48 142 C 34 112 36 68 78 36" fill="none" stroke="url(#goldGradient)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 152 142 C 166 112 164 68 122 36" fill="none" stroke="url(#goldGradient)" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          {/* Center Badge Typography */}
          {/* "The" in elegant script font style */}
          <text
            x="100"
            y="70"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="15"
            fontFamily="'Cinzel', serif"
            fontWeight="600"
            letterSpacing="2"
          >
            The
          </text>

          {/* "Trading" */}
          <text
            x="100"
            y="98"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="22"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="800"
            letterSpacing="-0.5"
          >
            Trading
          </text>

          {/* "Academy" */}
          <text
            x="100"
            y="126"
            textAnchor="middle"
            fill="#f1f5f9"
            fontSize="19"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="700"
            letterSpacing="-0.5"
          >
            Academy
          </text>

          {/* Stars bottom flourish */}
          <g fill="url(#goldGradient)">
            {/* Center star */}
            <polygon points="100,147 102.5,153 109,153 103.8,157 106,163 100,159 94,163 96.2,157 91,153 97.5,153" />
            {/* Small left star */}
            <polygon points="88,154 89.5,157.5 93.5,157.5 90.5,159.5 91.5,163 88,161 84.5,163 85.5,159.5 82.5,157.5 86.5,157.5" opacity="0.8" />
            {/* Small right star */}
            <polygon points="112,154 113.5,157.5 117.5,157.5 114.5,159.5 115.5,163 112,161 108.5,163 109.5,159.5 106.5,157.5 110.5,157.5" opacity="0.8" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-extrabold tracking-wider text-base sm:text-lg text-white leading-tight">
            FOREX TRADING <span className="gold-gradient-text">ACADEMY</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-amber-400/90 tracking-widest uppercase">
            Learn • Practice • Trade
          </span>
        </div>
      )}
    </div>
  );
};
