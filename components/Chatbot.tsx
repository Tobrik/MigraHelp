import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const translations: Record<string, { title: string; placeholder: string; greeting: string }> = {
  ru: { title: 'MigraHelp AI', placeholder: 'Задайте вопрос...', greeting: 'Привет! Я MigraHelp AI. Задайте мне вопрос о миграции, документах, жилье или услугах в Казахстане.' },
  kk: { title: 'MigraHelp AI', placeholder: 'Сұрақ қойыңыз...', greeting: 'Сәлем! Мен MigraHelp AI. Қазақстандағы көші-қон, құжаттар, тұрғын үй немесе қызметтер туралы сұрақ қойыңыз.' },
  en: { title: 'MigraHelp AI', placeholder: 'Ask a question...', greeting: 'Hi! I\'m MigraHelp AI. Ask me about migration, documents, housing or services in Kazakhstan.' },
  uz: { title: 'MigraHelp AI', placeholder: 'Savol bering...', greeting: 'Salom! Men MigraHelp AI. Qozog\'istondagi migratsiya, hujjatlar, turar joy yoki xizmatlar haqida savol bering.' },
  tj: { title: 'MigraHelp AI', placeholder: 'Савол диҳед...', greeting: 'Салом! Ман MigraHelp AI. Дар бораи муҳоҷират, ҳуҷҷатҳо, манзил ё хизматҳо дар Қазоқистон савол диҳед.' },
  zh: { title: 'MigraHelp AI', placeholder: '提问...', greeting: '你好！我是MigraHelp AI。问我关于哈萨克斯坦的移民、文件、住房或服务的问题。' },
  tr: { title: 'MigraHelp AI', placeholder: 'Soru sorun...', greeting: 'Merhaba! Ben MigraHelp AI. Kazakistan\'daki göç, belgeler, konaklama veya hizmetler hakkında soru sorun.' },
  ky: { title: 'MigraHelp AI', placeholder: 'Суроо бериңиз...', greeting: 'Салам! Мен MigraHelp AI. Казакстандагы миграция, документтер, турак жай же кызматтар жөнүндө суроо бериңиз.' },
};

export const Chatbot: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ru;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.greeting },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Update greeting when language changes
  useEffect(() => {
    const currentT = translations[language as keyof typeof translations] || translations.ru;
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: currentT.greeting }];
      }
      return prev;
    });
  }, [language]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Извините, произошла ошибка. Попробуйте позже.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[400px] h-[500px] max-h-[70vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold">{t.title}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Llama 3.3</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-slate-600 dark:text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Bot size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl rounded-bl-md">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.placeholder}
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
