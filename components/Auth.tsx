import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const translations = {
  ru: {
    login: 'Вход',
    register: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    name: 'Имя',
    loginBtn: 'Войти',
    registerBtn: 'Зарегистрироваться',
    googleBtn: 'Войти через Google',
    noAccount: 'Нет аккаунта?',
    haveAccount: 'Уже есть аккаунт?',
    forgotPassword: 'Забыли пароль?',
    resetPassword: 'Восстановить пароль',
    resetSent: 'Письмо для восстановления отправлено',
    passwordMismatch: 'Пароли не совпадают',
    welcome: 'Добро пожаловать в MigraHelp',
    subtitle: 'Войдите чтобы сохранять документы и отслеживать прогресс',
  },
  kk: {
    login: 'Кіру',
    register: 'Тіркелу',
    email: 'Email',
    password: 'Құпия сөз',
    confirmPassword: 'Құпия сөзді растаңыз',
    name: 'Аты',
    loginBtn: 'Кіру',
    registerBtn: 'Тіркелу',
    googleBtn: 'Google арқылы кіру',
    noAccount: 'Аккаунт жоқ па?',
    haveAccount: 'Аккаунтыңыз бар ма?',
    forgotPassword: 'Құпия сөзді ұмыттыңыз ба?',
    resetPassword: 'Құпия сөзді қалпына келтіру',
    resetSent: 'Қалпына келтіру хаты жіберілді',
    passwordMismatch: 'Құпия сөздер сәйкес келмейді',
    welcome: 'MigraHelp-ке қош келдіңіз',
    subtitle: 'Құжаттарды сақтау және прогресті бақылау үшін кіріңіз',
  },
  en: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    loginBtn: 'Sign In',
    registerBtn: 'Sign Up',
    googleBtn: 'Sign in with Google',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset Password',
    resetSent: 'Reset email sent',
    passwordMismatch: 'Passwords do not match',
    welcome: 'Welcome to MigraHelp',
    subtitle: 'Sign in to save documents and track progress',
  },
  uz: {
    login: 'Kirish',
    register: 'Ro\'yxatdan o\'tish',
    email: 'Email',
    password: 'Parol',
    confirmPassword: 'Parolni tasdiqlang',
    name: 'Ism',
    loginBtn: 'Kirish',
    registerBtn: 'Ro\'yxatdan o\'tish',
    googleBtn: 'Google orqali kirish',
    noAccount: 'Akkaunt yo\'qmi?',
    haveAccount: 'Akkauntingiz bormi?',
    forgotPassword: 'Parolni unutdingizmi?',
    resetPassword: 'Parolni tiklash',
    resetSent: 'Tiklash xati yuborildi',
    passwordMismatch: 'Parollar mos kelmaydi',
    welcome: 'MigraHelp-ga xush kelibsiz',
    subtitle: 'Hujjatlarni saqlash va jarayonni kuzatish uchun kiring',
  },
  tj: {
    login: 'Даромад',
    register: 'Бақайдгирӣ',
    email: 'Email',
    password: 'Рамз',
    confirmPassword: 'Рамзро тасдиқ кунед',
    name: 'Ном',
    loginBtn: 'Даромадан',
    registerBtn: 'Бақайд гирифтан',
    googleBtn: 'Бо Google ворид шавед',
    noAccount: 'Аккаунт надоред?',
    haveAccount: 'Аккаунт доред?',
    forgotPassword: 'Рамзро фаромӯш кардед?',
    resetPassword: 'Барқарор кардани рамз',
    resetSent: 'Мактуби барқарорсозӣ фиристода шуд',
    passwordMismatch: 'Рамзҳо мувофиқ нестанд',
    welcome: 'Хуш омадед ба MigraHelp',
    subtitle: 'Барои нигоҳ доштани ҳуҷҷатҳо ворид шавед',
  },
  zh: {
    login: '登录',
    register: '注册',
    email: '电子邮件',
    password: '密码',
    confirmPassword: '确认密码',
    name: '姓名',
    loginBtn: '登录',
    registerBtn: '注册',
    googleBtn: '使用Google登录',
    noAccount: '没有账户？',
    haveAccount: '已有账户？',
    forgotPassword: '忘记密码？',
    resetPassword: '重置密码',
    resetSent: '重置邮件已发送',
    passwordMismatch: '密码不匹配',
    welcome: '欢迎来到MigraHelp',
    subtitle: '登录以保存文档和跟踪进度',
  },
  tr: {
    login: 'Giriş',
    register: 'Kayıt',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifreyi Onayla',
    name: 'İsim',
    loginBtn: 'Giriş Yap',
    registerBtn: 'Kayıt Ol',
    googleBtn: 'Google ile Giriş',
    noAccount: 'Hesabınız yok mu?',
    haveAccount: 'Zaten hesabınız var mı?',
    forgotPassword: 'Şifrenizi mi unuttunuz?',
    resetPassword: 'Şifreyi Sıfırla',
    resetSent: 'Sıfırlama e-postası gönderildi',
    passwordMismatch: 'Şifreler eşleşmiyor',
    welcome: 'MigraHelp\'e Hoş Geldiniz',
    subtitle: 'Belgeleri kaydetmek ve ilerlemeyi takip etmek için giriş yapın',
  },
  ky: {
    login: 'Кирүү',
    register: 'Катталуу',
    email: 'Email',
    password: 'Сырсөз',
    confirmPassword: 'Сырсөздү ырастаңыз',
    name: 'Аты',
    loginBtn: 'Кирүү',
    registerBtn: 'Катталуу',
    googleBtn: 'Google менен кирүү',
    noAccount: 'Аккаунт жокпу?',
    haveAccount: 'Аккаунтуңуз барбы?',
    forgotPassword: 'Сырсөздү унутуңузбу?',
    resetPassword: 'Сырсөздү калыбына келтирүү',
    resetSent: 'Калыбына келтирүү каты жөнөтүлдү',
    passwordMismatch: 'Сырсөздөр дал келбейт',
    welcome: 'MigraHelp-ке кош келиңиз',
    subtitle: 'Документтерди сактоо жана прогрессти көзөмөлдөө үчүн кириңиз',
  },
};

export const Auth: React.FC = () => {
  const { language } = useLanguage();
  const { login, register, loginWithGoogle, resetPassword, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const t = translations[language as keyof typeof translations] || translations.ru;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setFormError(t.passwordMismatch);
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      navigate('/');
    } catch (err) {
      // Error handled in useAuth
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      // Error handled in useAuth
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(formData.email);
      setResetSent(true);
    } catch (err) {
      // Error handled in useAuth
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {t.welcome}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t.subtitle}
            </p>
          </div>

          {/* Error Display */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-2"
            >
              <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">{displayError}</span>
            </motion.div>
          )}

          {/* Reset Password Success */}
          {resetSent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
            >
              <span className="text-sm text-green-700 dark:text-green-300">{t.resetSent}</span>
            </motion.div>
          )}

          {/* Reset Password Form */}
          {showResetForm ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {t.resetPassword}
              </button>

              <button
                type="button"
                onClick={() => { setShowResetForm(false); setResetSent(false); }}
                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t.login}
              </button>
            </form>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex mb-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => { setIsLogin(true); clearError(); setFormError(null); }}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.login}
                </button>
                <button
                  onClick={() => { setIsLogin(false); clearError(); setFormError(null); }}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    !isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.register}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {t.name}
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {t.confirmPassword}
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!isLogin}
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t.forgotPassword}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {isLogin ? t.loginBtn : t.registerBtn}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm text-slate-400">или</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.googleBtn}
              </button>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
