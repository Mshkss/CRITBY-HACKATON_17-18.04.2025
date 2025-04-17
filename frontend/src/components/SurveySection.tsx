import React from 'react';
import { SurveyQuestion as SurveyQuestionType, SurveySection as SurveySectionType, SurveyResponse } from '@/types/survey';
import SurveyQuestion from './SurveyQuestion';

interface SurveySectionProps {
  section: SurveySectionType;
  questions: SurveyQuestionType[];
  responses: SurveyResponse;
  onQuestionChange: (id: string, value: string | string[]) => void;
}

const SurveySection: React.FC<SurveySectionProps> = ({ 
  section, 
  questions, 
  responses, 
  onQuestionChange 
}) => {
  // Helper to check if a question should be visible based on skip logic
  const shouldShowQuestion = (question: SurveyQuestionType): boolean => {
    if (!question.skipLogic) return true;
    
    const dependsOnValue = responses[question.skipLogic.dependsOn];
    if (!dependsOnValue) return false;
    
    // If the dependsOn value is an array, check if any value matches
    if (Array.isArray(dependsOnValue)) {
      return question.skipLogic.showWhen.some(value => dependsOnValue.includes(value));
    }
    
    // Otherwise, check if the single value matches
    return question.skipLogic.showWhen.includes(dependsOnValue);
  };

  return (
    <div className="mb-8">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold">{section.title}</h2>
        {section.description && (
          <p className="text-gray-600 mt-1">{section.description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {questions
          .filter(q => q.section === section.id)
          .map(question => (
            <SurveyQuestion
              key={question.id}
              question={question}
              value={responses[question.id]}
              onChange={onQuestionChange}
              isVisible={shouldShowQuestion(question)}
            />
          ))}
      </div>
    </div>
  );
};

export default SurveySection;
