
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "نقلب صفحات الحكمة...",
  "نبحث في بطون المجلدات...",
  "نستحضر عبق الماضي...",
  "نصغي لصوت العقل...",
  "الحكمة قادمة إليك..."
];

export const PoeticLoader: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-slow-fade">
      <div className="w-16 h-16 border-t-2 border-slate-400 border-opacity-30 rounded-full animate-spin" />
      <p className="text-xl font-light text-slate-300 italic tracking-wide transition-all duration-1000 ease-in-out">
        {MESSAGES[index]}
      </p>
    </div>
  );
};
