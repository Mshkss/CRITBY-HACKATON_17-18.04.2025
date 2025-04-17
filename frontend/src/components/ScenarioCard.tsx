
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface ScenarioCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ 
  title, 
  description, 
  icon = <Lightbulb size={24} />,
  isActive = false,
  onClick 
}) => {
  return (
    <button 
      className={`uas-scenario-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="mb-2">
        {icon}
      </div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </button>
  );
};

export default ScenarioCard;
