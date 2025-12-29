/**
 * Скрипт миграции данных в Firestore
 *
 * Запуск:
 * 1. npm run dev
 * 2. Откройте браузер на http://localhost:5173
 * 3. Откройте консоль (F12)
 * 4. Скопируйте и вставьте код ниже в консоль
 */

import { db } from './config/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { GUIDES, HELP_CENTERS, RESTAURANTS, DOCUMENT_PROCEDURES } from './data';

async function migrateAllData() {
  console.log('🚀 Начинаю миграцию данных в Firestore...');

  try {
    // Guides
    console.log('📖 Загружаю инструкции...');
    const guidesBatch = writeBatch(db);
    GUIDES.forEach((guide) => {
      const docRef = doc(db, 'guides', guide.id);
      guidesBatch.set(docRef, guide);
    });
    await guidesBatch.commit();
    console.log(`✅ Загружено ${GUIDES.length} инструкций`);

    // Help Centers
    console.log('🏢 Загружаю центры помощи...');
    const centersBatch = writeBatch(db);
    HELP_CENTERS.forEach((center) => {
      const docRef = doc(db, 'helpCenters', center.id);
      centersBatch.set(docRef, center);
    });
    await centersBatch.commit();
    console.log(`✅ Загружено ${HELP_CENTERS.length} центров помощи`);

    // Restaurants
    console.log('🍽️ Загружаю рестораны...');
    const restaurantsBatch = writeBatch(db);
    RESTAURANTS.forEach((restaurant) => {
      const docRef = doc(db, 'restaurants', restaurant.id);
      restaurantsBatch.set(docRef, restaurant);
    });
    await restaurantsBatch.commit();
    console.log(`✅ Загружено ${RESTAURANTS.length} ресторанов`);

    // Procedures
    console.log('📋 Загружаю процедуры...');
    const proceduresBatch = writeBatch(db);
    DOCUMENT_PROCEDURES.forEach((procedure) => {
      const docRef = doc(db, 'procedures', procedure.id);
      proceduresBatch.set(docRef, procedure);
    });
    await proceduresBatch.commit();
    console.log(`✅ Загружено ${DOCUMENT_PROCEDURES.length} процедур`);

    console.log('🎉 Миграция завершена успешно!');
    console.log('Всего загружено:');
    console.log(`  - Инструкции: ${GUIDES.length}`);
    console.log(`  - Центры помощи: ${HELP_CENTERS.length}`);
    console.log(`  - Рестораны: ${RESTAURANTS.length}`);
    console.log(`  - Процедуры: ${DOCUMENT_PROCEDURES.length}`);
  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  }
}

// Экспортируем функцию для использования
export { migrateAllData };

// Автоматический запуск, если этот файл импортируется
if (typeof window !== 'undefined') {
  (window as any).migrateAllData = migrateAllData;
  console.log('💡 Доступна функция: migrateAllData()');
  console.log('💡 Запустите в консоли: migrateAllData()');
}
