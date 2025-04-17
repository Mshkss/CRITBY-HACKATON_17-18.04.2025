
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SurveyQuestion as SurveyQuestionType, SurveyOption, OptionValue } from "@/types/survey";
import { Textarea } from "@/components/ui/textarea";

interface SurveyQuestionProps {
  question: SurveyQuestionType;
  value: OptionValue | OptionValue[] | undefined;
  onChange: (id: string, value: OptionValue | OptionValue[]) => void;
  isVisible?: boolean;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({ 
  question, 
  value, 
  onChange,
  isVisible = true 
}) => {
  if (!isVisible) return null;

  const handleRadioChange = (selectedValue: string) => {
    onChange(question.id, selectedValue);
  };

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    // For multiple selection questions
    let newValues: string[] = Array.isArray(value) ? [...value] : [];
    
    if (checked) {
      newValues.push(optionValue);
    } else {
      newValues = newValues.filter(v => v !== optionValue);
    }
    
    onChange(question.id, newValues);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(question.id, e.target.value);
  };

  // Check if this is the "Дополнительные требования к комплектации" question
  const isAdditionalRequirements = question.id === "additional_requirements";

  return (
    <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-start mb-3">
        <h3 className="text-lg font-medium flex-1">{question.text}</h3>
        {question.additionalInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <HelpCircle size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{question.additionalInfo}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {isAdditionalRequirements ? (
        // Render textarea for additional requirements
        <Textarea
          value={value as string || ''}
          onChange={handleTextareaChange}
          placeholder="Введите дополнительные требования к комплектации..."
          className="w-full min-h-[100px]"
        />
      ) : question.multiple ? (
        // Checkboxes for multiple selection
        <div className="space-y-3">
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={option.id}
                checked={Array.isArray(value) && value.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked === true)}
              />
              <Label htmlFor={option.id} className="text-sm">{option.text}</Label>
              {option.additionalInfo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600">
                        <HelpCircle size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{option.additionalInfo}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Radio buttons for single selection
        <RadioGroup 
          value={value as string}
          onValueChange={handleRadioChange}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.id} />
              <Label htmlFor={option.id} className="text-sm">{option.text}</Label>
              {option.additionalInfo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600">
                        <HelpCircle size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{option.additionalInfo}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default SurveyQuestion;
