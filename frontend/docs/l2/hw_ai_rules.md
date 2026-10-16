Сначала быстро соберу подтверждённые факты по структуре, зависимостям и запуску, а затем сформирую итоговый анализ без изменений в коде.

Read [](file:///home/alex/Project/MediaTagger)

Read [](file:///home/alex/Project/MediaTagger/tsconfig.json)

Read [](file:///home/alex/Project/MediaTagger/package.json)

Read [](file:///home/alex/Project/MediaTagger/README.md)

Read [](file:///home/alex/Project/MediaTagger/electron.vite.config.ts)

Searched for regex `window\.api|ipcMain|ipcRenderer|contextBridge|createWindow|BrowserWindow|tags.json|getImageWithGroup|getGroupsByImage|addImageInGroup|deleteImg|saveTags` (`**/src/**`), 123 results

Read [](file:///home/alex/Project/MediaTagger/src/main/index.ts#1-1), lines 1 to 240

Read [](file:///home/alex/Project/MediaTagger/src/preload/index.ts)

Read [](file:///home/alex/Project/MediaTagger/src/renderer/src/App.tsx)

Read [](file:///home/alex/Project/MediaTagger/eslint.config.mjs)

Searched for regex `describe\(|it\(|test\(|vitest|jest|playwright|cypress` (`**/src/**`), 98 results

Read [](file:///home/alex/Project/MediaTagger/src)

Read [](file:///home/alex/Project/MediaTagger/src/preload/types.ts)

Read [](file:///home/alex/Project/MediaTagger/src/main/GaleryStore.ts#1-1), lines 1 to 260

Read [](file:///home/alex/Project/MediaTagger/src/renderer/src/components)

Read [](file:///home/alex/Project/MediaTagger/.prettierrc.yaml)

Read [](file:///home/alex/Project/MediaTagger/.editorconfig)

Read [](file:///home/alex/Project/MediaTagger/src/renderer/src/components/GalleryWithGroup.tsx)

Read [](file:///home/alex/Project/MediaTagger/src/renderer/src/components/Groups.tsx#1-1), lines 1 to 220

Read [](file:///home/alex/Project/MediaTagger/src/main/types.ts)

## Краткое описание проекта

MediaTagger — это десктопное приложение на Electron + React + TypeScript для каталогизации и просмотра изображений по тегам. По описанию в README.md и коду в index.ts оно позволяет загружать изображения, назначать им теги, фильтровать и искать по ним, переименовывать/удалять изображения, распределять их по группам и хранить метаданные в локальных файлах.

Основные пользовательские возможности, подтверждённые исходниками:
- просмотр галереи и навигация по изображениям;
- добавление, удаление и редактирование тегов;
- поиск по имени/тегам;
- группировка изображений;
- переименование и удаление изображений;
- синхронизация данных с файловой системой;
- работа через локальные JSON-файлы для хранения тегов и групп.

Источники: README.md, index.ts, GaleryStore.ts, index.ts.

---

## Технологический стек

По package.json проект использует:

- Язык: TypeScript
- UI: React 19
- Десктоп: Electron 38
- Сборка/рантайм: electron-vite, Vite 7
- UI-библиотека: MUI (Material UI)
- Дополнительно:
  - @hello-pangea/dnd для drag-and-drop;
  - @emotion/react и @emotion/styled для стилизации;
  - electron-builder для сборки и packaging;
  - eslint, prettier.

Подтверждающие файлы:
- package.json
- electron.vite.config.ts
- eslint.config.mjs
- .prettierrc.yaml
- .editorconfig

---

## Структура проекта

Согласно структуре папок и файлам:

- main — основной процесс Electron
- preload — безопасный preload-мост и типы API
- renderer — React UI
- package.json — скрипты запуска и зависимости
- electron.vite.config.ts — конфиг сборки electron-vite
- tsconfig.json, tsconfig.node.json, tsconfig.web.json — типизация и сборка
- README.md — описание продукта и установки
- dev-app-update.yml, electron-builder.yml — настройка автоплея и сборки

Ключевые файлы:
- index.ts — главный процесс, меню, IPC-обработчики, выбор папки данных
- GaleryStore.ts — центральное хранилище изображений, тегов и групп
- types.ts — типы данных модели
- index.ts — экспозиция API в renderer
- App.tsx — корневой компонент интерфейса
- components — экранные компоненты галереи, групп, диалогов, превью

---

## Архитектура

Архитектура соответствует типичной Electron + React схеме:

1. Основной процесс
   - Создаёт окно браузера и меню.
   - Управляет рабочей папкой пользователя.
   - Работа с файловой системой и JSON-метаданными.
   - Отвечает на IPC-вызовы из renderer через preload.
   - См. index.ts.

2. Preload слой
   - Экспонирует API в window.api.
   - Используется как безопасный мост между renderer и main.
   - См. index.ts, index.d.ts.

3. Renderer
   - React-приложение, MUI-компоненты, галереи и диалоги.
   - Читает/обновляет состояние через window.api.
   - Основные рабочие экраны: галерея, группы, теги, диалог изображения.
   - См. App.tsx, GalleryWithGroup.tsx, Groups.tsx.

4. Хранилище данных
   - Класс GalleryStore собирает метаданные, индексы тегов, группы и связи между изображениями.
   - Хранит данные в локальных JSON-файлах, определяемых через userDataPath, configPath, tagsPath, groupPath.
   - См. index.ts, GaleryStore.ts, types.ts.

5. Взаимодействие
   - Renderer вызывает методы типа window.api.loadImage, getGroup, saveTags и т.д.
   - Main процесс обрабатывает IPC в index.ts.
   - Данные для UI формируются в GalleryStore и возвращаются в виде объектов (Image, ImagesWithGroup, GroupData и др.).
   - Наблюдение за обновлениями идёт через события tags-updated и navigate.

---

## Стиль кода

В проекте принят довольно строгий, но не полностью единообразный стиль:

- TypeScript с явной типизацией данных.
- Используется 2 пробела в отступах, как задано в .editorconfig.
- ESLint настроен с правилами import/order, react-hooks, react-refresh, отключен prop-types для TS.
- Prettier настроен на singleQuote: true, semi: false, printWidth: 100.
- См. .prettierrc.yaml, eslint.config.mjs.

Подтверждённые правила именования:
- camelCase для переменных, функций, параметров;
- PascalCase для React-компонентов;
- имя файлов часто соответствует роли компонента, например: GalleryWithGroup.tsx, Groups.tsx, ImageDialog.tsx;
- IPC-поля и API-методы в стиле saveTags, getGroup, renameGroup, loadImageWithGroup.

Есть и исключения:
- В коде встречаются несовместимые/неоднородные стили форматирования и кейсы, например, имя файла GaleryStore.ts с опечаткой “Galery” при классe GalleryStore;
- В некоторых местах есть прямые console.log и более “тестовый” код, что стоит учитывать при автоматических изменениях. Источник: GaleryStore.ts, App.tsx, GalleryWithGroup.tsx.

---

## Запуск и тестирование

Запуск и сборка определены в package.json:

- dev: electron-vite dev
- start: electron-vite preview
- build: npm run typecheck && electron-vite build
- lint: eslint --cache .
- typecheck: npm run typecheck:node && npm run typecheck:web
- build:win, build:mac, build:linux — сборка под платформы

Подтверждённые команды:
```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

Что важно:
- Для проектного анализа не обнаружено явной тестовой инфраструктуры: нет секции scripts test, no vitest/jest/cypress/playwright в package.json, и поиском по исходникам не найдено явных unit/integration тестов внутри src.
- Поэтому утверждение про “тесты” должно быть осторожным: test suite не подтверждён.

---

## Технические ограничения

По исходникам можно выделить несколько важных рисков и ограничений:

1. Нет явного “серверного” слоя или базы данных
   - Данные хранятся в JSON-файлах в пользовательской папке, а не в БД.
   - Это логично для локального десктопного редактора, но ограничивает масштабируемость.
   - Источник: index.ts, GaleryStore.ts.

2. Сильная зависимость от локальной файловой структуры
   - Все данные привязаны к userDataPath, tags.json, sequences.json, imagesPath.
   - Приложение не является полностью переносимым между разными окружениями без корректной подготовки директорий.
   - Источник: index.ts.

3. Есть признаки не полностью завершённой/дублирующей логики
   - В index.ts есть метод mergeDuplicatePaths, который выглядит как обработчик события, но по сигнатуре он похож на duplicate registration of onTagsUpdated;
   - В App.tsx есть console.log, а в ряде компонентов тоже.
   - Это не обязательно ошибка, но указывает на черновую стадию или отладочный код.

4. Нет явной валидации пользовательских данных во многих местах
   - Например, в диалогах редактирования тегов и групп есть прямые вызовы API без дополнительной валидации входов.
   - Это можно считать риском для работы с пустыми/невалидными строками и дубликатами.
   - Источники: ImageDialogWithGroup.tsx, Groups.tsx.

5. Нет подтверждённого тестового покрытия
   - Это главный риск для регрессий.
   - Нет явных тестовых файлов или runner-а в проекте.
   - Подтверждение: package.json, результаты поиска по src.

---

## Рекомендации для системных правил AI

Чтобы AI-агент не нарушал архитектуру проекта, стоит задать следующие правила:

- Не менять структуру Electron-архитектуры: main / preload / renderer должны сохраняться, а IPC-обращения должны проходить через bridge.
  - Источник: index.ts, index.ts

- Не заменять GalleryStore на другой паттерн хранения без явной необходимости.
  - Storage and metadata logic is centralized in GaleryStore.ts

- Поддерживать существующую схему данных: JSON-файлы tags.json, sequences.json, config.json и типы из types.ts.

- Сохранять MUI-подход и React-компонентную модель UI.
  - Источник: components

- Не добавлять новый тестовый framework без явной необходимости; сначала проверить, есть ли существующий контракт и scripts.
  - Источник: package.json

- Не смешивать UI-логику и главную бизнес-логику: обработка файлов и метаданных должна оставаться в main / GalleryStore, а UI — в renderer.
  - Источник: GaleryStore.ts, App.tsx

- При изменениях учитывать локальный характер хранения и отсутствие серверной инфраструктуры.
  - Источник: README.md, index.ts

- Не ломать соглашения ESLint/Prettier: two-space indent, no semicolons, import order.
  - Источник: .editorconfig, .prettierrc.yaml, eslint.config.mjs

---

## Краткая таблица

| Параметр | Установленное значение | Файл-источник | Уверенность |
|---|---|---|---|
| Назначение проекта | Десктопный менеджер изображений с тегами и группировкой | README.md, index.ts | Высокая |
| Язык | TypeScript | package.json, tsconfig.json | Высокая |
| UI-фреймворк | React 19 | package.json | Высокая |
| Десктопный движок | Electron | package.json | Высокая |
| UI-библиотека | MUI | package.json, App.tsx | Высокая |
| Сборка | electron-vite + Vite | package.json, electron.vite.config.ts | Высокая |
| Основной процесс | Electron main process | index.ts | Высокая |
| Preload bridge | window.api | index.ts | Высокая |
| Хранилище данных | GalleryStore + JSON files | GaleryStore.ts, index.ts | Высокая |
| Правила форматирования | 2 spaces, no semicolons, 100 chars | .editorconfig, .prettierrc.yaml | Высокая |
| Наличие тестов | Не подтверждено | package.json | Средняя |
| Основной риск | Нет явного automated test coverage; heavy local file dependence | package.json, index.ts | Высокая |

Если нужно, могу следующим сообщением подготовить отдельный набор “системных правил для AI-агента” в формате, готовом к вставке в AGENTS.md или .instructions.md, без внесения изменений в проект.