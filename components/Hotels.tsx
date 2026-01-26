import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { Card } from './ui/Card';
import { MapPin, Phone, Globe, DollarSign, Map as MapIcon, Star, Loader2, Wifi } from 'lucide-react';
import { getHotels } from '../services/firestore';
import { Hotel } from '../types';
import { useLanguage } from '../hooks/useLanguage';

// Component to fix map rendering issues
const MapResizer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
};

type BudgetFilter = 'all' | 'budget' | 'medium' | 'premium';
type Currency = 'KZT' | 'USD' | 'RUB' | 'UZS' | 'TJS';

const BUDGET_LABELS: Record<string, Record<string, string>> = {
  ru: { budget: 'Бюджетные', medium: 'Средний класс', premium: 'Премиум' },
  kk: { budget: 'Арзан', medium: 'Орташа', premium: 'Премиум' },
  en: { budget: 'Budget', medium: 'Medium', premium: 'Premium' },
  uz: { budget: 'Arzon', medium: 'O\'rta', premium: 'Premium' },
  tj: { budget: 'Арзон', medium: 'Миёна', premium: 'Премиум' },
  zh: { budget: '经济', medium: '中档', premium: '高档' },
  tr: { budget: 'Ekonomik', medium: 'Orta', premium: 'Premium' },
  ky: { budget: 'Арзан', medium: 'Орто', premium: 'Премиум' }
};

const BUDGET_COLORS: Record<string, string> = {
  budget: 'from-green-500 to-green-600',
  medium: 'from-blue-500 to-blue-600',
  premium: 'from-purple-500 to-purple-600'
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KZT: '₸',
  USD: '$',
  RUB: '₽',
  UZS: 'so\'m',
  TJS: 'SM'
};

const CURRENCY_NAMES: Record<string, Record<Currency, string>> = {
  ru: { KZT: 'Тенге', USD: 'Доллар', RUB: 'Рубль', UZS: 'Сум', TJS: 'Сомони' },
  kk: { KZT: 'Теңге', USD: 'Доллар', RUB: 'Рубль', UZS: 'Сум', TJS: 'Сомони' },
  en: { KZT: 'Tenge', USD: 'Dollar', RUB: 'Ruble', UZS: 'Som', TJS: 'Somoni' },
  uz: { KZT: 'Tenge', USD: 'Dollar', RUB: 'Rubl', UZS: 'So\'m', TJS: 'Somoni' },
  tj: { KZT: 'Тенге', USD: 'Доллар', RUB: 'Рубл', UZS: 'Сум', TJS: 'Сомонӣ' },
  zh: { KZT: '坚戈', USD: '美元', RUB: '卢布', UZS: '苏姆', TJS: '索莫尼' },
  tr: { KZT: 'Tenge', USD: 'Dolar', RUB: 'Ruble', UZS: 'Som', TJS: 'Somoni' },
  ky: { KZT: 'Теңге', USD: 'Доллар', RUB: 'Рубль', UZS: 'Сум', TJS: 'Сомони' }
};

const translations = {
  ru: { title: 'Отели & Хостелы', subtitle: 'Найдите жилье по вашему бюджету', search: 'Поиск по названию, типу или адресу...', all: 'Все', budget: 'Бюджет', pricePerNight: 'Цена за ночь', address: 'Адрес', phone: 'Телефон', website: 'Сайт', noResults: 'Ничего не найдено', showMap: 'Карта', listView: 'Список', currency: 'Валюта', hotels: 'отелей', amenities: 'Удобства' },
  kk: { title: 'Қонақ үйлер & Хостелдер', subtitle: 'Бюджетіңізге сай тұратын жер табыңыз', search: 'Атауы, түрі немесе мекенжайы бойынша іздеу...', all: 'Барлығы', budget: 'Бюджет', pricePerNight: 'Түнгі бағасы', address: 'Мекенжай', phone: 'Телефон', website: 'Сайт', noResults: 'Ештеңе табылмады', showMap: 'Карта', listView: 'Тізім', currency: 'Валюта', hotels: 'қонақ үй', amenities: 'Қолайлылықтар' },
  en: { title: 'Hotels & Hostels', subtitle: 'Find accommodation that fits your budget', search: 'Search by name, type or address...', all: 'All', budget: 'Budget', pricePerNight: 'Price per night', address: 'Address', phone: 'Phone', website: 'Website', noResults: 'Nothing found', showMap: 'Map', listView: 'List', currency: 'Currency', hotels: 'hotels', amenities: 'Amenities' },
  uz: { title: 'Mehmonxonalar & Xostellar', subtitle: 'Byudjetingizga mos turar joy toping', search: 'Nomi, turi yoki manzili bo\'yicha qidirish...', all: 'Barchasi', budget: 'Byudjet', pricePerNight: 'Bir kecha narxi', address: 'Manzil', phone: 'Telefon', website: 'Sayt', noResults: 'Hech narsa topilmadi', showMap: 'Xarita', listView: 'Ro\'yxat', currency: 'Valyuta', hotels: 'mehmonxona', amenities: 'Qulayliklar' },
  tj: { title: 'Меҳмонхона & Хостелҳо', subtitle: 'Ҷойи истиқомати мувофиқи буҷаи худро ёбед', search: 'Ҷустуҷӯ аз рӯи ном, навъ ё суроға...', all: 'Ҳама', budget: 'Буҷа', pricePerNight: 'Нархи як шаб', address: 'Суроға', phone: 'Телефон', website: 'Сайт', noResults: 'Ҳеҷ чиз ёфт нашуд', showMap: 'Харита', listView: 'Рӯйхат', currency: 'Асъор', hotels: 'меҳмонхона', amenities: 'Шароитҳо' },
  zh: { title: '酒店和旅馆', subtitle: '找到适合您预算的住宿', search: '按名称、类型或地址搜索...', all: '全部', budget: '预算', pricePerNight: '每晚价格', address: '地址', phone: '电话', website: '网站', noResults: '未找到结果', showMap: '地图', listView: '列表', currency: '货币', hotels: '酒店', amenities: '设施' },
  tr: { title: 'Oteller & Hosteller', subtitle: 'Bütçenize uygun konaklama bulun', search: 'İsim, tür veya adresle arayın...', all: 'Tümü', budget: 'Bütçe', pricePerNight: 'Gecelik fiyat', address: 'Adres', phone: 'Telefon', website: 'Web sitesi', noResults: 'Sonuç bulunamadı', showMap: 'Harita', listView: 'Liste', currency: 'Para birimi', hotels: 'otel', amenities: 'Olanaklar' },
  ky: { title: 'Мейманканалар & Хостелдер', subtitle: 'Бюджетиңизге ылайык жашоо орду табыңыз', search: 'Аты, түрү же дареги боюнча издөө...', all: 'Баары', budget: 'Бюджет', pricePerNight: 'Бир түн үчүн баасы', address: 'Дарек', phone: 'Телефон', website: 'Сайт', noResults: 'Эч нерсе табылган жок', showMap: 'Карта', listView: 'Тизме', currency: 'Валюта', hotels: 'мейманкана', amenities: 'Шарттар' }
};

export const Hotels: React.FC = () => {
  const { language } = useLanguage();
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('KZT');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language as keyof typeof translations] || translations.ru;
  const budgetLabels = BUDGET_LABELS[language as keyof typeof BUDGET_LABELS] || BUDGET_LABELS.ru;
  const currencyNames = CURRENCY_NAMES[language as keyof typeof CURRENCY_NAMES] || CURRENCY_NAMES.ru;

  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      const data = await getHotels();
      setHotels(data);
      setLoading(false);
    };
    loadHotels();
  }, []);

  const filteredHotels = hotels.filter(hotel => {
    const matchesBudget = budgetFilter === 'all' || hotel.budget === budgetFilter;
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBudget && matchesSearch;
  });

  const budgetStats = {
    budget: hotels.filter(h => h.budget === 'budget').length,
    medium: hotels.filter(h => h.budget === 'medium').length,
    premium: hotels.filter(h => h.budget === 'premium').length,
  };

  const almatyCenter: [number, number] = [43.238949, 76.889709];

  const createMarkerIcon = (budget: string) => {
    const colors = { budget: '#10b981', medium: '#3b82f6', premium: '#a855f7' };
    const color = colors[budget as keyof typeof colors] || '#64748B';
    return new DivIcon({
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="transform: rotate(45deg); color: white; font-size: 14px;">🏨</div>
      </div>`,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const formatPrice = (price: number, currency: Currency) => {
    return `${price.toLocaleString()} ${CURRENCY_SYMBOLS[currency]}`;
  };

  if (loading) {
    return (
      <div className="pb-24 md:pb-10">
        <div className="p-6 md:p-10 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 size={48} className="animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-10">
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <header>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
          </header>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showMap ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <MapIcon size={18} />
            {showMap ? t.listView : t.showMap}
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        {/* Budget Filter */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.budget}</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setBudgetFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                budgetFilter === 'all' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.all} ({hotels.length})
            </button>
            {(['budget', 'medium', 'premium'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setBudgetFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  budgetFilter === key ? `bg-gradient-to-r ${BUDGET_COLORS[key]} text-white` : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {budgetLabels[key]} ({budgetStats[key]})
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selector */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.currency}</h3>
          <div className="flex gap-2 flex-wrap">
            {(['KZT', 'USD', 'RUB', 'UZS', 'TJS'] as Currency[]).map((currency) => (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCurrency === currency ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {CURRENCY_SYMBOLS[currency]} {currencyNames[currency]}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filteredHotels.length} {t.hotels}
        </p>
      </div>

      {/* Map View */}
      {showMap && filteredHotels.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-[400px] md:h-[500px] mx-6 md:mx-10 rounded-xl overflow-hidden shadow-lg"
        >
          <MapContainer center={almatyCenter} zoom={12} style={{ height: '100%', width: '100%' }} className="z-0">
            <MapResizer />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            {filteredHotels.map((hotel) => (
              <Marker key={hotel.id} position={[hotel.lat, hotel.lng]} icon={createMarkerIcon(hotel.budget)}>
                <Popup>
                  <div className="min-w-[180px]">
                    <h4 className="font-bold text-sm mb-1">{hotel.name}</h4>
                    <p className="text-xs text-slate-600 mb-1">{hotel.type}</p>
                    <p className="text-xs text-slate-500 mb-2">{hotel.address}</p>
                    <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                      <DollarSign size={14} />
                      {formatPrice(hotel.prices[selectedCurrency], selectedCurrency)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>
      )}

      {/* Hotel Cards */}
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        {!showMap && filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all">
                  <div className={`h-2 bg-gradient-to-r ${BUDGET_COLORS[hotel.budget]}`} />
                  <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{hotel.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{hotel.type}</p>
                      </div>
                      {hotel.rating && (
                        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">{hotel.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center gap-2 text-xl font-bold text-green-600 dark:text-green-400">
                        <DollarSign size={20} />
                        {formatPrice(hotel.prices[selectedCurrency], selectedCurrency)}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.pricePerNight}</p>
                    </div>

                    {/* Amenities */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.amenities}:</p>
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities.map((amenity, idx) => (
                            <span key={idx} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    <div className="mb-3 flex gap-2">
                      <MapPin size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 dark:text-slate-300">{hotel.address}</p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3 mt-auto">
                      {hotel.phone && (
                        <a href={`tel:${hotel.phone}`} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          <Phone size={14} />
                          {hotel.phone}
                        </a>
                      )}
                      {hotel.website && (
                        <a href={`https://${hotel.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          <Globe size={14} />
                          {hotel.website}
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : !showMap ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">{t.noResults}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
