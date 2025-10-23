import React, { useState } from 'react';
import { Check, Edit2, Trash2, Users, Clock, Phone } from 'lucide-react';

/**
 * Карточка зоны с бронированием
 */
const ZoneCard = ({ zone, onStatusChange, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { name, capacity, isVip, booking } = zone;

  // Определяем статус и цвет карточки
  const getCardStyle = () => {
    if (!booking) {
      return 'bg-dungeon-card border-dungeon-gray';
    }
    
    switch (booking.status) {
      case 'active':
        return 'bg-gradient-to-br from-emerald-900/40 to-dungeon-card border-dungeon-neon-green';
      case 'pending':
        return 'bg-gradient-to-br from-yellow-900/40 to-dungeon-card border-yellow-500';
      case 'cancelled':
        return 'bg-gradient-to-br from-red-900/40 to-dungeon-card border-red-500';
      default:
        return 'bg-dungeon-card border-dungeon-gray';
    }
  };

  const getStatusBadge = () => {
    if (!booking) return null;
    
    const badges = {
      active: { text: 'Активна', color: 'bg-dungeon-neon-green text-dungeon-darker' },
      pending: { text: 'Ожидание', color: 'bg-yellow-500 text-dungeon-darker' },
      cancelled: { text: 'Отменена', color: 'bg-red-500 text-white' },
    };

    const badge = badges[booking.status] || badges.active;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div
      className={`
        relative rounded-xl border-2 p-4 transition-all duration-300 animate-fade-in
        ${getCardStyle()}
        ${isVip ? 'shadow-neon-purple' : ''}
        ${isHovered && booking ? 'transform -translate-y-1 shadow-2xl' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* VIP индикатор */}
      {isVip && (
        <div className="absolute -top-2 -right-2 bg-dungeon-neon-purple text-white px-3 py-1 rounded-full text-xs font-bold shadow-neon-purple">
          VIP
        </div>
      )}

      {/* Заголовок зоны */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-orbitron font-bold text-lg ${isVip ? 'text-dungeon-neon-purple' : 'text-dungeon-neon-green'}`}>
          {name}
        </h3>
        {getStatusBadge()}
      </div>

      {/* Вместимость */}
      <div className="flex items-center gap-2 mb-3 text-gray-400">
        <Users size={16} />
        <span className="text-sm">До {capacity} чел.</span>
      </div>

      {/* Информация о бронировании */}
      {booking ? (
        <div className="space-y-3">
          {/* Время */}
          <div className="flex items-center gap-2 text-white">
            <Clock size={18} className="text-dungeon-neon-blue" />
            <span className="font-semibold text-lg">{booking.time}</span>
          </div>

          {/* Имя гостя */}
          <div className="text-white font-medium">
            {booking.name}
          </div>

          {/* Количество гостей */}
          <div className="flex items-center gap-2 text-gray-300">
            <Users size={16} />
            <span>{booking.guests} {booking.guests === 1 ? 'гость' : 'гостей'}</span>
          </div>

          {/* Телефон */}
          {booking.phone && (
            <div className="flex items-center gap-2 text-gray-300">
              <Phone size={16} />
              <span className="text-sm">{booking.phone}</span>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-dungeon-gray">
            <button
              onClick={() => onStatusChange(booking.id, booking.status === 'active' ? 'pending' : 'active')}
              className="flex-1 flex items-center justify-center gap-2 bg-dungeon-neon-green/20 hover:bg-dungeon-neon-green/30 text-dungeon-neon-green px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-neon-green"
              title="Подтвердить"
            >
              <Check size={18} />
            </button>
            
            <button
              onClick={() => onEdit(booking)}
              className="flex-1 flex items-center justify-center gap-2 bg-dungeon-neon-blue/20 hover:bg-dungeon-neon-blue/30 text-dungeon-neon-blue px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-neon-blue"
              title="Редактировать"
            >
              <Edit2 size={18} />
            </button>
            
            <button
              onClick={() => onDelete(booking.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg transition-all duration-200"
              title="Удалить"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-sm">Нет брони</p>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;

