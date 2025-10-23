import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Компонент уведомлений Toast
 */
const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-dungeon-neon-green/20',
          border: 'border-dungeon-neon-green',
          text: 'text-dungeon-neon-green',
          icon: <CheckCircle size={20} />
        };
      case 'error':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500',
          text: 'text-red-400',
          icon: <AlertCircle size={20} />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500',
          text: 'text-yellow-400',
          icon: <AlertCircle size={20} />
        };
      default:
        return {
          bg: 'bg-dungeon-neon-blue/20',
          border: 'border-dungeon-neon-blue',
          text: 'text-dungeon-neon-blue',
          icon: <Info size={20} />
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`
      fixed top-4 right-4 z-50 
      ${styles.bg} ${styles.text}
      border-2 ${styles.border}
      rounded-lg shadow-lg backdrop-blur-md
      p-4 min-w-[300px] max-w-md
      animate-fade-in
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <p className="flex-1 text-sm font-medium">
          {message}
        </p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

/**
 * Контейнер для множественных Toast-уведомлений
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default Toast;

