# 📡 API документация — DUNGEON Канбан

## Обзор

Приложение взаимодействует с Google Sheets через Google Apps Script Web API. Все запросы отправляются на единый endpoint.

## Endpoint

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## 📥 GET — Получение данных

### Запрос

```http
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?branch=Московское%20ш.
```

### Параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `branch` | string | Нет | Фильтр по филиалу |

### Ответ

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Зона 1",
      "capacity": 6,
      "isVip": false,
      "booking": {
        "id": "b1",
        "time": "19:00",
        "name": "Алексей Петров",
        "guests": 4,
        "phone": "+7 (999) 123-45-67",
        "status": "active",
        "branch": "Московское ш."
      }
    },
    {
      "id": 2,
      "name": "Зона 2",
      "capacity": 6,
      "isVip": false,
      "booking": null
    }
  ],
  "timestamp": "2025-10-23T18:30:00.000Z"
}
```

---

## 📤 POST — Изменение данных

### Базовый запрос

```http
POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
Content-Type: application/json

{
  "action": "ACTION_NAME",
  ...
}
```

---

### 1. Обновление статуса

**Action:** `updateStatus`

```json
{
  "action": "updateStatus",
  "id": "b1",
  "status": "active"
}
```

**Параметры:**
- `id` (string) — ID бронирования
- `status` (string) — Новый статус: `active`, `pending`, `cancelled`

**Ответ:**
```json
{
  "success": true,
  "message": "Статус обновлён"
}
```

---

### 2. Обновление бронирования

**Action:** `update`

```json
{
  "action": "update",
  "id": "b1",
  "time": "20:00",
  "name": "Новое имя",
  "guests": 5,
  "phone": "+7 (999) 111-22-33",
  "status": "active"
}
```

**Параметры:**
- `id` (string, обязательный) — ID бронирования
- `time` (string, опционально) — Время в формате HH:MM
- `name` (string, опционально) — Имя гостя
- `guests` (number, опционально) — Количество гостей
- `phone` (string, опционально) — Телефон
- `status` (string, опционально) — Статус

**Ответ:**
```json
{
  "success": true,
  "message": "Бронирование обновлено"
}
```

---

### 3. Удаление бронирования

**Action:** `delete`

```json
{
  "action": "delete",
  "id": "b1"
}
```

**Параметры:**
- `id` (string) — ID бронирования

**Ответ:**
```json
{
  "success": true,
  "message": "Бронирование удалено"
}
```

---

### 4. Очистка всех бронирований

**Action:** `clearAll`

```json
{
  "action": "clearAll",
  "branch": "Московское ш."
}
```

**Параметры:**
- `branch` (string, опционально) — Филиал для очистки. Если не указан, очищаются все.

**Ответ:**
```json
{
  "success": true,
  "message": "Бронирования очищены"
}
```

---

## ❌ Обработка ошибок

### Формат ошибки

```json
{
  "success": false,
  "error": "Описание ошибки"
}
```

### Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `Неизвестное действие` | Неправильный `action` | Проверьте название действия |
| `Бронирование не найдено` | Неправильный `id` | Убедитесь, что ID существует |
| `CORS policy error` | Неправильные настройки доступа | Установите доступ "Все" в Apps Script |
| `403 Forbidden` | Нет прав доступа | Переразверните Apps Script |

---

## 🔐 Безопасность

### Ограничения доступа

По умолчанию Apps Script развёрнут с доступом **"Все"**. Это означает:
- ✅ Любой может читать данные
- ✅ Любой может изменять данные

### Рекомендации для продакшена

1. **Аутентификация через API ключ**

```javascript
// В Apps Script
function doGet(e) {
  const apiKey = e.parameter.apiKey;
  if (apiKey !== 'YOUR_SECRET_KEY') {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Unauthorized' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  // ... остальной код
}
```

2. **OAuth 2.0**

Используйте OAuth для идентификации пользователей.

3. **Ограничение по IP**

В Apps Script можно проверять IP адреса запросов.

---

## 📊 Структура данных Google Таблицы

### Обязательные столбцы

| Столбец | Тип | Описание |
|---------|-----|----------|
| ID | string/number | Уникальный идентификатор |
| Филиал | string | Название филиала |
| Зона | string | Название зоны |
| Время | string | Время в формате HH:MM |
| Имя | string | Имя гостя |
| Количество | number | Количество гостей |
| Телефон | string | Телефон |
| Статус | string | active / pending / cancelled |

### Опциональные столбцы

| Столбец | Тип | Описание |
|---------|-----|----------|
| Обновлено | datetime | Время последнего обновления |
| Комментарий | string | Дополнительная информация |
| Email | string | Email гостя |

---

## 🧪 Тестирование API

### С помощью curl

```bash
# GET запрос
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?branch=Московское%20ш."

# POST запрос
curl -X POST \
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "updateStatus",
    "id": "b1",
    "status": "active"
  }'
```

### С помощью Postman

1. Создайте новый запрос
2. Выберите метод `POST`
3. URL: ваш Apps Script endpoint
4. Body → raw → JSON
5. Вставьте JSON данные
6. Отправьте запрос

### С помощью браузера

Откройте Developer Tools (F12) → Console и выполните:

```javascript
// GET
fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec')
  .then(r => r.json())
  .then(data => console.log(data));

// POST
fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
  method: 'POST',
  body: JSON.stringify({
    action: 'updateStatus',
    id: 'b1',
    status: 'active'
  })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 🔄 Webhook для уведомлений

Можно настроить webhook для получения уведомлений при изменении данных.

### В Apps Script

```javascript
function notifyChange(action, data) {
  const webhookUrl = 'YOUR_WEBHOOK_URL';
  
  UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      action: action,
      data: data,
      timestamp: new Date().toISOString()
    })
  });
}
```

---

## 📈 Производительность

### Кэширование

Apps Script имеет встроенное кэширование:

```javascript
function doGet(e) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('bookings');
  
  if (cached) {
    return ContentService.createTextOutput(cached)
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // ... загрузка данных
  const data = JSON.stringify(bookings);
  cache.put('bookings', data, 300); // 5 минут
  
  return ContentService.createTextOutput(data)
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Оптимизация запросов

- Используйте фильтры на стороне сервера
- Кэшируйте данные на клиенте
- Используйте debounce для частых запросов

---

## 🛠️ Расширенные возможности

### Создание новой брони

Добавьте в Apps Script:

```javascript
function createBooking(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const newId = sheet.getLastRow() + 1;
  
  sheet.appendRow([
    newId,
    data.branch,
    data.zone,
    data.time,
    data.name,
    data.guests,
    data.phone,
    data.status || 'pending',
    new Date()
  ]);
  
  return { success: true, id: newId };
}
```

### Поиск броней

```javascript
function searchBookings(query) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const results = data.filter(row => 
    row.some(cell => 
      cell.toString().toLowerCase().includes(query.toLowerCase())
    )
  );
  
  return results;
}
```

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера (F12)
2. Проверьте логи Apps Script (View → Logs)
3. Убедитесь, что структура таблицы соответствует документации
4. Проверьте, что Apps Script развёрнут с правильными настройками

---

**Документация актуальна на:** 23 октября 2025

