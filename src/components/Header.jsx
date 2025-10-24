import React from 'react';
import { RefreshCw, Trash2, MapPin, Clock } from 'lucide-react';

/**
 * Компонент заголовка с фильтрами и управлением
 */
const Header = ({ 
  selectedBranch, 
  onBranchChange, 
  statusFilter, 
  onStatusFilterChange,
  onRefresh,
  onClearAll,
  lastUpdate,
  totalZones 
}) => {
  const branches = ['Московское ш.', 'Полевая'];
  const filters = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'pending', label: 'Ожидающие' },
  ];

  const formatTime = (date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="bg-dungeon-card/50 backdrop-blur-md border-b border-dungeon-neon-green/30 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-2 py-2">
        {/* Главный заголовок */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <div>
            <h1 className="font-orbitron font-black text-xl md:text-2xl bg-gradient-to-r from-dungeon-neon-green via-dungeon-neon-blue to-dungeon-neon-purple bg-clip-text text-transparent">
              DUNGEON
            </h1>
            <p className="text-gray-400 text-[10px] mt-0.5">Канбан-доска бронирований</p>
          </div>

          {/* Информация о последнем обновлении */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock size={12} className="text-dungeon-neon-blue" />
              <span>Обновлено: {formatTime(lastUpdate)}</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-dungeon-gray"></div>
            <div className="text-gray-400">
              Зон: <span className="text-dungeon-neon-green font-bold">{totalZones}</span>
            </div>
          </div>
        </div>

        {/* Панель управления */}
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-between">
          {/* Выбор филиала */}
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-dungeon-neon-purple" />
            <div className="flex gap-1.5">
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => onBranchChange(branch)}
                  className={`
                    px-3 py-1 rounded-md font-semibold text-xs transition-all duration-200
                    ${selectedBranch === branch
                      ? 'bg-dungeon-neon-purple text-white shadow-neon-purple'
                      : 'bg-dungeon-gray text-gray-400 hover:bg-dungeon-gray/70'
                    }
                  `}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          {/* Фильтры статуса */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-xs">Статус:</span>
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => onStatusFilterChange(filter.value)}
                className={`
                  px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                  ${statusFilter === filter.value
                    ? 'bg-dungeon-neon-green text-dungeon-darker shadow-neon-green'
                    : 'bg-dungeon-card text-gray-400 hover:bg-dungeon-gray'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-1.5">
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 bg-dungeon-neon-blue/20 hover:bg-dungeon-neon-blue/30 text-dungeon-neon-blue px-2.5 py-1 rounded-md transition-all duration-200 hover:shadow-neon-blue font-medium text-xs"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Обновить</span>
            </button>
            
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2.5 py-1 rounded-md transition-all duration-200 font-medium text-xs"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Очистить</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

