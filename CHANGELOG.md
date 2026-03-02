# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-02

### 🎉 Initial Release — Sprint 3 & 4 Complete

### ✨ Added — Sprint 3 (Foundation)

#### Core Features
- **#1** — Setup proyecto Next.js 16 + Tailwind CSS 4 + Shadcn UI
- **#2** — Componentes base (Button, Card, Input, Badge, etc.)
- **#3** — Dark mode y design system con CSS variables
- **#4** — Landing page con Hero section
- **#5** — Login básico con autenticación simulada
- **#6** — Layout responsive con sidebar y navbar
- **#7** — Kanban board con drag & drop

#### CRUD Features
- **#8** — Panel editar tarea con SlideOver
- **#9** — Sistema Undo/Redo con historial de acciones
- **#10** — Dependencias entre tareas con detección de ciclos (DFS)
- **#11** — CRUD Proyectos
- **#12** — Gestión de Agentes
- **#13** — Selector de Proyecto

### ✨ Added — Sprint 4 (Advanced Features)

#### Integrations & API
- **#14** — Integración con API externa
  - `useApi` hook para fetch con cache
  - `useApiMutation` hook para mutations
  - `ApiDashboardStats` componente
  - `ApiHealthCheck` componente
  - `TaskSyncButton` componente

#### Notifications & Webhooks
- **#15** — Sistema de Webhooks
  - CRUD de webhooks con localStorage
  - 8 eventos soportados (task.*, project.*)
  - UI para gestión de endpoints
  - Panel de logs con status y duración
  - Secret opcional para firma

#### Data Export
- **#16** — Exportar datos
  - Exportación a CSV (tareas y proyectos)
  - Exportación a JSON (backup completo)
  - Filtros por estado, proyecto y rango de fechas
  - Vista previa antes de exportar
  - Descarga directa de archivos

#### Dashboard & Analytics
- **#17** — Dashboard Analítico
  - Total de tareas
  - Tareas completadas
  - Tasa de finalización (%)
  - Distribución por prioridad
  - Distribución por estado
  - Tareas por proyecto
  - Gráficos de barras y progreso

#### Offline & PWA
- **#18** — Modo Offline/PWA
  - Service Worker para cacheo de assets
  - IndexedDB para almacenamiento local
  - Hook `useOnlineStatus` para detección de conexión
  - Componente `OfflineIndicator` con UI de alerta
  - Componente `SyncManager` para cola de sincronización
  - Auto-sync al recuperar conexión
  - PWA manifest completo

#### Theming
- **#19** — Sistema de Temas
  - 6 temas predefinidos (Default, Ocean, Forest, Sunset, Berry, Midnight)
  - Soporte light/dark/system modes
  - Selector de color primario personalizado (HEX)
  - Persistencia en localStorage
  - Aplicación dinámica con CSS variables
  - Componente `ThemeSelector` con UI completa

### 🔧 Technical

#### Architecture
- Next.js 16 App Router
- TypeScript 5 strict mode
- Tailwind CSS 4 with custom design tokens
- Shadcn UI component library
- React Hooks for state management
- localStorage for persistence

#### Code Quality
- ESLint + Prettier configurados
- TypeScript strict mode
- Componentes reutilizables
- Custom hooks desacoplados
- Utilidades centralizadas en `/lib`

#### Performance
- Static generation (SSG) para páginas
- Client-side data fetching con cache
- Debounced updates
- Optimistic UI updates
- IndexedDB para datos offline

### 📝 Documentation

- **README.md** — Documentación completa del proyecto
- **CHANGELOG.md** — Historial de cambios (este archivo)
- **Deployment Guide** — Instrucciones de despliegue

---

## [Unreleased]

### 🔮 Planned — Sprint 5

- **#20** — Documentación completa (README, CHANGELOG, Deployment)
- **#29** — Testing Infrastructure (Vitest + React Testing Library)
- Future features TBD

### 🚧 In Progress

- None

### 🐛 Known Issues

- None critical

---

## Contributors

- @Prism — Frontend Development
- @Horizon — UI/UX Advanced
- @Lens — Code Review & Testing
- @Vigil — QA
- @Compass — Coordination & Merge
- @Karen — Project Management

---

## Notes

### Semantic Versioning

- **MAJOR** — Breaking changes
- **MINOR** — New features (backward compatible)
- **PATCH** — Bug fixes (backward compatible)

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(#<issue>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
