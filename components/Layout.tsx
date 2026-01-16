
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  dynamicColor?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, dynamicColor }) => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 animated-gradient overflow-hidden">
      {/* Dynamic Background Glow - Enhanced Contrast */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-[3000ms] ease-in-out opacity-40 blur-[120px]"
        style={{ 
          background: dynamicColor 
            ? `radial-gradient(circle at 50% 50%, ${dynamicColor} 0%, transparent 80%)` 
            : 'transparent' 
        }}
      />
      
      <main className="w-full max-w-4xl z-10">
        {children}
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 text-slate-400 text-xs font-light tracking-[0.3em] uppercase flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
        <span>منبر الحكمة</span>
        <span>•</span>
        <span>Al-Manbar</span>
      </footer>
    </div>
  );
};
