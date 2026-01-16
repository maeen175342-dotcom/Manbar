
import React, { useState } from 'react';
import { addLegacyEntry } from '../services/firestoreService';

export const LegacySection: React.FC<{ onComplete: () => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !author || isSaving) return;
    
    setIsSaving(true);
    try {
      await addLegacyEntry(content, author);
      setSubmitted(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err) {
      alert("عذراً، حدث خطأ أثناء تخليد أثرك. حاول مجدداً.");
      setIsSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-6 animate-slow-fade">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <h3 className="text-2xl text-white">أثرك خُلّد في السحاب...</h3>
        <p className="text-slate-400 font-light">سيتم عرض حكمتك بعد مراجعة جوهرها من قبل الحكماء.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-slow-fade relative">
      <div className="absolute -top-16 right-0 w-full flex justify-start">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group"
        >
          <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
          <span className="text-sm font-light tracking-wide">عودة للبداية</span>
        </button>
      </div>

      <div className="text-center space-y-2 pt-4">
        <h2 className="text-3xl text-white font-light">تخليد الأثر</h2>
        <p className="text-slate-400 font-light">أضف حكمة تؤمن بها ليقرأها السائرون من بعدك في هذا المنبر.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <textarea
            required
            disabled={isSaving}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="اكتب هنا جوهر فكرك..."
            className="w-full glass rounded-2xl p-6 text-xl text-white min-h-[180px] focus:outline-none focus:ring-1 ring-white/20 transition-all resize-none placeholder:text-slate-600 disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <input
            required
            disabled={isSaving}
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="اسمك أو توقيعك الفلسفي"
            className="w-full glass rounded-full px-6 py-4 text-white focus:outline-none focus:ring-1 ring-white/20 transition-all placeholder:text-slate-600 disabled:opacity-50"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-95 disabled:bg-slate-500"
          >
            {isSaving ? 'جاري النقش في السحاب...' : 'نقش الأثر في السحابة'}
          </button>
        </div>
      </form>
    </div>
  );
};
