import { CustomerRequest, RequestStatus, QuestionnaireAnswers, EquipmentType } from '../types';

// CSV Format
// "ФИО,Номер,Почта,Список товаров,Время заполнения заявки,Статус,Комментарии"
// "Иванов Иван Иванович,79001234567,ivanov@example.com,\"БПЛА miniSIGMA, Авионика Автопилот АП-05\",2024-01-20 10:00:00,Новая,"

export const parseCSV = (csv: string): CustomerRequest[] => {
  if (!csv || typeof csv !== 'string') {
    console.error('Invalid CSV data:', csv);
    return [];
  }

  const lines = csv.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim() !== '');
  
  return dataLines.map((line, index) => {
    try {
      const parts: string[] = [];
      let inQuotes = false;
      let current = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      
      parts.push(current);
      
      const [
        fullName, phoneNumber, email, productsList, timestamp, status, comments,
        equipmentType, mainTasks, flightDuration, controlRange, payload, vtol,
        dataTypes, stabilization, realtimeVideo, realtimeHeavyData, automation,
        quickPreparation, temperatureMode, windSpeed, nightFlights, noInfrastructure,
        components, remoteControlFeatures, equipment, countryOfOrigin
      ] = parts;

      const questionnaireAnswers: QuestionnaireAnswers | undefined = parts.length > 7 ? {
        equipmentType: equipmentType as EquipmentType,
        mainTasks: mainTasks?.split(';') || [],
        flightDuration,
        controlRange,
        payload,
        vtol: vtol === 'Да',
        dataTypes: dataTypes?.split(';') || [],
        stabilization: stabilization === 'Да',
        realtimeVideo: realtimeVideo === 'Да',
        realtimeHeavyData: realtimeHeavyData === 'Да',
        automation: automation?.split(';') || [],
        quickPreparation: quickPreparation === 'Да',
        temperatureMode,
        windSpeed,
        nightFlights: nightFlights === 'Да',
        noInfrastructure: noInfrastructure === 'Да',
        components: components?.split(';') || [],
        remoteControlFeatures: remoteControlFeatures?.split(';') || [],
        equipment: equipment?.split(';') || [],
        countryOfOrigin
      } : undefined;

      const products = productsList?.includes(',') 
        ? productsList.split(',').map(p => p.trim())
        : [productsList?.trim()].filter(Boolean);

      const currentTime = new Date().toISOString();
      const validStatus: RequestStatus = (status as RequestStatus) || 'Новая';
      
      return {
        id: `req-${Date.now()}-${index}`,
        fullName: fullName || '',
        phoneNumber: phoneNumber || '',
        email: email || '',
        products: products || [],
        timestamp: timestamp || currentTime,
        status: validStatus,
        comments: comments || '',
        lastUpdated: currentTime,
        messages: [],
        questionnaireAnswers
      };
    } catch (error) {
      console.error(`Error parsing CSV line: ${line}`, error);
      const currentTime = new Date().toISOString();
      return {
        id: `req-error-${Date.now()}-${index}`,
        fullName: 'Error parsing data',
        phoneNumber: '',
        email: '',
        products: [],
        timestamp: currentTime,
        status: 'Новая' as RequestStatus,
        comments: 'Error occurred while parsing this record',
        lastUpdated: currentTime,
        messages: []
      };
    }
  }).filter(req => req.fullName);
};

export const generateCSV = (requests: CustomerRequest[]): string => {
  const header = 'ФИО,Номер,Почта,Список товаров,Время заполнения заявки,Статус,Комментарии';
  
  const rows = requests.map(req => {
    // Escape product list with quotes if it contains commas
    const productList = `"${req.products.join(', ')}"`;
    
    return [
      req.fullName,
      req.phoneNumber,
      req.email,
      productList,
      req.timestamp,
      req.status,
      req.comments
    ].join(',');
  });
  
  return [header, ...rows].join('\n');
};

// CSV Example for frontend development until backend is ready
export const sampleCSV = `ФИО,Номер,Почта,Список товаров,Время заполнения заявки,Статус,Комментарии,Тип оборудования,Основные задачи,Полет_продолжительность,Дальность_управления,Грузоподъемность,VTOL,Тип_данных,Стабилизация,Передача_видео_realtime,Передача_тяжелых_данных_realtime,Автоматизация,Быстрая_подготовка,Температурный_режим,Скорость_ветра,Полеты_ночью,Районы_без_связи,Компоненты,ПДУ_требования,Комплектация,Страна_производства
Иванов Иван Иванович,79001234567,ivanov@example.com,"miniSIGMA, Автопилот АП-05",2024-04-17 10:00:00,Новая,,Готовый к полету беспилотник (БПЛА),"Мониторинг территории/объектов;Аэрофотосъемка",До 30 минут,До 2 км,До 1 кг,Да,"Видео стандартного качества (для контроля);Фотографии высокого разрешения",Да,Да,Нет,"Полет по заранее заданному маршруту;Полностью автономная работа (взлет-маршрут-посадка)",Да,Стандартный (-10°C до +40°C),До 10 м/с,Нет,Нет,"Автопилот;Система связи (модем, антенна, пост);Полезная нагрузка (камера, ГСП, тепловизор)","Портативный;Встроенный экран","Не менее 4 аккумуляторов;Зарядный хаб на несколько АКБ",Российская Федерация`;
