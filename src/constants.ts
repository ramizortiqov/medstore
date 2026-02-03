
import { Book, Category } from './types';

export const CATEGORIES: Category[] = ['Все', 'Книги', 'Книжки', 'Тетради', 'Ручки', 'Развлечения'];

export const BOOKS: Book[] = [
  // Книги (Books with authors)
  {
    id: '1',
    title: 'Атлас анатомии человека',
    author: 'Фрэнк Г. Неттер',
    subject: 'Анатомия',
    price: 4500,
    coverImage: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Netter+Atlas',
    sampleImage: 'https://placehold.co/400x600/png?text=Anatomy+Map',
    status: 'In Stock',
    category: 'Книги',
    description: 'Единственный атлас по анатомии, иллюстрированный врачами. Более 500 детализированных изображений.'
  },
  {
    id: '2',
    title: 'Основы патологии заболеваний',
    author: 'Роббинс, Котран',
    subject: 'Патология',
    price: 3200,
    coverImage: 'https://placehold.co/400x600/fee2e2/991b1b?text=Robbins+Pathology',
    sampleImage: 'https://placehold.co/400x600/png?text=Pathology+Sample',
    status: 'In Stock',
    category: 'Книги',
    description: 'Золотой стандарт учебной литературы по патологии. Подробный разбор механизмов заболеваний.'
  },
  {
    id: '3',
    title: 'Медицинская физиология',
    author: 'Гайтон, Холл',
    subject: 'Физиология',
    price: 2800,
    coverImage: 'https://placehold.co/400x600/dbeafe/1e40af?text=Guyton+Physiology',
    sampleImage: 'https://placehold.co/400x600/png?text=Physiology+Graph',
    status: 'Out of Stock',
    category: 'Книги',
    description: 'Фундаментальный учебник по физиологии для студентов медицинских вузов.'
  },

  // Книжки (Booklets/Manuals)
  {
    id: '4',
    title: 'ЭКГ за 10 минут',
    subject: 'Кардиология',
    price: 350,
    coverImage: 'https://placehold.co/400x600/f3e8ff/6b21a8?text=ECG+Guide',
    sampleImage: 'https://placehold.co/400x600/png?text=ECG+Strip',
    status: 'In Stock',
    category: 'Книжки',
    description: 'Краткое карманное руководство по расшифровке электрокардиограммы.'
  },
  {
    id: '5',
    title: 'Справочник лекарств 2024',
    subject: 'Фармакология',
    price: 450,
    coverImage: 'https://placehold.co/400x600/ccfbf1/0f766e?text=Pharma+Guide',
    sampleImage: 'https://placehold.co/400x600/png?text=Table+Sample',
    status: 'In Stock',
    category: 'Книжки',
    description: 'Карманный справочник с актуальными дозировками и торговыми названиями.'
  },

  // Тетради (Notebooks)
  {
    id: '6',
    title: 'Тетрадь А4 (96 л, клетка)',
    subject: 'Канцелярия',
    price: 180,
    coverImage: 'https://placehold.co/400x600/f1f5f9/334155?text=Notebook+A4',
    sampleImage: 'https://placehold.co/400x600/png?text=Grid+Paper',
    status: 'In Stock',
    category: 'Тетради',
    description: 'Качественная бумага, твердая обложка, идеально для лекций.'
  },
  {
    id: '7',
    title: 'Тетрадь 48 л (Анатомия)',
    subject: 'Канцелярия',
    price: 90,
    coverImage: 'https://placehold.co/400x600/ffedd5/9a3412?text=Notebook+48',
    sampleImage: 'https://placehold.co/400x600/png?text=Paper+Sample',
    status: 'In Stock',
    category: 'Тетради',
    description: 'Тематическая обложка с анатомическими рисунками.'
  },

  // Ручки (Pens)
  {
    id: '8',
    title: 'Ручка-шприц (Синяя)',
    subject: 'Сувениры',
    price: 120,
    coverImage: 'https://placehold.co/400x600/e0f2fe/0369a1?text=Syringe+Pen',
    sampleImage: 'https://placehold.co/400x600/png?text=Ink+Color',
    status: 'In Stock',
    category: 'Ручки',
    description: 'Забавная шариковая ручка в форме шприца с жидкостью.'
  },
  {
    id: '9',
    title: 'Набор маркеров (Пастель)',
    subject: 'Канцелярия',
    price: 450,
    coverImage: 'https://placehold.co/400x600/fce7f3/db2777?text=Markers',
    sampleImage: 'https://placehold.co/400x600/png?text=Colors',
    status: 'In Stock',
    category: 'Ручки',
    description: 'Набор из 6 текстовыделителей пастельных тонов для конспектов.'
  },

  // Развлечения (Entertainment)
  {
    id: '10',
    title: 'Пазл "Человеческий мозг"',
    subject: 'Досуг',
    price: 890,
    coverImage: 'https://placehold.co/400x600/fef3c7/b45309?text=Brain+Puzzle',
    sampleImage: 'https://placehold.co/400x600/png?text=Puzzle+Piece',
    status: 'In Stock',
    category: 'Развлечения',
    description: 'Сложный и увлекательный пазл на 500 элементов.'
  },
  {
    id: '11',
    title: 'Брелок "Зуб мудрости"',
    subject: 'Сувениры',
    price: 250,
    coverImage: 'https://placehold.co/400x600/ecfccb/3f6212?text=Keyring',
    sampleImage: 'https://placehold.co/400x600/png?text=Detail',
    status: 'In Stock',
    category: 'Развлечения',
    description: 'Милый брелок для ключей или халата.'
  }
];
