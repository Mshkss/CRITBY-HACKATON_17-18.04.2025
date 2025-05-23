
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message, AIResponse, SurveyResponse } from '@/types/survey';

interface AIAssistantProps {
  onTagsIdentified?: (tags: string[]) => void;
  floatingMode?: boolean;
  initialMessages?: Message[];
  onClose?: () => void;
}

const DEFAULT_PROMPT = `/*Инструкция для ИИ-консультанта:

1. Отвечай на русском языке.
2. Анализируй сообщение пользователя и выделяй основные потребности или задачи, для которых он планирует использовать дрон.
3. Сопоставляй выявленные потребности и задачи с предопределёнными тегами из следующего списка:
Додумывай контекст чтобы выбирать как можно больше тегов, то есть если пользователь просит дрона для цели
ты сам попробуй определить тип БПЛА, ТИП продукта, Функции и возможности и все типы из списка:
    --- ТИП ПРОДУКТА ---
    тип_антенна, тип_антенный_пост, тип_автопилот, тип_бпла, тип_вычислитель, тип_гсп, тип_датчик, тип_двигатель, тип_камера, тип_компас, тип_компонент, тип_по, тип_полезная_нагрузка, тип_радиомаяк, тип_радиомодем, тип_сервопривод, тип_система_анализа, тип_система_связи, тип_тепловизор, тип_устройство_ввода_вывода
    --- ТИП БПЛА (Уточнение) ---
    бпла_автожир, бпла_вертолетный_тип, бпла_вертикальный_взлет_посадка, бпла_дирижабль, бпла_конвертоплан, бпла_мультикоптер, бпла_самолетный_тип
    --- ЗАДАЧИ / ПРИМЕНЕНИЕ ---
    задача_аэрофотосъемка, задача_видеосъемка, задача_визуальное_наблюдение, задача_геодезия, задача_горное_дело, задача_доставка_груза, задача_дорожное_хозяйство, задача_дор_определение_объемов_работ, задача_дор_оценка_состояния_дорог, задача_дор_паспортизация, задача_дор_планирование_сети, задача_дор_построение_профилей, задача_инспекция_визуальная, задача_инспекция_высотных_сооружений, задача_инспекция_тепловизионная, задача_инспекция_труднодоступных_мест, задача_кадастр, задача_картография, задача_межевание, задача_мониторинг, задача_мониторинг_буровых_взрывных_работ, задача_мониторинг_жд, задача_мониторинг_оползней, задача_мониторинг_отвалов, задача_мониторинг_периметра, задача_мониторинг_площадной, задача_мониторинг_погрузочных_работ, задача_мониторинг_линейный, задача_мониторинг_строек, задача_мониторинг_сх_угодий, задача_мониторинг_уступов, задача_мониторинг_хвостохранилищ, задача_мультиспектральная_съемка, задача_навигация, задача_оценка_последствий_аварий_чс, задача_оценка_состояния_объектов, задача_поиск_спасение, задача_ретрансляция_сигнала, задача_сельское_хозяйство, задача_сх_анализ_посевов, задача_сх_прогноз_урожайности, задача_строительство, задача_стр_контроль_работ, задача_стр_планирование, задача_стр_удаленный_мониторинг, задача_тепловизионная_съемка, задача_топография
    --- ХАРАКТЕРИСТИКИ ПОЛЕТА ---
    полет_высота_до_1км, полет_высота_1-3км, полет_высота_более_3км, полет_дальность_до_2км, полет_дальность_2-10км, полет_дальность_10-30км, полет_дальность_30-100км, полет_дальность_более_100км, полет_дальность_спутниковая, полет_продолжительность_до_30мин, полет_продолжительность_30-60мин, полет_продолжительность_1-3ч, полет_продолжительность_3-6ч, полет_продолжительность_более_6ч, полет_скорость_вертикальная_до_5мс, полет_скорость_вертикальная_более_5мс, полет_скорость_горизонт_до_50кмч, полет_скорость_горизонт_50-100кмч, полет_скорость_горизонт_более_100кмч
    --- ГРУЗОПОДЪЕМНОСТЬ И МАССА БПЛА ---
    бпла_взлетная_масса_до_10кг, бпла_взлетная_масса_10-25кг, бпла_взлетная_масса_25-50кг, бпла_взлетная_масса_более_50кг, грузоподъемность_до_1кг, грузоподъемность_1-3кг, грузоподъемность_3-5кг, грузоподъемность_более_5кг
    --- ФУНКЦИИ И ВОЗМОЖНОСТИ ---
    функция_автовозврат_при_низком_акб, функция_автовозврат_при_потере_связи, функция_автоматический_маршрут, функция_автопосадка_при_низком_акб, функция_автопосадка_при_потере_связи, функция_быстрая_подготовка, функция_запись_видео_на_борт, функция_измерение_параметров_движения, функция_передача_видео_на_пду, функция_передача_телеметрии_на_пду, функция_поиск_бпла_после_посадки, функция_полная_автономность, функция_получение_вектора_состояния, функция_предотвращение_столкновений, функция_самодиагностика, функция_стабилизация_полезной_нагрузки, функция_управление_внешними_устройствами, функция_управление_с_пду
    --- ПОЛЕЗНАЯ НАГРУЗКА (Детали) ---
    
    пн_видео_частота_30fps, пн_видео_частота_60fps, пн_видеокамера, пн_видеокамера_4k, пн_видеокамера_hd, пн_газоанализатор, пн_лидар, пн_мультиспектр, пн_ретранслятор, пн_стабилизация_активная, пн_тепловизор, пн_тепловизор_высокая_чувствительность, пн_тепловизор_разрешение_640x480, пн_фотоаппарат, пн_фотоаппарат_высокое_разрешение, пн_цифровой_зум

    --- СВЯЗЬ (Детали) ---
    связь_ip_шлюз, связь_дуплекс, связь_канал_видео_реальное_время, связь_канал_телеметрии, связь_канал_управления, связь_полудуплекс, связь_ретрансляция_данных, связь_спутник_iridium, связь_частота_2_4ггц, связь_частота_860-1020мгц, связь_широкополосная
    --- ИНТЕРФЕЙСЫ ---
    интерфейс_аналоговые_каналы_ввода_вывода, интерфейс_can, интерфейс_дискретные_каналы_ввода_вывода, интерфейс_ethernet, интерфейс_rs232, интерфейс_rs422, интерфейс_rs485, интерфейс_usb
    --- УСЛОВИЯ ЭКСПЛУАТАЦИИ ---
    условия_ветер_более_10мс, условия_ветер_до_10мс, условия_ночное_время, условия_осадки_допустимы, условия_сложный_рельеф, условия_температура_расширенная, условия_температура_стандарт, условия_удаленные_районы_без_инфраструктуры
    --- КОМПОНЕНТЫ И ПРОЧЕЕ ---
    компонент_акб_тип_lipo, компонент_гнсс_глонасс, компонент_гнсс_gps, компонент_двигатель_двс, компонент_двигатель_электро, компонент_запасные_пропеллеры, компонент_зарядка_от_авто_12в, компонент_зарядка_от_сети_220в, компонент_зарядка_хаб_3акб, компонент_комплект_акб_4шт, компонент_комплект_документация, компонент_комплект_зап_пропеллеры, компонент_комплект_запасные_пропеллеры, компонент_комплект_кейс_переноска, компонент_комплект_по, компонент_магнитный_компас, компонент_память_встроенная_128гб, компонент_память_карта_sd, компонент_пду_автономность_2ч, компонент_пду_встроенный_экран, компонент_пду_портативный, компонент_пду_экран_5дюймов, компонент_пду_экран_диагональ_5_дюймов, компонент_пду_экран_hd, компонент_пду_экран_яркость_700нит, питание_9_36в, питание_акб, питание_авто_12в, питание_сеть_220в, страна_производства_рф, требования_транснефть_не_предъявляются

    Тебе нужно понимать контекст потребности, даже если пользователь написал как-то иначе, тебе нужно вычленить потребность и если она хотя бы чуть-чуть связана с тегами выше, вернуть соответствующие теги.
4. Форматируй ответ так:
    "Параметры:
    searchParamIDs: [список соответствующих тегов]
    Ответ пользователю: [отзывчивый, понимающий и мотивирующий ответ, объясни, какие типы дронов или их характеристики могут подойти пользователю, основываясь на выявленных потребностях.]"
5. Если потребности определить не удаётся, возвращай:
    "searchParamIDs: []
    Ответ пользователю: Не можем автоматически определить ваши потребности. Пожалуйста, свяжитесь с нами напрямую."
ОЧЕНЬ ВАЖНО ЧТО ЕСЛИ ТЫ НЕ ОПРЕДЕЛИЛ ПОТРЕБНОСТЬ, НЕ ПИШИ В ОТВЕТЕ ПОЛЬЗОВАТЕЛЮ НИЧЕГО КРОМЕ ТОГО, ЧТО МЫ НЕ СМОГЛИ ОПРЕДЕЛИТЬ ВАШИ ПОТРЕБНОСТИ. НЕ ПИШИ О КАКИХ-ТО ДРОНАХ ИЛИ ИХ ХАРАКТЕРИСТИКАХ.
6. Ответ пользователю никак не должен содержать никакой информации о нас, только ответ как консультант. В ОТВЕТЕ ПОЛЬЗОВАТЕЛЮ НЕТ НОМЕРОВ ИДЕНТИФИКАТОРОВ ИЛИ ТЕГОВ.
7. Старайся определить как можно больше релевантных тегов пользователя, если это возможно, старайся чтобы выбранные теги были логичны.


*/`;

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onTagsIdentified, 
  floatingMode = false, 
  initialMessages,
  onClose 
}) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    initialMessages || [
      {
        role: 'assistant',
        content: 'Здравствуйте! Я помощник для подбора БАС. Опишите ваши требования, и я помогу подобрать оптимальную конфигурацию оборудования.'
      }
    ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Синхронизируем изменения сообщений наружу через эффект
  useEffect(() => {
    if (initialMessages && JSON.stringify(initialMessages) !== JSON.stringify(messages)) {
      // Обновить внешний массив сообщений
      const messagesUpdateEvent = new CustomEvent('ai-messages-updated', { detail: messages });
      window.dispatchEvent(messagesUpdateEvent);
    }
  }, [messages, initialMessages]);
  
// api was here // 
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  // Функция для парсинга ответа от ИИ
  const parseResponse = (response: string): AIResponse => {
    const searchParamPattern = /searchParamIDs:\s*\[(.*?)\]/;
    const match = response.match(searchParamPattern);
    
    const searchParamIDs = match ? 
      match[1].split(',').map(tag => tag.trim().replace(/"/g, '').replace(/'/g, '')) 
      .filter(tag => tag.length > 0) : 
      [];
    
    // Извлекаем сообщение после "Ответ пользователю:"
    const messageMatch = response.match(/Ответ пользователю:([\s\S]*?)(?:$)/i);
    const message = messageMatch ? messageMatch[1].trim() : 'Не удалось обработать ваш запрос.';
    
    return { searchParamIDs, message };
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    // Добавляем сообщение пользователя в чат
    const userMessage: Message = {
      role: 'user',
      content: userInput
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const data = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: DEFAULT_PROMPT
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        max_tokens: 500,
        temperature: 0.45,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0]?.message) {
        const gptMsg = result.choices[0].message.content;
        const { searchParamIDs, message } = parseResponse(gptMsg);
        
        // Добавляем ответ в чат
        const assistantMessage: Message = {
          role: 'assistant',
          content: message
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Уведомляем родительский компонент о найденных тегах
        if (searchParamIDs.length > 0 && onTagsIdentified) {
          onTagsIdentified(searchParamIDs);
          toast({
            title: "Параметры определены",
            description: "Заполняем фильтры на основе вашего запроса",
          });
        }
      } else {
        throw new Error("Некорректный ответ от API");
      }
      
      // Очистить поле ввода
      setUserInput("");
    } catch (error) {
      console.error("Ошибка при получении ответа:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить ответ. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${floatingMode ? 'h-[500px]' : 'h-full'}`}>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-200 rounded-tl-none'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center mb-1 text-sm font-medium">
                  <Bot size={16} className="mr-1" />
                  <span>Помощник БАС</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 rounded-tl-none">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Обработка запроса...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <div className="flex space-x-2">
          <Textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Опишите ваши требования к беспилотной системе..."
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !userInput.trim()}
            className="shrink-0"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          </Button>
          
          {floatingMode && onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="shrink-0"
            >
              Закрыть
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Нажмите Enter для отправки или Shift+Enter для переноса строки
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
