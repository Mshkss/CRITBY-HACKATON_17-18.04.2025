
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Minimize, Maximize } from 'lucide-react';
import AIAssistant from './AIAssistant';
import { Message } from '@/types/survey';

interface FloatingAssistantButtonProps {
  onTagsIdentified: (tags: string[]) => void;
  initialMessages?: Message[];
  onMinimize?: () => void;
}

const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({ 
  onTagsIdentified,
  initialMessages,
  onMinimize
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssistant = () => {
    setIsOpen(prev => !prev);
  };

  const handleMinimize = () => {
    setIsOpen(false);
    if (onMinimize) {
      onMinimize();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed right-5 bottom-20 w-[350px] md:w-[450px] z-50 bg-white rounded-lg shadow-xl border p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">ИИ-помощник</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleMinimize}
            >
              <Minimize size={16} />
            </Button>
          </div>
          <AIAssistant 
            onTagsIdentified={onTagsIdentified} 
            floatingMode={true}
            initialMessages={initialMessages}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
      
      <Button
        className="fixed right-5 bottom-5 rounded-full w-14 h-14 shadow-lg z-40"
        onClick={toggleAssistant}
      >
        <MessageSquare size={24} />
      </Button>
    </>
  );
};

export default FloatingAssistantButton;
