
import React from 'react';
import { ProductEstimate } from '@/types/survey';

interface CostEstimateProps {
  estimate: ProductEstimate;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
};

const CostEstimate: React.FC<CostEstimateProps> = ({ estimate }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Предварительная оценка стоимости</h2>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>Минимальная</span>
        <span>Максимальная</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">{formatCurrency(estimate.minCost)}</span>
        <span className="text-gray-400 mx-2">—</span>
        <span className="text-lg font-bold">{formatCurrency(estimate.maxCost)}</span>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        * Финальная стоимость может отличаться и зависит от конкретной конфигурации и дополнительных опций
      </p>
    </div>
  );
};

export default CostEstimate;
