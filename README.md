# Nexus — Task Management System

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Shadcn-UI-black?style=for-the-badge" alt="Shadcn UI" />
  <img src="https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge" alt="PWA Ready" />
</p>

<p align="center">
  <b>Nexus</b> es un sistema avanzado de gestión de tareas con soporte offline, webhooks, temas personalizables y dashboard analítico.
</p>

---

## ✨ Características

### Core Features
- 📋 **Kanban Board** — Gestión visual de tareas con drag & drop
- ✏️ **CRUD Completo** — Crear, editar, eliminar tareas con validación
- 🔄 **Undo/Redo** — Historial de acciones con soporte para deshacer/rehacer
- 🔗 **Dependencias** — Sistema de dependencias entre tareas con detección de ciclos
- 👥 **Gestión de Agentes** — Sistema de agentes para asignación de tareas
- 📁 **Proyectos** — Organización de tareas por proyectos

### Features Avanzadas
- 🎨 **Temas Personalizables** — 6 temas predefinidos + color primario personalizable
- 🌙 **Modo Oscuro** — Soporte light/dark/system mode
- 📊 **Dashboard Analítico** — Métricas de productividad y rendimiento
- 🔗 **Webhooks** — Sistema de notificaciones para eventos de tareas
- 📤 **Exportar Datos** — Exportación a CSV y JSON con filtros
- 📱 **PWA / Modo Offline** — Funciona sin conexión con sincronización automática
- 🔌 **Integración API** — Hooks para integración con APIs externas

---

## 🚀 Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) |
| Lenguaje | [TypeScript 5](https://www.typescriptlang.org/) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Componentes | [Shadcn UI](https://ui.shadcn.com/) |
| Estado | React Hooks + localStorage |
| PWA | Service Worker + IndexedDB |
| Testing | Vitest + React Testing Library (Issue #29) |

---

## 📦 Instalación

### Requisitos
- Node.js 18+
- npm 9+ o pnpm 8+

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/thinkmonic-eng/nexus.git
   cd nexus
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

5. **Abrir en navegador**
   ```
   http://localhost:3000
   ```

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construir para producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar ESLint |
| `npm run test` | Ejecutar tests (Issue #29) |
| `npm run test:coverage` | Tests con cobertura |

---

## 📱 Uso

### Gestión de Tareas
1. Crear tareas con título, descripción, prioridad y etiquetas
2. Arrastrar y soltar entre columnas (To Do, In Progress, Done)
3. Editar tareas haciendo clic en ellas
4. Usar Undo/Redo (Ctrl+Z / Ctrl+Y) para deshacer cambios

### Dependencias
- Al editar una tarea, seleccionar dependencias del dropdown
- El sistema detecta automáticamente ciclos
- Las tareas bloqueadas se muestran con indicador visual

### Temas
- Ir a `/ui` y seleccionar "Personalizar Tema"
- Elegir entre 6 temas predefinidos o personalizar color primario
- El tema se guarda automáticamente en localStorage

### Webhooks
- Configurar endpoints para recibir notificaciones de eventos
- Soporta eventos: task.created, task.updated, task.deleted, etc.
- Ver logs de llamadas en el panel de webhooks

### Exportar Datos
- Ir a `/ui` y usar el panel "Exportar Datos"
- Seleccionar formato (CSV/JSON)
- Aplicar filtros por fecha, proyecto o estado
- Descargar archivo directamente

### Modo Offline
- La aplicación funciona sin conexión automáticamente
- Los cambios se sincronizan al recuperar conexión
- Indicador visual muestra estado online/offline

---

## 🏗️ Arquitectura

```
nexus/
├── app/                    # Next.js App Router
│   ├── (routes)/           # Rutas de la aplicación
│   ├── api/                # API Routes
│   └── layout.tsx          # Layout raíz con providers
├── components/             # Componentes React
│   ├── ui/                 # Componentes Shadcn UI
│   └── *.tsx               # Componentes de feature
├── lib/                    # Utilidades y lógica
│   ├── utils.ts            # Utilidades generales
│   ├── api.ts              # Cliente HTTP + hooks
│   ├── webhooks.ts         # Sistema de webhooks
│   ├── export.ts           # Exportación de datos
│   ├── themes.ts           # Sistema de temas
│   └── offline-storage.ts  # Almacenamiento offline
├── hooks/                  # Custom React hooks
├── public/                 # Assets estáticos
│   ├── sw.js              # Service Worker
│   └── manifest.json      # PWA manifest
└── types/                  # Tipos TypeScript
```

---

## 🤝 Contribución

1. Fork el repositorio
2. Crear rama: `git checkout -b feat/#<issue>-descripcion`
3. Commit cambios: `git commit -m "feat(#<issue>): descripcion"`
4. Push a la rama: `git push origin feat/#<issue>-descripcion`
5. Abrir Pull Request

### Guía de Commits
- `feat(#<issue>):` — Nueva feature
- `fix(#<issue>):` — Corrección de bug
- `docs(#<issue>):` — Documentación
- `refactor(#<issue>):` — Refactorización
- `test(#<issue>):` — Tests

---

## 📄 Licencia

MIT License — ver [LICENSE](LICENSE) para detalles.

---

## 👥 Equipo

- **@Prism** — Frontend Development
- **@Horizon** — UI/UX Advanced
- **@Lens** — Code Review & Testing
- **@Vigil** — QA
- **@Compass** — Coordination & Merge
- **@Karen** — Project Management

---

<p align="center">
  <sub>Built with ❤️ by the Nexus Team</sub>
</p>
