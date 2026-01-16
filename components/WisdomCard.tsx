
import React, { useRef, useState } from 'react';
import { Wisdom } from '../types';

interface WisdomCardProps {
  wisdom: Wisdom;
  onContemplate: () => void;
  onReset: () => void;
}

export const WisdomCard: React.FC<WisdomCardProps> = ({ wisdom, onContemplate, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center gap-12 animate-slow-fade">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass rounded-[2.5rem] p-12 md:p-24 shadow-2xl relative transition-transform duration-300 ease-out preserve-3d cursor-default max-w-4xl border border-white/10"
        style={{
          transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Subtle inner light effect */}
        <div className="absolute top-0 left-0 w-full h-full rounded-[2.5rem] opacity-5 pointer-events-none bg-gradient-to-br from-white to-transparent" />
        
        <div className="relative space-y-12 text-center">
          <p className="quote-font text-4xl md:text-6xl font-bold leading-[1.4] text-white text-glow px-4">
            « {wisdom.text} »
          </p>
          
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl text-wisdom-gold font-medium tracking-wide">
              — {wisdom.author}
            </h3>
            <div className="h-px w-16 bg-slate-700 mx-auto opacity-50" />
            <p className="text-base text-slate-300 font-light italic">
              من {wisdom.source}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <button
          onClick={onContemplate}
          className="px-12 py-5 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-white/5 active:scale-95"
        >
          <span className="text-xl">💡 تأمل الحكمة</span>
        </button>
        <button
          onClick={onReset}
          className="px-12 py-5 glass-bright rounded-full text-white hover:bg-white/10 transition-all active:scale-95 border border-white/10"
        >
          حالة أخرى
        </button>
      </div>
    </div>
  );
};
