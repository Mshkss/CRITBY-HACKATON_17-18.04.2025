
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FileText } from 'lucide-react';
import { DroneConfiguration } from '@/types/drone';

interface ApplicationPreviewProps {
  configuration: DroneConfiguration;
  onRequestDocument: () => void;
}

const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({ 
  configuration,
  onRequestDocument
}) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    const content = `
    Модель дрона: ${configuration.model}
    Категория: ${configuration.category}
    Время полета: ${configuration.flightTime} мин
    Радиус действия: ${configuration.range} км
    Полезная нагрузка: ${configuration.payloadType}
    Стоимость: от ${configuration.estimatedPrice.min.toLocaleString()} до ${configuration.estimatedPrice.max.toLocaleString()} руб.
    `;
    
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Скопировано",
        description: "Спецификация скопирована в буфер обмена",
      });
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Спецификация</h3>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          Копировать
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Модель дрона:</div>
          <div className="font-medium">{configuration.model}</div>
          
          <div className="text-gray-600">Категория:</div>
          <div className="font-medium">{configuration.category}</div>
          
          <div className="text-gray-600">Время полета:</div>
          <div className="font-medium">{configuration.flightTime} мин</div>
          
          <div className="text-gray-600">Радиус действия:</div>
          <div className="font-medium">{configuration.range} км</div>
          
          <div className="text-gray-600">Полезная нагрузка:</div>
          <div className="font-medium">{configuration.payloadType}</div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h4 className="text-lg font-medium mb-2">Описание решения</h4>
          <p className="text-gray-700">
            {configuration.description}
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <span className="text-lg font-medium">Стоимость:</span>
            <span className="text-xl font-bold">
              от {configuration.estimatedPrice.min.toLocaleString()} до {configuration.estimatedPrice.max.toLocaleString()} руб.
            </span>
          </div>
          
          {configuration.isCustom && (
            <p className="text-sm text-gray-500 mt-1">
              * Требуется дополнительный анализ специалиста, окончательная стоимость будет отражена в ТКП
            </p>
          )}
        </div>
      </div>
      
      <Button 
        className="w-full mt-6"
        onClick={onRequestDocument}
      >
        <FileText className="mr-2" size={18} />
        Получить документ с ТКП
      </Button>
    </div>
  );
};

export default ApplicationPreview;
