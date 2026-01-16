
import React from 'react';
import { Contemplation, Wisdom } from '../types';

interface ContemplationViewProps {
  wisdom: Wisdom;
  contemplation: Contemplation;
  onBack: () => void;
}

export const ContemplationView: React.FC<ContemplationViewProps> = ({ wisdom, contemplation, onBack }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-slow-fade overflow-y-auto">
      <div className="max-w-3xl w-full space-y-12 py-10">
        
        {/* المقولة الأصلية كمرجع */}
        <div className="text-center space-y-4">
          <p className="quote-font text-2xl md:text-4xl font-bold text-wisdom-gold opacity-80 leading-relaxed">
            « {wisdom.text} »
          </p>
          <div className="h-px w-16 bg-slate-800 mx-auto" />
        </div>

        {/* الشرح المبسط */}
        <div className="grid gap-8">
          <div className="glass-bright rounded-3xl p-8 space-y-4 border border-white/5 transform transition-all hover:scale-[1.01]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">١</span>
              <h4 className="text-sm uppercase tracking-widest text-blue-400 font-bold">ببساطة.. ماذا تعني؟</h4>
            </div>
            <p className="text-xl text-slate-100 leading-relaxed font-normal">
              {contemplation.surfaceMeaning}
            </p>
          </div>

          <div className="glass-bright rounded-3xl p-8 space-y-4 border border-white/5 transform transition-all hover:scale-[1.01]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">٢</span>
              <h4 className="text-sm uppercase tracking-widest text-purple-400 font-bold">ما وراء الكلمات</h4>
            </div>
            <p className="text-xl text-slate-100 leading-relaxed font-normal">
              {contemplation.deepMeaning}
            </p>
          </div>

          <div className="glass-bright rounded-3xl p-8 space-y-4 border border-white/5 transform transition-all hover:scale-[1.01] bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">٣</span>
              <h4 className="text-sm uppercase tracking-widest text-emerald-400 font-bold">كيف تطبقها اليوم؟</h4>
            </div>
            <p className="text-xl text-emerald-50/90 leading-relaxed font-medium italic">
              {contemplation.practicalApplication}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mx-auto block px-14 py-4 bg-slate-800/50 text-slate-300 rounded-full hover:bg-slate-700 hover:text-white transition-all border border-white/5 shadow-2xl"
        >
          فهمت المقصد
        </button>
      </div>
    </div>
  );
};
