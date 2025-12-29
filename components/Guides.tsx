import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGuides } from '../services/firestore';
import { Guide } from '../types';
import { Card } from './ui/Card';
import { ChevronDown, Check, FileBadge, Stamp, Landmark, HeartPulse, Loader2 } from 'lucide-react';
import { Toast } from './ui/Toast';
import { useToast } from '../hooks/useToast';

const icons: Record<string, React.ReactNode> = {
  FileBadge: <FileBadge />,
  Stamp: <Stamp />,
  Landmark: <Landmark />,
  HeartPulse: <HeartPulse />,
};

const GUIDE_IMAGES: Record<string, string> = {
  patent: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&q=80',
  rvp: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&q=80',
  vnj: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',
  insurance: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&q=80'
};

export const Guides: React.FC = () => {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, Record<string, boolean>>>({});
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      const data = await getGuides();
      setGuides(data);
      setLoading(false);
    };
    loadGuides();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('guideProgress');
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load guide progress:', error);
      setProgress({});
    }
  }, []);

  const toggleStep = (guideId: string, stepId: string) => {
    const newProgress = { ...progress };
    if (!newProgress[guideId]) newProgress[guideId] = {};

    newProgress[guideId][stepId] = !newProgress[guideId][stepId];

    setProgress(newProgress);
    localStorage.setItem('guideProgress', JSON.stringify(newProgress));

    if (newProgress[guideId][stepId]) {
      showToast('Шаг выполнен', 'success');
    }
  };

  const calculateProgress = (guideId: string) => {
    const guide = guides.find(g => g.id === guideId);
    if (!guide) return 0;
    const completed = guide.steps.filter(step => progress[guideId]?.[step.id]).length;
    return Math.round((completed / guide.steps.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 pb-24 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-24 max-w-4xl mx-auto space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Инструкции</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Пошаговое руководство по легализации.</p>
      </header>

      <div className="space-y-4">
        {guides.map((guide, index) => {
          const percent = calculateProgress(guide.id);
          const isExpanded = expandedGuide === guide.id;

          return (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div 
                  className="p-6 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl relative overflow-hidden ${percent === 100 ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
                      <div
                        className="absolute inset-0 opacity-10 bg-cover bg-center"
                        style={{ backgroundImage: `url(${GUIDE_IMAGES[guide.id]})` }}
                      />
                      <div className="relative z-10">
                        {icons[guide.icon]}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{guide.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{guide.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                       <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Прогресс</span>
                       <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{percent}%</div>
                    </div>
                    {/* Radial Progress Mini for Mobile */}
                    <div className="md:hidden relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100 dark:text-slate-800"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className={`${percent === 100 ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'} transition-all duration-500`}
                            strokeDasharray={`${percent}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>
                        <span className="absolute text-[9px] font-bold">{percent}</span>
                    </div>

                    <ChevronDown
                      className={`transition-transform duration-300 text-slate-400 dark:text-slate-500 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
                
                {/* Progress Bar Line */}
                <div className="h-1 w-full bg-slate-50 dark:bg-slate-800">
                   <div
                    className={`h-full transition-all duration-500 ${percent === 100 ? 'bg-green-500 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-500'}`}
                    style={{ width: `${percent}%` }}
                   />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800"
                    >
                      <div className="p-6 space-y-3">
                        {guide.steps.map((step) => {
                          const isChecked = !!progress[guide.id]?.[step.id];
                          return (
                            <div
                              key={step.id}
                              onClick={() => toggleStep(guide.id, step.id)}
                              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                isChecked ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-blue-600 dark:bg-blue-700 border-blue-600 dark:border-blue-700 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                              }`}>
                                {isChecked && <Check size={12} />}
                              </div>
                              <span className={`text-sm ${isChecked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                                {step.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
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
