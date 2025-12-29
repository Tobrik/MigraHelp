import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, Files, Map as MapIcon, UtensilsCrossed, ClipboardList, LogIn, LogOut, Shield, User } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { LanguageSelector } from './ui/LanguageSelector';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS_LABELS = {
  ru: { home: 'Главная', guides: 'Инструкции', documents: 'Документы', procedures: 'Процедуры', restaurants: 'Рестораны', map: 'Карта', help: 'Нужна помощь?', emergency: 'Экстренный номер: 112', theme: 'Тема', language: 'Язык', login: 'Войти', logout: 'Выйти', admin: 'Админ-панель', profile: 'Профиль' },
  kk: { home: 'Басты бет', guides: 'Нұсқаулықтар', documents: 'Құжаттар', procedures: 'Ресімдеу', restaurants: 'Мейманхана', map: 'Карта', help: 'Көмек керек пе?', emergency: 'Төтенше нөмірі: 112', theme: 'Тема', language: 'Тіл', login: 'Кіру', logout: 'Шығу', admin: 'Админ-панель', profile: 'Профиль' },
  en: { home: 'Home', guides: 'Guides', documents: 'Documents', procedures: 'Procedures', restaurants: 'Restaurants', map: 'Map', help: 'Need help?', emergency: 'Emergency: 112', theme: 'Theme', language: 'Language', login: 'Login', logout: 'Logout', admin: 'Admin Panel', profile: 'Profile' },
  uz: { home: 'Bosh sahifa', guides: "Ko'rsatmalar", documents: 'Hujjatlar', procedures: 'Rasmiylashtirish', restaurants: 'Restoran', map: 'Xarita', help: 'Yordam kerakmi?', emergency: 'Faqat: 112', theme: 'Mavzu', language: 'Til', login: 'Kirish', logout: 'Chiqish', admin: 'Admin panel', profile: 'Profil' },
  tj: { home: 'Саҳифаи асосӣ', guides: 'Дастури', documents: 'Ҳуҷҷатҳо', procedures: 'Раҷистрирон', restaurants: 'Рестораҳо', map: 'Нақша', help: 'Кумак лозим?', emergency: 'Кумак: 112', theme: 'Мавзу', language: 'Забон', login: 'Воридшавӣ', logout: 'Баромадан', admin: 'Админ-панел', profile: 'Профил' },
  zh: { home: '首页', guides: '指南', documents: '文件', procedures: '程序', restaurants: '餐厅', map: '地图', help: '需要帮助？', emergency: '紧急呼号：112', theme: '主题', language: '语言', login: '登录', logout: '退出', admin: '管理面板', profile: '个人资料' },
  tr: { home: 'Anasayfa', guides: 'Kılavuzlar', documents: 'Belgeler', procedures: 'Prosedürler', restaurants: 'Restoranlar', map: 'Harita', help: 'Yardıma ihtiyacınız var mı?', emergency: 'Acil: 112', theme: 'Tema', language: 'Dil', login: 'Giriş', logout: 'Çıkış', admin: 'Admin Paneli', profile: 'Profil' },
  ky: { home: 'Башталгычы бет', guides: 'Колдонмолор', documents: 'Документтер', procedures: 'Процедуралар', restaurants: 'Ресторандар', map: 'Карта', help: 'Жардам керекпи?', emergency: 'Шашылыш: 112', theme: 'Тема', language: 'Тил', login: 'Кирүү', logout: 'Чыгуу', admin: 'Админ панели', profile: 'Профиль' },
};

const getNavItems = (labels: typeof NAV_ITEMS_LABELS['ru']) => [
  { path: '/', label: labels.home, icon: Home },
  { path: '/guides', label: labels.guides, icon: FileText },
  { path: '/documents', label: labels.documents, icon: Files },
  { path: '/procedures', label: labels.procedures, icon: ClipboardList },
  { path: '/restaurants', label: labels.restaurants, icon: UtensilsCrossed },
  { path: '/map', label: labels.map, icon: MapIcon },
];

export const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const { user, userData, logout, loading } = useAuth();
  const navigate = useNavigate();

  const labels = NAV_ITEMS_LABELS[language as keyof typeof NAV_ITEMS_LABELS] || NAV_ITEMS_LABELS.ru;
  const NAV_ITEMS = getNavItems(labels);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen fixed left-0 top-0 z-50">
        <div className="p-8">
          <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-500 dark:bg-teal-400 rounded-full"></span>
            MigraHelp
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-semibold">Ваш помощник</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          {/* Admin Panel Link - Only for admins */}
          {userData?.isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                }`
              }
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">{labels.admin}</span>
            </NavLink>
          )}
        </nav>

        {/* User Section */}
        <div className="px-4 pb-4">
          {user ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {(userData?.displayName || user.email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {userData?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                {labels.logout}
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium mb-4"
            >
              <LogIn size={18} />
              {labels.login}
            </NavLink>
          )}
        </div>

        {/* Theme Toggle & Language Selector - Desktop */}
        <div className="px-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{labels.theme}</span>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{labels.language}</span>
            <LanguageSelector />
          </div>
        </div>

        <div className="p-6 pt-0">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">{labels.help}</p>
            <p className="text-xs text-slate-400">{labels.emergency}</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          {/* Auth button for mobile */}
          {user ? (
            <NavLink
              to={userData?.isAdmin ? '/admin' : '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'
                }`
              }
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{userData?.isAdmin ? 'Admin' : labels.profile}</span>
            </NavLink>
          ) : (
            <NavLink
              to="/auth"
              className="flex flex-col items-center justify-center w-full h-full text-slate-400 dark:text-slate-500"
            >
              <LogIn className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{labels.login}</span>
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
};
