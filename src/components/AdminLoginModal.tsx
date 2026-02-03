import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
      onClose();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Вход для админа</h2>
          <p className="text-sm text-gray-500">Введите пароль доступа</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            className={`
              w-full text-center text-2xl tracking-widest font-bold py-3 px-4 rounded-xl border-2 outline-none transition-colors mb-2
              ${error 
                ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' 
                : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-blue-500 focus:bg-white'
              }
            `}
            placeholder="••••"
            value={password}
            onChange={(e) => {
              setError(false);
              setPassword(e.target.value);
            }}
          />
          
          {error && (
            <p className="text-red-500 text-xs text-center mb-4 font-medium">
              Неверный пароль
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};