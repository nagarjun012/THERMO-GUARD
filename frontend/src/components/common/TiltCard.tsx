import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxTilt?: number;
  glareEffect?: boolean;
  depth?: number;
}

/**
 * High-End 3D Physics Tilt Card (Awwwards / Apple-tier)
 * Employs hardware-accelerated motion values and spring dampening.
 * Does NOT cause continuous React re-renders on mousemove.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
  maxTilt = 8,
  glareEffect = true,
  depth = 12,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  // Smooth spring dynamics for physics mass feel (damping / stiffness tuned for ultra-fluid response)
  const springConfig = { damping: 20, stiffness: 280, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);
  const glareOpacity = useSpring(useTransform(x, [-0.5, 0, 0.5], [0.35, 0, 0.35]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
    mouseX.set((mouseXPos / width) * 100);
    mouseY.set((mouseYPos / height) * 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cursorClass = onClick ? 'cursor-pointer select-none' : '';

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.012 }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`relative perspective-container transition-shadow ${cursorClass} ${className}`}
    >
      <div style={{ transform: `translateZ(${depth}px)` }} className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>

      {/* Dynamic Specular Glare Overlay */}
      {glareEffect && (
        <motion.div
          style={{ opacity: glareOpacity }}
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 overflow-hidden bg-gradient-to-tr from-transparent via-white/25 to-transparent transition-opacity"
        />
      )}
    </motion.div>
  );
};
