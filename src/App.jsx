import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ZoneCard from './components/ZoneCard';
import EditModal from './components/EditModal';
import { ToastContainer } from './components/Toast';
import { fetchBookings, updateBookingStatus, deleteBooking, updateBooking, createBooking } from './services/googleSheets';

/**
 * Главный компонент приложения Канбан-доска
 */
function App() {
  const [zones, setZones] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('Московское ш.');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Функция добавления toast-уведомления
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  // Функция удаления toast-уведомления
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Загрузка данных из Google Sheets
  const loadData = useCallback(async (showSuccess = false) => {
    setIsLoading(true);
    try {
      const data = await fetchBookings(selectedBranch);
      setZones(data);
      setLastUpdate(new Date());
      if (showSuccess) {
        addToast('✅ Данные обновлены', 'success');
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      addToast('⚠️ Ошибка связи с таблицей', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch]);

  // Начальная загрузка и автообновление каждые 30 секунд
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Обработка смены филиала
  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
  };

  // Обработка изменения статуса бронирования
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await loadData();
      addToast('✅ Статус обновлён', 'success');
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      addToast('❌ Не удалось изменить статус', 'error');
    }
  };

  // Обработка создания новой брони
  const handleCreate = (zone) => {
    setEditingZone(zone);
    setEditingBooking(null);
    setIsCreating(true);
    setEditModalOpen(true);
  };

  // Обработка редактирования бронирования
  const handleEdit = (booking) => {
    const zone = zones.find(z => z.booking?.id === booking.id);
    setEditingBooking(booking);
    setEditingZone(zone);
    setIsCreating(false);
    setEditModalOpen(true);
  };

  // Сохранение брони (создание или редактирование)
  const handleSaveEdit = async (bookingId, newData) => {
    try {
      if (isCreating) {
        // Создание новой брони
        await createBooking(editingZone.name, selectedBranch, newData);
        addToast('✅ Бронь создана', 'success');
      } else {
        // Обновление существующей
        await updateBooking(bookingId, newData);
        addToast('✅ Бронь обновлена', 'success');
      }
      await loadData();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      addToast('❌ Не удалось сохранить бронь', 'error');
    }
  };

  // Переключение счастливых часов
  const handleHappyHoursToggle = async (bookingId, enabled) => {
    try {
      await updateBooking(bookingId, { happyHours: enabled });
      await loadData();
      addToast(enabled ? '🎉 Счастливые часы активированы!' : 'Счастливые часы отключены', 'success');
    } catch (error) {
      console.error('Ошибка переключения счастливых часов:', error);
      addToast('❌ Не удалось обновить статус', 'error');
    }
  };

  // Обработка удаления бронирования
  const handleDelete = async (bookingId) => {
    if (confirm('Вы уверены, что хотите удалить это бронирование?')) {
      try {
        await deleteBooking(bookingId);
        await loadData();
        addToast('✅ Бронь удалена', 'success');
      } catch (error) {
        console.error('Ошибка удаления:', error);
        addToast('❌ Не удалось удалить бронь', 'error');
      }
    }
  };

  // Обработка очистки всех бронирований
  const handleClearAll = () => {
    if (confirm('Вы уверены, что хотите очистить все бронирования?')) {
      // В реальном приложении здесь будет вызов API для массового удаления
      console.log('Очистка всех бронирований');
      addToast('🗑️ Все брони очищены', 'success');
      loadData();
    }
  };

  // Обработка ручного обновления
  const handleRefresh = () => {
    loadData(true);
  };

  // Фильтрация зон по статусу
  const filteredZones = zones.filter(zone => {
    if (statusFilter === 'all') return true;
    if (!zone.booking) return false;
    
    switch (statusFilter) {
      case 'active':
        return zone.booking.status === 'active';
      case 'pending':
        return zone.booking.status === 'pending';
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dungeon-dark via-dungeon-darker to-dungeon-dark">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-dungeon-neon-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-dungeon-neon-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-dungeon-neon-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Контент */}
      <div className="relative z-10">
        {/* Заголовок */}
        <Header
          selectedBranch={selectedBranch}
          onBranchChange={handleBranchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={handleRefresh}
          onClearAll={handleClearAll}
          lastUpdate={lastUpdate}
          totalZones={zones.length}
        />

        {/* Основная сетка зон */}
        <main className="container mx-auto px-4 py-8">
          {isLoading && zones.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dungeon-neon-green border-t-transparent mb-4"></div>
                <p className="text-gray-400">Загрузка данных...</p>
              </div>
            </div>
          ) : filteredZones.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-400 text-lg">Нет зон, соответствующих фильтру</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredZones.map(zone => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCreate={handleCreate}
                  onHappyHoursToggle={handleHappyHoursToggle}
                />
              ))}
            </div>
          )}

          {/* Статистика */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dungeon-card/50 backdrop-blur-sm rounded-xl p-6 border-2 border-dungeon-neon-green/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-dungeon-neon-green/20 flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Активные брони</p>
                  <p className="text-2xl font-bold text-dungeon-neon-green">
                    {zones.filter(z => z.booking?.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dungeon-card/50 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ожидающие</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {zones.filter(z => z.booking?.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dungeon-card/50 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center">
                  <span className="text-2xl">📭</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Свободные зоны</p>
                  <p className="text-2xl font-bold text-gray-300">
                    {zones.filter(z => !z.booking).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Футер */}
        <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>© 2025 DUNGEON. Система управления бронированиями.</p>
          <p className="mt-2">Автообновление каждые 30 секунд</p>
        </footer>
      </div>

      {/* Модальное окно редактирования/создания */}
      <EditModal
        booking={editingBooking}
        zone={editingZone}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setIsCreating(false);
        }}
        onSave={handleSaveEdit}
        isCreating={isCreating}
      />

      {/* Toast-уведомления */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;


