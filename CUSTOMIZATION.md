# 🎨 Руководство по кастомизации DUNGEON Канбан

## Изменение цветовой схемы

### Основные цвета

Отредактируйте `tailwind.config.js`:

```javascript
colors: {
  'dungeon': {
    'dark': '#0a0a0f',           // Основной темный фон
    'darker': '#05050a',         // Более темный фон
    'card': '#1a1a2e',           // Цвет карточек
    'neon-green': '#00ff88',     // Зелёный неон (активные)
    'neon-purple': '#a855f7',    // Фиолетовый неон (VIP)
    'neon-blue': '#3b82f6',      // Синий неон (акценты)
    'neon-pink': '#ec4899',      // Розовый неон
    'gray': '#2a2a3e',           // Серый для границ
  }
}
```

### Готовые цветовые схемы

#### Классический киберпанк (по умолчанию)
```javascript
'neon-green': '#00ff88',
'neon-purple': '#a855f7',
'neon-blue': '#3b82f6',
```

#### Красно-синий (Neon City)
```javascript
'neon-green': '#ff3366',
'neon-purple': '#cc00ff',
'neon-blue': '#00ccff',
```

#### Золотой элитный
```javascript
'neon-green': '#ffd700',
'neon-purple': '#ff6b35',
'neon-blue': '#f7931e',
```

#### Холодный лёд
```javascript
'neon-green': '#00d4ff',
'neon-purple': '#7b68ee',
'neon-blue': '#4169e1',
```

---

## Изменение шрифтов

### Текущие шрифты

- **Заголовки**: Orbitron (sci-fi)
- **Основной текст**: Poppins (современный)

### Альтернативные варианты

Отредактируйте `index.html`:

```html
<!-- Для более строгого стиля -->
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Для футуристического стиля -->
<link href="https://fonts.googleapis.com/css2?family=Electrolize&family=Share+Tech+Mono&display=swap" rel="stylesheet">

<!-- Для минималистичного стиля -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Затем в `tailwind.config.js`:

```javascript
fontFamily: {
  'heading': ['Rajdhani', 'sans-serif'],
  'body': ['Inter', 'sans-serif'],
}
```

И используйте в компонентах:
```jsx
<h1 className="font-heading">...</h1>
<p className="font-body">...</p>
```

---

## Изменение списка зон

### Редактирование зон

В файле `src/services/googleSheets.js` найдите массив `zones`:

```javascript
const zones = [
  { id: 1, name: 'Зона 1', capacity: 6, isVip: false },
  { id: 2, name: 'Зона 2', capacity: 6, isVip: false },
  // ...
];
```

### Примеры конфигураций

#### Небольшое заведение (10 зон)
```javascript
const zones = [
  { id: 1, name: 'Зона 1', capacity: 4, isVip: false },
  { id: 2, name: 'Зона 2', capacity: 4, isVip: false },
  { id: 3, name: 'Зона 3', capacity: 6, isVip: false },
  { id: 4, name: 'Зона 4', capacity: 6, isVip: false },
  { id: 5, name: 'Зона 5', capacity: 8, isVip: false },
  { id: 6, name: 'Зона 6', capacity: 8, isVip: false },
  { id: 7, name: 'Зона 7', capacity: 10, isVip: false },
  { id: 8, name: 'Зона 8', capacity: 10, isVip: false },
  { id: 9, name: 'VIP-1', capacity: 12, isVip: true },
  { id: 10, name: 'VIP-2', capacity: 15, isVip: true },
];
```

#### Именованные зоны
```javascript
const zones = [
  { id: 1, name: 'Neon Corner', capacity: 6, isVip: false },
  { id: 2, name: 'Cyber Bar', capacity: 8, isVip: false },
  { id: 3, name: 'Matrix Lounge', capacity: 10, isVip: false },
  { id: 4, name: 'Digital Den', capacity: 6, isVip: false },
  { id: 5, name: 'Elite Suite', capacity: 12, isVip: true },
];
```

---

## Изменение статусов

### Текущие статусы

- `active` — зелёный
- `pending` — жёлтый
- `cancelled` — красный

### Добавление новых статусов

1. В `src/components/ZoneCard.jsx` добавьте в `getCardStyle()`:

```javascript
case 'confirmed':
  return 'bg-gradient-to-br from-blue-900/40 to-dungeon-card border-blue-500';
case 'waiting':
  return 'bg-gradient-to-br from-orange-900/40 to-dungeon-card border-orange-500';
```

2. Добавьте в `getStatusBadge()`:

```javascript
confirmed: { text: 'Подтверждено', color: 'bg-blue-500 text-white' },
waiting: { text: 'В очереди', color: 'bg-orange-500 text-white' },
```

3. В `src/components/EditModal.jsx` добавьте кнопку:

```jsx
<button
  type="button"
  onClick={() => handleChange('status', 'confirmed')}
  className="..."
>
  Подтверждено
</button>
```

---

## Изменение анимаций

### Скорость анимаций

В `tailwind.config.js`:

```javascript
animation: {
  'glow': 'glow 2s ease-in-out infinite alternate',      // медленнее: 3s
  'fade-in': 'fadeIn 0.5s ease-in',                       // быстрее: 0.3s
}
```

### Отключение анимаций

Для пользователей с prefers-reduced-motion:

```css
/* В index.css */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Изменение сетки карточек

### Текущая конфигурация

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
```

### Варианты

#### Больше карточек на экране
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
```

#### Крупные карточки
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

#### Список (одна колонка)
```jsx
<div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
```

---

## Добавление логотипа

### В заголовок

В `src/components/Header.jsx`:

```jsx
<div className="flex items-center gap-4">
  <img 
    src="/logo.png" 
    alt="DUNGEON" 
    className="h-12 w-12 object-contain"
  />
  <div>
    <h1 className="font-orbitron font-black text-3xl ...">
      DUNGEON
    </h1>
    <p className="text-gray-400 text-sm mt-1">Канбан-доска бронирований</p>
  </div>
</div>
```

### Favicon

Положите `favicon.ico` в папку `public/` и добавьте в `index.html`:

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

---

## Изменение интервала обновления

В `src/App.jsx`:

```javascript
// Каждые 10 секунд
const interval = setInterval(loadData, 10000);

// Каждую минуту
const interval = setInterval(loadData, 60000);

// Отключить автообновление
// Закомментируйте строку с setInterval
```

---

## Добавление звуковых уведомлений

Создайте `src/utils/sounds.js`:

```javascript
export const playSound = (type) => {
  const sounds = {
    success: new Audio('/sounds/success.mp3'),
    delete: new Audio('/sounds/delete.mp3'),
    update: new Audio('/sounds/update.mp3'),
  };
  
  const sound = sounds[type];
  if (sound) {
    sound.volume = 0.3;
    sound.play().catch(e => console.log('Звук не воспроизведён:', e));
  }
};
```

Используйте в `App.jsx`:

```javascript
import { playSound } from './utils/sounds';

const handleDelete = async (bookingId) => {
  // ...
  playSound('delete');
};
```

---

## Темная/Светлая тема

### Добавление переключателя

В `src/components/Header.jsx`:

```jsx
import { Moon, Sun } from 'lucide-react';

const [theme, setTheme] = useState('dark');

<button
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  className="..."
>
  {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

### Настройка светлой темы

В `tailwind.config.js`:

```javascript
darkMode: 'class',
```

В корневом элементе:

```jsx
<div className={theme === 'dark' ? 'dark' : ''}>
  {/* приложение */}
</div>
```

---

## Локализация

### Создание файлов переводов

`src/locales/ru.json`:
```json
{
  "header.title": "DUNGEON",
  "header.subtitle": "Канбан-доска бронирований",
  "status.active": "Активна",
  "status.pending": "Ожидание"
}
```

`src/locales/en.json`:
```json
{
  "header.title": "DUNGEON",
  "header.subtitle": "Booking Kanban Board",
  "status.active": "Active",
  "status.pending": "Pending"
}
```

### Использование

```javascript
import ru from './locales/ru.json';
import en from './locales/en.json';

const [locale, setLocale] = useState('ru');
const t = locale === 'ru' ? ru : en;

<h1>{t['header.title']}</h1>
```

---

## Экспорт данных

### Добавление кнопки экспорта в CSV

В `src/components/Header.jsx`:

```jsx
import { Download } from 'lucide-react';

const handleExport = () => {
  const csv = zones
    .filter(z => z.booking)
    .map(z => [
      z.name,
      z.booking.time,
      z.booking.name,
      z.booking.guests,
      z.booking.phone,
      z.booking.status
    ].join(','))
    .join('\n');
    
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings-${new Date().toISOString()}.csv`;
  a.click();
};

<button onClick={handleExport} className="...">
  <Download size={18} />
  Экспорт
</button>
```

---

## Фильтры и сортировка

### Добавление сортировки

В `src/App.jsx`:

```javascript
const [sortBy, setSortBy] = useState('zone'); // zone, time, name

const sortedZones = [...filteredZones].sort((a, b) => {
  if (sortBy === 'zone') return a.id - b.id;
  if (sortBy === 'time') {
    if (!a.booking) return 1;
    if (!b.booking) return -1;
    return a.booking.time.localeCompare(b.booking.time);
  }
  if (sortBy === 'name') {
    if (!a.booking) return 1;
    if (!b.booking) return -1;
    return a.booking.name.localeCompare(b.booking.name);
  }
  return 0;
});
```

---

## Уведомления

### Установка библиотеки

```bash
npm install react-hot-toast
```

### Использование

```javascript
import toast, { Toaster } from 'react-hot-toast';

// В App.jsx
const handleDelete = async (bookingId) => {
  try {
    await deleteBooking(bookingId);
    toast.success('Бронирование удалено');
    await loadData();
  } catch (error) {
    toast.error('Не удалось удалить бронирование');
  }
};

// В рендере
<Toaster 
  position="top-right"
  toastOptions={{
    style: {
      background: '#1a1a2e',
      color: '#fff',
    },
  }}
/>
```

---

## 🎉 Готово!

Теперь вы можете полностью кастомизировать Канбан-доску под свои нужды!

Дополнительные ресурсы:
- [Tailwind CSS документация](https://tailwindcss.com/docs)
- [Lucide иконки](https://lucide.dev)
- [Google Fonts](https://fonts.google.com)

