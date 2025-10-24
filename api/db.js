import { neon } from '@neondatabase/serverless';

// PostgreSQL подключение к Neon Database
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ndU5X7kVHJwy@ep-cool-scene-a6ced7pu-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(DATABASE_URL);

/**
 * Инициализация базы данных
 * Создает таблицы если их нет
 */
export async function initDatabase() {
  try {
    console.log('🔄 Начинаем инициализацию БД...');
    
    // Создаем таблицу зон
    await sql`
      CREATE TABLE IF NOT EXISTS zones (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        capacity INTEGER NOT NULL,
        is_vip BOOLEAN DEFAULT FALSE,
        branch VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Создаем таблицу бронирований
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        zone_id INTEGER REFERENCES zones(id) ON DELETE CASCADE,
        zone_name VARCHAR(50) NOT NULL,
        branch VARCHAR(100) NOT NULL,
        time VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        guests INTEGER NOT NULL,
        phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pending',
        happy_hours BOOLEAN DEFAULT FALSE,
        comment TEXT,
        vr BOOLEAN DEFAULT FALSE,
        hookah BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Таблицы созданы');

    // Добавляем поле needs_cleaning если его нет (миграция)
    try {
      await sql`
        ALTER TABLE zones 
        ADD COLUMN IF NOT EXISTS needs_cleaning BOOLEAN DEFAULT FALSE
      `;
      console.log('✅ Поле needs_cleaning добавлено');
    } catch (error) {
      console.log('ℹ️ Поле needs_cleaning уже существует');
    }

    // Проверяем, есть ли зоны, если нет - создаем
    const zonesCount = await sql`SELECT COUNT(*) as count FROM zones`;
    console.log('📊 Количество зон в БД:', zonesCount[0].count);
    
    if (parseInt(zonesCount[0].count) === 0) {
      // Создаем зоны для Московского ш. (22 зоны)
      const moscowZones = [
        { name: 'Зона 1', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 2', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 3', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 4', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 5', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 6', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 7', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 8', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 9', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 10', capacity: 5, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 11', capacity: 10, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 12', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 13', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 14', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 15', capacity: 4, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 16', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'VIP-17', capacity: 8, is_vip: true, branch: 'Московское ш.' },
        { name: 'VIP-18', capacity: 8, is_vip: true, branch: 'Московское ш.' },
        { name: 'Зона 19', capacity: 2, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 20', capacity: 2, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 21', capacity: 2, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 22', capacity: 2, is_vip: false, branch: 'Московское ш.' },
      ];

      // Создаем зоны для Полевой (20 зон)
      const polevayaZones = [
        { name: 'Зона 1', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 2', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 3', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 4', capacity: 2, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 5', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 6', capacity: 10, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 7', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 8', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 9', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 10', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 11', capacity: 2, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 12', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 13', capacity: 10, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 14', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 15', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 16', capacity: 2, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 17', capacity: 4, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 18', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 19', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 20', capacity: 8, is_vip: false, branch: 'Полевая' },
      ];

      // Вставляем все зоны
      console.log('📝 Создаём зоны...');
      const allZones = [...moscowZones, ...polevayaZones];
      for (const zone of allZones) {
        await sql`
          INSERT INTO zones (name, capacity, is_vip, branch)
          VALUES (${zone.name}, ${zone.capacity}, ${zone.is_vip}, ${zone.branch})
        `;
      }

      console.log(`✅ База данных инициализирована, создано зон: ${allZones.length} (Московское ш.: 22, Полевая: 20)`);
    } else {
      console.log('ℹ️ Зоны уже существуют, пропускаем создание');
    }

    return { success: true, message: 'Database initialized' };
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error);
    throw error;
  }
}

/**
 * Получить все зоны с бронированиями
 */
export async function getZonesWithBookings(branch = null) {
  try {
    let zones;
    
    if (branch) {
      zones = await sql`
        SELECT * FROM zones 
        WHERE branch = ${branch}
        ORDER BY id
      `;
    } else {
      zones = await sql`
        SELECT * FROM zones 
        ORDER BY id
      `;
    }

    console.log(`📍 Найдено зон: ${zones.length}`, branch ? `для филиала: ${branch}` : '');

    // Если нет зон, возвращаем пустой массив
    if (zones.length === 0) {
      return [];
    }

    // Получаем бронирования для этих зон
    const zoneIds = zones.map(z => z.id);
    const bookings = await sql`
      SELECT * FROM bookings 
      WHERE zone_id = ANY(${zoneIds})
    `;

    console.log(`📅 Найдено бронирований: ${bookings.length}`);

    // Объединяем зоны с бронированиями
    const result = zones.map(zone => {
      const booking = bookings.find(b => b.zone_id === zone.id);
      
      return {
        id: zone.id,
        name: zone.name,
        capacity: zone.capacity,
        isVip: zone.is_vip,
        branch: zone.branch,
        needsCleaning: zone.needs_cleaning || false,
        booking: booking ? {
          id: booking.id,
          time: booking.time,
          name: booking.name,
          guests: booking.guests,
          phone: booking.phone,
          status: booking.status,
          happyHours: booking.happy_hours,
          comment: booking.comment,
          vr: booking.vr,
          hookah: booking.hookah,
          zone: booking.zone_name,
          branch: booking.branch
        } : null
      };
    });

    return result;
  } catch (error) {
    console.error('Ошибка получения зон:', error);
    throw error;
  }
}

/**
 * Создать бронирование
 */
export async function createBooking(zoneId, zoneName, branch, data) {
  try {
    const result = await sql`
      INSERT INTO bookings (
        zone_id, zone_name, branch, time, name, guests, 
        phone, status, happy_hours, comment, vr, hookah
      )
      VALUES (
        ${zoneId}, ${zoneName}, ${branch}, ${data.time}, ${data.name}, 
        ${data.guests}, ${data.phone || ''}, ${data.status || 'pending'}, 
        ${data.happyHours || false}, ${data.comment || ''}, 
        ${data.vr || false}, ${data.hookah || false}
      )
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error('Ошибка создания бронирования:', error);
    throw error;
  }
}

/**
 * Обновить бронирование
 */
export async function updateBooking(bookingId, data) {
  try {
    // Читаем текущее бронирование
    const current = await sql`SELECT * FROM bookings WHERE id = ${bookingId}`;
    if (current.length === 0) {
      throw new Error('Booking not found');
    }

    // Обновляем только переданные поля
    const updated = {
      time: data.time !== undefined ? data.time : current[0].time,
      name: data.name !== undefined ? data.name : current[0].name,
      guests: data.guests !== undefined ? data.guests : current[0].guests,
      phone: data.phone !== undefined ? data.phone : current[0].phone,
      status: data.status !== undefined ? data.status : current[0].status,
      happy_hours: data.happyHours !== undefined ? data.happyHours : current[0].happy_hours,
      comment: data.comment !== undefined ? data.comment : current[0].comment,
      vr: data.vr !== undefined ? data.vr : current[0].vr,
      hookah: data.hookah !== undefined ? data.hookah : current[0].hookah,
    };

    console.log(`📝 Обновление брони #${bookingId}:`, data);

    const result = await sql`
      UPDATE bookings 
      SET 
        time = ${updated.time},
        name = ${updated.name},
        guests = ${updated.guests},
        phone = ${updated.phone},
        status = ${updated.status},
        happy_hours = ${updated.happy_hours},
        comment = ${updated.comment},
        vr = ${updated.vr},
        hookah = ${updated.hookah},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${bookingId}
      RETURNING *
    `;

    console.log(`✅ Бронь обновлена:`, result[0]);
    return result[0];
  } catch (error) {
    console.error('Ошибка обновления бронирования:', error);
    throw error;
  }
}

/**
 * Удалить бронирование
 */
export async function deleteBooking(bookingId, skipCleaningFlag = false) {
  try {
    // Получаем zone_id перед удалением
    const booking = await sql`
      SELECT zone_id FROM bookings 
      WHERE id = ${bookingId}
    `;

    await sql`
      DELETE FROM bookings 
      WHERE id = ${bookingId}
    `;

    // Устанавливаем флаг "требует уборки" только если не пропускаем (skipCleaningFlag=false)
    if (!skipCleaningFlag && booking.length > 0) {
      await sql`
        UPDATE zones 
        SET needs_cleaning = TRUE 
        WHERE id = ${booking[0].zone_id}
      `;
      console.log(`🧹 Зона #${booking[0].zone_id} помечена как требующая уборки`);
    }

    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления бронирования:', error);
    throw error;
  }
}

/**
 * Обновить статус бронирования
 */
export async function updateBookingStatus(bookingId, status) {
  try {
    const result = await sql`
      UPDATE bookings 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${bookingId}
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    throw error;
  }
}

/**
 * Удалить все бронирования в филиале
 */
export async function clearAllBookings(branch) {
  try {
    const result = await sql`
      DELETE FROM bookings 
      WHERE branch = ${branch}
    `;

    // Сбрасываем флаги уборки для всех зон в филиале
    await sql`
      UPDATE zones 
      SET needs_cleaning = FALSE 
      WHERE branch = ${branch}
    `;

    console.log(`🗑️ Удалено броней в филиале ${branch}: ${result.count || 0}`);
    console.log(`🧹 Сброшены флаги уборки для зон в ${branch}`);
    return { success: true, deletedCount: result.count || 0 };
  } catch (error) {
    console.error('Ошибка очистки всех броней:', error);
    throw error;
  }
}

/**
 * Отметить зону как убранную
 */
export async function markZoneCleaned(zoneId) {
  try {
    await sql`
      UPDATE zones 
      SET needs_cleaning = FALSE 
      WHERE id = ${zoneId}
    `;

    console.log(`✨ Зона #${zoneId} отмечена как убранная`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка отметки зоны как убранной:', error);
    throw error;
  }
}

export default sql;

