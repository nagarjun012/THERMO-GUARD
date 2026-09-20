export const getRiskColor = (level: string) => {
  const l = level.toLowerCase();
  if (l === 'extreme') return '#ef4444';
  if (l === 'high') return '#f97316';
  if (l === 'moderate') return '#eab308';
  if (l === 'low' || l === 'safe') return '#10b981';
  return '#10b981';
};

export const getRiskGlowClass = (level: string) => {
  const l = level.toLowerCase();
  if (l === 'safe') return 'glow-safe';
  if (l === 'low') return 'glow-low';
  if (l === 'moderate') return 'glow-moderate';
  if (l === 'high') return 'glow-high';
  if (l === 'extreme') return 'glow-extreme';
  return 'glow-safe';
};

export const formatTemperature = (temp: number) => {
  return `${Math.round(temp)}°C`;
};

export const formatTimestamp = (ts: string) => {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getRiskIcon = (level: string) => {
  const l = level.toLowerCase();
  if (l === 'safe') return 'ShieldCheck';
  if (l === 'low') return 'AlertCircle';
  if (l === 'moderate') return 'AlertTriangle';
  if (l === 'high') return 'Flame';
  if (l === 'extreme') return 'Skull';
  return 'ShieldCheck';
};
