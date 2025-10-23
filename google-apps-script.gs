/**
 * Google Apps Script для интеграции с Канбан-доской DUNGEON
 * 
 * Инструкция по установке:
 * 1. Откройте Google Таблицу с данными о бронированиях
 * 2. Перейдите в Расширения → Apps Script
 * 3. Вставьте этот код
 * 4. Нажмите "Развернуть" → "Новое развертывание"
 * 5. Выберите тип: "Веб-приложение"
 * 6. Установите "У кого есть доступ" на "Все"
 * 7. Скопируйте URL развертывания
 * 8. Используйте этот URL в src/services/googleSheets.js
 */

/**
 * Обработка GET-запросов (получение данных)
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Первая строка — заголовки
    const headers = data[0];
    const rows = data.slice(1);
    
    // Параметр фильтрации по филиалу
    const branch = e.parameter.branch;
    
    // Преобразуем данные в JSON
    const bookings = rows.map((row, index) => {
      let booking = {
        rowIndex: index + 2 // +2 т.к. индекс начинается с 1 и первая строка — заголовки
      };
      
      headers.forEach((header, colIndex) => {
        booking[header] = row[colIndex];
      });
      
      return booking;
    })
    .filter(booking => {
      // Пропускаем пустые строки
      if (!booking['Зона']) return false;
      
      // Фильтруем по филиалу, если указан
      if (branch && booking['Филиал'] !== branch) return false;
      
      return true;
    });
    
    // Формируем структуру данных для фронтенда
    const zones = generateZonesStructure(bookings);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: zones,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Обработка POST-запросов (изменение данных)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'updateStatus':
        return updateStatus(data.id, data.status);
      
      case 'update':
        return updateBooking(data.id, data);
      
      case 'delete':
        return deleteBooking(data.id);
      
      case 'clearAll':
        return clearAllBookings(data.branch);
      
      default:
        throw new Error('Неизвестное действие: ' + action);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Обновление статуса бронирования
 */
function updateStatus(bookingId, newStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const statusColIndex = headers.indexOf('Статус') + 1;
  const updatedColIndex = headers.indexOf('Обновлено') + 1;
  
  // Находим строку по ID (предполагаем, что ID хранится в первом столбце)
  const rowIndex = findRowById(bookingId);
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, statusColIndex).setValue(newStatus);
    sheet.getRange(rowIndex, updatedColIndex).setValue(new Date());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Статус обновлён'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    throw new Error('Бронирование не найдено');
  }
}

/**
 * Обновление данных бронирования
 */
function updateBooking(bookingId, newData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rowIndex = findRowById(bookingId);
  
  if (rowIndex > 0) {
    // Обновляем каждое поле, если оно передано
    Object.keys(newData).forEach(key => {
      if (key !== 'action' && key !== 'id') {
        const colIndex = headers.indexOf(key) + 1;
        if (colIndex > 0) {
          sheet.getRange(rowIndex, colIndex).setValue(newData[key]);
        }
      }
    });
    
    // Обновляем время изменения
    const updatedColIndex = headers.indexOf('Обновлено') + 1;
    sheet.getRange(rowIndex, updatedColIndex).setValue(new Date());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Бронирование обновлено'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    throw new Error('Бронирование не найдено');
  }
}

/**
 * Удаление бронирования
 */
function deleteBooking(bookingId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rowIndex = findRowById(bookingId);
  
  if (rowIndex > 0) {
    sheet.deleteRow(rowIndex);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Бронирование удалено'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    throw new Error('Бронирование не найдено');
  }
}

/**
 * Очистка всех бронирований (опционально по филиалу)
 */
function clearAllBookings(branch) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const branchColIndex = headers.indexOf('Филиал');
  
  // Удаляем строки снизу вверх, чтобы индексы не сбивались
  for (let i = data.length - 1; i > 0; i--) {
    if (!branch || data[i][branchColIndex] === branch) {
      sheet.deleteRow(i + 1);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Бронирования очищены'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Вспомогательная функция: поиск строки по ID
 */
function findRowById(bookingId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    // Предполагаем, что ID в первом столбце или формируем его из данных
    if (data[i][0].toString() === bookingId.toString()) {
      return i + 1; // +1 т.к. индексы строк начинаются с 1
    }
  }
  
  return -1;
}

/**
 * Генерация структуры зон с бронированиями
 */
function generateZonesStructure(bookings) {
  // Список всех зон
  const allZones = [
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
  
  // Добавляем бронирования к зонам
  return allZones.map(zone => {
    const booking = bookings.find(b => b['Зона'] === zone.name);
    
    return {
      ...zone,
      booking: booking ? {
        id: booking.rowIndex || booking['ID'] || `b${zone.id}`,
        time: booking['Время'] || '',
        name: booking['Имя'] || '',
        guests: booking['Количество'] || 0,
        phone: booking['Телефон'] || '',
        status: booking['Статус'] || 'pending',
        branch: booking['Филиал'] || ''
      } : null
    };
  });
}

