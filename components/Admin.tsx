import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import {
  Users, MapPin, FileText, Utensils, Settings, Shield,
  Plus, Trash2, Edit2, Save, X, Loader2, AlertCircle,
  Database, Upload, Check, ChevronDown, ChevronUp, ClipboardList
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  getGuides, getHelpCenters, getRestaurants, getProcedures,
  seedGuides, seedHelpCenters, seedRestaurants, seedProcedures,
  addRestaurant, updateRestaurant, deleteRestaurant,
  addHelpCenter, updateHelpCenter, deleteHelpCenter,
  addGuide, updateGuide, deleteGuide,
  addProcedure, updateProcedure, deleteProcedure,
  getStatistics,
} from '../services/firestore';
import { GUIDES, HELP_CENTERS, RESTAURANTS, DOCUMENT_PROCEDURES } from '../data';
import { Restaurant, HelpCenter, Guide, DocumentProcedure } from '../types';

const translations = {
  ru: {
    title: 'Админ-панель',
    subtitle: 'Управление приложением',
    users: 'Пользователи',
    restaurants: 'Рестораны',
    helpCenters: 'Центры помощи',
    procedures: 'Процедуры',
    guides: 'Инструкции',
    settings: 'Настройки',
    data: 'Данные',
    noAccess: 'У вас нет доступа к админ-панели',
    loading: 'Загрузка...',
    totalUsers: 'Всего пользователей',
    admins: 'Администраторов',
    makeAdmin: 'Сделать админом',
    removeAdmin: 'Убрать админа',
    delete: 'Удалить',
    save: 'Сохранить',
    cancel: 'Отмена',
    add: 'Добавить',
    edit: 'Редактировать',
    name: 'Имя/Название',
    email: 'Email',
    role: 'Роль',
    actions: 'Действия',
    admin: 'Админ',
    user: 'Пользователь',
    confirmDelete: 'Вы уверены?',
    statistics: 'Статистика',
    migrateData: 'Миграция данных',
    migrateDescription: 'Загрузить начальные данные из приложения в Firestore',
    migrateRestaurants: 'Загрузить рестораны',
    migrateHelpCenters: 'Загрузить центры помощи',
    migrateGuides: 'Загрузить инструкции',
    migrateProcedures: 'Загрузить процедуры',
    migrateAll: 'Загрузить все данные',
    migrationSuccess: 'Данные успешно загружены!',
    migrationError: 'Ошибка загрузки данных',
    address: 'Адрес',
    cuisine: 'Кухня',
    budget: 'Бюджет',
    phone: 'Телефон',
    rating: 'Рейтинг',
    type: 'Тип',
    workingHours: 'Часы работы',
    lat: 'Широта',
    lng: 'Долгота',
    description: 'Описание',
    icon: 'Иконка',
    processingTime: 'Время обработки',
    noData: 'Нет данных. Загрузите данные во вкладке "Данные"',
  },
  en: {
    title: 'Admin Panel',
    subtitle: 'Application management',
    users: 'Users',
    restaurants: 'Restaurants',
    helpCenters: 'Help Centers',
    procedures: 'Procedures',
    guides: 'Guides',
    settings: 'Settings',
    data: 'Data',
    noAccess: 'You do not have access to the admin panel',
    loading: 'Loading...',
    totalUsers: 'Total users',
    admins: 'Administrators',
    makeAdmin: 'Make admin',
    removeAdmin: 'Remove admin',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    edit: 'Edit',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    actions: 'Actions',
    admin: 'Admin',
    user: 'User',
    confirmDelete: 'Are you sure?',
    statistics: 'Statistics',
    migrateData: 'Data Migration',
    migrateDescription: 'Upload initial data from application to Firestore',
    migrateRestaurants: 'Upload restaurants',
    migrateHelpCenters: 'Upload help centers',
    migrateGuides: 'Upload guides',
    migrateProcedures: 'Upload procedures',
    migrateAll: 'Upload all data',
    migrationSuccess: 'Data uploaded successfully!',
    migrationError: 'Error uploading data',
    address: 'Address',
    cuisine: 'Cuisine',
    budget: 'Budget',
    phone: 'Phone',
    rating: 'Rating',
    type: 'Type',
    workingHours: 'Working Hours',
    lat: 'Latitude',
    lng: 'Longitude',
    description: 'Description',
    icon: 'Icon',
    processingTime: 'Processing Time',
    noData: 'No data. Upload data in the "Data" tab',
  },
};

interface UserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
  createdAt: any;
}

type TabType = 'stats' | 'users' | 'data' | 'restaurants' | 'helpCenters' | 'guides' | 'procedures';

export const Admin: React.FC = () => {
  const { language } = useLanguage();
  const { user, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [helpCenters, setHelpCenters] = useState<HelpCenter[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [procedures, setProcedures] = useState<DocumentProcedure[]>([]);
  const [stats, setStats] = useState({ users: 0, admins: 0, restaurants: 0, helpCenters: 0, guides: 0, procedures: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({
    restaurants: 'idle',
    helpCenters: 'idle',
    guides: 'idle',
    procedures: 'idle',
  });

  // Edit modal state
  const [editModal, setEditModal] = useState<{ type: string; item: any } | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const t = translations[language as keyof typeof translations] || translations.ru;

  useEffect(() => {
    if (userData?.isAdmin) {
      loadAllData();
    }
  }, [userData]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersData, restaurantsData, helpCentersData, guidesData, proceduresData] = await Promise.all([
        getDocs(collection(db, 'users')),
        getRestaurants(),
        getHelpCenters(),
        getGuides(),
        getProcedures(),
      ]);

      const usersArray = usersData.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as UserRecord[];
      setUsers(usersArray);
      setRestaurants(restaurantsData);
      setHelpCenters(helpCentersData);
      setGuides(guidesData);
      setProcedures(proceduresData);

      setStats({
        users: usersArray.length,
        admins: usersArray.filter(u => u.isAdmin).length,
        restaurants: restaurantsData.length,
        helpCenters: helpCentersData.length,
        guides: guidesData.length,
        procedures: proceduresData.length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMigrate = async (type: 'restaurants' | 'helpCenters' | 'guides' | 'procedures' | 'all') => {
    const migrate = async (key: string, fn: () => Promise<void>) => {
      setMigrationStatus(prev => ({ ...prev, [key]: 'loading' }));
      try {
        await fn();
        setMigrationStatus(prev => ({ ...prev, [key]: 'success' }));
      } catch (error) {
        console.error(`Error migrating ${key}:`, error);
        setMigrationStatus(prev => ({ ...prev, [key]: 'error' }));
      }
    };

    if (type === 'all') {
      await migrate('restaurants', () => seedRestaurants(RESTAURANTS));
      await migrate('helpCenters', () => seedHelpCenters(HELP_CENTERS));
      await migrate('guides', () => seedGuides(GUIDES));
      await migrate('procedures', () => seedProcedures(DOCUMENT_PROCEDURES));
    } else if (type === 'restaurants') {
      await migrate('restaurants', () => seedRestaurants(RESTAURANTS));
    } else if (type === 'helpCenters') {
      await migrate('helpCenters', () => seedHelpCenters(HELP_CENTERS));
    } else if (type === 'guides') {
      await migrate('guides', () => seedGuides(GUIDES));
    } else if (type === 'procedures') {
      await migrate('procedures', () => seedProcedures(DOCUMENT_PROCEDURES));
    }

    await loadAllData();
  };

  const toggleAdmin = async (uid: string, currentStatus: boolean) => {
    try {
      setActionLoading(uid);
      await updateDoc(doc(db, 'users', uid), { isAdmin: !currentStatus });
      setUsers(users.map(u => u.uid === uid ? { ...u, isAdmin: !currentStatus } : u));
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      setActionLoading(uid);
      await deleteDoc(doc(db, 'users', uid));
      setUsers(users.filter(u => u.uid !== uid));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteItem = async (type: string, id: string) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      setActionLoading(id);
      if (type === 'restaurant') {
        await deleteRestaurant(id);
        setRestaurants(restaurants.filter(r => r.id !== id));
      } else if (type === 'helpCenter') {
        await deleteHelpCenter(id);
        setHelpCenters(helpCenters.filter(h => h.id !== id));
      } else if (type === 'guide') {
        await deleteGuide(id);
        setGuides(guides.filter(g => g.id !== id));
      } else if (type === 'procedure') {
        await deleteProcedure(id);
        setProcedures(procedures.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (type: string, item: any) => {
    setEditModal({ type, item });
    setEditForm({ ...item });
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    try {
      setActionLoading(editForm.id);
      const { type } = editModal;

      if (type === 'restaurant') {
        await updateRestaurant(editForm.id, editForm);
        setRestaurants(restaurants.map(r => r.id === editForm.id ? editForm : r));
      } else if (type === 'helpCenter') {
        await updateHelpCenter(editForm.id, editForm);
        setHelpCenters(helpCenters.map(h => h.id === editForm.id ? editForm : h));
      } else if (type === 'guide') {
        await updateGuide(editForm.id, editForm);
        setGuides(guides.map(g => g.id === editForm.id ? editForm : g));
      } else if (type === 'procedure') {
        await updateProcedure(editForm.id, editForm);
        setProcedures(procedures.map(p => p.id === editForm.id ? editForm : p));
      }

      setEditModal(null);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Show loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // Check if user is admin
  if (!userData?.isAdmin) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t.noAccess}</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            На главную
          </button>
        </Card>
      </div>
    );
  }

  const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'stats', icon: <FileText size={18} />, label: t.statistics },
    { id: 'data', icon: <Database size={18} />, label: t.data },
    { id: 'users', icon: <Users size={18} />, label: t.users },
    { id: 'restaurants', icon: <Utensils size={18} />, label: t.restaurants },
    { id: 'helpCenters', icon: <MapPin size={18} />, label: t.helpCenters },
    { id: 'guides', icon: <FileText size={18} />, label: t.guides },
    { id: 'procedures', icon: <ClipboardList size={18} />, label: t.procedures },
  ];

  const MigrationButton = ({ type, label, count }: { type: 'restaurants' | 'helpCenters' | 'guides' | 'procedures'; label: string; count: number }) => (
    <button
      onClick={() => handleMigrate(type)}
      disabled={migrationStatus[type] === 'loading'}
      className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all ${
        migrationStatus[type] === 'success'
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
          : migrationStatus[type] === 'error'
          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <Upload size={20} className={migrationStatus[type] === 'success' ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'} />
        <div className="text-left">
          <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{count} записей</p>
        </div>
      </div>
      {migrationStatus[type] === 'loading' ? (
        <Loader2 size={20} className="animate-spin text-blue-600" />
      ) : migrationStatus[type] === 'success' ? (
        <Check size={20} className="text-green-600" />
      ) : (
        <ChevronDown size={20} className="text-slate-400" />
      )}
    </button>
  );

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {[
            { icon: Users, value: stats.users, label: t.totalUsers, color: 'blue' },
            { icon: Shield, value: stats.admins, label: t.admins, color: 'purple' },
            { icon: Utensils, value: stats.restaurants, label: t.restaurants, color: 'green' },
            { icon: MapPin, value: stats.helpCenters, label: t.helpCenters, color: 'orange' },
            { icon: FileText, value: stats.guides, label: t.guides, color: 'cyan' },
            { icon: ClipboardList, value: stats.procedures, label: t.procedures, color: 'pink' },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon size={20} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Data Migration Tab */}
      {activeTab === 'data' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{t.migrateData}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t.migrateDescription}</p>

            <div className="space-y-3">
              <MigrationButton type="restaurants" label={t.migrateRestaurants} count={RESTAURANTS.length} />
              <MigrationButton type="helpCenters" label={t.migrateHelpCenters} count={HELP_CENTERS.length} />
              <MigrationButton type="guides" label={t.migrateGuides} count={GUIDES.length} />
              <MigrationButton type="procedures" label={t.migrateProcedures} count={DOCUMENT_PROCEDURES.length} />
            </div>

            <button
              onClick={() => handleMigrate('all')}
              disabled={Object.values(migrationStatus).some(s => s === 'loading')}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {Object.values(migrationStatus).some(s => s === 'loading') ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Upload size={20} />
              )}
              {t.migrateAll}
            </button>
          </Card>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 size={32} className="animate-spin text-blue-600 mx-auto" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.name}</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.email}</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.role}</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {users.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                              {(u.displayName || u.email || '?')[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{u.displayName || 'No name'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            u.isAdmin ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {u.isAdmin && <Shield size={12} />}
                            {u.isAdmin ? t.admin : t.user}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.uid !== userData?.uid && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleAdmin(u.uid, u.isAdmin)}
                                disabled={actionLoading === u.uid}
                                className={`px-3 py-1 rounded text-xs font-medium ${
                                  u.isAdmin ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                }`}
                              >
                                {actionLoading === u.uid ? <Loader2 size={12} className="animate-spin" /> : u.isAdmin ? t.removeAdmin : t.makeAdmin}
                              </button>
                              <button onClick={() => handleDeleteUser(u.uid)} disabled={actionLoading === u.uid} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            {restaurants.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t.noData}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.name}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.address}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.cuisine}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.budget}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {restaurants.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{r.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{r.address}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{r.cuisine}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            r.budget === 'budget' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            r.budget === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>{r.budget}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal('restaurant', r)} className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteItem('restaurant', r.id)} disabled={actionLoading === r.id} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Help Centers Tab */}
      {activeTab === 'helpCenters' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            {helpCenters.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t.noData}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.name}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.type}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.address}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.workingHours}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {helpCenters.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{h.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            h.type === 'mfc' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            h.type === 'hospital' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            h.type === 'police' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>{h.type}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{h.address}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{h.workingHours}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal('helpCenter', h)} className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteItem('helpCenter', h.id)} disabled={actionLoading === h.id} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            {guides.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t.noData}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.name}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.description}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.icon}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {guides.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{g.title}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{g.description}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{g.icon}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal('guide', g)} className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteItem('guide', g.id)} disabled={actionLoading === g.id} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Procedures Tab */}
      {activeTab === 'procedures' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            {procedures.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t.noData}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.name}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.processingTime}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {procedures.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{p.title}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.processingTime}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal('procedure', p)} className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteItem('procedure', p.id)} disabled={actionLoading === p.id} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.edit}</h3>
              <button onClick={() => setEditModal(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              {editModal.type === 'restaurant' && (
                <>
                  <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder={t.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <input type="text" value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} placeholder={t.address} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <input type="text" value={editForm.cuisine || ''} onChange={(e) => setEditForm({ ...editForm, cuisine: e.target.value })} placeholder={t.cuisine} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <select value={editForm.budget || 'budget'} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    <option value="budget">Budget</option>
                    <option value="medium">Medium</option>
                    <option value="premium">Premium</option>
                  </select>
                  <input type="text" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder={t.phone} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                </>
              )}

              {editModal.type === 'helpCenter' && (
                <>
                  <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder={t.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <input type="text" value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} placeholder={t.address} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <select value={editForm.type || 'mfc'} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    <option value="mfc">MFC</option>
                    <option value="hospital">Hospital</option>
                    <option value="police">Police</option>
                    <option value="legal">Legal</option>
                  </select>
                  <input type="text" value={editForm.workingHours || ''} onChange={(e) => setEditForm({ ...editForm, workingHours: e.target.value })} placeholder={t.workingHours} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                </>
              )}

              {editModal.type === 'guide' && (
                <>
                  <input type="text" value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder={t.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <textarea value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder={t.description} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <input type="text" value={editForm.icon || ''} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} placeholder={t.icon} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                </>
              )}

              {editModal.type === 'procedure' && (
                <>
                  <input type="text" value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder={t.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <textarea value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder={t.description} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                  <input type="text" value={editForm.processingTime || ''} onChange={(e) => setEditForm({ ...editForm, processingTime: e.target.value })} placeholder={t.processingTime} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                {t.cancel}
              </button>
              <button onClick={handleSaveEdit} disabled={actionLoading === editForm.id} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
                {actionLoading === editForm.id ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {t.save}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
