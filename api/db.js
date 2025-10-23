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

    // Проверяем, есть ли зоны, если нет - создаем
    const zonesCount = await sql`SELECT COUNT(*) as count FROM zones`;
    
    if (zonesCount[0].count === 0) {
      // Создаем зоны для Московского ш.
      const moscowZones = [
        { name: 'Зона 1', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 2', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 3', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 4', capacity: 8, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 5', capacity: 8, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 6', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 7', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 8', capacity: 8, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 9', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 10', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'Зона 11', capacity: 6, is_vip: false, branch: 'Московское ш.' },
        { name: 'VIP-17', capacity: 10, is_vip: true, branch: 'Московское ш.' },
        { name: 'VIP-18', capacity: 12, is_vip: true, branch: 'Московское ш.' },
      ];

      // Создаем зоны для Полевой
      const polevayaZones = [
        { name: 'Зона 1', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 2', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 3', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 4', capacity: 8, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 5', capacity: 8, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 6', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 7', capacity: 6, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 8', capacity: 8, is_vip: false, branch: 'Полевая' },
        { name: 'Зона 9', capacity: 6, is_vip: false, branch: 'Полевая' },
      ];

      // Вставляем все зоны
      for (const zone of [...moscowZones, ...polevayaZones]) {
        await sql`
          INSERT INTO zones (name, capacity, is_vip, branch)
          VALUES (${zone.name}, ${zone.capacity}, ${zone.is_vip}, ${zone.branch})
        `;
      }

      console.log('✅ База данных инициализирована, зоны созданы');
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

    // Получаем бронирования для этих зон
    const zoneIds = zones.map(z => z.id);
    const bookings = await sql`
      SELECT * FROM bookings 
      WHERE zone_id = ANY(${zoneIds})
    `;

    // Объединяем зоны с бронированиями
    const result = zones.map(zone => {
      const booking = bookings.find(b => b.zone_id === zone.id);
      
      return {
        id: zone.id,
        name: zone.name,
        capacity: zone.capacity,
        isVip: zone.is_vip,
        branch: zone.branch,
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
    const updates = [];
    const values = [];

    if (data.time !== undefined) updates.push(`time = $${updates.length + 1}`), values.push(data.time);
    if (data.name !== undefined) updates.push(`name = $${updates.length + 1}`), values.push(data.name);
    if (data.guests !== undefined) updates.push(`guests = $${updates.length + 1}`), values.push(data.guests);
    if (data.phone !== undefined) updates.push(`phone = $${updates.length + 1}`), values.push(data.phone);
    if (data.status !== undefined) updates.push(`status = $${updates.length + 1}`), values.push(data.status);
    if (data.happyHours !== undefined) updates.push(`happy_hours = $${updates.length + 1}`), values.push(data.happyHours);
    if (data.comment !== undefined) updates.push(`comment = $${updates.length + 1}`), values.push(data.comment);
    if (data.vr !== undefined) updates.push(`vr = $${updates.length + 1}`), values.push(data.vr);
    if (data.hookah !== undefined) updates.push(`hookah = $${updates.length + 1}`), values.push(data.hookah);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(bookingId);

    const result = await sql`
      UPDATE bookings 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE id = ${bookingId}
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error('Ошибка обновления бронирования:', error);
    throw error;
  }
}

/**
 * Удалить бронирование
 */
export async function deleteBooking(bookingId) {
  try {
    await sql`
      DELETE FROM bookings 
      WHERE id = ${bookingId}
    `;

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

export default sql;

