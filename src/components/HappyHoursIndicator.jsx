import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Компонент индикатора "Счастливых часов"
 * Активен с 14:00 до 19:00
 * Начинает мигать за 10 минут до окончания (18:50-19:00)
 */
const HappyHoursIndicator = ({ time, isHappyHours, onToggle, isActive }) => {
  const [isEnding, setIsEnding] = useState(false);

  // Проверяем, попадает ли время в диапазон счастливых часов (14:00-19:00)
  const isInHappyHoursRange = () => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    
    // 14:00 = 840 минут, 19:00 = 1140 минут
    return timeInMinutes >= 840 && timeInMinutes < 1140;
  };

  // Проверяем, близится ли конец счастливых часов (18:50-19:00)
  const isNearEnd = () => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    
    // 18:50 = 1130 минут, 19:00 = 1140 минут
    return timeInMinutes >= 1130 && timeInMinutes < 1140;
  };

  useEffect(() => {
    // Обновляем состояние "близится конец" каждую минуту
    const checkEnding = () => {
      if (isActive && isInHappyHoursRange()) {
        setIsEnding(isNearEnd());
      } else {
        setIsEnding(false);
      }
    };

    checkEnding();
    const interval = setInterval(checkEnding, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, [time, isActive]);

  const canBeHappyHours = isInHappyHoursRange();

  if (!canBeHappyHours && !isActive) return null;

  return (
    <div className="space-y-1.5">
      {/* Переключатель счастливых часов */}
      {canBeHappyHours && (
        <div className="flex items-center justify-between p-1.5 bg-dungeon-darker rounded-md border border-dungeon-gray">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-dungeon-neon-green" />
            <span className="text-xs text-gray-300">Счастливые часы</span>
          </div>
          <button
            onClick={onToggle}
            className={`
              relative inline-flex h-5 w-9 items-center rounded-full transition-colors
              ${isActive ? 'bg-dungeon-neon-green' : 'bg-dungeon-gray'}
            `}
          >
            <span
              className={`
                inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                ${isActive ? 'translate-x-5' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      )}

      {/* Индикатор активных счастливых часов */}
      {isActive && (
        <div className={`
          flex items-center gap-1.5 px-2 py-1.5 rounded-md
          ${isEnding 
            ? 'bg-dungeon-neon-green/30 border border-dungeon-neon-green animate-pulse' 
            : 'bg-dungeon-neon-green/20 border border-dungeon-neon-green'
          }
        `}>
          <span className="text-sm">🎉</span>
          <div className="flex-1">
            <p className="text-dungeon-neon-green font-semibold text-xs">
              Счастливые часы!
            </p>
            {isEnding && (
              <p className="text-[10px] text-dungeon-neon-green/80 mt-0.5">
                ⚠️ Скоро закончатся
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HappyHoursIndicator;

