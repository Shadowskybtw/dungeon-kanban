import { 
  initDatabase, 
  getZonesWithBookings, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  updateBookingStatus 
} from './db.js';

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запроса
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Инициализируем БД при первом запросе
    await initDatabase();

    const { method, query, body } = req;

    // GET - получение всех зон с бронированиями
    if (method === 'GET') {
      const branch = query.branch;
      const zones = await getZonesWithBookings(branch);
      
      return res.status(200).json({
        success: true,
        data: zones
      });
    }

    // POST - создание или действия с бронированиями
    if (method === 'POST') {
      const { action, zoneId, zoneName, branch, data, bookingId, status } = body;

      switch (action) {
        case 'create':
          const newBooking = await createBooking(zoneId, zoneName, branch, data);
          return res.status(201).json({
            success: true,
            data: newBooking
          });

        case 'update':
          const updatedBooking = await updateBooking(bookingId, data);
          return res.status(200).json({
            success: true,
            data: updatedBooking
          });

        case 'updateStatus':
          const statusUpdated = await updateBookingStatus(bookingId, status);
          return res.status(200).json({
            success: true,
            data: statusUpdated
          });

        case 'delete':
          await deleteBooking(bookingId);
          return res.status(200).json({
            success: true,
            message: 'Booking deleted'
          });

        default:
          return res.status(400).json({
            success: false,
            error: 'Unknown action'
          });
      }
    }

    // Метод не поддерживается
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

