
import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slow-fade">
      <div className="glass p-10 rounded-[2.5rem] border border-white/10 space-y-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wisdom-gold to-transparent opacity-50" />
        
        <div className="space-y-3">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
            <svg className="w-8 h-8 text-wisdom-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl text-white font-light">غرفة الحكماء</h2>
          <p className="text-slate-400 text-sm font-light">أدخل كلمة المرور للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className={`w-full bg-slate-900/50 border ${error ? 'border-red-500' : 'border-white/10'} px-6 py-4 rounded-full text-center text-white focus:outline-none focus:ring-1 ring-wisdom-gold transition-all placeholder:text-slate-600`}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-xs animate-pulse">كلمة المرور خاطئة!</p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-wisdom-gold text-black font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              دخول المنبر
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-4 text-slate-400 hover:text-white transition-all text-sm"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
