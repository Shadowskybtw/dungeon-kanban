import React, { useState } from 'react';
import { Check, Edit2, Trash2, Users, Clock, Phone, Plus } from 'lucide-react';
import HappyHoursIndicator from './HappyHoursIndicator';

/**
 * Карточка зоны с бронированием
 */
const ZoneCard = ({ zone, onStatusChange, onEdit, onDelete, onCreate, onHappyHoursToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
        return 'bg-gradient-to-br from-red-900/40 to-dungeon-card border-red-500';
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
      pending: { text: 'Ожидание', color: 'bg-red-500 text-white' },
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

          {/* Имя гостя с tooltip */}
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="text-white font-medium cursor-pointer hover:text-dungeon-neon-green transition-colors">
              {booking.name}
            </div>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute z-50 bottom-full left-0 mb-2 p-3 bg-dungeon-darker border-2 border-dungeon-neon-green rounded-lg shadow-neon-green min-w-[200px] animate-fade-in">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-dungeon-neon-green">
                    <Clock size={14} />
                    <span className="font-semibold">{booking.time}</span>
                  </div>
                  {booking.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={14} />
                      <span>{booking.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users size={14} />
                    <span>{booking.guests} гостей</span>
                  </div>
                </div>
                {/* Стрелка tooltip */}
                <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-dungeon-neon-green transform rotate-45"></div>
              </div>
            )}
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

          {/* VR и Кальян бейджи */}
          {(booking.vr || booking.hookah) && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {booking.vr && (
                <span className="px-2 py-1 rounded-md text-xs font-semibold bg-dungeon-neon-purple/20 text-dungeon-neon-purple border border-dungeon-neon-purple/50">
                  🥽 VR
                </span>
              )}
              {booking.hookah && (
                <span className="px-2 py-1 rounded-md text-xs font-semibold bg-dungeon-neon-blue/20 text-dungeon-neon-blue border border-dungeon-neon-blue/50">
                  💨 Кальян
                </span>
              )}
            </div>
          )}

          {/* Индикатор счастливых часов */}
          <HappyHoursIndicator
            time={booking.time}
            isHappyHours={booking.happyHours}
            isActive={booking.happyHours}
            onToggle={() => onHappyHoursToggle && onHappyHoursToggle(booking.id, !booking.happyHours)}
          />

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
        <button
          onClick={() => onCreate && onCreate(zone)}
          className="w-full text-center py-8 text-gray-500 hover:text-dungeon-neon-green hover:bg-dungeon-neon-green/5 rounded-lg transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📭</div>
            <p className="text-sm">Нет брони</p>
            <div className="flex items-center gap-1 text-dungeon-neon-green opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={16} />
              <span className="text-xs font-semibold">Добавить бронь</span>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ZoneCard;

