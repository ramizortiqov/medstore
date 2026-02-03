import React from 'react';
import { Book } from '../types';
import { ShoppingBag } from 'lucide-react'; // Добавил иконку для красоты

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const isAvailable = book.status === 'In Stock';

  // Функция для красивого вывода цены (например: 1 200 ₽)
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(book.price);

  return (
    <div 
      onClick={() => onClick(book)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer active:scale-95 flex flex-col h-full"
    >
      {/* Контейнер картинки */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100 relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? 'grayscale opacity-70' : ''}`}
          loading="lazy"
        />
        
        {/* Бейдж "Нет в наличии" */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
            <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm rotate-[-6deg]">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Контент карточки */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Категория/Предмет */}
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 truncate">
          {book.subject}
        </p>
        
        {/* Название */}
        <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        
        {/* Автор (если есть) */}
        {book.author && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
            {book.author}
          </p>
        )}
        
        {/* Распорка, чтобы цена всегда была внизу */}
        <div className="flex-grow" />
        
        {/* Блок цены */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-lg font-bold leading-none ${isAvailable ? 'text-blue-600' : 'text-gray-400'}`}>
              {formattedPrice} С
            </span>
          </div>

          {/* Кнопка-иконка (декоративная) */}
          {isAvailable && (
             <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ShoppingBag className="w-4 h-4" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
