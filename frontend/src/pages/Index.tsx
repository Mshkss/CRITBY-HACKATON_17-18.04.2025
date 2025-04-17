
import { useState, useEffect } from "react";
import { MessageSquare, List, Minimize } from "lucide-react";
import Logo from "@/components/Logo";
import { SurveyResponse, ProductEstimate, ContactFormData, Message } from "@/types/survey";
import { TimingData } from "@/types/analytics";
import AIAssistant from "@/components/AIAssistant";
import SurveyTabContent from "@/components/SurveyTabContent";
import HelpDialog from "@/components/HelpDialog";
import FloatingAssistantButton from "@/components/FloatingAssistantButton";
import CostEstimate from "@/components/CostEstimate";
import { Button } from "@/components/ui/button";
import { generateCostEstimate, generateDocument, downloadDocument } from "@/services/productService";
import { surveyQuestions } from "@/data/surveyQuestions";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  // Состояние для отслеживания ответов на опрос
  const [responses, setResponses] = useState<SurveyResponse>({});
  
  // Состояние для отслеживания выбранных товаров (тегов)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Состояние показа диалога помощи
  const [showHelpDialog, setShowHelpDialog] = useState(true);
  
  // Состояние для отображения помощника ИИ
  const [showAI, setShowAI] = useState(false);
  
  // Состояние для отображения опроса
  const [showSurvey, setShowSurvey] = useState(false);
  
  // Состояние для отображения оценки стоимости
  const [costEstimate, setCostEstimate] = useState<ProductEstimate | null>(null);
  
  // Состояние загрузки для генерации документа
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  
  // Состояние для хранения истории сообщений ИИ
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Здравствуйте! Я помощник для подбора БАС. Опишите ваши требования, и я помогу подобрать оптимальную конфигурацию оборудования.'
    }
  ]);
  
  // Состояние для отображения контактной формы
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Состояние для хранения данных контактной формы
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  
  // Состояние для хранения данных о времени заполнения
  const [timingData, setTimingData] = useState<TimingData>({
    sessionStart: Date.now(),
    questionTimings: {}
  });
  
  // Флаг, указывающий что форма была заполнена через AI
  const [filledByAI, setFilledByAI] = useState(false);
  
  // Флаг, указывающий что идет процесс заполнения формы
  const [isFillingForm, setIsFillingForm] = useState(false);
  
  const { toast } = useToast();
  
  // Обработчик выбора "Да" в диалоге помощи
  const handleAcceptHelp = () => {
    setShowHelpDialog(false);
    setShowAI(true);
    
    // Записываем время начала общения с ИИ
    const newTimingData = { ...timingData };
    newTimingData.aiChatDuration = 0; // Будет увеличиваться
    setTimingData(newTimingData);
  };
  
  // Обработчик выбора "Нет" в диалоге помощи
  const handleDeclineHelp = () => {
    setShowHelpDialog(false);
    setShowSurvey(true);
  };
  
  // Обработчик минимизации ИИ помощника
  const handleMinimizeAI = () => {
    setShowAI(false);
    setShowSurvey(true);
    
    // Записываем время окончания общения с ИИ
    const newTimingData = { ...timingData };
    if (newTimingData.aiChatDuration !== undefined) {
      newTimingData.aiChatDuration = Date.now() - timingData.sessionStart;
    }
    setTimingData(newTimingData);
  };
  
  // Функция для автоматического заполнения опроса на основе тегов
  const handleTagsIdentified = (tags: string[]) => {
    setSelectedTags(tags);
    setFilledByAI(true);
    setIsFillingForm(true);
    
    // Задержка для эффекта "автоматического заполнения"
    const fillResponses = async () => {
      const newResponses = { ...responses };
      let delay = 300; // Начальная задержка
      const filledQuestions: string[] = [];
      
      // Для каждого вопроса в опросе
      for (const question of surveyQuestions) {
        // Проверяем, есть ли в опциях вопроса теги из selectedTags
        const matchingOptions = question.options.filter(option => {
          if (!option.value) return false; // Skip empty values
          const optionValues = option.value.split(',');
          return optionValues.some(val => tags.includes(val.trim()));
        });
        
        if (matchingOptions.length > 0) {
          // Устанавливаем задержку для эффекта последовательного заполнения
          await new Promise(resolve => setTimeout(resolve, delay));
          delay += 300; // Увеличиваем задержку для следующего вопроса
          
          // Если вопрос с множественным выбором
          if (question.multiple) {
            newResponses[question.id] = matchingOptions.map(opt => opt.value);
          } else {
            // Для вопросов с одиночным выбором берем первое совпадение
            newResponses[question.id] = matchingOptions[0].value;
          }
          
          filledQuestions.push(question.id);
          
          // Обновляем ответы с каждым выбором для визуального эффекта
          setResponses({ ...newResponses });
        }
      }
      
      // Заполняем вопросы, на которые не было найдено ответа, значениями по умолчанию
      for (const question of surveyQuestions) {
        if (!filledQuestions.includes(question.id) && question.options.length > 0) {
          // Находим опцию "нет", "стандартный" или другую для дефолтных значений
          const defaultOption = question.options.find(opt => 
            opt.text.toLowerCase().includes('нет') || 
            opt.text.toLowerCase().includes('не требуется') ||
            opt.text.toLowerCase().includes('стандартный') ||
            opt.text.toLowerCase().includes('до') // Часто первая опция для числовых диапазонов
          );
          
          // Если не нашли дефолтную опцию, берем первую
          const optionToUse = defaultOption || 
            (question.options.length > 0 ? question.options[0] : null);
          
          if (optionToUse) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay += 300;
            
            if (question.multiple) {
              newResponses[question.id] = [optionToUse.value];
            } else {
              newResponses[question.id] = optionToUse.value;
            }
            
            // Обновляем состояние для визуального эффекта
            setResponses({ ...newResponses });
          }
        }
      }
      
      // После заполнения всех ответов показываем опрос
      setShowSurvey(true);
      setShowAI(false);
      setIsFillingForm(false);
      
      // Записываем время окончания общения с ИИ
      const newTimingData = { ...timingData };
      if (newTimingData.aiChatDuration !== undefined) {
        newTimingData.aiChatDuration = Date.now() - timingData.sessionStart;
      }
      setTimingData(newTimingData);
      
      toast({
        title: "Заполнение завершено",
        description: "Анкета предварительно заполнена на основе вашего запроса.",
      });
    };
    
    fillResponses();
  };
  
  // Функция для создания и скачивания документа
  const handleCreateDocument = async () => {
    if (!contactData) {
      toast({
        title: "Ошибка",
        description: "Необходимо заполнить контактную информацию",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingDoc(true);
    try {
      // Обновляем timing data перед отправкой
      const finalTimingData = { ...timingData };
      finalTimingData.totalSurveyTime = Date.now() - timingData.sessionStart;
      
      console.log("Отправка на бэкенд:", { 
        tags: selectedTags, 
        contact: contactData,
        responses,
        timingData: finalTimingData
      });
      
      const result = await generateDocument(selectedTags, contactData);
      downloadDocument(result, "drone_specification.docx");
      
      toast({
        title: "Документ создан",
        description: "Спецификация дрона успешно скачана.",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать документ. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDoc(false);
    }
  };
  
  // Обработчик отправки контактной формы
  const handleSubmitContactForm = (data: ContactFormData, finalTimingData: TimingData) => {
    setContactData(data);
    
    // Обновляем финальные данные о времени
    setTimingData(finalTimingData);
    
    // Теперь генерируем смету
    const estimate = generateCostEstimate(selectedTags);
    setCostEstimate(estimate);
    
    console.log("Контактные данные:", data);
    console.log("Расчет стоимости:", estimate);
    console.log("Данные о времени:", finalTimingData);
    
    toast({
      title: "Данные сохранены",
      description: "Контактная информация сохранена. Теперь вы можете создать спецификацию.",
    });
  };
  
  // Слушатель для обновлений сообщений из компонента AI Assistant
  useEffect(() => {
    const handleMessagesUpdate = (event: CustomEvent) => {
      setAiMessages(event.detail);
    };
    
    window.addEventListener('ai-messages-updated', handleMessagesUpdate as EventListener);
    
    return () => {
      window.removeEventListener('ai-messages-updated', handleMessagesUpdate as EventListener);
    };
  }, []);
  
  // Обновление выбранных тегов при изменении ответов
  useEffect(() => {
    if (!showSurvey) return;
    
    const tags: string[] = [];
    
    Object.entries(responses).forEach(([questionId, answer]) => {
      // Находим вопрос по ID
      const question = surveyQuestions.find(q => q.id === questionId);
      if (!question) return;
      
      // Если ответ - массив (множественный выбор)
      if (Array.isArray(answer)) {
        answer.forEach(value => {
          // Для каждого значения находим соответствующие опции
          const options = question.options.filter(opt => opt.value === value);
          options.forEach(opt => {
            // Добавляем все теги из значения опции
            if (opt.value) {
              opt.value.split(',').forEach(tag => {
                const trimmedTag = tag.trim();
                if (trimmedTag && !tags.includes(trimmedTag)) {
                  tags.push(trimmedTag);
                }
              });
            }
          });
        });
      } else if (typeof answer === 'string') {
        // Для текстовых полей (additional_requirements)
        if (questionId === 'additional_requirements') {
          // Нет тегов для текстового поля
        } else {
          // Для одиночного выбора
          const option = question.options.find(opt => opt.value === answer);
          if (option && option.value) {
            option.value.split(',').forEach(tag => {
              const trimmedTag = tag.trim();
              if (trimmedTag && !tags.includes(trimmedTag)) {
                tags.push(trimmedTag);
              }
            });
          }
        }
      }
    });
    
    setSelectedTags(tags);
  }, [responses, showSurvey]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <h1 className="text-lg md:text-xl font-light tracking-wide text-gray-700">
            АВТОНОМНЫЕ АЭРОКОСМИЧЕСКИЕ СИСТЕМЫ
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 mb-20">
        {showHelpDialog && (
          <div className="flex justify-center items-center mt-10">
            <HelpDialog 
              onAccept={handleAcceptHelp} 
              onDecline={handleDeclineHelp} 
            />
          </div>
        )}
        
        {showAI && !showSurvey && (
          <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-medium">
                ИИ-помощник для подбора БАС
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMinimizeAI}
                title="Свернуть ИИ и перейти к самостоятельному заполнению"
              >
                <Minimize size={18} />
              </Button>
            </div>
            
            <AIAssistant 
              onTagsIdentified={handleTagsIdentified}
              initialMessages={aiMessages}
            />
          </div>
        )}
        
        {(showSurvey || isFillingForm) && (
          <div className="space-y-8">
            <SurveyTabContent 
              responses={responses}
              setResponses={setResponses}
              selectedTags={selectedTags}
              onSubmitComplete={handleSubmitContactForm}
              timingData={timingData}
              setTimingData={setTimingData}
              filledByAI={filledByAI}
            />
            
            {costEstimate && contactData && (
              <div className="mt-8">
                <CostEstimate estimate={costEstimate} />
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleCreateDocument}
                    disabled={isGeneratingDoc}
                  >
                    {isGeneratingDoc ? "Создание..." : "Создать спецификацию"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      {showSurvey && !isFillingForm && (
        <FloatingAssistantButton 
          onTagsIdentified={handleTagsIdentified}
          initialMessages={aiMessages}
          onMinimize={() => setShowSurvey(true)}
        />
      )}
    </div>
  );
};

export default Index;
