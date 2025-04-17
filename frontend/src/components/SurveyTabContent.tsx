
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SurveyResponse, ContactFormData } from '@/types/survey';
import { TimingData } from '@/types/analytics';
import { surveyQuestions, surveySections } from '@/data/surveyQuestions';
import SurveySection from '@/components/SurveySection';
import SurveyProgress from '@/components/SurveyProgress';
import SurveyNavigation from '@/components/SurveyNavigation';
import ContactForm from '@/components/ContactForm';
import CostEstimate from '@/components/CostEstimate';
import { generateCostEstimate } from '@/services/productService';

interface SurveyTabContentProps {
  responses: SurveyResponse;
  setResponses: React.Dispatch<React.SetStateAction<SurveyResponse>>;
  selectedTags: string[];
  onSubmitComplete: (contactData: ContactFormData, timingData: TimingData) => void;
  timingData: TimingData;
  setTimingData: React.Dispatch<React.SetStateAction<TimingData>>;
  filledByAI: boolean;
}

const SurveyTabContent: React.FC<SurveyTabContentProps> = ({ 
  responses, 
  setResponses,
  selectedTags,
  onSubmitComplete,
  timingData,
  setTimingData,
  filledByAI
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [costEstimate, setCostEstimate] = useState(null);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<number>(Date.now());
  
  // Filter questions for the current section
  const currentSectionQuestions = surveyQuestions.filter(q => q.section === activeSection);
  
  // Find the current section
  const currentSection = surveySections.find(s => s.id === activeSection);
  
  // Record timing when changing sections or answering questions
  useEffect(() => {
    // Mark the start time for this section's questions
    setCurrentQuestionStartTime(Date.now());
  }, [activeSection]);
  
  // Handle question responses and track time spent
  const handleQuestionChange = (id: string, value: string | string[]) => {
    // Record end time for the current question
    const endTime = Date.now();
    const newTimingData = { ...timingData };
    
    // If we already have a start time for this question, update it
    if (newTimingData.questionTimings[id]) {
      newTimingData.questionTimings[id].endTime = endTime;
      newTimingData.questionTimings[id].duration = 
        endTime - newTimingData.questionTimings[id].startTime;
    } else {
      // Initialize timing data for this question
      newTimingData.questionTimings[id] = {
        startTime: currentQuestionStartTime,
        endTime: endTime,
        duration: endTime - currentQuestionStartTime
      };
    }
    
    // Update timing data
    setTimingData(newTimingData);
    
    // Reset the start time for the next question
    setCurrentQuestionStartTime(endTime);
    
    // Update responses
    setResponses(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Navigate to the next survey section
  const handleNextSection = () => {
    const nextSection = activeSection + 1;
    if (nextSection <= surveySections.length) {
      setActiveSection(nextSection);
      window.scrollTo(0, 0);
    } else {
      // Calculate end time and show contact form
      const endTime = Date.now();
      const newTimingData = { ...timingData };
      newTimingData.totalSurveyTime = endTime - timingData.sessionStart;
      setTimingData(newTimingData);
      
      // Generate the cost estimate and show contact form
      const estimate = generateCostEstimate(selectedTags);
      setCostEstimate(estimate);
      setShowContactForm(true);
    }
  };
  
  // Navigate to the previous survey section
  const handlePreviousSection = () => {
    if (showContactForm) {
      setShowContactForm(false);
      return;
    }
    
    const prevSection = activeSection - 1;
    if (prevSection >= 1) {
      setActiveSection(prevSection);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleContactFormSubmit = (contactData: ContactFormData) => {
    setIsSubmitting(true);
    
    // Record the final timing data
    const finalTimingData = { ...timingData };
    finalTimingData.totalSurveyTime = Date.now() - timingData.sessionStart;
    
    // Логируем отправляемые данные
    console.log("Отправка заявки с данными:", {
      contact: contactData,
      responses,
      tags: selectedTags,
      timingData: finalTimingData
    });
    
    // Имитация отправки на сервер
    setTimeout(() => {
      toast({
        title: "Запрос отправлен",
        description: "Специалист свяжется с вами в ближайшее время",
      });
      setIsSubmitting(false);
      onSubmitComplete(contactData, finalTimingData);
    }, 1500);
  };
  
  const handleContactFormCancel = () => {
    setShowContactForm(false);
  };
  
  // Заполнение значений по умолчанию для не отвеченных вопросов, срабатывает только если не было заполнения через AI
  const fillDefaultValues = () => {
    // Только если не происходило заполнения через AI
    if (!filledByAI) {
      const newResponses = { ...responses };
      
      // Проходим по всем вопросам и заполняем пропущенные
      surveyQuestions.forEach(question => {
        // Если на вопрос не ответили
        if (!newResponses[question.id]) {
          if (question.options.length > 0) {
            // Ищем опцию "нет" или подобную
            const defaultOption = question.options.find(opt => 
              opt.text.toLowerCase().includes('нет') || 
              opt.text.toLowerCase().includes('не требуется') ||
              opt.text.toLowerCase().includes('стандартный')
            );
            
            if (defaultOption) {
              if (question.multiple) {
                newResponses[question.id] = [defaultOption.value];
              } else {
                newResponses[question.id] = defaultOption.value;
              }
            } else {
              // Если нет подходящей опции, берем первую
              if (question.multiple) {
                newResponses[question.id] = [question.options[0].value];
              } else {
                newResponses[question.id] = question.options[0].value;
              }
            }
          }
        }
      });
      
      setResponses(newResponses);
    }
  };
  
  // Check if the current section has required questions that are not answered
  const currentSectionHasUnansweredRequired = () => {
    return currentSectionQuestions
      .filter(q => q.required)
      .some(q => {
        // If the question has skip logic and should not be shown, it's not required
        if (q.skipLogic) {
          const dependsOnValue = responses[q.skipLogic.dependsOn];
          if (!dependsOnValue) return false;
          
          // If the dependent value doesn't match any of the showWhen values, question isn't required
          if (Array.isArray(dependsOnValue)) {
            if (!q.skipLogic.showWhen.some(value => dependsOnValue.includes(value))) {
              return false;
            }
          } else if (!q.skipLogic.showWhen.includes(dependsOnValue)) {
            return false;
          }
        }
        
        // If we get here, the question is required and should be shown
        return !responses[q.id];
      });
  };
  
  const isLastSection = activeSection === surveySections.length;

  return (
    <div className="space-y-8">
      <SurveyProgress 
        currentSection={showContactForm ? surveySections.length + 1 : activeSection} 
        totalSections={surveySections.length + 1} 
      />
      
      {showContactForm ? (
        <div className="space-y-6">
          {costEstimate && (
            <CostEstimate estimate={costEstimate} />
          )}
          
          <ContactForm
            onSubmit={handleContactFormSubmit}
            onCancel={handleContactFormCancel}
          />
        </div>
      ) : currentSection ? (
        <SurveySection
          section={currentSection}
          questions={currentSectionQuestions}
          responses={responses}
          onQuestionChange={handleQuestionChange}
        />
      ) : null}
      
      {!showContactForm && (
        <SurveyNavigation 
          onPrevious={handlePreviousSection}
          onNext={() => {
            // Перед переходом на следующий шаг, заполняем значения по умолчанию для текущей секции
            fillDefaultValues();
            handleNextSection();
          }}
          isPreviousDisabled={activeSection === 1}
          isNextDisabled={currentSectionHasUnansweredRequired() || isSubmitting}
          isLastSection={isLastSection}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default SurveyTabContent;
