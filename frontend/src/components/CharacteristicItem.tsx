
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CharacteristicItemProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

const CharacteristicItem: React.FC<CharacteristicItemProps> = ({ 
  label, 
  tooltip,
  children 
}) => {
  return (
    <div className="flex items-center p-3 bg-blue-50 rounded-lg mb-3">
      <div className="flex items-center w-1/3">
        <span className="font-medium">{label}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-1 cursor-help">
                  <HelpCircle size={16} className="text-blue-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="w-2/3">
        {children}
      </div>
    </div>
  );
};

export default CharacteristicItem;
