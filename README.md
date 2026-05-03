# RS School React 2026Q2 — Task 1: Class Components

Поиск персонажей по [Rick and Morty API](https://rickandmortyapi.com/) на React-классовых компонентах.

## Стек

- React 19 (class components)
- TypeScript (strict)
- Vite
- Vitest + React Testing Library
- ESLint + Prettier

## Запуск

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview      # http://localhost:4173
```

## Скрипты

| Команда | Назначение |
|---|---|
| `npm run dev` | дев-сервер |
| `npm run build` | продакшн-сборка |
| `npm run preview` | превью продакшн-сборки |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint с автофиксом |
| `npm run format` | Prettier |
| `npm test` | Vitest one-shot |
| `npm run test:watch` | Vitest watch |
| `npm run test:coverage` | покрытие |

## Что внутри

- **Search** — классовый компонент с input + кнопкой; сохраняет последний запрос в `localStorage`.
- **CardList / Card** — рендер списка персонажей.
- **Loader** — индикатор загрузки.
- **ErrorBoundary** — ловит ошибки рендера, **ErrorTrigger** — кнопка для проверки.
- **api/rickandmorty.ts** — обёртка над публичным API с типизированной ошибкой.

## Структура

```
src/
  api/         # клиент к Rick and Morty API
  components/  # UI-компоненты
  types/       # общие TS-типы
  utils/       # localStorage helper
  App.tsx      # корневой компонент
  main.tsx     # точка входа
```
