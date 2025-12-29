import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { ChevronDown, Clock, FileText, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getProcedures } from '../services/firestore';
import { DocumentProcedure, DocumentStep } from '../types';
import { useLanguage } from '../hooks/useLanguage';

type IconType = keyof typeof iconMap;

const iconMap = {
  'FileText': FileText,
  'Clock': Clock,
  'MapPin': MapPin,
  'AlertCircle': AlertCircle,
};

const translations = {
  ru: { title: 'Процедуры оформления', subtitle: 'Пошаговые инструкции по документам', progress: 'Прогресс', requiredDocs: 'Необходимые документы:', processingTime: 'Время', cost: 'Стоимость', steps: 'Шаги оформления:', },
  kk: { title: 'Ресімдеу процедурасы', subtitle: 'Құжаттар бойынша ешпе сыбарлау', progress: 'Ағымдалуы', requiredDocs: 'Қажетті құжаттар:', processingTime: 'Уақыт', cost: 'Құны', steps: 'Ресімдеу қадамдары:', },
  en: { title: 'Registration Procedures', subtitle: 'Step-by-step document guides', progress: 'Progress', requiredDocs: 'Required documents:', processingTime: 'Processing time', cost: 'Cost', steps: 'Registration steps:', },
  uz: { title: 'Rasmiylashtirish Protseduraları', subtitle: 'Hujjat bo\'yicha bosqichma-bosqich ko\'rsatmalar', progress: 'Taraqqiyot', requiredDocs: 'Kerakli hujjatlar:', processingTime: 'Qayta ishlash vaqti', cost: 'Narxi', steps: 'Rasmiylashtirish bosqichlari:', },
  tj: { title: 'Рӯйхати Регистрирон', subtitle: 'Дастури қадами бо қадам бо ҳуҷҷатҳо', progress: 'Пешрафт', requiredDocs: 'Ҳуҷҷатҳои лозим:', processingTime: 'Вақти қайд кунӣ', cost: 'Нарх', steps: 'Қадамҳои регистрирон:', },
  zh: { title: '登记程序', subtitle: '分步文件指南', progress: '进度', requiredDocs: '所需文件：', processingTime: '处理时间', cost: '费用', steps: '登记步骤：', },
  tr: { title: 'Kayıt Prosedürleri', subtitle: 'Adım adım belge kılavuzları', progress: 'İlerleme', requiredDocs: 'Gerekli belgeler:', processingTime: 'İşlem süresi', cost: 'Maliyet', steps: 'Kayıt adımları:', },
  ky: { title: 'Каттоо процедурасы', subtitle: 'Баскычтан-баскычка документ колдонмолору', progress: 'Улутуу', requiredDocs: 'Керектүү документтер:', processingTime: 'Иштетүү убактысы', cost: 'Баасы', steps: 'Каттоо кадамдары:', }
};

export const DocumentProcedures: React.FC = () => {
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<string>>>({});
  const [procedures, setProcedures] = useState<DocumentProcedure[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language as keyof typeof translations] || translations.ru;

  useEffect(() => {
    const loadProcedures = async () => {
      setLoading(true);
      const data = await getProcedures();
      setProcedures(data);
      setLoading(false);
    };
    loadProcedures();
  }, []);

  const toggleStep = (procedureId: string, stepId: string) => {
    setCompletedSteps(prev => {
      const updated = { ...prev };
      if (!updated[procedureId]) {
        updated[procedureId] = new Set();
      }
      const stepSet = new Set(updated[procedureId]);
      if (stepSet.has(stepId)) {
        stepSet.delete(stepId);
      } else {
        stepSet.add(stepId);
      }
      updated[procedureId] = stepSet;
      return updated;
    });
  };

  const getStepProgress = (procedureId: string) => {
    const completed = completedSteps[procedureId]?.size || 0;
    const procedure = procedures.find(p => p.id === procedureId);
    const total = procedure?.steps.length || 0;
    return { completed, total };
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 pb-24 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const Icon = iconMap[iconName as IconType] || FileText;
    return Icon;
  };

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10 max-w-4xl mx-auto space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
      </header>

      {/* Procedures List */}
      <div className="space-y-4">
        {procedures.map((procedure) => {
          const isExpanded = expandedId === procedure.id;
          const progress = getStepProgress(procedure.id);
          const progressPercent = (progress.completed / progress.total) * 100;
          const Icon = getIconComponent(procedure.icon);

          return (
            <motion.div key={procedure.id}>
              <Card className="overflow-hidden">
                {/* Header - Clickable */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : procedure.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Icon size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {procedure.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {procedure.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-3 w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            {t.progress}
                          </span>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <ChevronDown size={24} className="text-slate-400 dark:text-slate-500" />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-200 dark:border-slate-700"
                    >
                      <div className="p-6 space-y-6">
                        {/* Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {procedure.processingTime && (
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {t.processingTime}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {procedure.processingTime}
                              </p>
                            </div>
                          )}

                          {procedure.cost && (
                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText size={16} className="text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {t.cost}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {procedure.cost.amount} {procedure.cost.currency}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Required Documents */}
                        {procedure.requiredDocuments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                              {t.requiredDocs}
                            </h4>
                            <ul className="space-y-2">
                              {procedure.requiredDocuments.map((doc, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                                >
                                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Steps */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                            {t.steps}
                          </h4>
                          <div className="space-y-3">
                            {procedure.steps.map((step, stepIndex) => {
                              const isCompleted = completedSteps[procedure.id]?.has(step.id);
                              return (
                                <button
                                  key={step.id}
                                  onClick={() => toggleStep(procedure.id, step.id)}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    isCompleted
                                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {isCompleted ? (
                                        <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
                                      ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            {stepIndex + 1}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <h5
                                        className={`font-medium mb-1 ${
                                          isCompleted
                                            ? 'text-green-900 dark:text-green-100 line-through'
                                            : 'text-slate-900 dark:text-slate-100'
                                        }`}
                                      >
                                        {step.title}
                                      </h5>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {step.description}
                                      </p>

                                      {step.location && (
                                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                          <MapPin size={12} />
                                          {step.location}
                                        </div>
                                      )}

                                      {step.duration && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                          <Clock size={12} />
                                          {step.duration}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
