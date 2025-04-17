
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';

interface HelpDialogProps {
  onAccept: () => void;
  onDecline: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl text-center font-medium mb-4">
        Вам нужна помощь ИИ в подаче заявки?
      </h3>
      <div className="space-y-2 mb-6">
        <div className="flex items-start">
          <PlusCircle size={20} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Заполним фильтры</span>
        </div>
        <div className="flex items-start">
          <PlusCircle size={20} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Уточним ваш запрос</span>
        </div>
        <div className="flex items-start">
          <PlusCircle size={20} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Сделаем отчет</span>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button 
          className="flex-1" 
          onClick={onAccept}
        >
          Да
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1" 
          onClick={onDecline}
        >
          Нет
        </Button>
      </div>
    </div>
  );
};

export default HelpDialog;
