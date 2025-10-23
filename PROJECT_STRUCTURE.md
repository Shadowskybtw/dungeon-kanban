# 📂 Структура проекта DUNGEON Канбан

## Обзор

Полная структура файлов и директорий проекта с описанием назначения каждого элемента.

```
Kanban/
├── public/                          # Статические файлы
│   └── (поместите сюда логотипы, favicon, звуки)
│
├── src/                             # Исходный код приложения
│   ├── components/                  # React компоненты
│   │   ├── Header.jsx              # Шапка с фильтрами и переключателем филиалов
│   │   ├── ZoneCard.jsx            # Карточка зоны с бронированием
│   │   └── EditModal.jsx           # Модальное окно редактирования
│   │
│   ├── services/                    # Бизнес-логика и API
│   │   └── googleSheets.js         # Интеграция с Google Sheets API
│   │
│   ├── App.jsx                      # Главный компонент приложения
│   ├── main.jsx                     # Точка входа React
│   └── index.css                    # Глобальные стили и Tailwind
│
├── index.html                       # HTML шаблон
├── package.json                     # Зависимости и скрипты
├── vite.config.js                   # Конфигурация Vite
├── tailwind.config.js               # Конфигурация Tailwind CSS
├── postcss.config.js                # Конфигурация PostCSS
├── .gitignore                       # Игнорируемые файлы Git
│
├── google-apps-script.gs            # Код для Google Apps Script
├── google-sheets-template.csv       # Шаблон структуры таблицы
│
├── README.md                        # Основная документация
├── QUICK_START.md                   # Быстрый старт
├── SETUP.md                         # Детальная настройка
├── API_DOCUMENTATION.md             # Документация API
├── CUSTOMIZATION.md                 # Руководство по кастомизации
└── PROJECT_STRUCTURE.md             # Этот файл
```

---

## 📄 Описание ключевых файлов

### Frontend (React)

#### `src/App.jsx`
**Главный компонент приложения**

- Управление состоянием (зоны, фильтры, модальные окна)
- Загрузка данных из API
- Автообновление каждые 30 секунд
- Обработчики событий (подтверждение, редактирование, удаление)
- Рендер Header, карточек зон, статистики

**Основные функции:**
- `loadData()` — загрузка данных
- `handleStatusChange()` — изменение статуса
- `handleEdit()` — открытие модального окна
- `handleSaveEdit()` — сохранение изменений
- `handleDelete()` — удаление брони
- `handleClearAll()` — очистка всех броней

#### `src/components/Header.jsx`
**Компонент шапки с управлением**

- Заголовок и логотип
- Переключатель филиалов (Московское ш., Полевая)
- Фильтры статусов (Все, Активные, Ожидающие)
- Кнопки "Обновить" и "Очистить"
- Информация о времени обновления и количестве зон

**Props:**
- `selectedBranch` — текущий филиал
- `onBranchChange` — обработчик смены филиала
- `statusFilter` — текущий фильтр
- `onStatusFilterChange` — обработчик фильтра
- `onRefresh` — обработчик обновления
- `onClearAll` — обработчик очистки
- `lastUpdate` — время последнего обновления
- `totalZones` — количество зон

#### `src/components/ZoneCard.jsx`
**Карточка зоны с бронированием**

- Отображение информации о зоне (название, вместимость)
- Визуализация статуса (цветовое кодирование)
- Данные брони (время, имя, гости, телефон)
- Кнопки действий (✅ ✏️ 🗑️)
- VIP-индикатор для премиум-зон
- Hover-эффекты и анимации

**Props:**
- `zone` — объект зоны с данными
- `onStatusChange` — изменение статуса
- `onEdit` — редактирование
- `onDelete` — удаление

#### `src/components/EditModal.jsx`
**Модальное окно редактирования**

- Форма редактирования брони
- Поля: время, имя, количество, телефон, статус
- Валидация данных
- Анимация появления
- Закрытие по ESC или кнопке

**Props:**
- `booking` — редактируемое бронирование
- `zone` — зона для контекста
- `isOpen` — открыто/закрыто
- `onClose` — закрытие окна
- `onSave` — сохранение изменений

#### `src/services/googleSheets.js`
**Сервис для работы с API**

Функции:
- `fetchBookings(branch)` — получение данных
- `updateBookingStatus(id, status)` — обновление статуса
- `updateBooking(id, data)` — обновление брони
- `deleteBooking(id)` — удаление брони
- `getMockData(branch)` — демо-данные для разработки

---

### Styling

#### `tailwind.config.js`
**Конфигурация Tailwind CSS**

Кастомные настройки:
- **Шрифты**: Orbitron, Poppins
- **Цвета**: dungeon-dark, neon-green, neon-purple, neon-blue
- **Тени**: neon-green, neon-purple, neon-blue (свечение)
- **Анимации**: glow, fade-in
- **Breakpoints**: адаптивная сетка

#### `src/index.css`
**Глобальные стили**

- Подключение Tailwind директив
- Фоновый градиент
- Кастомный scrollbar
- Анимация pulse-glow
- Базовые стили для body и root

---

### Configuration

#### `package.json`
**Зависимости проекта**

**Dependencies:**
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `lucide-react` ^0.294.0 (иконки)

**DevDependencies:**
- `vite` ^5.0.8 (сборщик)
- `tailwindcss` ^3.3.6 (стили)
- `@vitejs/plugin-react` ^4.2.1

**Scripts:**
- `npm run dev` — запуск dev-сервера
- `npm run build` — сборка для продакшена
- `npm run preview` — предпросмотр сборки

#### `vite.config.js`
**Конфигурация Vite**

- Плагин React с Fast Refresh
- Оптимизация сборки
- Настройки dev-сервера

---

### Backend (Google Apps Script)

#### `google-apps-script.gs`
**Серверная логика**

**Функции:**

**`doGet(e)`** — обработка GET-запросов
- Чтение данных из таблицы
- Фильтрация по филиалу
- Формирование JSON структуры
- Возврат данных о зонах и бронированиях

**`doPost(e)`** — обработка POST-запросов
- Маршрутизация по `action`
- Вызов соответствующих функций
- Обработка ошибок

**CRUD операции:**
- `updateStatus(id, status)` — изменение статуса
- `updateBooking(id, data)` — обновление данных
- `deleteBooking(id)` — удаление строки
- `clearAllBookings(branch)` — массовое удаление

**Вспомогательные:**
- `findRowById(id)` — поиск строки по ID
- `generateZonesStructure(bookings)` — создание структуры данных

---

## 🔄 Поток данных

### 1. Загрузка данных

```
App.jsx (loadData)
    ↓
googleSheets.js (fetchBookings)
    ↓
Google Apps Script (doGet)
    ↓
Google Sheets (чтение)
    ↓
Возврат JSON
    ↓
Обновление state (setZones)
    ↓
Рендер компонентов
```

### 2. Редактирование брони

```
ZoneCard (кнопка Edit)
    ↓
App.jsx (handleEdit)
    ↓
Открытие EditModal (setEditModalOpen)
    ↓
Пользователь редактирует
    ↓
EditModal (onSave)
    ↓
App.jsx (handleSaveEdit)
    ↓
googleSheets.js (updateBooking)
    ↓
Google Apps Script (doPost → updateBooking)
    ↓
Google Sheets (запись)
    ↓
Перезагрузка данных (loadData)
```

### 3. Автообновление

```
App.jsx (useEffect)
    ↓
setInterval (30 секунд)
    ↓
loadData()
    ↓
Обновление данных
```

---

## 🎨 Дизайн-система

### Цветовая палитра

| Название | Hex | Использование |
|----------|-----|---------------|
| dark | `#0a0a0f` | Основной фон |
| darker | `#05050a` | Глубокий фон |
| card | `#1a1a2e` | Карточки |
| neon-green | `#00ff88` | Активные статусы |
| neon-purple | `#a855f7` | VIP, акценты |
| neon-blue | `#3b82f6` | Информация |
| gray | `#2a2a3e` | Границы |

### Типографика

- **Заголовки**: Orbitron, 700-900
- **Текст**: Poppins, 400-600
- **Моноширинный**: Share Tech Mono (опционально)

### Размеры

- **Radius**: rounded-lg (8px), rounded-xl (12px)
- **Padding**: p-4 (16px), p-6 (24px)
- **Gap**: gap-4 (16px), gap-6 (24px)

### Анимации

- **Fade-in**: 0.5s ease-in
- **Glow**: 2s infinite alternate
- **Hover**: transform + shadow

---

## 📊 Структура данных

### Zone Object

```javascript
{
  id: number,           // Уникальный ID зоны
  name: string,         // Название зоны
  capacity: number,     // Вместимость
  isVip: boolean,       // VIP-статус
  booking: Booking | null  // Бронирование (или null)
}
```

### Booking Object

```javascript
{
  id: string,           // Уникальный ID брони
  time: string,         // "HH:MM"
  name: string,         // Имя гостя
  guests: number,       // Количество гостей
  phone: string,        // Телефон
  status: string,       // active | pending | cancelled
  branch: string        // Филиал
}
```

---

## 🔧 Технологический стек

### Frontend
- React 18 — UI library
- Vite — build tool
- Tailwind CSS — styling
- Lucide React — icons

### Backend
- Google Apps Script — serverless API
- Google Sheets — database

### Deployment
- Vercel / Netlify / GitHub Pages

---

## 📱 Адаптивность

### Breakpoints

| Размер | Ширина | Колонки |
|--------|--------|---------|
| Mobile | < 640px | 1 |
| SM | 640px+ | 2 |
| LG | 1024px+ | 3 |
| XL | 1280px+ | 4 |
| 2XL | 1536px+ | 5 |

---

## 🚀 Производительность

### Оптимизации

- ✅ Кэширование API запросов
- ✅ Автообновление с debounce
- ✅ Ленивая загрузка модальных окон
- ✅ Минификация в продакшене
- ✅ Tree shaking неиспользуемого кода

### Метрики (целевые)

- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: 90+

---

## 🧪 Тестирование

### Ручное тестирование

1. Проверка отображения зон
2. Фильтрация по филиалам и статусам
3. CRUD операции с бронями
4. Автообновление
5. Адаптивность на разных экранах

### Чек-лист перед деплоем

- [ ] Все зоны отображаются корректно
- [ ] Фильтры работают
- [ ] Модальное окно открывается/закрывается
- [ ] Данные сохраняются в Google Sheets
- [ ] Автообновление работает
- [ ] Мобильная версия корректна
- [ ] Нет ошибок в консоли

---

## 📚 Документация

- **README.md** — основная документация, обзор
- **QUICK_START.md** — быстрый старт за 5 минут
- **SETUP.md** — детальная настройка шаг за шагом
- **API_DOCUMENTATION.md** — документация API
- **CUSTOMIZATION.md** — кастомизация и расширение
- **PROJECT_STRUCTURE.md** — структура проекта (этот файл)

---

## 🎯 Roadmap (будущие улучшения)

### Версия 2.0
- [ ] Drag & Drop между зонами
- [ ] История изменений
- [ ] Push-уведомления
- [ ] Множественное выделение

### Версия 3.0
- [ ] Интеграция с календарём
- [ ] Экспорт в PDF/Excel
- [ ] Аналитика и отчёты
- [ ] Роли и права доступа

---

**Последнее обновление:** 23 октября 2025
**Версия проекта:** 1.0.0

