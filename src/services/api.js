// API для работы с бэкендом
const API_URL = '/api/bookings';

/**
 * Получение данных о зонах с бронированиями
 * @param {string} branch - Фильтр по филиалу (опционально)
 * @returns {Promise<Array>} Массив зон с бронированиями
 */
export const fetchBookings = async (branch = null) => {
  try {
    const url = branch ? `${API_URL}?branch=${encodeURIComponent(branch)}` : API_URL;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};

/**
 * Создание нового бронирования
 * @param {number} zoneId - ID зоны
 * @param {string} zoneName - Название зоны
 * @param {string} branch - Филиал
 * @param {Object} data - Данные брони
 */
export const createBooking = async (zoneId, zoneName, branch, data) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        zoneId,
        zoneName,
        branch,
        data
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Ошибка при создании брони:', error);
    throw error;
  }
};

/**
 * Обновление данных бронирования
 * @param {number} bookingId - ID бронирования
 * @param {Object} data - Новые данные
 */
export const updateBooking = async (bookingId, data) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        bookingId,
        data
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Ошибка при обновлении брони:', error);
    throw error;
  }
};

/**
 * Обновление статуса бронирования
 * @param {number} bookingId - ID бронирования
 * @param {string} status - Новый статус
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateStatus',
        bookingId,
        status
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    throw error;
  }
};

/**
 * Удаление бронирования
 * @param {number} bookingId - ID бронирования
 */
export const deleteBooking = async (bookingId) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        bookingId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Ошибка при удалении брони:', error);
    throw error;
  }
};

/**
 * Очистка всех бронирований в филиале
 * @param {string} branch - Название филиала
 */
export const clearAllBookings = async (branch) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'clearAll',
        branch
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Ошибка при очистке всех броней:', error);
    throw error;
  }
};

