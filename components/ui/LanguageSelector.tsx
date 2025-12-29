import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Language } from '../../types';

const LANGUAGES: Record<Language, string> = {
  ru: '🇷🇺 Русский',
  kk: '🇰🇿 Қазақша',
  en: '🇬🇧 English',
  uz: '🇺🇿 Ўзбек',
  tj: '🇹🇯 Тоҷикӣ',
  zh: '🇨🇳 中文',
  tr: '🇹🇷 Türkçe',
  ky: '🇰🇬 Кыргызча',
};

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = Object.entries(LANGUAGES) as [Language, string][];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
      >
        <Globe size={16} />
        <span className="text-sm font-medium">{LANGUAGES[language]}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 max-h-80 overflow-y-auto"
          >
            {languages.map(([lang, label]) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 flex items-center justify-between transition-colors ${
                  language === lang
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{label}</span>
                {language === lang && <Check size={16} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
