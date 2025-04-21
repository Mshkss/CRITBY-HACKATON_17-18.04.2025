
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <div className="mr-4">
            <img 
              src="/lovable-uploads/0a2998aa-d828-4028-aeb2-85207e98b3d4.png" 
              alt="АВАКС Лого" 
              className="h-12 w-auto" 
            />
          </div>
          <div className="hidden md:block text-gray-700 font-medium">
            АВАКС
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            <span className="font-bold">RU</span> | <span className="text-gray-400">EN</span>
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className="md:hidden">
          <button 
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="absolute top-16 right-0 z-50 w-64 bg-white shadow-lg border border-gray-200 rounded-b-lg py-2 px-4">
          <div className="py-2 border-b border-gray-100">
            <div className="font-medium">Панель управления заявками</div>
          </div>
          <div className="py-2">
            <a href="#" className="block py-1 hover:text-blue-600">Все заявки</a>
            <a href="#" className="block py-1 hover:text-blue-600">Новые заявки</a>
            <a href="#" className="block py-1 hover:text-blue-600">В работе</a>
            <a href="#" className="block py-1 hover:text-blue-600">Отправлено КП</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
