import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { CheckCircle2, AlertTriangle, Hotel as HotelIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DocumentItem } from '../types';

export const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    try {
      // Load data from storage
      const storedDocs = JSON.parse(localStorage.getItem('myDocuments') || '[]');
      setDocuments(storedDocs);

      // Calculate completed steps across all guides
      const storedProgress = JSON.parse(localStorage.getItem('guideProgress') || '{}');
      let count = 0;
      Object.values(storedProgress).forEach((guide: Record<string, boolean>) => {
        count += Object.keys(guide).filter(k => guide[k] === true).length;
      });
      setCompletedSteps(count);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setDocuments([]);
      setCompletedSteps(0);
    }
  }, []);

  const urgentDoc = documents
    .filter(d => {
      const days = Math.ceil((new Date(d.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return days > 0 && days < 30;
    })
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];

  return (
    <div className="p-6 md:p-10 space-y-8 pb-24 md:pb-10 max-w-6xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Добро пожаловать</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Вот краткий обзор вашего прогресса.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Stats Card (Large) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-2"
        >
          <Card className="h-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white border-none p-6 relative overflow-hidden">
            {/* Hero Background Image */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <CheckCircle2 size={150} />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-blue-100 font-medium">Ваш прогресс</h3>
                <div className="text-5xl font-bold mt-2">{completedSteps}</div>
                <p className="text-blue-200">выполненных шагов</p>
              </div>
              <Link to="/guides" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold hover:opacity-80 transition-opacity">
                Продолжить
                <ArrowRight size={16} />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Alert Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className={`h-full p-6 flex flex-col justify-between ${urgentDoc ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950' : 'dark:bg-slate-900'}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${urgentDoc ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {urgentDoc ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {urgentDoc ? 'Внимание!' : 'Все отлично'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {urgentDoc
                  ? `${urgentDoc.name} истекает скоро.`
                  : 'Срочных уведомлений нет.'}
              </p>
            </div>
            {urgentDoc && (
               <Link to="/documents" className="mt-4 text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                 Проверить <ArrowRight size={14}/>
               </Link>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions / Bento Items */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.2 }}
           className="md:col-span-1"
        >
          <Link to="/hotels">
            <Card className="h-40 p-6 flex flex-col justify-center items-center text-center hover:scale-[1.02] cursor-pointer group dark:bg-slate-900">
              <div className="p-3 bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-400 rounded-full mb-3 group-hover:bg-purple-100 dark:group-hover:bg-purple-800 transition-colors">
                <HotelIcon size={24} />
              </div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200">Отели</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Недорогое жилье в городе</p>
            </Card>
          </Link>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.3 }}
           className="md:col-span-2"
        >
          <Link to="/map">
            <Card className="h-40 p-6 flex items-center justify-between hover:scale-[1.02] cursor-pointer group relative overflow-hidden dark:bg-slate-900">
               <div
                 className="absolute inset-0 opacity-20 dark:opacity-10 bg-cover bg-center transition-opacity group-hover:opacity-30"
                 style={{
                   backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80)'
                 }}
               />
               <div className="relative z-10">
                 <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Карта Помощи</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Найдите ЦОНы, больницы и центры поддержки рядом.</p>
               </div>
               <div className="relative z-10 w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center text-white group-hover:bg-blue-700 dark:group-hover:bg-blue-600 transition-colors">
                 <ArrowRight size={20} />
               </div>
            </Card>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};
