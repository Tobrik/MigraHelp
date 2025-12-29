import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Plus, Trash2, Calendar, FileText, AlertCircle } from 'lucide-react';
import { DocumentItem } from '../types';
import { Toast } from './ui/Toast';
import { useToast } from '../hooks/useToast';

const DOCUMENT_IMAGES: Record<string, string> = {
  passport: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=100&q=80',
  patent: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=100&q=80',
  registration: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=100&q=80',
  other: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&q=80'
};

export const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Form state
  const [docName, setDocName] = useState('');
  const [docDate, setDocDate] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('myDocuments');
      if (stored) setDocuments(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load documents:', error);
      setDocuments([]);
    }
  }, []);

  const saveDocuments = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    localStorage.setItem('myDocuments', JSON.stringify(newDocs));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docDate) return;

    const newDoc: DocumentItem = {
      id: Date.now().toString(),
      name: docName,
      expiryDate: docDate,
      type: 'other' // simplified for now
    };

    saveDocuments([...documents, newDoc]);
    setDocName('');
    setDocDate('');
    setIsAdding(false);
    showToast('Документ успешно добавлен', 'success');
  };

  const handleDelete = (id: string) => {
    saveDocuments(documents.filter(d => d.id !== id));
    showToast('Документ удален', 'info');
  };

  const getDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const getStatusColor = (days: number) => {
    if (days < 0) return 'expired';
    if (days < 7) return 'critical';
    if (days < 30) return 'warning';
    return 'good';
  };

  return (
    <div className="p-6 md:p-10 pb-24 max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Документы</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Отслеживайте сроки действия.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Название документа</label>
                  <input
                    type="text"
                    placeholder="Например: Патент"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Дата истечения</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300">Отмена</button>
                  <button type="submit" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all">Сохранить</button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        {documents.map((doc) => {
          const days = getDaysLeft(doc.expiryDate);
          const status = getStatusColor(days);
          
          let cardStyle = "border-l-4 ";
          let statusText = `${days} дней`;
          let statusIcon = <Calendar className="w-4 h-4" />;
          
          if (status === 'critical') {
            cardStyle += "border-l-red-500 shadow-red-100 animate-pulse-slow"; // Custom pulse class needs tailwind config or standard pulse
            statusText = `Истекает через ${days} дн.`;
            statusIcon = <AlertCircle className="w-4 h-4 text-red-500" />;
          } else if (status === 'warning') {
            cardStyle += "border-l-amber-400 shadow-amber-50";
          } else if (status === 'expired') {
            cardStyle += "border-l-slate-400 bg-slate-50 opacity-75";
            statusText = "Истек";
          } else {
            cardStyle += "border-l-green-500";
          }

          return (
            <motion.div key={doc.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className={`relative overflow-hidden group dark:bg-slate-900 ${cardStyle}`}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-20 bg-cover bg-center"
                        style={{ backgroundImage: `url(${DOCUMENT_IMAGES[doc.type] || DOCUMENT_IMAGES.other})` }}
                      />
                      <FileText size={20} className="relative z-10" />
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{doc.name}</h3>
                  <div className={`flex items-center gap-2 text-sm font-medium ${
                    status === 'critical' ? 'text-red-600' : 
                    status === 'warning' ? 'text-amber-600' : 
                    status === 'expired' ? 'text-slate-500' : 'text-green-600'
                  }`}>
                    {statusIcon}
                    <span>{statusText}</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Дата: {new Date(doc.expiryDate).toLocaleDateString('ru-RU')}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {documents.length === 0 && !isAdding && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1554224311-beee460c201f?w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="relative z-10">
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p>Документы не добавлены</p>
              <button onClick={() => setIsAdding(true)} className="text-blue-500 dark:text-blue-400 font-semibold mt-2 hover:underline">Добавить первый</button>
            </div>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};
