# Nexus

Plataforma de colaboración inteligente para equipos distribuidos.

## 🚀 Setup

### Requisitos
- Node.js 18+
- npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/thinkmonic-eng/nexus.git
cd nexus

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con Turbopack |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint |

## 📁 Estructura del proyecto

```
nexus/
├── src/
│   ├── app/          # App Router de Next.js
│   ├── components/   # Componentes React
│   │   └── ui/       # Componentes de Shadcn UI
│   └── lib/          # Utilidades y helpers
├── types/            # Tipos TypeScript globales
├── public/           # Archivos estáticos
├── components.json   # Configuración de Shadcn UI
└── README.md
```

## 🎨 Tecnologías

- **Framework:** [Next.js](https://nextjs.org/) 16+
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## 📄 Licencia

MIT
