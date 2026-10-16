# Media Storage — Frontend

Frontend Media Storage использует React, TypeScript, Vite, Material UI и Supabase JS Client. Фактическая архитектура, Auth, схема PostgreSQL, RLS, Storage, API-функции, конфигурация и ограничения описаны в [README проекта](../README.md) и [документации backend](../backend_documentation.md).

## Запуск

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Перед запуском укажите в `.env.local` переменные `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY`. Пример находится в [`.env.example`](./.env.example); секретный `service_role` key во frontend не используется.

## Проверки и сборка

```bash
npm run lint
npm run build
npm run test
npm run preview
```

Сценарии приложения включают поиск и фильтрацию медиатеки, просмотр файлов, коллекции, переименование и удаление медиа, а также загрузку через виджет на странице библиотеки. Маршрут `/upload` пока является заглушкой.
