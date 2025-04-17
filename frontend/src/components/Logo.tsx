
import React from 'react';
import { Globe } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Globe size={36} strokeWidth={1.5} className="text-black" />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-3/4 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rotate-45 border-t border-r border-black"></div>
          </div>
        </div>
      </div>
      <span className="text-2xl font-semibold tracking-wider">АБАКС</span>
    </div>
  );
};

export default Logo;
