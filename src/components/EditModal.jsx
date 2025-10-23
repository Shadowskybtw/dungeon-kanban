import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Users, Phone, User } from 'lucide-react';

/**
 * Модальное окно для редактирования бронирования
 */
const EditModal = ({ booking, zone, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    time: '',
    name: '',
    guests: '',
    phone: '',
    status: 'pending'
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        time: booking.time || '',
        name: booking.name || '',
        guests: booking.guests || '',
        phone: booking.phone || '',
        status: booking.status || 'pending'
      });
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(booking.id, formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-dungeon-card border-2 border-dungeon-neon-purple rounded-2xl shadow-neon-purple max-w-md w-full overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-dungeon-neon-purple/20 to-dungeon-neon-blue/20 p-6 border-b-2 border-dungeon-gray">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-dungeon-neon-purple">
                Редактирование брони
              </h2>
              <p className="text-gray-400 text-sm mt-1">{zone?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-dungeon-gray rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Время */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Clock size={16} className="text-dungeon-neon-blue" />
              Время
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-3 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Имя гостя */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <User size={16} className="text-dungeon-neon-blue" />
              Имя гостя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-3 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors"
              placeholder="Введите имя"
              required
            />
          </div>

          {/* Количество гостей */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Users size={16} className="text-dungeon-neon-blue" />
              Количество гостей
            </label>
            <input
              type="number"
              min="1"
              max={zone?.capacity || 20}
              value={formData.guests}
              onChange={(e) => handleChange('guests', parseInt(e.target.value))}
              className="w-full bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-3 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Вместимость зоны: до {zone?.capacity || 0} человек
            </p>
          </div>

          {/* Телефон */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Phone size={16} className="text-dungeon-neon-blue" />
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-3 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          {/* Статус */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              Статус
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleChange('status', 'active')}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200
                  ${formData.status === 'active'
                    ? 'bg-dungeon-neon-green text-dungeon-darker shadow-neon-green'
                    : 'bg-dungeon-darker text-gray-400 border-2 border-dungeon-gray hover:border-dungeon-neon-green/50'
                  }
                `}
              >
                Активна
              </button>
              <button
                type="button"
                onClick={() => handleChange('status', 'pending')}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200
                  ${formData.status === 'pending'
                    ? 'bg-yellow-500 text-dungeon-darker'
                    : 'bg-dungeon-darker text-gray-400 border-2 border-dungeon-gray hover:border-yellow-500/50'
                  }
                `}
              >
                Ожидание
              </button>
              <button
                type="button"
                onClick={() => handleChange('status', 'cancelled')}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200
                  ${formData.status === 'cancelled'
                    ? 'bg-red-500 text-white'
                    : 'bg-dungeon-darker text-gray-400 border-2 border-dungeon-gray hover:border-red-500/50'
                  }
                `}
              >
                Отменена
              </button>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dungeon-gray hover:bg-dungeon-gray/70 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 bg-dungeon-neon-green hover:bg-dungeon-neon-green/80 text-dungeon-darker py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-neon-green flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

