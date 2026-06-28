'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api.client';
import { FolderTree, Plus, Loader2, Edit3, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', nameAr: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get<{ data: any[] }>('/api/categories'),
  });

  const mutation = useMutation({
    mutationFn: (newCat: any) => 
      editingCat 
      ? api.patch(`/api/categories/${editingCat.id}`, newCat)
      : api.post('/api/categories', newCat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(editingCat ? 'تم التعديل بنجاح' : 'تمت الإضافة بنجاح');
      closeModal();
    },
    onError: () => toast.error('فشلت العملية، تأكد من الاتصال')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('تم الحذف بنجاح');
    }
  });

  const openModal = (cat: any = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name, nameAr: cat.nameAr || '' });
    } else {
      setEditingCat(null);
      setFormData({ name: '', nameAr: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
    setFormData({ name: '', nameAr: '' });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  const categoriesList = data?.data || [];

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-8 flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <FolderTree className="w-8 h-8 text-indigo-500" /> إدارة الأقسام
        </h1>
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
          <Plus className="w-5 h-5" /> إضافة قسم
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoriesList.map((cat: any) => (
          <div key={cat.id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-black text-gray-900 dark:text-white">{cat.nameAr || cat.name}</h3>
              <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModal(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition"><Edit3 className="w-5 h-5" /></button>
              <button onClick={() => {if(confirm('هل أنت متأكد؟')) deleteMutation.mutate(cat.id)}} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
        {categoriesList.length === 0 && <p className="text-gray-500 col-span-3 text-center py-10">لا توجد أقسام، أضف قسماً جديداً لتبدأ.</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">{editingCat ? 'تعديل القسم' : 'قسم جديد'}</h2>
              <button onClick={closeModal} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2">اسم القسم (انجليزي/عام)</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-indigo-500" placeholder="e.g. Electronics" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2">الاسم بالعربي (يظهر للزبون)</label>
                <input type="text" value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-indigo-500 text-right" placeholder="مثال: إلكترونيات" />
              </div>
              <button disabled={mutation.isPending || !formData.name} onClick={() => mutation.mutate(formData)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-50 mt-4">
                {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingCat ? 'حفظ التعديلات' : 'إنشاء القسم الآن'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
