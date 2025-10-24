import React, { useState, useEffect } from 'react';
import { Check, Edit2, Trash2, Users, Clock, Phone, Plus, CheckCircle } from 'lucide-react';
import HappyHoursIndicator from './HappyHoursIndicator';

/**
 * Карточка зоны с бронированием
 */
const ZoneCard = ({ zone, onStatusChange, onEdit, onDelete, onCreate, onHappyHoursToggle, onMarkCleaned }) => {
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
      case 'cancelled':
        return 'bg-gradient-to-br from-red-900/40 to-dungeon-card border-red-500';
      default:
        return 'bg-dungeon-card border-dungeon-gray';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Активна', color: 'bg-dungeon-neon-green text-dungeon-darker' },
      pending: { text: 'Ожидание', color: 'bg-red-500 text-white' },
      cancelled: { text: 'Отменена', color: 'bg-red-500 text-white' },
    };

    const badge = badges[status] || badges.active;
    
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
        ${isHovered && hasBookings ? 'transform -translate-y-1 shadow-2xl' : ''}
        ${hasEndingHappyHours() ? 'animate-happy-ending' : ''}
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
        {hasBookings && bookings.length > 1 && (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-dungeon-neon-blue/20 text-dungeon-neon-blue border border-dungeon-neon-blue/50">
            {bookings.length} броней
          </span>
        )}
      </div>

      {/* Вместимость */}
      <div className="flex items-center gap-2 mb-3 text-gray-400">
        <Users size={16} />
        <span className="text-sm">До {capacity} чел.</span>
      </div>

      {/* Информация о бронировании */}
      {hasBookings ? (
        <div className="space-y-3">
          {/* Показываем все брони */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {bookings.map((booking, index) => (
              <div 
                key={booking.id} 
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${booking.status === 'active' ? 'border-dungeon-neon-green/50 bg-emerald-900/10' :
                    booking.status === 'pending' ? 'border-red-500/50 bg-red-900/10' :
                    'border-dungeon-gray bg-dungeon-darker/30'}
                `}
              >
                <div className="space-y-3">
                  {/* Статус и время */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <Clock size={18} className="text-dungeon-neon-blue" />
                      <span className="font-semibold text-lg">{booking.time}</span>
                    </div>
                    {getStatusBadge(booking.status)}
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

                  {/* Индикатор счастливых часов - показываем всегда */}
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
              </div>
            ))}
          </div>

          {/* Кнопка добавить еще бронь */}
          <button
            onClick={() => onCreate && onCreate(zone)}
            className="w-full flex items-center justify-center gap-2 bg-dungeon-neon-green/10 hover:bg-dungeon-neon-green/20 text-dungeon-neon-green px-4 py-2 rounded-lg transition-all duration-200 border-2 border-dashed border-dungeon-neon-green/30 hover:border-dungeon-neon-green/50 font-semibold"
          >
            <Plus size={18} />
            <span>Добавить еще бронь</span>
          </button>
        </div>
      ) : needsCleaning ? (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="text-5xl mb-3 animate-bounce">🧹</div>
            <p className="text-orange-400 font-semibold text-lg mb-2">Требует уборки!</p>
            <p className="text-gray-400 text-sm">Зона освободилась, необходима уборка</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onMarkCleaned && onMarkCleaned(zone.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-dungeon-neon-green/20 hover:bg-dungeon-neon-green/30 text-dungeon-neon-green px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-neon-green font-semibold"
              title="Отметить как убранную"
            >
              <CheckCircle size={20} />
              <span>Убрали</span>
            </button>
            
            <button
              onClick={() => onCreate && onCreate(zone)}
              className="flex-1 flex items-center justify-center gap-2 bg-dungeon-neon-blue/20 hover:bg-dungeon-neon-blue/30 text-dungeon-neon-blue px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-neon-blue"
              title="Добавить бронь"
            >
              <Plus size={20} />
              <span>Бронь</span>
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
