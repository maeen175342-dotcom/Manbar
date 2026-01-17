
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

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'wisdoms' | 'legacy'>('wisdoms');
  const [legacyEntries, setLegacyEntries] = useState<LegacyEntry[]>([]);
  const [wisdoms, setWisdoms] = useState<Wisdom[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-slow-fade">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-light text-white">إدارة <span className="text-wisdom-gold">المنبر</span></h2>
        <div className="flex gap-4">
          <button onClick={handleSeed} className="px-6 py-2 bg-indigo-600/30 text-indigo-300 rounded-full hover:bg-indigo-600/50 transition-all text-sm">بذر البيانات (Seed)</button>
          <button onClick={onBack} className="px-6 py-2 glass rounded-full text-slate-400 hover:text-white transition-all">خروج</button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('wisdoms')}
          className={`px-6 py-2 rounded-full transition-all ${activeTab === 'wisdoms' ? 'bg-wisdom-gold text-black font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          مكتبة الحكم (CMS)
        </button>
        <button 
          onClick={() => setActiveTab('legacy')}
          className={`px-6 py-2 rounded-full transition-all ${activeTab === 'legacy' ? 'bg-wisdom-gold text-black font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          مساهمات الزوار
        </button>
      </div>

      {activeTab === 'wisdoms' && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1 glass p-6 rounded-3xl h-fit sticky top-6">
            <h3 className="text-xl text-white mb-6">{editingWisdomId ? 'تعديل حكمة' : 'إضافة حكمة جديدة'}</h3>
            <form onSubmit={handleSaveWisdom} className="space-y-4">
              <textarea 
                required
                placeholder="نص الحكمة"
                className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-xl text-white focus:ring-1 ring-wisdom-gold outline-none"
                value={wisdomForm.text}
                onChange={e => setWisdomForm({...wisdomForm, text: e.target.value})}
              />
              <input 
                required
                placeholder="القائل"
                className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white outline-none"
                value={wisdomForm.author}
                onChange={e => setWisdomForm({...wisdomForm, author: e.target.value})}
              />
              <input 
                placeholder="المصدر"
                className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white outline-none"
                value={wisdomForm.source}
                onChange={e => setWisdomForm({...wisdomForm, source: e.target.value})}
              />
              <input 
                placeholder="التصنيف (فلسفة، علم، الخ)"
                className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl text-white outline-none"
                value={wisdomForm.category}
                onChange={e => setWisdomForm({...wisdomForm, category: e.target.value})}
              />
              <textarea 
                required
                placeholder="شرح الحكمة"
                className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-xl text-white min-h-[100px] outline-none"
                value={wisdomForm.explanation}
                onChange={e => setWisdomForm({...wisdomForm, explanation: e.target.value})}
              />
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">لون الشعور:</span>
                <input 
                  type="color"
                  className="bg-transparent border-none w-10 h-10 cursor-pointer"
                  value={wisdomForm.moodColor}
                  onChange={e => setWisdomForm({...wisdomForm, moodColor: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-wisdom-gold text-black font-bold rounded-xl hover:scale-[1.02] transition-all">
                  {editingWisdomId ? 'تحديث' : 'إضافة'}
                </button>
                {editingWisdomId && (
                  <button type="button" onClick={() => {setEditingWisdomId(null); setWisdomForm({text:'',author:'',source:'',explanation:'',moodColor:'#1e1b4b',category:''})}} className="px-4 py-3 bg-slate-800 text-white rounded-xl">إلغاء</button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <div className="p-12 text-center text-slate-500">جاري المعالجة...</div>
            ) : wisdoms.length === 0 ? (
              <div className="p-12 text-center text-slate-500 glass rounded-3xl italic">المكتبة فارغة حالياً. اضغط "بذر البيانات" للبدء.</div>
            ) : (
              wisdoms.map(w => (
                <div key={w.id} className="glass p-6 rounded-2xl flex justify-between items-start gap-4 hover:border-wisdom-gold/20 transition-all group">
                  <div className="space-y-2">
                    <p className="text-lg text-white font-medium line-clamp-2">« {w.text} »</p>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span className="text-wisdom-gold">{w.author}</span>
                      <span>•</span>
                      <span>{w.source}</span>
                      <span>•</span>
                      <span className="px-2 bg-white/5 rounded">{w.category || 'غير مصنف'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(w)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg">تعديل</button>
                    <button onClick={() => handleDeleteWisdom(w.id!)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'legacy' && (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10">
                  <th className="p-4 font-light">الأثر</th>
                  <th className="p-4 font-light">الكاتب</th>
                  <th className="p-4 font-light text-center">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {legacyEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-slate-200">{entry.content}</td>
                    <td className="p-4 text-wisdom-gold font-medium">{entry.authorName}</td>
                    <td className="p-4 text-center text-slate-500 text-xs">
                      {new Date(entry.timestamp).toLocaleDateString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
