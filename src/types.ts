
export type BookStatus = 'In Stock' | 'Out of Stock';

export type Category = 'Все' | 'Книги' | 'Книжки' | 'Тетради' | 'Ручки' | 'Развлечения';

export interface Book {
  id: string; 
  title: string;
  author?: string; 
  subject: string;
  price: number;
  coverImage: string;
  sampleImage: string;
  status: BookStatus;
  category: Category | string;
  description?: string;
}

// Telegram Web App Types
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}
