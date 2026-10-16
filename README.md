# Media Storage

Media Storage — React-приложение для хранения и организации пользовательских изображений, видео и аудиофайлов. Supabase предоставляет авторизацию, PostgreSQL для метаданных и коллекций, а также приватный Storage bucket для бинарных файлов. Отдельный backend-сервер в репозитории отсутствует: frontend обращается к Supabase напрямую через `@supabase/supabase-js`.

## Возможности

- Регистрация, вход, восстановление сохранённой сессии и выход.
- Просмотр, поиск и фильтрация своей медиатеки.
- Загрузка изображений, видео и аудио в Supabase Storage.
- Переименование и удаление медиафайлов.
- Создание и удаление коллекций, добавление файлов в коллекции и удаление из них.
- Отображение расчёта занятого места для интерфейса. API-функция сводки библиотеки реализована, но пока не подключена к экрану.

Загрузка доступна в виджете на странице библиотеки. Отдельный маршрут `/upload` пока содержит демонстрационную заглушку.

## Технологический стек

- React 19, TypeScript 6, Vite 8.
- Material UI 9, React Router 7.
- Supabase JavaScript Client 2, Supabase Auth, PostgreSQL, Supabase Storage.
- Oxlint, Vitest и React Testing Library.

## Требования

- Node.js и npm, совместимые с версиями используемых Vite и TypeScript.
- Проект Supabase с включённым Email provider.
- Доступ к Supabase Project URL и publishable key.

## Установка и настройка

Перейдите в каталог frontend, установите зависимости и создайте локальный файл окружения:

```bash
cd frontend
npm ci
cp .env.example .env.local
```

Укажите в `frontend/.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key_here
```

Значения URL и publishable key доступны в настройках API проекта Supabase. Publishable key предназначен для клиентского приложения; доступ к пользовательским данным должен ограничиваться RLS. Никогда не помещайте в frontend `service_role` или другой секретный привилегированный ключ.

Примените существующую SQL-миграцию [20261015_000001_create_media_storage_schema.sql](./supabase/migrations/20261015_000001_create_media_storage_schema.sql) к нужному Supabase-проекту после проверки проекта и текущей схемы. Миграция создаёт таблицы, политики RLS и приватный bucket. Самостоятельная проверка фактического удалённого проекта не выполнялась. Дополнительная информация — в [backend_documentation.md](./backend_documentation.md).

## Разработка

```bash
cd frontend
npm run dev
```

Vite выведет локальный URL приложения в терминал.

## Проверки и production-сборка

Из каталога `frontend`:

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` выполняет TypeScript build и production-сборку Vite. `npm run preview` запускает локальный просмотр собранного приложения. Тесты запускаются командой `npm run test`; отдельный backend-сервер или backend-команда запуска в проекте не определены.

## Документация

- [Документация backend и интеграции с Frontend](./backend_documentation.md)
- [Описание модели базы данных](./docs/database_design.md)
- [Frontend README](./frontend/README.md)
