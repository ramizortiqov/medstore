import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const isAvailable = book.status === 'In Stock';

  return (
    <div 
      onClick={() => onClick(book)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer active:scale-95"
    >
      {/* Image Container */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100 relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md rotate-[-12deg]">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col h-full">
        <p className="text-xs text-blue-500 font-medium mb-0.5 truncate">
          {book.subject}
        </p>
        
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        
        {book.author && (
          <p className="text-xs text-gray-500 mb-auto line-clamp-1">
            {book.author}
          </p>
        )}
        {!book.author && <div className="mb-auto" />} {/* Spacer if no author */}
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {book.price} ₽
          </span>
          {isAvailable && (
             <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7 7 12-12"/></svg>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
