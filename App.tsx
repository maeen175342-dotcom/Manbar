import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { IntroSection } from './components/IntroSection';
import { PoeticLoader } from './components/PoeticLoader';
import { WisdomCard } from './components/WisdomCard';
import { ContemplationView } from './components/ContemplationView';
import { LegacySection } from './components/LegacySection';
import { AdminDashboard } from './components/AdminDashboard';
import { AppState, Wisdom, Contemplation } from './types';
import { summonWisdom, contemplateWisdom } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INTRO);
  const [wisdom, setWisdom] = useState<Wisdom | null>(null);
  const [contemplation, setContemplation] = useState<Contemplation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // مراقبة الحالة في الكونسول للتأكد من التحميل
    console.debug(`[Al-Manbar] Current state: ${state}`);
  }, [state]);

  const handleSummon = async (input: string) => {
    setError(null);
    setState(AppState.SUMMONING);
    try {
      const result = await summonWisdom(input);
      setWisdom(result);
      setState(AppState.REVELATION);
    } catch (err: any) {
      setError(err.message || 'عذراً، وقع خطأ ما أثناء استحضار الحكمة.');
      setState(AppState.INTRO);
    }
  };

  const handleContemplate = async () => {
    if (!wisdom) return;
    setState(AppState.SUMMONING);
    try {
      const result = await contemplateWisdom(wisdom);
      setContemplation(result);
      setState(AppState.CONTEMPLATION);
    } catch (err: any) {
      setError(err.message);
      setState(AppState.REVELATION);
    }
  };

  const reset = () => {
    setWisdom(null);
    setContemplation(null);
    setError(null);
    setState(AppState.INTRO);
  };

  const handleAdminAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const password = window.prompt("الرجاء إدخال كلمة مرور الإدارة لدخول المنبر:");
    if (password === "admin123") {
      setState(AppState.ADMIN);
    } else if (password !== null) {
      alert("عذراً، كلمة المرور خاطئة. لا تملك صلاحية دخول غرفة الحكماء.");
    }
  };

  return (
    <Layout dynamicColor={wisdom?.moodColor}>
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-red-900/40 text-red-200 border border-red-800 rounded-full text-sm animate-slow-fade z-[200]">
          {error}
        </div>
      )}

      {state === AppState.INTRO && <IntroSection onSubmit={handleSummon} />}
      {state === AppState.SUMMONING && <PoeticLoader />}
      {state === AppState.REVELATION && wisdom && (
        <WisdomCard wisdom={wisdom} onContemplate={handleContemplate} onReset={reset} />
      )}
      {state === AppState.CONTEMPLATION && wisdom && contemplation && (
        <ContemplationView wisdom={wisdom} contemplation={contemplation} onBack={() => setState(AppState.REVELATION)} />
      )}
      {state === AppState.LEGACY && (
        <LegacySection onComplete={reset} onBack={reset} />
      )}
      {state === AppState.ADMIN && (
        <AdminDashboard onBack={reset} />
      )}

      {/* أزرار الإجراءات الجانبية - تظهر في الحالات الأساسية */}
      {(state === AppState.INTRO || state === AppState.REVELATION) && (
        <>
          <button
            onClick={() => setState(AppState.LEGACY)}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-full text-slate-200 border border-white/10 hover:border-wisdom-gold/50 hover:text-wisdom-gold hover:scale-105 transition-all duration-500 flex items-center gap-3 group shadow-2xl z-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-base font-medium tracking-wide">أريد تخليد أثر...</span>
          </button>
          
          <button 
            type="button"
            onClick={handleAdminAccess}
            className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center text-slate-500 hover:text-wisdom-gold transition-all z-[150] opacity-40 hover:opacity-100 hover:scale-110 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 shadow-lg shadow-black/50"
            title="إدارة المنبر"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        </>
      )}
    </Layout>
  );
};

export default App;