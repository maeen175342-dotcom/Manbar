
import React, { useEffect, useState } from 'react';
import { LegacyEntry } from '../types';
import { getAllLegacyEntries, deleteLegacyEntry, updateLegacyEntry } from '../services/firestoreService';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [entries, setEntries] = useState<LegacyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ content: '', authorName: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllLegacyEntries();
      setEntries(data);
    } catch (err) {
      alert("فشل في تحميل البيانات");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الأثر؟")) return;
    await deleteLegacyEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleToggleStatus = async (entry: LegacyEntry) => {
    const newStatus = entry.status === 'approved' ? 'pending' : 'approved';
    await updateLegacyEntry(entry.id, { status: newStatus });
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: newStatus } : e));
  };

  const startEdit = (entry: LegacyEntry) => {
    setEditingId(entry.id);
    setEditForm({ content: entry.content, authorName: entry.authorName });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateLegacyEntry(editingId, editForm);
    setEntries(prev => prev.map(e => e.id === editingId ? { ...e, ...editForm } : e));
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8 animate-slow-fade">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-light text-white">لوحة التحكم <span className="text-wisdom-gold">بالآثار</span></h2>
        <button onClick={onBack} className="px-6 py-2 glass rounded-full text-slate-400 hover:text-white transition-all">خروج</button>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-500">جاري تحميل الآثار...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10">
                  <th className="p-4 font-light">الأثر</th>
                  <th className="p-4 font-light">الكاتب</th>
                  <th className="p-4 font-light text-center">الحالة</th>
                  <th className="p-4 font-light text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {editingId === entry.id ? (
                        <textarea 
                          className="w-full bg-slate-900 border border-white/20 p-2 rounded text-white"
                          value={editForm.content}
                          onChange={e => setEditForm({...editForm, content: e.target.value})}
                        />
                      ) : (
                        <p className="text-slate-200 line-clamp-2">{entry.content}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {editingId === entry.id ? (
                        <input 
                          className="w-full bg-slate-900 border border-white/20 p-2 rounded text-white"
                          value={editForm.authorName}
                          onChange={e => setEditForm({...editForm, authorName: e.target.value})}
                        />
                      ) : (
                        <span className="text-wisdom-gold">{entry.authorName}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleToggleStatus(entry)}
                        className={`px-3 py-1 rounded-full text-xs ${entry.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
                      >
                        {entry.status === 'approved' ? 'منشور' : 'معلق'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        {editingId === entry.id ? (
                          <button onClick={saveEdit} className="text-blue-400 hover:underline">حفظ</button>
                        ) : (
                          <button onClick={() => startEdit(entry)} className="text-slate-400 hover:text-white">تعديل</button>
                        )}
                        <button onClick={() => handleDelete(entry.id)} className="text-red-900/60 hover:text-red-500">حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
