import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ZoneCard from './components/ZoneCard';
import EditModal from './components/EditModal';
import { ToastContainer } from './components/Toast';
import { fetchBookings, updateBookingStatus, deleteBooking, updateBooking, createBooking, clearAllBookings, markZoneCleaned, completeBooking } from './services/api';

/**
 * Главный компонент приложения Канбан-доска
 * v1.0.1 - Обновлены зоны: 22 МСК, 20 Полевая
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
      // Оптимистичное обновление UI
      setZones(prevZones => prevZones.map(zone => {
        // Ищем бронь в массиве bookings
        const bookingIndex = zone.bookings?.findIndex(b => b.id === bookingId);
        if (bookingIndex !== undefined && bookingIndex !== -1) {
          const updatedBookings = [...zone.bookings];
          updatedBookings[bookingIndex] = {
            ...updatedBookings[bookingIndex],
            status: newStatus
          };
          return {
            ...zone,
            bookings: updatedBookings,
            // Обновляем и booking для обратной совместимости
            booking: updatedBookings[0] || null
          };
        }
        return zone;
      }));

      try {
        await updateBookingStatus(bookingId, newStatus);
        addToast('✅ Статус обновлён', 'success');
        // Обновляем данные с сервера
        setTimeout(() => loadData(), 500);
      } catch (error) {
        console.error('Ошибка изменения статуса:', error);
        addToast('❌ Не удалось изменить статус', 'error');
        // В случае ошибки откатываем изменения
        loadData();
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
        // Создание новой брони - оптимистичное обновление
        const newBookingId = `temp-${Date.now()}`;
        const newBooking = {
          id: newBookingId,
          ...newData,
          zone: editingZone.name,
          branch: selectedBranch
        };

        setZones(prevZones => prevZones.map(zone => {
          if (zone.id === editingZone.id) {
            return {
              ...zone,
              booking: newBooking
            };
          }
          return zone;
        }));

        await createBooking(editingZone.id, editingZone.name, selectedBranch, newData);
        addToast('✅ Бронь создана', 'success');
      } else {
        // Обновление существующей - оптимистичное обновление
        setZones(prevZones => prevZones.map(zone => {
          if (zone.booking?.id === bookingId) {
            return {
              ...zone,
              booking: {
                ...zone.booking,
                ...newData
              }
            };
          }
          return zone;
        }));

        await updateBooking(bookingId, newData);
        addToast('✅ Бронь обновлена', 'success');
      }
      
      // Обновляем данные с сервера через секунду
      setTimeout(() => loadData(), 1000);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      addToast('❌ Не удалось сохранить бронь', 'error');
      // В случае ошибки откатываем изменения
      loadData();
    }
  };

    // Переключение счастливых часов
    const handleHappyHoursToggle = async (bookingId, enabled) => {
      // Оптимистичное обновление UI
      setZones(prevZones => prevZones.map(zone => {
        // Ищем бронь в массиве bookings
        const bookingIndex = zone.bookings?.findIndex(b => b.id === bookingId);
        if (bookingIndex !== undefined && bookingIndex !== -1) {
          const updatedBookings = [...zone.bookings];
          updatedBookings[bookingIndex] = {
            ...updatedBookings[bookingIndex],
            happyHours: enabled
          };
          return {
            ...zone,
            bookings: updatedBookings,
            // Обновляем и booking для обратной совместимости
            booking: updatedBookings[0] || null
          };
        }
        return zone;
      }));

      try {
        await updateBooking(bookingId, { happyHours: enabled });
        addToast(enabled ? '🎉 Счастливые часы активированы!' : 'Счастливые часы отключены', 'success');
        setTimeout(() => loadData(), 500);
      } catch (error) {
        console.error('Ошибка переключения счастливых часов:', error);
        addToast('❌ Не удалось обновить статус', 'error');
        loadData();
      }
    };

    // Обработка удаления бронирования
    const handleDelete = async (bookingId, guestName) => {
      const choice = confirm(
        `Удалить бронь "${guestName}"?\n\nОК = Гость не пришел (сохранить в историю + уборка)\nОтмена = Просто удалить (не сохранять + без уборки)`
      );
      
      if (choice === null) return; // Нажали ESC
      
      try {
        // Оптимистичное обновление - убираем бронь
        setZones(prevZones => prevZones.map(zone => ({
          ...zone,
          bookings: zone.bookings ? zone.bookings.filter(b => b.id !== bookingId) : [],
          booking: zone.bookings && zone.bookings.length > 0 && zone.bookings[0].id === bookingId 
            ? (zone.bookings[1] || null) 
            : zone.booking
        })));

        if (choice) {
          // OK - гость не пришел, сохраняем в историю + помечаем зону для уборки
          await completeBooking(bookingId, 'no_show');
          addToast('🚫 Бронь удалена (гость не пришел) - зона требует уборки', 'error');
        } else {
          // Отмена - просто удаляем БЕЗ уборки (используем deleteBooking)
          await deleteBooking(bookingId);
          addToast('🗑️ Бронь удалена', 'success');
        }
        
        setTimeout(() => loadData(), 500);
      } catch (error) {
        console.error('Ошибка удаления:', error);
        addToast('❌ Не удалось удалить бронь', 'error');
        loadData();
      }
    };

  // Обработка очистки всех бронирований
  const handleClearAll = async () => {
    if (confirm(`Вы уверены, что хотите удалить ВСЕ бронирования на филиале "${selectedBranch}"?`)) {
      try {
        // Оптимистичное обновление - убираем все брони
        setZones(prevZones => prevZones.map(zone => ({
          ...zone,
          booking: null
        })));

        await clearAllBookings(selectedBranch);
        addToast('🗑️ Все брони очищены', 'success');
        setTimeout(() => loadData(), 500);
      } catch (error) {
        console.error('Ошибка очистки всех броней:', error);
        addToast('❌ Не удалось очистить брони', 'error');
        loadData();
      }
    }
  };

  // Обработка отметки зоны как убранной
  const handleMarkCleaned = async (zoneId) => {
    try {
      // Оптимистичное обновление - убираем флаг уборки
      setZones(prevZones => prevZones.map(zone => 
        zone.id === zoneId ? { ...zone, needsCleaning: false } : zone
      ));

      await markZoneCleaned(zoneId);
      addToast('✨ Зона убрана', 'success');
      setTimeout(() => loadData(), 500);
    } catch (error) {
      console.error('Ошибка отметки зоны как убранной:', error);
      addToast('❌ Не удалось отметить зону', 'error');
      loadData();
    }
  };

    // Обработка завершения бронирования (гость пришел)
    const handleComplete = async (bookingId, guestName) => {
      if (!confirm(`Гость "${guestName}" пришел?\n\nБронь будет завершена.`)) {
        return; // Просто закрываем диалог
      }
      
      try {
        // Оптимистичное обновление - убираем бронь
        setZones(prevZones => prevZones.map(zone => ({
          ...zone,
          bookings: zone.bookings ? zone.bookings.filter(b => b.id !== bookingId) : [],
          booking: zone.bookings && zone.bookings.length > 0 && zone.bookings[0].id === bookingId 
            ? (zone.bookings[1] || null) 
            : zone.booking
        })));

        await completeBooking(bookingId, 'completed');
        addToast('✅ Бронь завершена (гость пришел) - зона требует уборки', 'success');
        
        setTimeout(() => loadData(), 500);
      } catch (error) {
        console.error('Ошибка завершения брони:', error);
        addToast('❌ Не удалось завершить бронь', 'error');
        loadData();
      }
    };

  // Обработка переноса брони между зонами
  const handleMoveBooking = async (bookingId, sourceZoneId, targetZoneId, booking) => {
    try {
      // Обновляем бронь в базе данных СНАЧАЛА
      await updateBooking(bookingId, { zone_id: targetZoneId });
      
      // Только после успешного обновления в БД обновляем UI
      setZones(prevZones => prevZones.map(zone => {
        if (zone.id === sourceZoneId) {
          // Убираем бронь из исходной зоны
          return {
            ...zone,
            bookings: zone.bookings ? zone.bookings.filter(b => b.id !== bookingId) : []
          };
        } else if (zone.id === targetZoneId) {
          // Добавляем бронь в целевую зону, но только если её там еще нет
          const existingBooking = zone.bookings?.find(b => b.id === bookingId);
          if (!existingBooking) {
            return {
              ...zone,
              bookings: [...(zone.bookings || []), { ...booking, zone_id: targetZoneId }]
            };
          }
        }
        return zone;
      }));

      addToast(`✅ Бронь "${booking.name}" перенесена в ${zones.find(z => z.id === targetZoneId)?.name}`, 'success');
    } catch (error) {
      console.error('Ошибка переноса брони:', error);
      addToast('❌ Не удалось перенести бронь', 'error');
      // В случае ошибки перезагружаем данные
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-dungeon-dark via-dungeon-darker to-dungeon-dark flex flex-col">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-dungeon-neon-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-dungeon-neon-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-dungeon-neon-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Контент */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Заголовок - фиксированная высота */}
        <div className="flex-none">
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
        </div>

        {/* Основная сетка зон - растягивается на оставшееся пространство */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-2 py-2">
            {isLoading && zones.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dungeon-neon-green border-t-transparent mb-4"></div>
                  <p className="text-gray-400">Загрузка данных...</p>
                </div>
              </div>
            ) : filteredZones.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-400 text-lg">Нет зон, соответствующих фильтру</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-2 zones-grid">
                {filteredZones.map(zone => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCreate={handleCreate}
                  onHappyHoursToggle={handleHappyHoursToggle}
                  onMarkCleaned={handleMarkCleaned}
                  onComplete={handleComplete}
                  onMoveBooking={handleMoveBooking}
                />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Футер - компактный */}
        <footer className="flex-none px-4 py-2 text-center text-gray-500 text-xs border-t border-dungeon-gray/20">
          <div className="container mx-auto flex items-center justify-between">
            <p>© 2025 DUNGEON v1.0.3</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-dungeon-neon-green">✅</span>
                  <span className="font-semibold text-dungeon-neon-green">{zones.filter(z => z.booking?.status === 'active').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-500">⏳</span>
                  <span className="font-semibold text-red-500">{zones.filter(z => z.booking?.status === 'pending').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">📭</span>
                  <span className="font-semibold text-gray-400">{zones.filter(z => !z.booking).length}</span>
                </div>
              </div>
              <p>Автообновление: 30 сек</p>
            </div>
          </div>
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




