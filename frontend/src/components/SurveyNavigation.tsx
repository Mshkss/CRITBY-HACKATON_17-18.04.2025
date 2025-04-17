
import React from 'react';
import { Button } from "@/components/ui/button";

interface SurveyNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isLastSection: boolean;
  isSubmitting: boolean;
}

const SurveyNavigation: React.FC<SurveyNavigationProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  isLastSection,
  isSubmitting
}) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
      >
        Назад
      </Button>
      
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
      >
        {isLastSection ? (
          isSubmitting ? "Обработка..." : "Отправить запрос"
        ) : (
          "Далее"
        )}
      </Button>
    </div>
  );
};

export default SurveyNavigation;
