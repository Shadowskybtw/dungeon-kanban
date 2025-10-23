# 🗄️ Настройка базы данных PostgreSQL + Vercel

## ✅ Что готово:

1. **PostgreSQL подключение** — Neon Database
2. **API роуты** — Vercel Serverless Functions
3. **Автосоздание таблиц** — при первом запросе
4. **Полный CRUD** — создание, чтение, обновление, удаление

---

## 🚀 Быстрый деплой на Vercel

### 1. Добавьте переменную окружения в Vercel

После `git push` перейдите в Vercel:

1. Откройте ваш проект **dungeon-kanban**
2. **Settings** → **Environment Variables**
3. Добавьте переменную:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://neondb_owner:npg_ndU5X7kVHJwy@ep-cool-scene-a6ced7pu-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
4. Нажмите **Save**

### 2. Redeploy проекта

После добавления переменной:
- Vercel автоматически передеплоит проект
- ИЛИ в **Deployments** → три точки → **Redeploy**

### 3. Инициализация базы данных

При первом запросе к `/api/bookings`:
- Автоматически создадутся таблицы `zones` и `bookings`
- Заполнятся зоны для обоих филиалов
- Готово к использованию! ✅

---

## 📊 Структура базы данных

### Таблица `zones`

```sql
CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE,
  branch VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица `bookings`

```sql
CREATE TABLE bookings (
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
);
```

---

## 🔌 API Endpoints

### GET `/api/bookings`

Получение всех зон с бронированиями

**Query параметры:**
- `branch` (опционально) — фильтр по филиалу

**Пример:**
```
GET /api/bookings?branch=Московское%20ш.
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Зона 1",
      "capacity": 6,
      "isVip": false,
      "branch": "Московское ш.",
      "booking": {
        "id": 10,
        "time": "19:00",
        "name": "Иван Иванов",
        "guests": 4,
        "phone": "+79991234567",
        "status": "active",
        "happyHours": false,
        "comment": "",
        "vr": false,
        "hookah": true
      }
    }
  ]
}
```

### POST `/api/bookings` — Создание брони

```json
{
  "action": "create",
  "zoneId": 1,
  "zoneName": "Зона 1",
  "branch": "Московское ш.",
  "data": {
    "time": "19:00",
    "name": "Иван Иванов",
    "guests": 4,
    "phone": "+79991234567",
    "status": "pending",
    "happyHours": false,
    "comment": "Окно",
    "vr": true,
    "hookah": false
  }
}
```

### POST `/api/bookings` — Обновление брони

```json
{
  "action": "update",
  "bookingId": 10,
  "data": {
    "name": "Петр Петров",
    "guests": 5
  }
}
```

### POST `/api/bookings` — Обновление статуса

```json
{
  "action": "updateStatus",
  "bookingId": 10,
  "status": "active"
}
```

### POST `/api/bookings` — Удаление брони

```json
{
  "action": "delete",
  "bookingId": 10
}
```

---

## 🧪 Локальное тестирование

### Способ 1: Через Vercel CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Запустите локально
vercel dev
```

### Способ 2: Прямое подключение к Neon

API роуты автоматически работают на Vercel.  
Для локальной разработки используйте `vercel dev`.

---

## ✅ Проверка работы

После деплоя:

1. **Откройте приложение** на Vercel
2. **Кликните на пустую зону** → создайте бронь
3. **Обновите страницу** → бронь должна остаться! ✅
4. **Удалите бронь** → она действительно удалится! ✅
5. **Измените статус** → изменения сохранятся! ✅

---

## 🗃️ Управление базой данных

### Neon Dashboard

Перейдите в: [console.neon.tech](https://console.neon.tech)

Там вы можете:
- Просматривать данные
- Выполнять SQL запросы
- Создавать бэкапы
- Мониторить производительность

### Пример SQL запросов

```sql
-- Все брони
SELECT * FROM bookings ORDER BY created_at DESC;

-- Брони для конкретного филиала
SELECT * FROM bookings WHERE branch = 'Московское ш.';

-- Активные брони
SELECT * FROM bookings WHERE status = 'active';

-- Брони со счастливыми часами
SELECT * FROM bookings WHERE happy_hours = true;

-- Очистить все брони (осторожно!)
DELETE FROM bookings;
```

---

## 🔧 Устранение проблем

### Проблема: API возвращает 500

**Решение:**
1. Проверьте, что переменная `DATABASE_URL` добавлена в Vercel
2. Redeploy проекта после добавления переменной
3. Проверьте логи в Vercel: **Deployments** → ваш деплой → **Functions**

### Проблема: Данные не сохраняются

**Решение:**
1. Откройте DevTools (F12) → Console
2. Проверьте, есть ли ошибки запросов к `/api/bookings`
3. Проверьте, что база данных инициализирована (первый запрос к API)

### Проблема: CORS ошибка

**Решение:**
API уже настроен с CORS заголовками. Если проблема остаётся:
- Очистите кэш браузера
- Проверьте Network tab в DevTools

---

## 📝 Что дальше?

- ✅ База данных работает
- ✅ CRUD операции реализованы
- ✅ Автосинхронизация настроена
- ✅ Данные персистентны (сохраняются навсегда)

**Теперь ваша Канбан-доска полностью функциональна!** 🎉

Все изменения сохраняются в PostgreSQL и доступны на всех устройствах.

