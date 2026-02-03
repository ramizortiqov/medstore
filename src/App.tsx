import React, { useState, useMemo, useEffect } from 'react';
import { BOOKS, CATEGORIES } from './constants';
import { Book, Category } from './types';
import { SearchBar } from './components/SearchBar';
import { CategoryMenu } from './components/CategoryMenu';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { X, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';

// ВАЖНО: Оставьте здесь только реальные ID админов
const ADMIN_IDS = [
  6520890849, 
  6720999592,
  5743119052 // <-- УБЕДИТЕСЬ, ЧТО ТУТ ВАШ ID (который вы видели на экране)
];

const ADMIN_PASSWORD = '1234'; 

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Все');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Права доступа
  const [isTelegramAdmin, setIsTelegramAdmin] = useState(false);

  // Initialize Telegram Web App
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      
      // Проверка: является ли пользователь админом
      if (user) {
        // Сравниваем ID как строки, чтобы избежать ошибок типов
        const isAdmin = ADMIN_IDS.some(adminId => String(adminId) === String(user.id));
        if (isAdmin) {
          setIsTelegramAdmin(true);
        }
      }
    }
  }, []);

  // Supabase Fetch & Realtime Subscription
  useEffect(() => {
    setIsLoading(true);

    const fetchBooks = async () => {
      const { data, error } = await supabase.from('books').select('*');
      if (error) {
        console.error("Error fetching books:", error);
      } else {
        setBooks((data as Book[]) || []);
      }
      setIsLoading(false);
    };

    fetchBooks();

    const subscription = supabase
      .channel('public:books')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setBooks((prev) => [...prev, payload.new as Book]);
        } 
        else if (payload.eventType === 'DELETE') {
          setBooks((prev) => prev.filter((book) => book.id !== payload.old.id));
        } 
        else if (payload.eventType === 'UPDATE') {
          setBooks((prev) => prev.map((book) => 
            book.id === payload.new.id ? (payload.new as Book) : book
          ));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Вспомогательная функция (если админ пытается зайти по прямой ссылке в обход меню)
  const checkTelegramAdmin = () => {
    return isTelegramAdmin;
  };

  // CRUD Operations
  const handleAddBook = async (newBookData: Omit<Book, 'id'>) => {
    try {
      const { error } = await supabase.from('books').insert([newBookData]);
      if (error) throw error;
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Ошибка при добавлении. Проверьте подключение или размер фото.");
    }
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      const { id, ...data } = updatedBook;
      const { error } = await supabase.from('books').update(data).eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Ошибка сохранения.");
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
      if (selectedBook?.id === id) setSelectedBook(null);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleResetData = async () => {
    if (confirm('СБРОС БАЗЫ: Вы уверены? Это удалит все товары и вернет стандартные.')) {
      try {
        setIsLoading(true);
        const { data: allBooks } = await supabase.from('books').select('id');
        if (allBooks && allBooks.length > 0) {
          const ids = allBooks.map(b => b.id);
          await supabase.from('books').delete().in('id', ids);
        }
        
        const booksToInsert = BOOKS.map(b => b);
        const { error } = await supabase.from('books').insert(booksToInsert);
        if (error) throw error;

        alert('База данных успешно сброшена.');
        const { data } = await supabase.from('books').select('*');
        if (data) setBooks(data as Book[]);
      } catch (e) {
        console.error("Error resetting data: ", e);
        alert("Ошибка при сбросе.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Auth Logic
  const handleAdminRequest = () => {
    setIsMenuOpen(false);
    // Если пользователь уже определен как админ по ID — пускаем сразу
    if (isTelegramAdmin) {
      setIsAdminOpen(true);
    } else {
      // Иначе просим пароль
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminOpen(true);
      return true;
    }
    return false;
  };

  // Filtering Logic
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory = selectedCategory === 'Все' || book.category === selectedCategory;
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [books, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-10">
      
      {/* Header Area */}
      <div className="sticky top-0 z-30 bg-white shadow-md transition-shadow duration-300">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          onMenuClick={() => setIsMenuOpen(true)}
        />
        
        {/* Active Category Indicator */}
        {selectedCategory !== 'Все' && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between animate-slide-in-up">
            <span className="text-sm text-blue-800 font-medium">
              Категория: {selectedCategory}
            </span>
            <button 
              onClick={() => setSelectedCategory('Все')}
              className="text-blue-600 p-1 hover:bg-blue-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <main className="px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
             <Loader2 className="w-10 h-10 animate-spin mb-2 text-blue-500" />
             <p className="text-sm">Загрузка товаров...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={setSelectedBook} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-center opacity-60">
            <div className="bg-gray-200 p-4 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600">Ничего не найдено</p>
          </div>
        )}
      </main>

      {/* Side Menu */}
      {isMenuOpen && (
        <CategoryMenu
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onClose={() => setIsMenuOpen(false)}
          onOpenAdmin={handleAdminRequest}
          isAdmin={isTelegramAdmin} 
        />
      )}

      {/* Auth Modal (только для тех, кого нет в списке ID) */}
      {isAuthModalOpen && (
        <AdminLoginModal 
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel 
          books={books}
          onAddBook={handleAddBook}
          onUpdateBook={handleUpdateBook}
          onDeleteBook={handleDeleteBook}
          onResetData={handleResetData}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Modal Overlay for Book Details */}
      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
};

export default App;
