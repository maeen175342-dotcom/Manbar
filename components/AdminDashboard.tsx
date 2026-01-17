
import React, { useEffect, useState } from 'react';
import { LegacyEntry, Wisdom } from '../types';
import { 
  getAllLegacyEntries, 
  getAllWisdoms, 
  addWisdom, 
  updateWisdom, 
  deleteWisdom,
  seedWisdoms 
} from '../services/firestoreService';
import { generateWisdomsBatch } from '../services/geminiService';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'wisdoms' | 'legacy' | 'ai'>('wisdoms');
  const [legacyEntries, setLegacyEntries] = useState<LegacyEntry[]>([]);
  const [wisdoms, setWisdoms] = useState<Wisdom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWisdoms, setGeneratedWisdoms] = useState<Omit<Wisdom, 'id' | 'createdAt' | 'updatedAt'>[]>([]);
  
  const hasApiKey = process.env.API_KEY && process.env.API_KEY !== 'PLACEHOLDER_API_KEY';

  // CMS State
  const [editingWisdomId, setEditingWisdomId] = useState<string | null>(null);
  const [wisdomForm, setWisdomForm] = useState<Omit<Wisdom, 'id' | 'createdAt' | 'updatedAt'>>({
    text: '',
    author: '',
    source: '',
    explanation: '',
    moodColor: '#1e1b4b',
    category: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const legacy = await getAllLegacyEntries();
      const library = await getAllWisdoms();
      setLegacyEntries(legacy);
      setWisdoms(library);
    } catch (err) {
      alert("فشل في تحميل البيانات من Firestore");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAISummon = async () => {
    if (!hasApiKey) {
      alert("مفتاح API غير متوفر. يرجى ضبطه في ملف البيئة.");
      return;
    }
    setIsGenerating(true);
    try {
      const batch = await generateWisdomsBatch(5);
      setGeneratedWisdoms(batch);
    } catch (err) {
      alert("فشل في توليد الحكم. تأكد من اتصالك بالإنترنت وصلاحية المفتاح.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAllGenerated = async () => {
    setLoading(true);
    try {
      for (const w of generatedWisdoms) {
        await addWisdom(w);
      }
      setGeneratedWisdoms([]);
      await loadData();
      setActiveTab('wisdoms');
      alert("تم حفظ جميع الحكم المولدة بنجاح!");
    } catch (err) {
      alert("حدث خطأ أثناء حفظ الحكم.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("هل تريد بذر 50 حكمة أولية في قاعدة البيانات؟")) return;
    setLoading(true);
    await seedWisdoms();
    await loadData();
    setLoading(false);
  };

  const handleSaveWisdom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingWisdomId) {
        await updateWisdom(editingWisdomId, wisdomForm);
      } else {
        await addWisdom(wisdomForm);
      }
      setWisdomForm({ text: '', author: '', source: '', explanation: '', moodColor: '#1e1b4b', category: '' });
      setEditingWisdomId(null);
      await loadData();
    } catch (err) {
      alert("حدث خطأ أثناء حفظ الحكمة");
    }
    setLoading(false);
  };

  const handleDeleteWisdom = async (id: string) => {
    if (!window.confirm("حذف هذه الحكمة نهائياً؟")) return;
    await deleteWisdom(id);
    await loadData();
  };

  const startEdit = (w: Wisdom) => {
    setEditingWisdomId(w.id!);
    setWisdomForm({
      text: w.text,
      author: w.author,
      source: w.source,
      explanation: w.explanation,
      moodColor: w.moodColor,
      category: w.category || ''
    });
    setActiveTab('wisdoms');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-slow-fade pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-light text-white">إدارة <span className="text-wisdom-gold font-bold">المنبر</span></h2>
        <div className="flex gap-4">
          <button onClick={handleSeed} className="px-6 py-2 bg-indigo-600/20 text-indigo-300 rounded-full hover:bg-indigo-600/40 transition-all text-sm border border-indigo-500/30">بذر البيانات (Seed)</button>
          <button onClick={onBack} className="px-6 py-2 glass rounded-full text-slate-400 hover:text-white transition-all">خروج</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('wisdoms')}
          className={`px-8 py-3 rounded-full transition-all flex items-center gap-2 ${activeTab === 'wisdoms' ? 'bg-wisdom-gold text-black font-bold scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <span>📚</span> مكتبة الحكم
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-8 py-3 rounded-full transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-purple-600 text-white font-bold scale-105 shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <span>✨</span> التوليد بالذكاء الاصطناعي
        </button>
        <button 
          onClick={() => setActiveTab('legacy')}
          className={`px-8 py-3 rounded-full transition-all flex items-center gap-2 ${activeTab === 'legacy' ? 'bg-wisdom-silver text-black font-bold scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <span>🖊️</span> مساهمات الزوار
        </button>
      </div>

      {activeTab === 'wisdoms' && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1 glass p-6 rounded-3xl h-fit sticky top-6">
            <h3 className="text-xl text-white mb-6 font-bold flex items-center gap-2">
              {editingWisdomId ? '✏️ تعديل حكمة' : '➕ إضافة حكمة'}
            </h3>
            <form onSubmit={handleSaveWisdom} className="space-y-4">
              <textarea 
                required
                placeholder="نص الحكمة"
                className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-xl text-white focus:ring-1 ring-wisdom-gold outline-none min-h-[100px]"
                value={wisdomForm.text}
                onChange={e => setWisdomForm({...wisdomForm, text: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required
                  placeholder="القائل"
                  className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white outline-none"
                  value={wisdomForm.author}
                  onChange={e => setWisdomForm({...wisdomForm, author: e.target.value})}
                />
                <input 
                  placeholder="التصنيف"
                  className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white outline-none"
                  value={wisdomForm.category}
                  onChange={e => setWisdomForm({...wisdomForm, category: e.target.value})}
                />
              </div>
              <input 
                placeholder="المصدر"
                className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white outline-none"
                value={wisdomForm.source}
                onChange={e => setWisdomForm({...wisdomForm, source: e.target.value})}
              />
              <textarea 
                required
                placeholder="شرح الحكمة المفصل"
                className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-xl text-white min-h-[100px] outline-none"
                value={wisdomForm.explanation}
                onChange={e => setWisdomForm({...wisdomForm, explanation: e.target.value})}
              />
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-slate-400 text-sm">لون الحالة:</span>
                <input 
                  type="color"
                  className="bg-transparent border-none w-10 h-10 cursor-pointer rounded-full overflow-hidden"
                  value={wisdomForm.moodColor}
                  onChange={e => setWisdomForm({...wisdomForm, moodColor: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-4 bg-wisdom-gold text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                  {editingWisdomId ? 'تحديث البيانات' : 'حفظ في المكتبة'}
                </button>
                {editingWisdomId && (
                  <button type="button" onClick={() => {setEditingWisdomId(null); setWisdomForm({text:'',author:'',source:'',explanation:'',moodColor:'#1e1b4b',category:''})}} className="px-4 py-4 bg-slate-800 text-white rounded-xl">إلغاء</button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <div className="p-20 text-center">
                <div className="w-10 h-10 border-4 border-wisdom-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">جاري قراءة المخطوطات...</p>
              </div>
            ) : wisdoms.length === 0 ? (
              <div className="p-20 text-center glass rounded-[2rem] border-dashed border-white/10">
                <p className="text-slate-500 italic text-lg">المكتبة فارغة حالياً. استخدم "التوليد الذكي" أو "بذر البيانات" للبدء.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <p className="text-slate-500 text-sm px-2">إجمالي الحكم: {wisdoms.length}</p>
                {wisdoms.map(w => (
                  <div key={w.id} className="glass p-6 rounded-2xl flex justify-between items-start gap-4 hover:border-wisdom-gold/30 transition-all group relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full" style={{ backgroundColor: w.moodColor }} />
                    <div className="space-y-3 flex-1">
                      <p className="text-lg text-white font-serif leading-relaxed">« {w.text} »</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="text-wisdom-gold font-bold">{w.author}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400">{w.source}</span>
                        <span className="text-slate-600">|</span>
                        <span className="px-2 py-0.5 bg-white/5 rounded text-wisdom-silver">{w.category || 'عام'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(w)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">تعديل</button>
                      <button onClick={() => handleDeleteWisdom(w.id!)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-8 animate-slow-fade">
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 p-10 rounded-[2.5rem] border border-purple-500/20 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-purple-600/20">✨</div>
              <h3 className="text-3xl font-bold text-white">توليد الحكم بالذكاء الاصطناعي</h3>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                استخدم نموذج <span className="text-purple-400 font-bold">Gemini 3 Flash</span> لإنشاء دفعات جديدة من الحكم العربية الأصيلة مع شروحاتها وتصنيفاتها النفسية بضغطة زر واحدة.
              </p>
              
              <button 
                onClick={handleAISummon}
                disabled={isGenerating || !hasApiKey}
                className={`mt-4 px-12 py-5 rounded-full font-bold text-xl transition-all flex items-center gap-4 ${isGenerating ? 'bg-slate-800 text-slate-500' : 'bg-white text-purple-900 hover:scale-105 active:scale-95 shadow-2xl'}`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    جاري استحضار الحكمة...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">⚡</span>
                    توليد 5 حكم جديدة
                  </>
                )}
              </button>
              
              {!hasApiKey && (
                <p className="text-red-400 text-sm font-medium">⚠️ يرجى ضبط مفتاح GEMINI_API_KEY لتفعيل التوليد.</p>
              )}
            </div>
          </div>

          {/* Generated Preview */}
          {generatedWisdoms.length > 0 && (
            <div className="space-y-6 animate-slow-fade">
              <div className="flex justify-between items-center px-4">
                <h4 className="text-xl text-white font-bold">نتائج التوليد (المعاينة)</h4>
                <div className="flex gap-4">
                  <button onClick={() => setGeneratedWisdoms([])} className="text-slate-400 hover:text-white transition-colors">مسح الكل</button>
                  <button onClick={saveAllGenerated} className="px-8 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">حفظ الكل في المكتبة</button>
                </div>
              </div>
              <div className="grid gap-6">
                {generatedWisdoms.map((w, idx) => (
                  <div key={idx} className="glass p-8 rounded-3xl border-purple-500/20 hover:border-purple-500/40 transition-all relative">
                    <div className="absolute right-0 top-0 bg-purple-600 text-[10px] px-3 py-1 rounded-bl-xl font-bold uppercase tracking-widest">AI Generated</div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="text-2xl font-serif text-white leading-relaxed">« {w.text} »</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-wisdom-gold font-bold">— {w.author}</span>
                          <span className="text-slate-500 italic">({w.source})</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold">{w.category}</span>
                          <div className="w-6 h-6 rounded-full border border-white/10" style={{backgroundColor: w.moodColor}} title="لون الشعور المولّد" />
                        </div>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h5 className="text-sm text-purple-400 font-bold mb-2 uppercase tracking-tighter">الشرح المولّد:</h5>
                        <p className="text-slate-300 text-sm leading-relaxed">{w.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'legacy' && (
        <div className="glass rounded-[2rem] overflow-hidden border border-white/5 animate-slow-fade">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10">
                  <th className="p-6 font-bold uppercase text-xs tracking-widest">الأثر المكتوب</th>
                  <th className="p-6 font-bold uppercase text-xs tracking-widest">الكاتب</th>
                  <th className="p-6 font-bold uppercase text-xs tracking-widest text-center">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {legacyEntries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-20 text-center text-slate-500 italic">لا توجد مساهمات زوار حتى الآن.</td>
                  </tr>
                ) : (
                  legacyEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6 text-slate-200 text-lg leading-relaxed">{entry.content}</td>
                      <td className="p-6">
                        <span className="text-wisdom-gold font-bold">{entry.authorName}</span>
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-slate-500 text-xs font-mono">
                          {new Date(entry.timestamp).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
