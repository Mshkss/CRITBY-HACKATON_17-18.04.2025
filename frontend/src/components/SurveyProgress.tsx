
import React from 'react';

interface SurveyProgressProps {
  currentSection: number;
  totalSections: number;
}

const SurveyProgress: React.FC<SurveyProgressProps> = ({ 
  currentSection, 
  totalSections 
}) => {
  const progress = Math.round((currentSection / totalSections) * 100);
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Прогресс</span>
        <span className="text-sm text-gray-500">
          Раздел {currentSection} из {totalSections} ({progress}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SurveyProgress;
