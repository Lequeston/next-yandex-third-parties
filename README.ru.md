# Next.js Yandex Third Parties

*[English](README.md) | **Русский***

[![codecov](https://codecov.io/gh/Lequeston/next-yandex-third-parties/graph/badge.svg)](https://codecov.io/gh/Lequeston/next-yandex-third-parties)
[![Tests](https://github.com/Lequeston/next-yandex-third-parties/actions/workflows/test.yml/badge.svg)](https://github.com/Lequeston/next-yandex-third-parties/actions/workflows/test.yml)
[![CI](https://github.com/Lequeston/next-yandex-third-parties/actions/workflows/ci.yml/badge.svg)](https://github.com/Lequeston/next-yandex-third-parties/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/next-yandex-third-parties.svg)](https://badge.fury.io/js/next-yandex-third-parties)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Интеграция Яндекс сервисов для Next.js приложений. Предоставляет простые в использовании компоненты и утилиты для интеграции Яндекс.Метрики в ваш Next.js проект.

## Установка

```bash
npm install next-yandex-third-parties
# или
yarn add next-yandex-third-parties
# или
pnpm add next-yandex-third-parties
```

## Быстрый старт

### 1. Добавьте Яндекс.Метрику в ваше приложение

Добавьте компонент `YandexMetrika` в ваш root layout или `_app.tsx`:

```tsx
import { YandexMetrika } from 'next-yandex-third-parties';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <YandexMetrika
          tagId={12345678} // Замените на ваш ID счетчика Яндекс.Метрики
          initParameters={{
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
          }}
        />
      </body>
    </html>
  );
}
```

### 2. Отслеживание пользовательских событий

```tsx
import { sendYAEvent, reachGoal, userParams } from 'next-yandex-third-parties';

function MyComponent() {
  const handleClick = () => {
    // Отследить пользовательское событие
    sendYAEvent('hit', '/virtual-page');

    // Отследить достижение цели
    reachGoal('button_click', { user_type: 'premium' });

    // Установить параметры пользователя
    userParams({ user_id: '12345', subscription: 'premium' });
  };

  return <button onClick={handleClick}>Отследить событие</button>;
}
```

## Справочник API

### Компонент YandexMetrika

Основной компонент для инициализации отслеживания Яндекс.Метрики.

```tsx
<YandexMetrika
  tagId={number} // Обязательно: ID вашего счетчика Яндекс.Метрики
  initParameters={object} // Опционально: Параметры инициализации
  scriptSrc={string} // Опционально: Пользовательский URL скрипта
/>
```

#### Пропсы

| Проп             | Тип              | Обязательно | Описание                                                                          |
| ---------------- | ---------------- | ----------- | --------------------------------------------------------------------------------- |
| `tagId`          | `number`         | Да          | ID вашего счетчика Яндекс.Метрики                                                |
| `initParameters` | `InitParameters` | Нет         | Параметры инициализации счетчика                                                  |
| `scriptSrc`      | `string`         | Нет         | Пользовательский URL скрипта Яндекс.Метрики (по умолчанию: `https://mc.yandex.ru/metrika/tag.js`) |

#### InitParameters

```tsx
interface InitParameters {
  clickmap?: boolean; // Отслеживание кликов по карте
  trackLinks?: boolean; // Отслеживание внешних ссылок
  accurateTrackBounce?: boolean; // Точный показатель отказов
  webvisor?: boolean; // Записи сессий
  trackHash?: boolean; // Отслеживание изменений хеша
  ecommerce?: boolean | string; // Отслеживание электронной коммерции
  // ... и другие параметры
}
```

### Функции отслеживания

#### sendYAEvent()

Отправка пользовательских событий в Яндекс.Метрику:

```tsx
sendYAEvent('hit', url, options);
sendYAEvent('reachGoal', goalName, params, callback);
sendYAEvent('userParams', params);
// ... любой другой метод Яндекс.Метрики
```

#### reachGoal()

Отслеживание достижения целей:

```tsx
reachGoal('goal_name');
reachGoal('goal_name', { param1: 'value1' });
reachGoal('goal_name', { param1: 'value1' }, () => {
  console.log('Цель отслежена!');
});
```

#### userParams()

Установка параметров пользователя:

```tsx
userParams({
  user_id: '12345',
  user_type: 'premium',
  age: 30,
});
```

#### setUserID()

Установка ID пользователя:

```tsx
setUserID('user123');
```

#### notBounce()

Отметка сессии как не-отказ:

```tsx
notBounce();
notBounce({ callback: () => console.log('Не-отказ отслежен') });
```

## Примеры

### Отслеживание электронной коммерции

```tsx
import { sendYAEvent } from 'next-yandex-third-parties';

// Отследить покупку
sendYAEvent('reachGoal', 'purchase', {
  order_id: '12345',
  revenue: 99.99,
  currency: 'RUB',
});

// Отследить просмотр товара
sendYAEvent('hit', '/product/123', {
  product_id: '123',
  product_name: 'Крутой товар',
  category: 'Электроника',
});
```

### Отслеживание просмотров страниц

```tsx
import { useEffect } from 'react';
import { sendYAEvent } from 'next-yandex-third-parties';

function MyPage() {
  useEffect(() => {
    sendYAEvent('hit', window.location.pathname);
  }, []);

  return <div>Содержимое моей страницы</div>;
}
```

### Пользовательское отслеживание

```tsx
import { userParams, setUserID } from 'next-yandex-third-parties';

function UserProfile({ user }) {
  useEffect(() => {
    setUserID(user.id);
    userParams({
      user_type: user.subscription,
      registration_date: user.createdAt,
      total_orders: user.ordersCount,
    });
  }, [user]);

  return <div>Профиль пользователя</div>;
}
```

## Требования

- Next.js 13.0.0 или выше
- React 18.2.0 или выше
- TypeScript 4.0+ (опционально, но рекомендуется)

## Лицензия

MIT License - смотрите файл [LICENSE](LICENSE) для деталей.

## Участие в разработке

Мы приветствуем участие в разработке! Пожалуйста, ознакомьтесь с нашими правилами участия и отправляйте pull request'ы в наш репозиторий.

## Разработка

Этот проект использует Gulp для сборки и компиляции TypeScript.

### Настройка

```bash
# Установить зависимости
npm install

# Собрать проект
npm run build

# Запустить тесты
npm test

# Запустить тесты с покрытием
npm run test:coverage

# Следить за изменениями во время разработки
npm run watch

# Очистить директорию сборки
npm run clean
```

### Скрипты

- `npm run build` - Очистить и скомпилировать TypeScript в JavaScript
- `npm run compile` - Скомпилировать TypeScript без очистки
- `npm run clean` - Удалить директорию dist
- `npm run watch` - Следить за изменениями файлов и автоматически компилировать
- `npm test` - Запустить тесты с Jest
- `npm run test:watch` - Запустить тесты в режиме наблюдения
- `npm run test:coverage` - Запустить тесты с отчетом о покрытии
- `npm run lint` - Запустить ESLint для проверки качества кода и форматирования
- `npm run lint:fix` - Запустить ESLint и автоматически исправить проблемы и форматирование
- `npm run typecheck` - Запустить проверку типов TypeScript

### Тестирование

Отчеты о покрытии автоматически генерируются и загружаются в [Codecov](https://codecov.io/gh/Lequeston/next-yandex-third-parties) при каждом запуске CI.

### Структура проекта

```
src/
├── index.tsx              # Основные экспорты
├── YandexMetrika.tsx      # Основной компонент
└── types/                 # Определения TypeScript
    ├── yandexMetrika.ts   # Типы пропсов компонента
    ├── parameters.ts      # Типы параметров
    ├── events.ts         # Типы событий
    ├── options.ts        # Типы опций
    └── ym.ts            # Типы API Яндекс.Метрики
```

## Поддержка

- 📖 [Документация Яндекс.Метрики](https://yandex.ru/support/metrica/)
- 🐛 [Сообщить о проблеме](https://github.com/Lequeston/next-yandex-third-parties/issues)
- 💬 [Обсуждения](https://github.com/Lequeston/next-yandex-third-parties/discussions)