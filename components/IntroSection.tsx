
import React, { useState } from 'react';

interface IntroSectionProps {
  onSubmit: (text: string) => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 animate-slow-fade">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight">
          اكتب شعورك..
        </h1>
        <p className="text-slate-300 text-2xl md:text-3xl font-light">
          وخذ حكمة تناسبك
        </p>
      </div>
      
      <div className="w-full max-w-lg relative group">
        <textarea
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ما الذي يجول في خاطرك الآن؟"
          className="w-full bg-transparent border-b border-slate-600 p-4 text-2xl text-center text-white focus:outline-none focus:border-wisdom-gold transition-all placeholder:text-slate-400 placeholder:italic resize-none min-h-[120px]"
        />
        <div className="absolute -bottom-10 left-0 right-0 text-slate-400 text-sm opacity-0 group-focus-within:opacity-100 transition-opacity flex justify-center items-center gap-2 font-light">
          اضغط 
          <kbd className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700 text-slate-200">Enter</kbd>
          لاستحضار الحكمة
        </div>
      </div>
    </div>
  );
};
