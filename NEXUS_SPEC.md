# Nexus - Sistema de Gestión de Tareas

## 📋 Documento de Especificaciones Técnicas

> **Versión:** 1.0  
> **Fecha:** 2026-02-28  
> **Proyecto:** Rediseño Completo Nexus  
> **Propósito:** Specs detalladas para implementación

---

# 1. Visión General del Producto

## 1.1 Descripción

Nexus es un dashboard de gestión de tareas orientado a equipos de engineering que trabajan con agentes AI autónomos. El sistema permite gestionar proyectos, tareas, y visualizar el trabajo de múltiples agentes en un Kanban visual.

## 1.2 Usuarios Objetivo

- Desarrolladores
- Engineering Managers
- Product Owners
- Equipos que utilizan agentes AI para automatización de tareas

## 1.3 Tech Stack (objetivo)

- **Frontend:** Next.js + React (versiones a fijar cuando se cree el repo)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (o equivalente, definir al crear repo)
- **Estado:** React Query o SWR (elegir una)
- **Drag & Drop:** @dnd-kit (preferido)
- **Formularios:** React Hook Form + Zod
- **Markdown:** react-markdown
- **Fechas:** date-fns
- **Animaciones:** Framer Motion (opcional)

> Regla: el `package.json` del repo es la fuente de verdad. Este bloque se ajusta cuando el repo se cree.

---

# 1.4 Alcance y MVP

## MVP (v1)
- Kanban básico por proyecto.
- CRUD de tareas.
- Estados y prioridades.
- Asignación a agentes.
- Filtros simples (estado, prioridad, agente).

## v2+
- Métricas y analytics.
- Integraciones (Discord/OpenClaw).
- Automatizaciones.

---

# 2. Diseño del Sistema

## 2.1 Theme & Colores

```css
/* Dark Mode (default) */
--bg-primary: #0a0a0b        /* Main background */
--bg-secondary: #141416      /* Cards, panels */
--bg-tertiary: #1c1c1f       /* Elevated surfaces */
--bg-hover: #232327          /* Hover states */

--text-primary: #fafafa      /* Main text */
--text-secondary: #a1a1aa    /* Secondary text */
--text-muted: #71717a        /* Muted/placeholder */

--accent-primary: #6366f1    /* Indigo - main accent */
--accent-hover: #818cf8      /* Indigo hover */
--accent-muted: #4f46e5      /* Indigo pressed */

--border: #27272a            /* Default borders */
--border-focus: #6366f1      /* Focus rings */

/* Status Colors */
--status-success: #22c55e    /* Green */
--status-warning: #eab308    /* Yellow */
--status-error: #ef4444      /* Red */
--status-info: #3b82f6       /* Blue */

/* Priority Colors */
--priority-p0: #ef4444       /* Critical - Red */
--priority-p1: #f97316       /* High - Orange */
--priority-p2: #6b7280       /* Medium - Gray */
--priority-p3: #52525b       /* Low - Dark Gray */
```

## 2.2 Tipografía

- **Font Family:** Inter, Geist Sans, SF Pro (sans-serif)
- **Monospace:** JetBrains Mono (para código)
- **Heading XL:** 24px / 600
- **Heading LG:** 20px / 600
- **Heading MD:** 16px / 600
- **Body:** 14px / 400
- **Body Small:** 12px / 400
- **Caption:** 11px / 400

## 2.3 Spacing System

- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px

## 2.4 Border Radius

- **sm:** 4px (buttons small)
- **md:** 6px (inputs)
- **lg:** 8px (cards)
- **xl:** 12px (modals)
- **full:** 9999px (pills, avatars)

## 2.5 Breakpoints

- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

---

# 3. Componentes UI Base

## 3.1 Button

```
Variantes:
- primary: bg accent, text white
- secondary: bg tertiary, text primary
- ghost: transparent, text secondary, hover bg-hover
- danger: bg error, text white

Props:
- variant: 'primary' | 'secondary' | 'ghost' | 'danger'
- size: 'sm' (32px) | 'md' (40px) | 'lg' (48px)
- disabled: boolean
- loading: boolean
- icon: ReactNode (left)
- iconRight: ReactNode (right)
```

## 3.2 Input

```
Props:
- type: 'text' | 'email' | 'password' | 'number' | 'date'
- placeholder: string
- value: string
- error: string (validation message)
- disabled: boolean
- label: string
- icon: ReactNode (left)
- rightElement: ReactNode
```

## 3.3 Select / Dropdown

```
Props:
- options: { value: string, label: string, icon?: ReactNode }[]
- value: string | string[]
- multi: boolean
- searchable: boolean
- placeholder: string
- error: string
- disabled: boolean
```

## 3.4 Modal

```
Props:
- open: boolean
- onOpenChange: (open: boolean) => void
- title: string
- description?: string
- children: ReactNode
- footer?: ReactNode
- size?: 'sm' (400px) | 'md' (480px) | 'lg' (560px) | 'xl' (720px)
- closeOnOverlayClick: boolean
- closeOnEscape: boolean

Behavior:
- Body scroll lock al abrir
- Focus trap dentro del modal
- Backdrop click cierra (configurable)
```

## 3.5 Slide-over (Drawer)

```
Props:
- open: boolean
- onOpenChange: (open: boolean) => void
- title: string
- children: ReactNode
- footer?: ReactNode
- side: 'right' | 'left'
- width: string | number (default: 480px)

Animation:
- Slide from side (200ms ease-out)
- Backdrop fade in
```

## 3.6 Card

```
Props:
- children: ReactNode

---

# 4. Modelo de Datos (base)

## Entidades
- **Project**: id, name, description, status
- **Task**: id, projectId, title, description, status, priority, assigneeId, tags, createdAt, updatedAt
- **Agent**: id, name, role
- **Comment**: id, taskId, authorId, text, createdAt
- **Activity**: id, taskId, actorId, action, payload, createdAt

## Estados (default)
- `backlog`, `todo`, `in-progress`, `review`, `qa`, `done`

## Prioridades
- `p0`, `p1`, `p2`, `p3`

---

# 5. Flujos y Reglas de Negocio

- Una tarea solo pasa a `done` con **Lens approve** + **Vigil QA**.
- QA solo valida en el entorno de feature (`localhost:4000`) por defecto.
- Regresión si algo falla en el entorno estable (`localhost:3000`).

---

# 6. Persistencia

## Modo local (v1)
- Persistencia mínima (localStorage/JSON).
- Sin backend obligatorio en MVP.

## Con backend (v2)
- API REST/GraphQL con auth.
- Base de datos (PostgreSQL).

---

# 7. Integraciones (v2)

- OpenClaw (estado de agentes).
- Discord (notificaciones).

---

# 8. QA Local

- `localhost:3000` = estable local (develop).
- `localhost:4000` = QA de feature.
- Si un proyecto usa otros puertos, se define en su `SPEC.md`.

---

# 9. Flujos de Usuario (MVP)

## Kanban
- Ver proyectos.
- Entrar a un proyecto y ver su Kanban.
- Crear tarea.
- Editar tarea.
- Mover tarea entre columnas.
- Filtrar por estado, prioridad, agente.
- Buscar por texto.

## Tarea
- Ver detalles.
- Añadir comentarios.
- Cambiar estado/prioridad/asignado.

---

# 10. Reglas de Negocio (MVP)

- Estados permitidos: `backlog` → `todo` → `in-progress` → `review` → `qa` → `done`.
- Transiciones solo hacia adelante (salvo `review` → `in-progress` si hay cambios).
- `done` requiere aprobación de Lens y QA de Vigil.
- `priority` debe ser uno de `p0|p1|p2|p3`.
- `assignee` debe ser un agente existente.

---

# 11. Persistencia (MVP)

- Almacenamiento local (localStorage) con export/import JSON.
- Sin backend obligatorio.
- Estructura de datos versionada (campo `schemaVersion`).

## Capa de persistencia (adaptable)

### Objetivo
Definir un **dominio estable** y permitir múltiples backends sin reescribir el core.

### Interfaces (repositorios)
- `ProjectStore`: `list`, `get`, `create`, `update`, `delete`
- `TaskStore`: `listByProject`, `get`, `create`, `update`, `move`, `delete`
- `CommentStore`: `listByTask`, `create`, `delete`
- `ActivityStore`: `listByTask`, `create`

### Drivers soportados
- **LocalStorage/JSON** (default MVP).
- **Firestore** (document store).
- **PostgreSQL** (relacional).

### Reglas comunes
- IDs UUIDv4.
- `createdAt` / `updatedAt` en ISO 8601.
- Soft delete opcional (`deletedAt`).
- `schemaVersion` obligatorio para migraciones.

### Migraciones
- Cada cambio de schema incrementa `schemaVersion`.
- Migradores por versión, ejecutados al cargar.

### Esquema de ejemplo (JSON)
```json
{
  "schemaVersion": 1,
  "projects": [
    {
      "id": "uuid",
      "name": "Nexus",
      "description": "Proyecto principal",
      "status": "active",
      "createdAt": "2026-03-01T00:00:00Z",
      "updatedAt": "2026-03-01T00:00:00Z"
    }
  ],
  "tasks": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "title": "Implementar Kanban",
      "description": "Vista principal",
      "status": "todo",
      "priority": "p1",
      "assigneeId": "agent-id",
      "tags": ["ui", "kanban"],
      "createdAt": "2026-03-01T00:00:00Z",
      "updatedAt": "2026-03-01T00:00:00Z"
    }
  ],
  "comments": [
    {
      "id": "uuid",
      "taskId": "uuid",
      "authorId": "agent-id",
      "text": "Primera version",
      "createdAt": "2026-03-01T00:00:00Z"
    }
  ],
  "activities": [
    {
      "id": "uuid",
      "taskId": "uuid",
      "actorId": "agent-id",
      "action": "status_change",
      "payload": { "from": "todo", "to": "in-progress" },
      "createdAt": "2026-03-01T00:00:00Z"
    }
  ]
}
```

### Esquema de ejemplo (PostgreSQL)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  assignee_id TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE comments (
  id UUID PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id),
  author_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE activities (
  id UUID PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id),
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL
);
```

### Esquema de ejemplo (Firestore)
- `projects/{projectId}`
- `tasks/{taskId}` con `projectId`
- `comments/{commentId}` con `taskId`
- `activities/{activityId}` con `taskId`

---

# 12. Pantallas (MVP)

- `/` Home (lista de proyectos).
- `/project/:id` Kanban del proyecto.
- `/project/:id/task/:taskId` Detalle de tarea (modal o panel).

---

# 13. Arquitectura Frontend (MVP)

- Rutas App Router (Next).
- Estado global: elegir una (React Query o Zustand) y documentarla aquí.
- Componentes base reutilizables según sección 3.

---

# 14. Criterios de Aceptación (MVP)

## Kanban
- Crear tarea y verla en `backlog`.
- Mover tarea a `todo`, `in-progress`, `review`, `qa`, `done`.
- Persistencia local tras recarga.

## Tareas
- Editar título/descripción.
- Asignar agente.
- Cambiar prioridad.

---

# 15. QA Local (checklist)

- `dev:stable` y `dev:qa` levantan sin errores.
- Kanban renderiza con datos de ejemplo.
- CRUD de tareas funciona en `localhost:4000`.
- Persistencia local funciona tras refresh.
- padding?: 'none' | 'sm' | 'md' | 'lg'
- hoverable: boolean
- clickable: boolean

Styles:
- bg: bg-secondary
- border: 1px solid border
- radius: lg (8px)
- hover: translateY(-2px), shadow increase
```

## 3.7 Badge / Pill

```
Variantes:
- default: bg-tertiary, text-secondary
- success: bg-success/20, text-success
- warning: bg-warning/20, text-warning
- error: bg-error/20, text-error
- info: bg-info/20, text-info
- priority-p0 through p3

Props:
- variant: string
- size: 'sm' | 'md'
- dot: boolean (small indicator dot)
```

## 3.8 Avatar

```
Props:
- src?: string
- name: string (fallback: initials)
- size: 'xs' (24px) | 'sm' (32px) | 'md' (40px) | 'lg' (48px) | 'xl' (64px)
- status?: 'online' | 'idle' | 'offline'
```

## 3.9 Checkbox / Checklist

```
Props:
- checked: boolean
- onChange: (checked: boolean) => void
- label: string
- disabled: boolean
- removable: boolean (show X button)
- onRemove: () => void
```

## 3.10 Date Picker

```
Props:
- value: Date | null
- onChange: (date: Date) => void
- placeholder: string
- minDate?: Date
- maxDate?: Date
- disabled: boolean

Features:
- Calendar dropdown
- Quick selects: Today, Tomorrow, Next Week
- Manual input allowed
```

---

# 4. Pantallas

---

## 4.1 Kanban Board

### Descripción
Pantalla principal del sistema. Tablero Kanban visual con drag & drop de tareas entre columnas.

### Estructura Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ TOP BAR (56px height)                                          │
│ ┌─────────┬───────────────────────────┬───────┬────────┬──────┐ │
│ │  Logo   │  Search (cmd+K)  │Project │  + New │ Notif │ User │ │
│ └─────────┴───────────────────────────┴───────┴────────┴──────┘ │
├────────┬────────────────────────────────────────────────────────┤
│SIDEBAR │  KANBAN AREA (horizontal scroll)                       │
│(240px) │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│        │  │INTAKE  │ │  SPEC  │ │ READY  │ │ IN PR │ │ DONE │ │
│Projects│  │ (12)   │ │  (5)   │ │  (8)   │ │ (3)   │ │ (24) │ │
│Tasks   │  │        │ │        │ │        │ │       │ │      │ │
│Settings│  │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐ │ │ ┌────┐│ │
│        │  │ │Card│ │ │ │Card│ │ │ │Card│ │ │ │Card│ │ │ │Card││ │
│        │  │ └────┘ │ │ └────┘ │ │ └────┘ │ │ └────┘ │ │ └────┘│ │
│        │  │ ┌────┐ │ │        │ │ ┌────┐ │ │        │ │ ┌────┐│ │
│        │  │ │Card│ │ │        │ │ │Card│ │ │        │ │ │Card││ │
│        │  │ └────┘ │ │        │ │ └────┘ │ │        │ │ └────┘│ │
│        │  └────────┘ └────────┘ └────────┘ └────────┘ └──────┘ │
└────────┴────────────────────────────────────────────────────────┘
```

### Componentes

#### Sidebar
- **Width:** 240px (expandida) / 64px (colapsada)
- **Logo:** 32px icon + "Nexus" text
- **Nav Items:** Icon + Label, hover bg-hover, active accent border-left
- **Secciones:** Projects, Tasks, Settings
- **User:** Avatar + Name + Dropdown (abajo)

#### Top Bar
- **Height:** 56px
- **Search:** Input con cmd+K hint, expande a modal (command palette)
- **Project Selector:** Dropdown con lista de proyectos + color
- **New Task Button:** Primary button, acciona modal crear tarea
- **Notifications:** Bell icon con badge count
- **User:** Avatar dropdown con profile/logout

#### Columnas Kanban
- **Cantidad:** 6 columnas
- **Columnas:** INTAKE, SPEC, READY, IN_PROGRESS, DONE, BLOCKED
- **Width:** 280px cada una
- **Header:** 
  - Nombre (bold, 14px)
  - Count badge (bg-tertiary, 12px)
  - "+" button (hover revela)
- **Scroll:** Vertical interno
- **Drop Zone:** Línea azul cuando se arrastra sobre

#### Task Card
- **Width:** 100% (fill column)
- **Padding:** 12px
- **Margin-bottom:** 8px
- **Contenido:**
  ```
  ┌─────────────────────────────┐
  │ Title (max 2 lines)     [P] │ ← Priority badge (top-right)
  │ ─────────────────────────── │
  │ [tag1] [tag2]               │ ← Tags (small pills)
  │ ─────────────────────────── │
  │ [avatar] 📅 Due Date        │ ← Assignee + Due
  └─────────────────────────────┘
  ```
- **Prioridad Badge:** Color según nivel (P0=red, P1=orange, P2=gray, P3=muted)
- **Tags:** Max 3 visibles, "+N" si más
- **Assignee:** Avatar 24px + nombre (truncate)
- **Due Date:** Icon + text, rojo si overdue
- **Hover:** translateY(-2px), border accent glow
- **Dragging:** rotate(3deg), shadow-xl

### Funcionalidades

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| Drag & Drop | Mover tareas entre columnas | MUST |
| Quick Add | Click "+" en columna para crear tarea rápida | SHOULD |
| Card Click | Abre Task Detail Panel | MUST |
| Context Menu | Right-click para acciones (delete, duplicate) | COULD |
| Column Collapse | Colapsar columnas no usadas | COULD |
| Keyboard Nav | Arrow keys para mover cards | WONT |

### Casos Edge

- **Columna vacía:** Mostrar illustration + "No tasks"
- **Título muy largo:** Truncate con "..." + tooltip al hover
- **Many cards:** Scroll interno, virtualización si >50 cards
- **Drag cancel:** Escape o drop fuera de columns возвращает card
- **Concurrently editing:** Optimistic updates con rollback

### Criterios de Aceptación

- [ ] Sidebar muestra navegación correcta
- [ ] Top bar con search, project selector, new task, notifications, user
- [ ] 6 columnas visibles con scroll horizontal si no caben
- [ ] Cards muestran título, prioridad, tags, assignee, due date
- [ ] Drag & drop funciona entre todas las columnas
- [ ] Hover en card muestra efectos visuales
- [ ] Click en card abre Task Detail Panel
- [ ] "+" en columna crea tarea en esa columna
- [ ] Empty states mostrados cuando corresponde

---

## 4.2 Crear Tarea (Modal)

### Descripción
Modal para crear una nueva tarea con todos los parámetros.

### Estructura

```
┌────────────────────────────────────────┐
│  ✕ New Task                           │
├────────────────────────────────────────┤
│                                        │
│  Title *                              │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Description                          │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │                                  │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌────────────┐  ┌────────────────┐    │
│  │ Priority   │  │    Assignee    │    │
│  │  (dropdown)│  │   (dropdown)   │    │
│  └────────────┘  └────────────────┘    │
│                                        │
│  ┌────────────┐  ┌────────────────┐    │
│  │  Due Date  │  │    Project     │    │
│  │  (picker)  │  │   (dropdown)   │    │
│  └────────────┘  └────────────────┘    │
│                                        │
│  Tags                                 │
│  ┌──────────────────────────────────┐  │
│  │ [tag1 ×] [tag2 ×] [+ Add]       │  │
│  └──────────────────────────────────┘  │
│                                        │
├────────────────────────────────────────┤
│  Cancel              Create Task      │
└────────────────────────────────────────┘
```

### Campos del Formulario

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| Título | text | Sí | Min 1 char, max 200 |
| Descripción | textarea | No | Max 5000 chars |
| Prioridad | select | No | Default: P2 |
| Assignee | select (searchable) | No | |
| Due Date | date picker | No | |
| Project | select | No | Default: proyecto actual |
| Tags | multi-select | No | Max 10 |

### Comportamiento

- **Open:** New Task button o Cmd+N
- **Focus:** Auto-focus en título
- **Submit:** Cmd+Enter o click button
- **Validation:** Inline errors en rojo
- **Loading:** Button muestra spinner
- **Success:** Close modal, toast "Task created", agregar card al Kanban
- **Close:** X button, Escape, click outside

### Criterios de Aceptación

- [ ] Modal abre con animación
- [ ] Título es requerido, muestra error si vacío
- [ ] Prioridad dropdown con opciones P0-P3
- [ ] Assignee dropdown con search y avatars
- [ ] Due Date date picker funcional
- [ ] Project dropdown (si hay proyectos)
- [ ] Tags permite agregar/eliminar
- [ ] Cmd+Enter hace submit
- [ ] Success muestra toast y cierra modal
- [ ] Kanban actualiza con nueva tarea

---

## 4.3 Eliminar Tarea

### Descripción
Flujo para eliminar una tarea con confirmación.

### Flujo

1. **Trigger:** Botón delete en Task Detail Panel
2. **Confirm Modal:**
   ```
   ┌─────────────────────────────────┐
   │  ⚠️  Delete Task?              │
   │                                 │
   │  This will permanently delete   │
   │  "Task Title".                  │
   │                                 │
   │  This action cannot be undone.  │
   │                                 │
   │  ┌───────────────────────────┐  │
   │  │ type "delete" to confirm   │  │
   │  └───────────────────────────┘  │
   │                                 │
   │  Cancel    Delete Task          │
   └─────────────────────────────────┘
   ```
3. **Success:** Toast "Task deleted", card se remove con animación

### Opciones de Diseño

| Opción | Descripción | Complejidad |
|--------|-------------|-------------|
| A | Botón en Task Detail → Confirm modal | Simple |
| B | Hover en card → Menu → Delete → Confirm | Medium |
| C | Keyboard (Delete key) → Confirm | Medium |

### Criterios de Aceptación

- [ ] Delete button visible en Task Detail
- [ ] Confirmation modal previene accidental delete
- [ ] Input "delete" requerido para confirmar
- [ ] Success muestra toast
- [ ] Card se remove del Kanban con animación
- [ ] Undo disponible en toast (5 seg)

---

## 4.4 Editar Tarea (Task Detail Panel)

### Descripción
Slide-over desde la derecha para ver y editar todos los detalles de una tarea.

### Estructura

```
┌────────────────────────────────────────────────────┐
│  INTAKE (dropdown)              ✕  🗑️  ⋯        │ ← Header
├────────────────────────────────────────────────────┤
│                                                    │
│  Task Title Here                                   │ ← Editable
│  ───────────────────────────────────────────────  │
│                                                    │
│  Description                                       │
│  ┌────────────────────────────────────────────┐   │
│  │ Markdown textarea with preview toggle      │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐    │
│  │ Priority │ │Assignee │ │   Due Date     │    │
│  │ (dropdown)│ │(dropdown)│ │  (date picker) │    │
│  └──────────┘ └──────────┘ └────────────────┘    │
│                                                    │
│  Tags                                              │
│  [P0] [frontend] [bug] [×] [+ Add]               │
│                                                    │
│  ▼ Task Contract (collapsible)                    │
│    ┌─────────────────────────────────────────┐    │
│    │ Goal                                     │    │
│    │ [textarea]                               │    │
│    │                                          │    │
│    │ Deliverables                            │    │
│    │ ☐ Deliverable 1                   [×]  │    │
│    │ ☐ Deliverable 2                   [×]  │    │
│    │ [+ Add deliverable]                      │    │
│    │                                          │    │
│    │ Acceptance Criteria                      │    │
│    │ ☐ Criterion 1                      [×]  │    │
│    │ [+ Add criterion]                        │    │
│    └─────────────────────────────────────────┘    │
│                                                    │
│  ▼ Execution (collapsible)                        │
│    Repo:     [input____________] [🔗]            │
│    PR:       [input____________] [🔗]            │
│    CI:       [badge: pending/running/success/fail]│
│    QA:       [badge: pending/passed/failed]       │
│                                                    │
│  ▼ Activity (collapsible)                         │
│    • Created by John 2 days ago                   │
│    • Moved to IN_PROGRESS by Agent-X              │
│    • Updated description by Jane                  │
│                                                    │
├────────────────────────────────────────────────────┤
│  Created 2 days ago            Cancel  Save      │ ← Footer
└────────────────────────────────────────────────────┘
```

### Campos Editables

| Campo | Tipo UI | Notas |
|-------|---------|-------|
| Título | Input inline | Click to edit, Enter to save |
| Descripción | Textarea | Markdown support |
| Prioridad | Select | P0-P3 |
| Assignee | Select searchable | Con avatars |
| Due Date | Date picker | |
| Tags | Multi-select + create | |
| Status | Select dropdown | Cambia columna en Kanban |
| Goal | Textarea | |
| Deliverables | Checklist | Add/remove/check items |
| Acceptance Criteria | Checklist | |
| Repo | Input | |
| PR | Input | Auto-convert to link |
| CI Status | Badge | Read-only o editable |
| QA Result | Badge | Read-only o editable |

### Collapsibles (Acordeones)

1. **Task Contract** (default: expanded)
2. **Execution** (default: collapsed)
3. **Activity** (default: collapsed)

### Comportamiento

- **Open:** Click en task card
- **Close:** X button, Escape, click outside
- **Unsaved Changes:** Toast warning al cerrar
- **Auto-save:** Opcional, con debounce 1s
- **Save:** Cmd+Enter o click button

### Criterios de Aceptación

- [ ] Slide-in desde derecha (480px)
- [ ] Todos los campos editables
- [ ] Markdown preview en descripción
- [ ] Checklist permite add/remove/check
- [ ] Unsaved changes warning
- [ ] Status change actualiza Kanban
- [ ] Activity log muestra historial
- [ ] Footer con Cancel/Save
- [ ] Animación suave

---

## 4.5 Dashboard Info de Tareas

### Descripción
Vista agregada con métricas, filtros y tabla de tareas.

### Estructura

```
┌─────────────────────────────────────────────────────────────────┐
│ TOP BAR (same as Kanban)                                       │
├─────────────────────────────────────────────────────────────────┤
│ FILTERS BAR                                                     │
│ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐ │
│ │ 🔍 Search│ │ Project│ │Priority│ │Assignee│ │ Due: This w│ │
│ └──────────┘ └────────┘ └────────┘ └────────┘ └────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ SUMMARY CARDS                                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │Total Task│ │In Progress│ │Completed │ │ Blocked  │          │
│ │   142    │ │    12    │ │   89     │ │    3    │          │
│ │  +12% ▲  │ │  +2 ▲    │ │  +24% ▲  │ │  ⚠️     │          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├─────────────────────────────────────────────────────────────────┤
│ CHARTS                                                          │
│ ┌────────────────────────┐ ┌────────────────────────┐         │
│ │   Tasks by Status     │ │   Tasks by Priority    │         │
│ │   [DONUT CHART]       │ │   [BAR CHART]          │         │
│ └────────────────────────┘ └────────────────────────┘         │
│ ┌─────────────────────────────────────────────┐                │
│ │         Tasks Over Time (30 days)           │                │
│ │              [LINE CHART]                   │                │
│ └─────────────────────────────────────────────┘                │
├─────────────────────────────────────────────────────────────────┤
│ TABLE                                                           │
│ ┌────┬────────────┬─────────┬────────┬──────────┬──────────┐  │
│ │ ☐  │ Title      │ Project │ Pri    │ Assignee │ Due Date │  │
│ ├────┼────────────┼─────────┼────────┼──────────┼──────────┤  │
│ │ ☐  │ Task 1     │ Proj A  │ [P0]   │ @jane    │ Mar 15   │  │
│ │ ☐  │ Task 2     │ Proj B  │ [P1]   │ @john    │ Mar 20   │  │
│ └────┴────────────┴─────────┴────────┴──────────┴──────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Showing 1-20 of 142    [< 1 2 ... 8 >]    📥 Export        │
└─────────────────────────────────────────────────────────────────┘
```

### Summary Cards

| Card | Datos | Variante |
|------|-------|----------|
| Total Tasks | Count + % change vs last period | Default |
| In Progress | Count + trend | Default |
| Completed This Week | Count + % of goal | Success si >80% |
| Blocked | Count + alert si >0 | Warning si >0 |

### Filtros

| Filtro | Tipo | Opciones |
|--------|------|----------|
| Search | text | Buscar en título |
| Project | multi-select | Todos los proyectos |
| Priority | multi-select | P0, P1, P2, P3 |
| Assignee | multi-select | Todos los usuarios |
| Status | multi-select | Todas las columnas |
| Due Date | preset | All, Today, This Week, This Month, Overdue |

### Tabla

| Columna | Sortable | Width |
|---------|----------|-------|
| Checkbox | No | 40px |
| Title | Yes | flex |
| Project | Yes | 120px |
| Priority | Yes | 80px |
| Assignee | Yes | 120px |
| Due Date | Yes | 100px |
| Status | Yes | 120px |

- **Row click:** Abre Task Detail
- **Checkbox:** Para bulk actions
- **Pagination:** 20 items por página

### Charts

1. **Tasks by Status** (Donut)
   - Distribución por columna
   - Colors: uno por status

2. **Tasks by Priority** (Bar)
   - Horizontal bars
   - P0, P1, P2, P3

3. **Tasks Over Time** (Line/Area)
   - 30 días
   - Daily completions

### Criterios de Aceptación

- [ ] Filtros funcionan y actualizan vista
- [ ] Summary cards muestran datos correctos
- [ ] Charts renderizan correctamente
- [ ] Tabla con datos de tareas
- [ ] Sort por todas las columnas
- [ ] Pagination funciona
- [ ] Export CSV descarga archivo
- [ ] Click en row abre Task Detail
- [ ] Empty state si no hay resultados

---

## 4.6 Crear Proyecto

### Descripción
Modal para crear un nuevo proyecto.

### Estructura

```
┌────────────────────────────────────────┐
│  ✕ New Project                        │
├────────────────────────────────────────┤
│                                        │
│  Project Name *                        │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Description                          │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Color                                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌┐  │
│  │● │ │● │ │● │ │● │ │● │ │● │ │● │││  │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│  #ef44 #f973 #eab3 #22c5 #3b82 #8b5f #ec48│
│                                        │
│  ┌────────────┐  ┌────────────────┐    │
│  │Start Date │  │  Target Date   │    │
│  │ (picker)  │  │   (picker)     │    │
│  └────────────┘  └────────────────┘    │
│                                        │
│  Members                               │
│  ┌──────────────────────────────────┐  │
│  │ [avatar A] [avatar B] [+ Add]   │  │
│  └──────────────────────────────────┘  │
│                                        │
├────────────────────────────────────────┤
│  Cancel              Create Project   │
└────────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| Nombre | text | Sí | Min 1, max 100 |
| Descripción | textarea | No | Max 500 |
| Color | color picker | No | Default: random o #6366f1 |
| Fecha inicio | date | No | |
| Fecha objetivo | date | No | |
| Miembros | multi-select | No | Searchable con avatars |

### Color Picker

- **Presets:** 8 colores en grid
- **Custom:** Input hex adicional

### Criterios de Aceptación

- [ ] Modal con todos los campos
- [ ] Nombre requerido
- [ ] Color picker con preview
- [ ] Date pickers funcionan
- [ ] Members searchable
- [ ] Success cierra modal y actualiza sidebar
- [ ] Toast "Project created"

---

## 4.7 Cambiar de Proyecto

### Descripción
Selector para cambiar entre proyectos.

### Diseño Principal: Dropdown (Top Bar)

```
┌─────────────────────────────┐
│ Project: [Nexus v2     ▼]  │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ 🔍 Search projects...       │
├─────────────────────────────┤
│ ✓ Nexus v2 (42)            │
│   Frontend (12)            │
│   Backend (8)              │
│   Mobile (5)               │
├─────────────────────────────┤
│   + Create New Project     │
└─────────────────────────────┘
```

### Alternativa: Command Palette (cmd+K)

- Press cmd+K → Modal con proyectos
- Search para filtrar
- Enter para seleccionar

### Comportamiento

- **Cambio de proyecto:** Kanban filtra tareas por proyecto
- **"All Projects":** Muestra todas las tareas
- **Nueva tarea:** Se crea en proyecto seleccionado

### Criterios de Aceptación

- [ ] Selector visible en top bar
- [ ] Muestra proyecto actual
- [ ] Lista todos los proyectos con color y count
- [ ] Search filtra proyectos
- [ ] Click selecciona y cierra dropdown
- [ ] Kanban actualiza al cambiar
- [ ] "All Projects" es opción válida

---

## 4.8 Editar Proyecto

### Descripción
Panel para editar detalles de un proyecto.

### Estructura

```
┌─────────────────────────────────────┐
│  Edit Project                 ✕     │
├─────────────────────────────────────┤
│                                     │
│  Project Name                       │
│  ┌─────────────────────────────┐   │
│  │ Nexus v2                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Description                        │
│  ┌─────────────────────────────┐   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Color                              │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐     │
│  │● │ │● │ │● │ │● │ │● │ │● │     │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘     │
│                                     │
│  ┌────────────┐ ┌───────────────┐   │
│  │Start Date  │ │  Target Date │   │
│  │ (picker)   │ │   (picker)   │   │
│  └────────────┘ └───────────────┘   │
│                                     │
│  Members                            │
│  ┌─────────────────────────────┐   │
│  │ [avatar A] [avatar B] [×]  │   │
│  │ [+ Add member]             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Status                             │
│  ┌─────────────────────────────┐   │
│  │ (•) Active  ( ) Archived   │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  Delete Project        Cancel Save  │
└─────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Notas |
|-------|------|-------|
| Nombre | text | Editable |
| Descripción | textarea | Editable |
| Color | color picker | Cambiable |
| Fecha inicio | date | Editable |
| Fecha objetivo | date | Editable |
| Miembros | multi-select | Add/remove |
| Estado | radio | Active / Archived |

### Delete Project

- **Botón:** "Delete Project" (danger, abajo izquierda)
- **Confirm Modal:**
  ```
  ┌─────────────────────────────────┐
  │  Delete Project?                │
  │                                 │
  │  What to do with 42 tasks?     │
  │                                 │
  │  ( ) Delete all tasks          │
  │  (•) Move to another project   │
  │         [dropdown: select]      │
  │                                 │
  │  Cancel      Delete Project    │
  └─────────────────────────────────┘
  ```

### Criterios de Aceptación

- [ ] Slide-over o modal abre
- [ ] Todos los campos editables
- [ ] Color change muestra preview
- [ ] Members add/remove funciona
- [ ] Archive oculta proyecto del Kanban
- [ ] Delete con opciones para tareas
- [ ] Success toast y cierra panel

---

# 5. Estructura de Datos

## 5.1 Task

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  projectId?: string;
  dueDate?: string; // ISO date
  tags: string[];
  
  // Task Contract
  goal?: string;
  deliverables: ChecklistItem[];
  acceptanceCriteria: ChecklistItem[];
  
  // Execution
  repo?: string;
  pr?: string;
  ciStatus?: CIStatus;
  qaResult?: QAResult;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

type TaskStatus = 
  | 'INTAKE' 
  | 'SPEC' 
  | 'READY' 
  | 'IN_PROGRESS' 
  | 'PR_OPEN' 
  | 'QA' 
  | 'CHANGES_REQUESTED' 
  | 'APPROVED' 
  | 'MERGED' 
  | 'DONE' 
  | 'BLOCKED';

type Priority = 'P0' | 'P1' | 'P2' | 'P3';

type CIStatus = 'pending' | 'running' | 'success' | 'failed';

type QAResult = 'pending' | 'passed' | 'failed';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}
```

## 5.2 Project

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  color: string; // hex
  startDate?: string;
  targetDate?: string;
  memberIds: string[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

## 5.3 User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

---

# 6. APIs

## 6.1 Tasks

```
GET    /api/tasks              → List tasks (with filters)
POST   /api/tasks              → Create task
GET    /api/tasks/:id          → Get task
PATCH  /api/tasks/:id          → Update task
DELETE /api/tasks/:id          → Delete task
PATCH  /api/tasks/:id/status   → Update task status (for drag & drop)
```

##
## 6.2 Projects

```
GET    /api/projects           → List projects
POST   /api/projects           → Create project
GET    /api/projects/:id       → Get project
PATCH  /api/projects/:id       → Update project
DELETE /api/projects/:id       → Delete project
```

---

# 7. Flujos de Usuario

## 7.1 Crear Tarea

```
1. User click "New Task" button
2. Modal opens with focus on title
3. User fills required fields
4. User clicks "Create Task" or Cmd+Enter
5. API creates task
6. Modal closes
7. Toast shows "Task created"
8. Kanban updates with new card
```

## 7.2 Mover Tarea (Drag & Drop)

```
1. User starts dragging card
2. Card lifts with shadow
3. User hovers over target column
4. Drop zone highlights
5. User drops card
6. Optimistic UI update (card moves)
7. API updates task status
8. If error, rollback with toast
```

## 7.3 Editar Tarea

```
1. User clicks on task card
2. Slide-over opens from right
3. User edits fields inline
4. User clicks "Save" or Cmd+Enter
5. API updates task
6. Slide-over closes
7. Kanban card updates
8. Toast shows "Task updated"
```

## 7.4 Eliminar Tarea

```
1. User opens task detail
2. User clicks delete icon
3. Confirmation modal appears
4. User types "delete"
5. User clicks "Delete Task"
6. API deletes task
7. Modal closes
8. Card removes from Kanban with animation
9. Toast shows "Task deleted" with Undo option
```

## 7.5 Gestionar Proyectos

```
1. User clicks project selector in top bar
2. Dropdown shows all projects
3. User selects different project
4. Kanban filters to that project
5. All tasks update to show only project's tasks

To create: Click "+ Create New Project" in dropdown
To edit: Right-click project in sidebar → "Edit Project"
```

---

# 8. Casos Edge

## 8.1 Tareas

| Caso | Manejo |
|------|--------|
| Título vacío | Validation error, prevent submit |
| Drag cancel | Return card to original position |
| Delete while editing | Confirm dialog, then close panel |
| Status change via API fail | Rollback UI, show error toast |
| Very long description | Scroll, max 5000 chars |
| Many tags (>10) | Show "+N more" |
| Due date past | Show in red, sort to top |
| Assignee deleted | Show "Unassigned" |

## 8.2 Proyectos

| Caso | Manejo |
|------|--------|
| Delete project with tasks | Ask: delete tasks or move |
| Archive project | Hide from dropdown, keep data |
| Duplicate name | Allow (no unique constraint) |
| No projects | Show "Create first project" CTA |

## 8.3 UI

| Caso | Manejo |
|------|--------|
| No tasks in column | Show empty state illustration |
| Network error | Show error toast, retry button |
| Slow loading | Show skeleton loaders |
| Mobile view | Stack columns vertically |

---

# 9. Checklist de Implementación

## 9.1 Setup

- [ ] Next.js project initialized
- [ ] Tailwind CSS configured
- [ ] Shadcn UI installed
- [ ] Theme (dark mode) applied
- [ ] Router configured

## 9.2 Componentes Base

- [ ] Button variants
- [ ] Input / Textarea
- [ ] Select / Dropdown
- [ ] Modal
- [ ] Slide-over (Drawer)
- [ ] Card
- [ ] Badge / Pill
- [ ] Avatar
- [ ] Checkbox
- [ ] Date Picker

## 9.3 Kanban Board

- [ ] Layout (Sidebar + Top Bar + Kanban)
- [ ] 6 Columns with headers
- [ ] Task Card component
- [ ] Drag & drop implementation
- [ ] Empty states
- [ ] Quick add task

## 4.2 Crear Tarea

- [ ] Modal component
- [ ] Form with all fields
- [ ] Validation
- [ ] Submit handler
- [ ] Success feedback

## 4.3 Eliminar Tarea

- [ ] Delete button in task detail
- [ ] Confirmation modal
- [ ] Delete handler
- [ ] Undo toast

## 4.4 Editar Tarea

- [ ] Slide-over component
- [ ] All editable fields
- [ ] Markdown support
- [ ] Checklist components
- [ ] Save handler
- [ ] Unsaved changes warning

## 4.5 Dashboard

- [ ] Summary cards
- [ ] Filters
- [ ] Table with pagination
- [ ] Charts (3 types)
- [ ] Export functionality

## 4.6-4.8 Proyectos

- [ ] Create Project modal
- [ ] Project selector dropdown
- [ ] Edit Project panel
- [ ] Delete with task handling

---

# 10. Définitions de "Done"

Una tarea se considera completa cuando:

1. **Código implementado** según specs
2. **Tests unitarios** pasan (si aplica)
3. **Tests visuales** pasan (creenshot comparison)
4. **Responsive** funciona en mobile/tablet/desktop
5. **Dark mode** se ve bien
6. **Keyboard navigation** funciona
7. **Edge cases** manejados
8. **Code review** aprobado

---

# 11. Notas Adicionales

## 11.1 Performance

- Use virtualization para tablas >100 rows
- Lazy load modals/slide-overs
- Debounce search inputs (300ms)
- Cache API responses con React Query

## 11.2 Accesibilidad

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast WCAG AA

## 11.3 Responsive Breakpoints

- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640-1024px): 2-3 columns
- **Desktop** (> 1024px): Full 6 columns

---

*Documento generado: 2026-02-28*
*Para uso interno - Nexus Redesign*
