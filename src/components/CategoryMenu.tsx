import React from 'react';
import { X, ChevronRight, Settings } from 'lucide-react';
import { Category } from '../types';

interface CategoryMenuProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  onClose: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean; // <-- НОВОЕ: Принимаем статус админа
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onClose,
  onOpenAdmin,
  isAdmin // <-- НОВОЕ
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative w-3/4 max-w-xs h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Категории</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onClose();
              }}
              className={`
                w-full px-5 py-4 flex items-center justify-between text-left transition-colors
                ${selectedCategory === cat 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-base">{cat}</span>
              {selectedCategory === cat && <ChevronRight className="w-5 h-5 text-blue-500" />}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50">
           {/* <-- НОВОЕ: Кнопка видна только если isAdmin === true */}
           {isAdmin && (
             <button 
               onClick={() => {
                 onClose();
                 onOpenAdmin();
               }}
               className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-gray-800 transition-colors text-sm mb-2"
             >
               <Settings className="w-4 h-4" />
               <span>Администратор</span>
             </button>
           )}
           
           <div className="text-xs text-center text-gray-300">MedBooks Store v1.1</div>
        </div>
      </div>
    </div>
  );
};
