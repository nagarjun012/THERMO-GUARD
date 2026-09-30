import React from 'react';

export type WeatherClimateType = 'heatwave' | 'sunny' | 'partly-cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'cloudy';

interface DynamicWeatherSymbolProps {
  temp: number;
  humidity?: number;
  condition?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Determines the climate category based on temperature, humidity, and condition
 */
export function getClimateType(temp: number, humidity = 50, condition = ''): WeatherClimateType {
  const condLower = condition.toLowerCase();

  if (condLower.includes('thunder') || condLower.includes('storm')) return 'thunderstorm';
  if (condLower.includes('snow') || condLower.includes('ice') || temp <= 10) return 'snow';
  if (condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('shower') || (humidity >= 80 && temp < 36)) return 'rain';
  if (temp >= 38) return 'heatwave';
  if (temp >= 30) return 'sunny';
  if (temp >= 20 && humidity <= 65) return 'partly-cloudy';
  return 'cloudy';
}

export const DynamicWeatherSymbol: React.FC<DynamicWeatherSymbolProps> = ({
  temp,
  humidity = 50,
  condition = '',
  size = 'lg',
  className = '',
}) => {
  const climateType = getClimateType(temp, humidity, condition);

  const dimensionMap = {
    sm: 44,
    md: 68,
    lg: 104,
    xl: 140,
  };

  const dim = dimensionMap[size];

  // 1. High Weather / Heatwave (Blazing 3D Sun with Solar Flares)
  if (climateType === 'heatwave') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
        {/* Ambient Warm Solar Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/40 via-orange-500/30 to-red-500/20 blur-xl animate-pulse" />
        
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_16px_rgba(245,158,11,0.4)]">
          <defs>
            <linearGradient id="heatSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE047" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="heatFlareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="heatSunSpecular" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#FDE047" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Rotating Corona Rays */}
          <g className="animate-[spin_24s_linear_infinite] origin-center">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <rect
                key={i}
                x="47"
                y="10"
                width="6"
                height="14"
                rx="3"
                transform={`rotate(${angle} 50 50)`}
                fill="url(#heatFlareGrad)"
              />
            ))}
          </g>

          {/* Main 3D Sun Sphere */}
          <circle cx="50" cy="50" r="28" fill="url(#heatSunGrad)" />
          {/* Specular Highlight Sphere */}
          <circle cx="50" cy="50" r="28" fill="url(#heatSunSpecular)" />

          {/* Heatwave Thermal Ripples */}
          <path
            d="M 32 78 Q 41 73, 50 78 T 68 78"
            fill="none"
            stroke="#EA580C"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="animate-pulse"
          />
          <path
            d="M 36 85 Q 43 81, 50 85 T 64 85"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 2. Sunny (Clear 3D Golden Sun with Soft Clouds)
  if (climateType === 'sunny') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
        <div className="absolute inset-2 rounded-full bg-amber-400/25 blur-lg" />
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_16px_rgba(245,158,11,0.3)]">
          <defs>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF0" />
              <stop offset="30%" stopColor="#FDE68A" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <radialGradient id="sunShine" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#FBBF24" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="smallCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
          </defs>

          {/* Corona Rays */}
          <g className="animate-[spin_30s_linear_infinite] origin-center opacity-85">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={i}
                cx="50"
                cy="18"
                r="3.5"
                transform={`rotate(${angle} 50 50)`}
                fill="#FBBF24"
              />
            ))}
          </g>

          {/* Sun body */}
          <circle cx="50" cy="50" r="26" fill="url(#sunGrad)" />
          <circle cx="50" cy="50" r="26" fill="url(#sunShine)" />

          {/* Soft small accent cloud at lower right */}
          <g transform="translate(18, 20) scale(0.65)" opacity="0.9">
            <path
              d="M 35 60 A 14 14 0 0 1 58 50 A 18 18 0 0 1 88 56 A 12 12 0 0 1 88 72 L 35 72 A 12 12 0 0 1 35 60 Z"
              fill="url(#smallCloudGrad)"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.08))"
            />
          </g>
        </svg>
      </div>
    );
  }

  // 3. Partly Cloudy (3D Fluffy Cloud with Sun behind)
  if (climateType === 'partly-cloudy') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_18px_rgba(59,130,246,0.2)]">
          <defs>
            <linearGradient id="cloudSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="puffyCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="cloudHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Peeking Sun */}
          <g transform="translate(14, 0)">
            <circle cx="54" cy="38" r="18" fill="url(#cloudSunGrad)" />
            {/* Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="54"
                y1="14"
                x2="54"
                y2="10"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${angle} 54 38)`}
              />
            ))}
          </g>

          {/* Big 3D Puffy Cloud */}
          <path
            d="M 28 68 A 16 16 0 0 1 42 46 A 22 22 0 0 1 76 48 A 18 18 0 0 1 86 68 L 28 68 Z"
            fill="url(#puffyCloudGrad)"
          />
          {/* Specular Top Rim */}
          <path
            d="M 29 65 A 15 15 0 0 1 42 48 A 21 21 0 0 1 74 50 A 17 17 0 0 1 84 65"
            fill="none"
            stroke="url(#cloudHighlight)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 4. Rain & Showers (Dark Glossy Cloud with Raindrops)
  if (climateType === 'rain') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_20px_rgba(37,99,235,0.25)]">
          <defs>
            <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="45%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="cloudTopGlint" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Rain Cloud */}
          <path
            d="M 26 58 A 16 16 0 0 1 42 38 A 22 22 0 0 1 76 40 A 18 18 0 0 1 84 58 L 26 58 Z"
            fill="url(#rainCloudGrad)"
          />
          {/* Cloud Highlight Rim */}
          <path
            d="M 28 55 A 15 15 0 0 1 42 40 A 21 21 0 0 1 74 42 A 17 17 0 0 1 82 55"
            fill="none"
            stroke="url(#cloudTopGlint)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Diagonal Raindrops with Staggered Animation */}
          <g>
            <path
              d="M 32 66 L 27 78"
              stroke="url(#dropGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <path
              d="M 46 68 L 41 82"
              stroke="url(#dropGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="animate-pulse [animation-delay:200ms]"
            />
            <path
              d="M 60 66 L 55 78"
              stroke="url(#dropGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="animate-pulse [animation-delay:400ms]"
            />
            <path
              d="M 74 68 L 69 82"
              stroke="url(#dropGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="animate-pulse [animation-delay:600ms]"
            />
          </g>
        </svg>
      </div>
    );
  }

  // 5. Thunderstorm (Glossy Dark Cloud with Golden Lightning Bolt & Rain)
  if (climateType === 'thunderstorm') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_22px_rgba(245,158,11,0.3)]">
          <defs>
            <linearGradient id="stormCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="50%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Dark Storm Cloud */}
          <path
            d="M 24 56 A 16 16 0 0 1 40 36 A 22 22 0 0 1 76 38 A 18 18 0 0 1 84 56 L 24 56 Z"
            fill="url(#stormCloudGrad)"
          />

          {/* Golden 3D Lightning Bolt */}
          <polygon
            points="52,48 40,66 49,66 43,84 62,62 51,62"
            fill="url(#boltGrad)"
            filter="drop-shadow(0 0 6px #FBBF24)"
            className="animate-pulse"
          />

          {/* Raindrops */}
          <line x1="30" y1="64" x2="26" y2="76" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="64" x2="68" y2="76" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 6. Snow / Cold (Soft Cloud with Falling Snow Crystals)
  if (climateType === 'snow') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_18px_rgba(186,230,253,0.3)]">
          <defs>
            <linearGradient id="snowCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="50%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          {/* Snow Cloud */}
          <path
            d="M 26 56 A 16 16 0 0 1 42 36 A 22 22 0 0 1 76 38 A 18 18 0 0 1 84 56 L 26 56 Z"
            fill="url(#snowCloudGrad)"
            stroke="#7DD3FC"
            strokeWidth="1.5"
          />

          {/* Falling Snowflakes */}
          <g fill="#0284C7" className="animate-pulse">
            <circle cx="36" cy="68" r="3" />
            <circle cx="50" cy="76" r="3.5" />
            <circle cx="66" cy="70" r="3" />
            <circle cx="44" cy="86" r="2.5" />
            <circle cx="60" cy="84" r="2.5" />
          </g>
        </svg>
      </div>
    );
  }

  // Default: Layered Puffy Overcast Clouds
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_18px_rgba(148,163,184,0.25)]">
        <defs>
          <linearGradient id="defaultCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>
        <path
          d="M 24 64 A 18 18 0 0 1 42 42 A 24 24 0 0 1 78 44 A 20 20 0 0 1 88 64 L 24 64 Z"
          fill="url(#defaultCloudGrad)"
        />
      </svg>
    </div>
  );
};
