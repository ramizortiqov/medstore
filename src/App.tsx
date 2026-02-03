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

// ВАЖНО: ID должны быть числами (без кавычек)
const ADMIN_IDS = [
  6520890849, 
  6720999592
   // <-- ВАШ ID (Замените на реальный)
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
  const [isTelegramAdmin, setIsTelegramAdmin] = useState(false);

  // <-- НОВОЕ: Стейт для отладки (чтобы видеть свой ID на экране)
  const [debugUserId, setDebugUserId] = useState<number | string>('Не определен');

  // Initialize Telegram Web App
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      
      // <-- ОТЛАДКА: Сохраняем ID, чтобы показать на экране
      if (user) {
        setDebugUserId(user.id);
        
        // Улучшенная проверка (сравниваем как строки, чтобы избежать ошибок типов)
        const isAdmin = ADMIN_IDS.some(adminId => String(adminId) === String(user.id));
        
        if (isAdmin) {
          setIsTelegramAdmin(true);
        }
      } else {
        setDebugUserId('Нет данных User');
      }
    }
  }, []);

  // Supabase Fetch & Realtime Subscription
  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      const { data, error } = await supabase.from('books').select('*');
      if (!error) setBooks((data as Book[]) || []);
      setIsLoading(false);
    };
    fetchBooks();

    const subscription = supabase
      .channel('public:books')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, (payload) => {
        if (payload.eventType === 'INSERT') setBooks((prev) => [...prev, payload.new as Book]);
        else if (payload.eventType === 'DELETE') setBooks((prev) => prev.filter((b) => b.id !== payload.old.id));
        else if (payload.eventType === 'UPDATE') setBooks((prev) => prev.map((b) => b.id === payload.new.id ? (payload.new as Book) : b));
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  // Auth Logic
  const handleAdminRequest = () => {
    setIsMenuOpen(false);
    if (isTelegramAdmin) { // Используем уже вычисленное значение
      setIsAdminOpen(true);
    } else {
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

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory = selectedCategory === 'Все' || book.category === selectedCategory;
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [books, searchQuery, selectedCategory]);

  // CRUD functions (сокращены для экономии места, они не менялись)
  const handleAddBook = async (b: any) => { /* ... */ supabase.from('books').insert([b]); };
  const handleUpdateBook = async (b: any) => { const {id, ...d} = b; supabase.from('books').update(d).eq('id', id); };
  const handleDeleteBook = async (id: string) => { supabase.from('books').delete().eq('id', id); if(selectedBook?.id === id) setSelectedBook(null); };
  const handleResetData = async () => { /* ... */ };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <SearchBar value={searchQuery} onChange={setSearchQuery} onMenuClick={() => setIsMenuOpen(true)} />
        {selectedCategory !== 'Все' && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <span className="text-sm text-blue-800 font-medium">Категория: {selectedCategory}</span>
            <button onClick={() => setSelectedCategory('Все')} className="text-blue-600 p-1 hover:bg-blue-100 rounded-full"><X className="w-4 h-4" /></button>
          </div>
        )}
      </div>

      {/* Content */}
      <main className="px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
             <Loader2 className="w-10 h-10 animate-spin mb-2 text-blue-500" />
             <p className="text-sm">Загрузка товаров...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={setSelectedBook} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-center opacity-60">
            <p className="text-lg font-medium text-gray-600">Ничего не найдено</p>
          </div>
        )}
      </main>

      {/* --- БЛОК ОТЛАДКИ (Удалите потом) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 text-xs z-50 opacity-80 text-center">
        Ваш ID: <span className="font-bold text-yellow-400">{debugUserId}</span> 
        {isTelegramAdmin ? ' (АДМИН)' : ' (Гость)'}
      </div>
      {/* ---------------------------------- */}

      {/* Menu & Modals */}
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
      {isAuthModalOpen && <AdminLoginModal onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />}
      {isAdminOpen && <AdminPanel books={books} onAddBook={handleAddBook} onUpdateBook={handleUpdateBook} onDeleteBook={handleDeleteBook} onResetData={handleResetData} onClose={() => setIsAdminOpen(false)} />}
      {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
};

export default App;
