
import React, { useState } from 'react';
import { Book, Category, BookStatus } from '../types';
import { CATEGORIES } from '../constants';
import { Plus, X, Pencil, Trash2, Save, ArrowLeft, Upload, ImageIcon, RotateCcw } from 'lucide-react';

interface AdminPanelProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: string) => void; 
  onResetData: () => void;
  onClose: () => void;
}

const emptyBook: Omit<Book, 'id'> = {
  title: '',
  author: '',
  subject: '',
  price: 0,
  coverImage: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Cover',
  sampleImage: 'https://placehold.co/400x600/png?text=Page',
  status: 'In Stock',
  category: 'Книги',
  description: ''
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  books, 
  onAddBook, 
  onUpdateBook, 
  onDeleteBook, 
  onResetData,
  onClose 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | Omit<Book, 'id'>>(emptyBook);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if ('id' in currentBook) {
        await onUpdateBook(currentBook as Book);
      } else {
        await onAddBook(currentBook);
      }
      setIsEditing(false);
      setCurrentBook(emptyBook);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      onDeleteBook(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'sampleImage') => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit upload size to ensure database performance (storing base64 strings)
      if (file.size > 800 * 1024) {
        alert('Файл слишком большой. Пожалуйста, выберите фото меньше 800 КБ для быстрой работы приложения.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentBook(prev => ({ ...prev, [field]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto pb-10">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full">
               <ArrowLeft className="w-5 h-5" />
             </button>
             <h2 className="text-lg font-bold">
               {'id' in currentBook ? 'Редактировать' : 'Новый товар'}
             </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto">
          {/* Основная информация */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input 
                required
                type="text" 
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={currentBook.title}
                onChange={e => setCurrentBook({...currentBook, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Предмет</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none"
                  value={currentBook.subject}
                  onChange={e => setCurrentBook({...currentBook, subject: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
                 <input 
                    required
                    type="number" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none"
                    value={currentBook.price}
                    onChange={e => setCurrentBook({...currentBook, price: Number(e.target.value)})}
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Автор</label>
              <input 
                type="text" 
                placeholder="Необязательно"
                className="w-full p-2.5 border border-gray-300 rounded-xl outline-none"
                value={currentBook.author || ''}
                onChange={e => setCurrentBook({...currentBook, author: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select 
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none bg-white"
                  value={currentBook.category}
                  onChange={e => setCurrentBook({...currentBook, category: e.target.value as Category})}
                >
                  {CATEGORIES.filter(c => c !== 'Все').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                <select 
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none bg-white"
                  value={currentBook.status}
                  onChange={e => setCurrentBook({...currentBook, status: e.target.value as BookStatus})}
                >
                  <option value="In Stock">В наличии</option>
                  <option value="Out of Stock">Нет в наличии</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-2"></div>

          {/* Загрузка фото */}
          <div className="space-y-4">
            <div>
               <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                 <ImageIcon className="w-4 h-4 text-blue-500" />
                 Обложка товара
               </label>
               <div className="flex gap-4 items-start p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                 <div className="relative w-24 h-32 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                   {currentBook.coverImage ? (
                     <img src={currentBook.coverImage} alt="Cover" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-8 h-8" />
                     </div>
                   )}
                 </div>
                 <div className="flex-1 flex flex-col justify-center h-32">
                   <label className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium cursor-pointer hover:bg-blue-100 transition-colors">
                     <Upload className="w-4 h-4 mr-2" />
                     Выбрать фото
                     <input 
                       type="file" 
                       accept="image/*" 
                       className="hidden"
                       onChange={(e) => handleImageUpload(e, 'coverImage')}
                     />
                   </label>
                   <p className="mt-2 text-xs text-gray-500 text-center">
                     Макс 800КБ (для быстрой работы)
                   </p>
                 </div>
               </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                 <ImageIcon className="w-4 h-4 text-blue-500" />
                 Пример страницы
               </label>
               <div className="flex gap-4 items-start p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                 <div className="relative w-24 h-32 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                   {currentBook.sampleImage ? (
                     <img src={currentBook.sampleImage} alt="Sample" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-8 h-8" />
                     </div>
                   )}
                 </div>
                 <div className="flex-1 flex flex-col justify-center h-32">
                   <label className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium cursor-pointer hover:bg-blue-100 transition-colors">
                     <Upload className="w-4 h-4 mr-2" />
                     Выбрать фото
                     <input 
                       type="file" 
                       accept="image/*" 
                       className="hidden"
                       onChange={(e) => handleImageUpload(e, 'sampleImage')}
                     />
                   </label>
                   <p className="mt-2 text-xs text-gray-500 text-center">
                     Макс 800КБ
                   </p>
                 </div>
               </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-2"></div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea 
              rows={4}
              className="w-full p-2.5 border border-gray-300 rounded-xl outline-none"
              value={currentBook.description || ''}
              onChange={e => setCurrentBook({...currentBook, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className={`
              w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200
              ${isProcessing ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {isProcessing ? 'Сохранение...' : (
              <>
                <Save className="w-5 h-5" />
                Сохранить товар
              </>
            )}
          </button>
          
          <div className="h-4"></div>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-gray-50 flex flex-col animate-slide-in-up">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Админ-панель</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <button 
          onClick={() => {
            setCurrentBook(emptyBook);
            setIsEditing(true);
          }}
          className="w-full bg-blue-600 text-white p-4 rounded-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center gap-2 mb-6 hover:bg-blue-700 transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Добавить товар
        </button>

        <div className="space-y-3">
          {books.map(book => (
            <div key={book.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3 items-center">
              <div className="w-12 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                <p className="text-xs text-gray-500">{book.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-blue-600">{book.price} ₽</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${book.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {book.status === 'In Stock' ? 'Есть' : 'Нет'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleEdit(book)}
                  className="p-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="p-2 bg-gray-50 text-red-500 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        
      </div>
    </div>
  );
};
