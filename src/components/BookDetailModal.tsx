import React, { useState } from 'react';
import { X, MapPin, ZoomIn } from 'lucide-react';
import { Book } from '../types';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const isAvailable = book.status === 'In Stock';

  const handleBuyClick = () => {
    // Проверяем, доступны ли функции Telegram
    if (window.Telegram?.WebApp?.showPopup) {
      window.Telegram.WebApp.showPopup({
        title: 'Адрес',
        message: 'Подземкаи пеши Приёмный, Қараболо (Мағозаи 9-ум) \nВақти корӣ: 07:10 - 21:00 \n Телефон: +992929238520',
        buttons: [{ type: 'ok', text: 'Ок' }]
      });
    } else {
      // Если открыто не в Telegram (например, в обычном браузере),
      // показываем старый alert как запасной вариант
      alert(`Подземкаи пеши Приёмный, Қараболо (Мағозаи 9-ум) \nВақти корӣ: 07:10 - 21:00\n Телефон: +992929238520`);
    }
  };

  if (isZoomed) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black flex items-center justify-center p-2 cursor-zoom-out"
        onClick={() => setIsZoomed(false)}
      >
        <img 
          src={book.sampleImage} 
          alt="Sample Page" 
          className="max-w-full max-h-full object-contain"
        />
        <button 
          className="absolute top-4 right-4 text-white p-2 bg-white/20 rounded-full"
          onClick={() => setIsZoomed(false)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white h-[90vh] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header/Nav */}
        <div className="absolute top-0 right-0 p-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 pb-24 no-scrollbar">
          {/* Cover Image */}
          <div className="w-full h-80 bg-gray-100 relative">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
               <span className="inline-block px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
                 {book.subject}
               </span>
             </div>
          </div>

          <div className="p-5">
            {/* Title & Price */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
                {book.title}
              </h2>
              {book.author && (
                <p className="text-lg text-gray-600 font-medium mb-3">
                  {book.author}
                </p>
              )}
              
              <div className="flex items-center space-x-3 mt-2">
                 <span className="text-2xl font-bold text-blue-600">
                   {book.price} с
                 </span>
                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {book.status === 'In Stock' ? 'В наличии' : 'Нет в наличии'}
                 </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Описание
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {book.description || 'Описание отсутствует.'}
              </p>
            </div>

            {/* Sample Page Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  {book.category === 'Книги' || book.category === 'Книжки' ? 'Пример страницы' : 'Фото товара'}
                </h3>
                <span className="text-xs text-blue-500 font-medium">Нажмите для фото</span>
              </div>
              
              <button 
                onClick={() => setIsZoomed(true)}
                className="group relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
              >
                <img 
                  src={book.sampleImage} 
                  alt="Sample" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                  <div className="bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ZoomIn className="w-6 h-6 text-gray-800" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 safe-area-pb">
          <button
            onClick={handleBuyClick}
            disabled={!isAvailable}
            className={`
              w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-[0.98]
              ${isAvailable 
                ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}
            `}
          >
            <MapPin className="w-5 h-5" />
            <span>{isAvailable ? 'Купить в офисе' : 'Временно нет'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
