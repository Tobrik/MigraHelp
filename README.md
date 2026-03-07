# MigraHelp

Веб-приложение для помощи мигрантам в Казахстане. Информация о документах, жилье, еде, полезных местах и AI-чатбот для ответов на вопросы.

![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Vite](https://img.shields.io/badge/Vite-6-646cff)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## Возможности

- **Документы** — пошаговые инструкции по оформлению ИИН, РВП, ВНЖ, трудового патента, регистрации
- **Отели и хостелы** — поиск жилья с фильтрацией по бюджету и 5 валютам
- **Рестораны** — кафе и рестораны Алматы по категориям бюджета
- **Карта помощи** — ЦОНы, больницы, миграционная полиция, юридическая помощь
- **AI-чатбот** — помощник на базе Llama 3.3 для ответов на вопросы о миграции
- **8 языков** — русский, казахский, английский, узбекский, таджикский, китайский, турецкий, кыргызский
- **Темная тема** — автоматическое переключение

## Стек

| Категория | Технология |
|-----------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Анимации | Framer Motion |
| Роутинг | React Router DOM 7 |
| Карты | Leaflet + React-Leaflet |
| База данных | Firebase Firestore (с локальным фоллбэком) |
| AI-чатбот | Llama 3.3 70B через Groq API |
| Деплой | Vercel |
| Сборка | Vite 6 |

## Быстрый старт

```bash
# Клонирование
git clone https://github.com/Tobrik/MigraHelp.git
cd MigraHelp

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env.local
# Заполните VITE_FIREBASE_* и GROQ_API_KEY

# Запуск
npm run dev
```

Приложение откроется на `http://localhost:3000`

## Переменные окружения

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# AI Chatbot (Groq)
GROQ_API_KEY=
```

Groq API ключ бесплатно: [console.groq.com/keys](https://console.groq.com/keys)

## Структура проекта

```
MigraHelp/
├── api/                 # Vercel serverless functions
│   └── chat.ts          # AI-чатбот (Llama 3.3)
├── components/          # React компоненты
│   ├── ui/              # UI компоненты (Card, Toast, ...)
│   ├── Chatbot.tsx      # AI-чатбот
│   ├── Hotels.tsx       # Отели и хостелы
│   ├── Restaurants.tsx  # Рестораны
│   ├── Dashboard.tsx    # Главная
│   ├── Documents.tsx    # Управление документами
│   ├── DocumentProcedures.tsx # Процедуры оформления
│   ├── Guides.tsx       # Гайды
│   ├── Map.tsx          # Карта помощи
│   ├── Sidebar.tsx      # Навигация
│   ├── Auth.tsx         # Авторизация
│   └── Admin.tsx        # Админ-панель
├── config/              # Конфигурация Firebase
├── hooks/               # React хуки
├── services/            # Сервисы Firestore
├── utils/               # Переводы
├── data.ts              # Статические данные (фоллбэк)
├── types.ts             # TypeScript типы
├── App.tsx              # Главный компонент
└── vercel.json          # Конфигурация Vercel
```

## Деплой на Vercel

1. Импортируйте репозиторий в [Vercel](https://vercel.com)
2. Добавьте переменные окружения в Settings → Environment Variables
3. Деплой произойдет автоматически

## Команды

```bash
npm run dev       # Разработка
npm run build     # Сборка
npm run preview   # Предпросмотр сборки
```

## Лицензия

MIT

## Автор

**Tobrik** — [github.com/Tobrik](https://github.com/Tobrik)
