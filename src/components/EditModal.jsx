import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Users, Phone, User, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Модальное окно для редактирования/создания бронирования
 */
const EditModal = ({ booking, zone, isOpen, onClose, onSave, isCreating = false }) => {
  const [formData, setFormData] = useState({
    time: '',
    name: '',
    guests: '',
    phone: '',
    status: 'pending',
    happyHours: false,
    comment: '',
    vr: false,
    hookah: false
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        time: booking.time || '',
        name: booking.name || '',
        guests: booking.guests || '',
        phone: booking.phone || '',
        status: booking.status || 'pending',
        happyHours: booking.happyHours || false,
        comment: booking.comment || '',
        vr: booking.vr || false,
        hookah: booking.hookah || false
      });
    } else if (isCreating) {
      // Для новой брони устанавливаем значения по умолчанию
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setFormData({
        time: `${hours}:00`,
        name: '',
        guests: 1,
        phone: '+7',
        status: 'pending',
        happyHours: false,
        comment: '',
        vr: false,
        hookah: false
      });
    }
  }, [booking, isCreating]);

  if (!isOpen || (!booking && !isCreating)) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверка на счастливые часы
    if (formData.time) {
      const [hours, minutes] = formData.time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      const isInRange = timeInMinutes >= 840 && timeInMinutes < 1140; // 14:00-19:00
      
      // Автоматически устанавливаем счастливые часы, если время попадает в диапазон
      if (isInRange && !formData.happyHours) {
        formData.happyHours = false; // Оставляем выбор пользователю
      } else if (!isInRange) {
        formData.happyHours = false; // Отключаем, если не в диапазоне
      }
    }
    
    if (isCreating) {
      onSave(null, formData); // null ID для новой брони
    } else {
      onSave(booking.id, formData);
    }
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
                {isCreating ? 'Новая бронь' : 'Редактирование брони'}
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
          {/* Время - кнопки выбора часов */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
              <Clock size={16} className="text-dungeon-neon-blue" />
              Время *
            </label>
            <div className="grid grid-cols-6 gap-2 mb-2">
              {[14, 15, 16, 17, 18, 19].map(hour => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleChange('time', `${hour}:00`)}
                  className={`
                    py-2 px-3 rounded-lg font-semibold transition-all duration-200 text-sm
                    ${formData.time === `${hour}:00` || formData.time?.startsWith(`${hour}:`)
                      ? 'bg-dungeon-neon-green text-dungeon-darker shadow-neon-green'
                      : 'bg-dungeon-darker text-gray-400 border border-dungeon-gray hover:border-dungeon-neon-green/50'
                    }
                  `}
                >
                  {hour}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[20, 21, 22, 23, '00', '01'].map(hour => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleChange('time', `${hour}:00`)}
                  className={`
                    py-2 px-3 rounded-lg font-semibold transition-all duration-200 text-sm
                    ${formData.time === `${hour}:00` || formData.time?.startsWith(`${hour}:`)
                      ? 'bg-dungeon-neon-green text-dungeon-darker shadow-neon-green'
                      : 'bg-dungeon-darker text-gray-400 border border-dungeon-gray hover:border-dungeon-neon-green/50'
                    }
                  `}
                >
                  {hour}
                </button>
              ))}
            </div>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full mt-2 bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-2 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors text-sm"
              required
            />
          </div>

          {/* Имя гостя */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <User size={16} className="text-dungeon-neon-blue" />
              Имя *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-2 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors"
              placeholder="Имя клиента"
              required
            />
          </div>

          {/* Количество гостей */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Users size={16} className="text-dungeon-neon-blue" />
              Гости *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={zone?.capacity || 20}
                value={formData.guests}
                onChange={(e) => handleChange('guests', parseInt(e.target.value) || 1)}
                className="flex-1 bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-2 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors text-center font-semibold"
                required
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const newValue = (parseInt(formData.guests) || 1) + 1;
                    if (newValue <= (zone?.capacity || 20)) {
                      handleChange('guests', newValue);
                    }
                  }}
                  className="bg-dungeon-neon-green hover:bg-dungeon-neon-green/80 text-dungeon-darker p-1 rounded transition-all shadow-neon-green/30"
                  title="Увеличить"
                >
                  <ChevronUp size={16} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = (parseInt(formData.guests) || 1) - 1;
                    if (newValue >= 1) {
                      handleChange('guests', newValue);
                    }
                  }}
                  className="bg-dungeon-neon-green hover:bg-dungeon-neon-green/80 text-dungeon-darker p-1 rounded transition-all shadow-neon-green/30"
                  title="Уменьшить"
                >
                  <ChevronDown size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Вместимость: до {zone?.capacity || 0} чел.
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
              className="w-full bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-2 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors"
              placeholder="+7"
            />
          </div>

          {/* Комментарий */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              Комментарий
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              className="w-full bg-dungeon-darker border-2 border-dungeon-gray rounded-lg px-4 py-2 text-white focus:border-dungeon-neon-green focus:outline-none transition-colors resize-none"
              rows="2"
              placeholder="Дополнительная информация..."
            />
          </div>

          {/* Дополнительные опции */}
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.vr}
                onChange={(e) => handleChange('vr', e.target.checked)}
                className="w-4 h-4 rounded border-dungeon-gray bg-dungeon-darker text-dungeon-neon-green focus:ring-dungeon-neon-green"
              />
              <span className="text-sm text-gray-300">VR</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hookah}
                onChange={(e) => handleChange('hookah', e.target.checked)}
                className="w-4 h-4 rounded border-dungeon-gray bg-dungeon-darker text-dungeon-neon-green focus:ring-dungeon-neon-green"
              />
              <span className="text-sm text-gray-300">Кальян</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.happyHours}
                onChange={(e) => handleChange('happyHours', e.target.checked)}
                className="w-4 h-4 rounded border-dungeon-gray bg-dungeon-darker text-dungeon-neon-green focus:ring-dungeon-neon-green"
              />
              <span className="text-sm text-gray-300">Счастливые часы</span>
            </label>
          </div>

          {/* Статус (только при редактировании) */}
          {!isCreating && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                Статус
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('status', 'active')}
                  className={`
                    flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 text-sm
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
                    flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 text-sm
                    ${formData.status === 'pending'
                      ? 'bg-red-500 text-white'
                      : 'bg-dungeon-darker text-gray-400 border-2 border-dungeon-gray hover:border-red-500/50'
                    }
                  `}
                >
                  Ожидание
                </button>
              </div>
            </div>
          )}

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
              className="flex-1 bg-dungeon-neon-blue hover:bg-dungeon-neon-blue/80 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-neon-blue flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isCreating ? 'Добавить' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

