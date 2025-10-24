import React, { useState, useEffect } from 'react';
import { Check, Edit2, Trash2, Users, Clock, Phone, Plus, CheckCircle, CheckSquare } from 'lucide-react';
import HappyHoursIndicator from './HappyHoursIndicator';

/**
 * Карточка зоны с бронированием
 */
const ZoneCard = ({ zone, onStatusChange, onEdit, onDelete, onCreate, onHappyHoursToggle, onMarkCleaned, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { name, capacity, isVip, bookings = [], needsCleaning } = zone;
  
  // Обновляем текущее время каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновление каждую минуту
    return () => clearInterval(timer);
  }, []);
  
  // Проверяем, есть ли брони
  const hasBookings = bookings && bookings.length > 0;
  
  // Проверяем, есть ли активные счастливые часы, которые скоро закончатся
  const hasEndingHappyHours = () => {
    if (!hasBookings) return false;
    
    // Получаем текущее время в часовом поясе Самары (UTC+4)
    const samaraTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Europe/Samara' }));
    const currentHour = samaraTime.getHours();
    const currentMinute = samaraTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Проверяем, есть ли брони с активными счастливыми часами
    const hasActiveHappyHours = bookings.some(b => b.happyHours && b.status === 'active');
    
    // 18:50 - 19:00 (1130 - 1140 минут от полуночи)
    const isEndingTime = currentTimeInMinutes >= 1130 && currentTimeInMinutes < 1140;
    
    return hasActiveHappyHours && isEndingTime;
  };

  // Определяем статус и цвет карточки
  const getCardStyle = () => {
    // Если зона требует уборки
    if (!hasBookings && needsCleaning) {
      return 'bg-gradient-to-br from-orange-900/50 to-dungeon-card border-orange-500 shadow-orange-500/30 animate-pulse';
    }
    
    if (!hasBookings) {
      return 'bg-dungeon-card border-dungeon-gray';
    }
    
    // Если есть брони, определяем цвет по первой активной брони
    const activeBooking = bookings.find(b => b.status === 'active') || bookings[0];
    
    switch (activeBooking?.status) {
      case 'active':
        return 'bg-gradient-to-br from-emerald-900/40 to-dungeon-card border-dungeon-neon-green';
      case 'pending':
        return 'bg-gradient-to-br from-red-900/40 to-dungeon-card border-red-500';
      default:
        return 'bg-dungeon-card border-dungeon-gray';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { icon: '✓', color: 'bg-dungeon-neon-green text-dungeon-darker' },
      pending: { icon: '⏱', color: 'bg-red-500 text-white' },
    };

    const badge = badges[status] || badges.active;
    
    return (
      <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${badge.color}`}>
        {badge.icon}
      </span>
    );
  };

  return (
    <div
      className={`
        relative rounded-md border p-1.5 transition-all duration-300 animate-fade-in
        ${getCardStyle()}
        ${isVip ? 'shadow-neon-purple' : ''}
        ${isHovered && hasBookings ? 'transform -translate-y-1 shadow-2xl' : ''}
        ${hasEndingHappyHours() ? 'animate-happy-ending' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* VIP индикатор */}
      {isVip && (
        <div className="absolute -top-0.5 -right-0.5 bg-dungeon-neon-purple text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold shadow-neon-purple">
          VIP
        </div>
      )}

      {/* Заголовок зоны */}
      <div className="flex items-center justify-between mb-1">
        <h3 className={`font-orbitron font-bold text-xs ${isVip ? 'text-dungeon-neon-purple' : 'text-dungeon-neon-green'}`}>
          {name}
        </h3>
        {hasBookings && bookings.length > 1 && (
          <span className="px-1 py-0.5 rounded-full text-[9px] font-semibold bg-dungeon-neon-blue/20 text-dungeon-neon-blue">
            {bookings.length}
          </span>
        )}
      </div>

      {/* Вместимость */}
      <div className="flex items-center gap-1 mb-1 text-gray-400">
        <span className="text-[10px]">👥 {capacity} чел</span>
      </div>

      {/* Информация о бронировании */}
      {hasBookings ? (
        <div className="space-y-1">
          {/* Показываем все брони */}
          <div className="space-y-1 max-h-[250px] overflow-y-auto pr-0.5">
            {bookings.map((booking, index) => (
              <div 
                key={booking.id} 
                className={`
                  p-1.5 rounded border transition-all
                  ${booking.status === 'active' ? 'border-dungeon-neon-green/50 bg-emerald-900/10' :
                    booking.status === 'pending' ? 'border-red-500/50 bg-red-900/10' :
                    'border-dungeon-gray bg-dungeon-darker/30'}
                `}
              >
                <div className="space-y-1">
                  {/* Статус и время */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white">
                      <span className="font-semibold text-xs">🕐 {booking.time}</span>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Имя гостя и количество */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-white font-medium text-xs truncate">
                      {booking.name}
                    </div>
                    <div className="flex items-center gap-0.5 text-gray-300 text-[10px] flex-shrink-0">
                      <span>👤 {booking.guests}</span>
                    </div>
                  </div>

                  {/* Телефон - только иконка и номер */}
                  {booking.phone && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <span className="text-[10px]">📞 {booking.phone}</span>
                    </div>
                  )}

                  {/* VR и Кальян бейджи */}
                  {(booking.vr || booking.hookah) && (
                    <div className="flex items-center gap-0.5 flex-wrap">
                      {booking.vr && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-semibold bg-dungeon-neon-purple/20 text-dungeon-neon-purple border border-dungeon-neon-purple/50">
                          🥽
                        </span>
                      )}
                      {booking.hookah && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-semibold bg-dungeon-neon-blue/20 text-dungeon-neon-blue border border-dungeon-neon-blue/50">
                          💨
                        </span>
                      )}
                    </div>
                  )}

                  {/* Индикатор счастливых часов - показываем всегда */}
                  <HappyHoursIndicator
                    time={booking.time}
                    isHappyHours={booking.happyHours}
                    isActive={booking.happyHours}
                    onToggle={() => onHappyHoursToggle && onHappyHoursToggle(booking.id, !booking.happyHours)}
                  />

                  {/* Кнопки действий */}
                  <div className="mt-1 pt-1 border-t border-dungeon-gray">
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => onStatusChange(booking.id, booking.status === 'active' ? 'pending' : 'active')}
                        className="flex-1 flex items-center justify-center bg-dungeon-neon-green/20 hover:bg-dungeon-neon-green/30 text-dungeon-neon-green px-1 py-0.5 rounded transition-all"
                        title="Подтвердить"
                      >
                        <Check size={12} />
                      </button>
                      
                      <button
                        onClick={() => onEdit(booking)}
                        className="flex-1 flex items-center justify-center bg-dungeon-neon-blue/20 hover:bg-dungeon-neon-blue/30 text-dungeon-neon-blue px-1 py-0.5 rounded transition-all"
                        title="Редактировать"
                      >
                        <Edit2 size={12} />
                      </button>
                      
                      <button
                        onClick={() => onDelete(booking.id, booking.name)}
                        className="flex-1 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 px-1 py-0.5 rounded transition-all"
                        title="Удалить"
                      >
                        <Trash2 size={12} />
                      </button>
                      
                      {/* Кнопка завершить - в той же строке */}
                      <button
                        onClick={() => onComplete && onComplete(booking.id, booking.name)}
                        className="flex-1 flex items-center justify-center bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-1 py-0.5 rounded transition-all border border-purple-600/30"
                        title="Завершить"
                      >
                        <CheckSquare size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопка добавить еще бронь */}
          <button
            onClick={() => onCreate && onCreate(zone)}
            className="w-full flex items-center justify-center bg-dungeon-neon-green/10 hover:bg-dungeon-neon-green/20 text-dungeon-neon-green px-1.5 py-1 rounded transition-all duration-200 border border-dashed border-dungeon-neon-green/30 hover:border-dungeon-neon-green/50 text-xs font-semibold"
          >
            + Еще бронь
          </button>
        </div>
      ) : needsCleaning ? (
        <div className="space-y-1.5">
          <div className="text-center py-2">
            <div className="text-2xl mb-1 animate-bounce">🧹</div>
            <p className="text-orange-400 font-semibold text-xs">Требует уборки</p>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => onMarkCleaned && onMarkCleaned(zone.id)}
              className="flex-1 flex items-center justify-center gap-0.5 bg-dungeon-neon-green/20 hover:bg-dungeon-neon-green/30 text-dungeon-neon-green px-1.5 py-1 rounded transition-all duration-200 hover:shadow-neon-green text-xs font-semibold"
              title="Убрано"
            >
              ✓
            </button>
            
            <button
              onClick={() => onCreate && onCreate(zone)}
              className="flex-1 flex items-center justify-center gap-0.5 bg-dungeon-neon-blue/20 hover:bg-dungeon-neon-blue/30 text-dungeon-neon-blue px-1.5 py-1 rounded transition-all duration-200 hover:shadow-neon-blue text-xs"
              title="Добавить бронь"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onCreate && onCreate(zone)}
          className="w-full text-center py-3 text-gray-500 hover:text-dungeon-neon-green hover:bg-dungeon-neon-green/5 rounded transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform">+</div>
            <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">Добавить</p>
          </div>
        </button>
      )}
    </div>
  );
};

export default ZoneCard;
