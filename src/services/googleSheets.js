// Google Sheets API Service
// Здесь реализована интеграция с Google Sheets через Apps Script

const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Замените на ваш URL

/**
 * Получение данных из Google Таблицы
 * @param {string} branch - Филиал (опционально)
 * @returns {Promise<Array>} Массив бронирований
 */
export const fetchBookings = async (branch = null) => {
  try {
    // В production замените на реальный URL вашего Google Apps Script
    // const url = branch ? `${GOOGLE_SCRIPT_URL}?branch=${encodeURIComponent(branch)}` : GOOGLE_SCRIPT_URL;
    // const response = await fetch(url);
    // const data = await response.json();
    // return data;

    // Для демо используем моковые данные
    return getMockData(branch);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return [];
  }
};

/**
 * Обновление статуса бронирования
 * @param {string} id - ID бронирования
 * @param {string} status - Новый статус
 */
export const updateBookingStatus = async (id, status) => {
  try {
    // В production:
    // const response = await fetch(GOOGLE_SCRIPT_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({ action: 'updateStatus', id, status })
    // });
    // return await response.json();
    
    console.log(`Обновление статуса ${id} на ${status}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    throw error;
  }
};

/**
 * Удаление бронирования
 * @param {string} id - ID бронирования
 */
export const deleteBooking = async (id) => {
  try {
    // В production:
    // const response = await fetch(GOOGLE_SCRIPT_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({ action: 'delete', id })
    // });
    // return await response.json();
    
    console.log(`Удаление брони ${id}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении брони:', error);
    throw error;
  }
};

/**
 * Обновление данных бронирования
 * @param {string} id - ID бронирования
 * @param {Object} data - Новые данные
 */
export const updateBooking = async (id, data) => {
  try {
    // В production:
    // const response = await fetch(GOOGLE_SCRIPT_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({ action: 'update', id, ...data })
    // });
    // return await response.json();
    
    console.log(`Обновление брони ${id}:`, data);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении брони:', error);
    throw error;
  }
};

// Моковые данные для демонстрации
const getMockData = (branch) => {
  const zones = [
    { id: 1, name: 'Зона 1', capacity: 6, isVip: false },
    { id: 2, name: 'Зона 2', capacity: 6, isVip: false },
    { id: 3, name: 'Зона 3', capacity: 6, isVip: false },
    { id: 4, name: 'Зона 4', capacity: 8, isVip: false },
    { id: 5, name: 'Зона 5', capacity: 8, isVip: false },
    { id: 6, name: 'Зона 6', capacity: 6, isVip: false },
    { id: 7, name: 'Зона 7', capacity: 6, isVip: false },
    { id: 8, name: 'Зона 8', capacity: 8, isVip: false },
    { id: 9, name: 'Зона 9', capacity: 6, isVip: false },
    { id: 10, name: 'Зона 10', capacity: 6, isVip: false },
    { id: 11, name: 'Зона 11', capacity: 6, isVip: false },
    { id: 12, name: 'Зона 12', capacity: 8, isVip: false },
    { id: 13, name: 'Зона 13', capacity: 6, isVip: false },
    { id: 14, name: 'Зона 14', capacity: 6, isVip: false },
    { id: 15, name: 'Зона 15', capacity: 8, isVip: false },
    { id: 16, name: 'Зона 16', capacity: 6, isVip: false },
    { id: 17, name: 'VIP-17', capacity: 10, isVip: true },
    { id: 18, name: 'VIP-18', capacity: 12, isVip: true },
    { id: 19, name: 'Зона 19', capacity: 6, isVip: false },
    { id: 20, name: 'Зона 20', capacity: 8, isVip: false },
    { id: 21, name: 'Зона 21', capacity: 6, isVip: false },
    { id: 22, name: 'Зона 22', capacity: 6, isVip: false },
  ];

  const mockBookings = [
    {
      id: 'b1',
      zone: 'Зона 1',
      time: '19:00',
      name: 'Алексей Петров',
      guests: 4,
      phone: '+7 (999) 123-45-67',
      status: 'active',
      branch: 'Московское ш.'
    },
    {
      id: 'b2',
      zone: 'Зона 4',
      time: '20:30',
      name: 'Мария Иванова',
      guests: 6,
      phone: '+7 (999) 234-56-78',
      status: 'active',
      branch: 'Московское ш.'
    },
    {
      id: 'b3',
      zone: 'VIP-17',
      time: '21:00',
      name: 'Дмитрий Сидоров',
      guests: 8,
      phone: '+7 (999) 345-67-89',
      status: 'pending',
      branch: 'Московское ш.'
    },
    {
      id: 'b4',
      zone: 'Зона 8',
      time: '18:00',
      name: 'Елена Козлова',
      guests: 5,
      phone: '+7 (999) 456-78-90',
      status: 'active',
      branch: 'Полевая'
    },
    {
      id: 'b5',
      zone: 'Зона 12',
      time: '22:00',
      name: 'Игорь Волков',
      guests: 7,
      phone: '+7 (999) 567-89-01',
      status: 'cancelled',
      branch: 'Полевая'
    },
    {
      id: 'b6',
      zone: 'VIP-18',
      time: '19:30',
      name: 'Анна Смирнова',
      guests: 10,
      phone: '+7 (999) 678-90-12',
      status: 'active',
      branch: 'Московское ш.'
    },
  ];

  // Создаем результат с информацией о зонах и их бронированиях
  const result = zones.map(zone => {
    const booking = mockBookings.find(b => b.zone === zone.name && (!branch || b.branch === branch));
    return {
      ...zone,
      booking: booking || null,
      branch: branch || 'Московское ш.'
    };
  });

  return result;
};

