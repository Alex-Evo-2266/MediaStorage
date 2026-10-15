# Промпт

# ДЗ5 — Шаг 1. Подключение Supabase

## Role — Роль

Ты — опытный frontend-разработчик React и TypeScript, специализирующийся на интеграции Supabase.

## Context — Контекст

Проект Media Storage — веб-приложение для хранения изображений, видео и музыки.

Технологии проекта: React, TypeScript, Vite, Material UI.

Для backend выбран Supabase. PostgreSQL-схема создаётся миграцией `supabase/migrations/20261015000001_create_media_storage_schema.sql`.

Frontend пока использует mock-данные. На этом этапе их не удалять.

## Task — Задача

Подготовь базовое подключение frontend к Supabase.

## Требования

1. Изучи структуру проекта, существующий `package.json`, `vite.config.ts` и `.gitignore`.
2. Установи `@supabase/supabase-js`, если пакет ещё не установлен.
3. Создай единый клиент Supabase в подходящем каталоге проекта, например `frontend/src/shared/api/supabaseClient.ts`. Сначала проверь существующую архитектуру и выбери соответствующий ей путь.
4. Используй переменные окружения:
   - `VITE_SUPABASE_URL`;
   - `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. Если в проекте используется стандартный `anon` key вместо publishable key, не ломай существующую конфигурацию: согласуй название переменной с фактическим способом подключения.
6. Добавь проверку наличия необходимых переменных окружения с понятным сообщением об ошибке.
7. Создай `.env.example` с пустыми или демонстрационными значениями, не содержащими настоящих секретов.
8. Проверь, что `.env.local` и другие файлы с реальными настройками исключены из Git.
9. Не добавляй `service_role`, secret key или другие привилегированные ключи во frontend.
10. Не изменяй страницы, бизнес-логику, модели, mock-данные и существующий UI.
11. Не создавай дополнительные серверы, Edge Functions или собственную REST API без необходимости.

## Проверка

- TypeScript не выдаёт ошибок.
- Проект собирается существующей командой сборки.
- Клиент Supabase создаётся с корректными переменными окружения.
- В коде нет реальных ключей.
- В конце перечисли изменённые файлы, выполненные проверки и оставшиеся действия вручную.

Сначала изучи проект, затем внеси минимальные изменения. Не переписывай существующую архитектуру.

# результат


Optimized tool selectionСначала быстро проверю текущую структуру проекта и конфигурацию Vite, чтобы подключить Supabase в том же стиле, а затем внесу минимальные изменения и прогоню сборку.

Read [](file:///home/alex/Project/MediaStorage/frontend/package.json)

Read [](file:///home/alex/Project/MediaStorage/frontend/src)

Read [](file:///home/alex/Project/MediaStorage/frontend/vite.config.ts)

Read [](file:///home/alex/Project/MediaStorage/frontend/.gitignore)

Read [](file:///home/alex/Project/MediaStorage)

Searched for files matching `MediaStorage` · `**/*.{env,example,local}`, no matches

No matches found. Your search pattern might be excluded completely by either the search.exclude settings or .*ignore files.
If you believe that it should have results, you can check into the .*ignore files and the exclude setting (here are some excluded patterns for reference:[**/node_modules,**/bower_components,**/*.code-search]).
Then if you want to include those files you can call the tool again by setting "includeIgnoredFiles" to true.

Структура уже понятна: проект использует Vite и не содержит отдельного Supabase клиента. Сейчас добавляю универсальный клиент в слой shared и закрываю переменные окружения от Git без затрагивания UI и данных.

Searched for files matching `MediaStorage` · `frontend/**/*vite-env*`, no matches

Read [](file:///home/alex/Project/MediaStorage/frontend)

Read [](file:///home/alex/Project/MediaStorage/frontend/tsconfig.app.json)

Created 3 todos

Read [](file:///home/alex/Project/MediaStorage/frontend/.env.local)

Read [](file:///home/alex/Project/MediaStorage/frontend/src)

Ran terminal command:  printf '\n## git status\n' && git status --short --ignored --untracked-files=all && printf '\n## tracked env files\n' && git ls-files --stage -- .env.local frontend/.env.local || true

Read [](file:///home/alex/.config/Code/User/workspaceStorage/d28a20476381b486eb61c0768c0ebda0/GitHub.copilot-chat/chat-session-resources/645f3ee5-c974-4e73-9afd-e314940ec601/call_aAQ6ASxzZvx93tiaalm6HTfx__vscode-1792082186982/content.txt#1-1), lines 1 to 220

Добавляю только необходимые точки интеграции: отдельный клиент Supabase, шаблон env-файла и явное исключение переменных окружения из Git. Никакие страницы и mock-данные не трогаются.

Replacing 7 lines with 10 lines in [](file:///home/alex/Project/MediaStorage/frontend/.gitignore)


```

```


Created [](file:///home/alex/Project/MediaStorage/frontend/src/shared/api/supabaseClient.ts)

Created [](file:///home/alex/Project/MediaStorage/frontend/.env.example)

Ran terminal command:  cd /home/alex/Project/MediaStorage/frontend && npm run build

Ran terminal command:  cd /home/alex/Project/MediaStorage && printf '\n### ignored env entries\n' && git check-ignore -v frontend/.env.local || echo 'not ignored' && printf '\n### status\n' && git status --short --ignored --untracked-files=all -- frontend/.env.local frontend/.env.example frontend/.gitignore frontend/src/shared/api/supabaseClient.ts

## ✅ Подключение Supabase подготовлено

Сделал минимальную и безопасную интеграцию: создал единый клиент Supabase в существующей архитектуре frontend, добавил проверку env-переменных и исключил реальные настройки из Git. Сами страницы, mock-данные, UI и бизнес-логика не затронуты.

### Что сделано
- В supabaseClient.ts создан единый клиент supabase через `createClient`.
- Поддерживаются переменные:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Добавлена явная проверка на отсутствие переменных с понятной ошибкой.
- Создан шаблон .env.example без реальных секретов.
- Обновлён .gitignore, чтобы исключать .env, `.env.*` и оставить только примерный файл.
- Реальный .env.local оставлен локальным; в Git он игнорируется.

---

## Изменённые файлы
- supabaseClient.ts
- .env.example
- .gitignore

> Пакет `@supabase/supabase-js` уже был установлен в проекте, поэтому дополнительно ставить его не потребовалось.

---

## Проверки
Проверил фактически:

1. Сборка проекта:
   - Команда: `cd /home/alex/Project/MediaStorage/frontend && npm run build`
   - Результат: успешная сборка, exit code 0.
   - В выводе есть строка: `✓ built in 2.26s`

2. Исключение секретов из Git:
   - Команда проверки: `git check-ignore -v frontend/.env.local`
   - Результат: `frontend/.gitignore:16:*.local  frontend/.env.local`
   - Это подтверждает, что реальный .env.local не попадает в Git.

---

## Оставшиеся действия вручную
1. Убедиться, что в локальном .env.local есть корректные значения:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
2. Если у проекта в Supabase используется не publishable key, а другой актуальный ключ по схеме подключения, заменить только переменную в .env.local и при необходимости согласовать это с фактическим клиентом. В текущем проекте уже используется шаблон с publishable key, поэтому изменения не ломают существующую конфигурацию.
3. При необходимости в дальнейшем подключать реальные запросы к данным можно будет использовать этот клиент без изменения UI и mock-логики.

Если хотите, следующим сообщением я могу сразу подготовить второй шаг — минимальный пример использования Supabase в одном из существующих экранов без изменения текущего поведения UI.

Made changes.