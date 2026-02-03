import React from 'react';
import { Category } from '../types';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 pl-4 bg-white">
      <div className="flex space-x-2 pr-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`
              whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200
              ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
