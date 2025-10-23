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
    <div className="space-y-2">
      {/* Переключатель счастливых часов */}
      {canBeHappyHours && (
        <div className="flex items-center justify-between p-2 bg-dungeon-darker rounded-lg border border-dungeon-gray">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-dungeon-neon-green" />
            <span className="text-sm text-gray-300">Счастливые часы</span>
          </div>
          <button
            onClick={onToggle}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${isActive ? 'bg-dungeon-neon-green' : 'bg-dungeon-gray'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isActive ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      )}

      {/* Индикатор активных счастливых часов */}
      {isActive && (
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          ${isEnding 
            ? 'bg-dungeon-neon-green/30 border-2 border-dungeon-neon-green animate-pulse' 
            : 'bg-dungeon-neon-green/20 border border-dungeon-neon-green'
          }
        `}>
          <span className="text-xl">🎉</span>
          <div className="flex-1">
            <p className="text-dungeon-neon-green font-semibold text-sm">
              Счастливые часы активны!
            </p>
            {isEnding && (
              <p className="text-xs text-dungeon-neon-green/80 mt-0.5">
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

