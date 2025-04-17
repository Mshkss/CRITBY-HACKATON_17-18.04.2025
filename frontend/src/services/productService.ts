
import { ProductEstimate } from '@/types/survey';

// Функция для создания docx документа
export const generateDocument = async (items: string[], contactData?: any): Promise<Blob> => {
  try {
    const requestBody = {
      items,
      contactData
    };
    
    // Логирование запроса для дебага
    console.log("Отправка запроса на:", "http://127.0.0.1:8000/app1/generate_docx/");
    console.log("Данные запроса:", JSON.stringify(requestBody));
    
    const response = await fetch("http://127.0.0.1:8000/app1/generate_docx/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Ошибка при создании документа');
    }

    return await response.blob();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Функция для скачивания созданного документа
export const downloadDocument = (blob: Blob, filename: string = "output.docx") => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Функция для генерации оценки стоимости на основе выбранных товаров
export const generateCostEstimate = (selectedTags: string[]): ProductEstimate => {
  // Базовая стоимость в зависимости от типа дрона
  let baseCost = 500000; // Базовая стоимость по умолчанию

  // Увеличение базовой стоимости на основе типа дрона
  if (selectedTags.includes('тип_бпла')) {
    if (selectedTags.includes('бпла_мультикоптер')) {
      baseCost = 400000;
    } else if (selectedTags.includes('бпла_самолетный_тип')) {
      baseCost = 700000;
    } else if (selectedTags.includes('бпла_вертикальный_взлет_посадка')) {
      baseCost = 900000;
    } else if (selectedTags.includes('бпла_вертолетный_тип')) {
      baseCost = 650000;
    }
  }

  // Модификаторы на основе задач
  let taskMultiplier = 1.0;
  const taskTags = selectedTags.filter(tag => tag.startsWith('задача_'));
  if (taskTags.length > 0) {
    taskMultiplier += taskTags.length * 0.05;
    
    // Специальные задачи имеют более высокий коэффициент
    if (selectedTags.includes('задача_аэрофотосъемка')) taskMultiplier += 0.1;
    if (selectedTags.includes('задача_мультиспектральная_съемка')) taskMultiplier += 0.25;
    if (selectedTags.includes('задача_тепловизионная_съемка')) taskMultiplier += 0.2;
    if (selectedTags.includes('задача_картография')) taskMultiplier += 0.15;
  }

  // Модификаторы на основе полезной нагрузки
  let payloadMultiplier = 1.0;
  if (selectedTags.includes('пн_тепловизор')) payloadMultiplier += 0.3;
  if (selectedTags.includes('пн_мультиспектр')) payloadMultiplier += 0.35;
  if (selectedTags.includes('пн_видеокамера_4k')) payloadMultiplier += 0.15;
  if (selectedTags.includes('пн_лидар')) payloadMultiplier += 0.4;

  // Модификаторы на основе характеристик полета
  if (selectedTags.includes('полет_продолжительность_3-6ч')) baseCost += 200000;
  if (selectedTags.includes('полет_продолжительность_более_6ч')) baseCost += 350000;
  if (selectedTags.includes('полет_дальность_30-100км')) baseCost += 150000;
  if (selectedTags.includes('полет_дальность_более_100км')) baseCost += 300000;

  // Модификаторы на основе функций
  if (selectedTags.includes('функция_полная_автономность')) baseCost += 180000;
  if (selectedTags.includes('функция_предотвращение_столкновений')) baseCost += 120000;

  // Расчет минимальной и максимальной стоимости (разброс 10-30%)
  const finalBaseCost = baseCost * taskMultiplier * payloadMultiplier;
  const varianceFactor = 0.1 + Math.random() * 0.2; // Между 10% и 30%
  
  return {
    minCost: Math.round(finalBaseCost),
    maxCost: Math.round(finalBaseCost * (1 + varianceFactor))
  };
};
