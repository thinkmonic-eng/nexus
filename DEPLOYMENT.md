# Deployment Guide

Guía completa para desplegar Nexus en diferentes entornos.

---

## 📋 Requisitos Previos

### Sistema
- Node.js 18.x o superior
- npm 9.x+ o pnpm 8.x+
- Git

### Variables de Entorno

Crear archivo `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.tudominio.com

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_WEBHOOKS=true
NEXT_PUBLIC_ENABLE_OFFLINE=true
```

---

## 🚀 Opciones de Deploy

### Opción 1: Vercel (Recomendado)

La forma más rápida y sencilla de desplegar Next.js.

#### Paso 1: Preparar Repositorio

```bash
# Asegurar que todo está committeado
git add .
git commit -m "chore: prepare for deployment"
git push origin develop
```

#### Paso 2: Importar a Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Importar repositorio de GitHub
4. Configurar:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (o `projects/nexus` si monorepo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Paso 3: Variables de Entorno

En el dashboard de Vercel:
1. Ir a Settings > Environment Variables
2. Agregar las variables del `.env.local`

#### Paso 4: Deploy

```bash
# Deploy automático con git push
git push origin main

# O deploy manual
vercel --prod
```

### Opción 2: Netlify

#### Paso 1: Build Configuration

Crear `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Paso 2: Deploy

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Opción 3: Servidor Propio (VPS/Dedicado)

#### Requisitos del Servidor

- Ubuntu 22.04 LTS (recomendado)
- Nginx o Apache
- PM2 para procesos Node.js
- SSL Certificate (Let's Encrypt)

#### Paso 1: Preparar Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y
```

#### Paso 2: Clonar y Build

```bash
# Crear directorio
mkdir -p /var/www/nexus
cd /var/www/nexus

# Clonar repositorio
git clone https://github.com/thinkmonic-eng/nexus.git .

# Instalar dependencias
npm install

# Build
npm run build
```

#### Paso 3: Configurar PM2

Crear `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'nexus',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/nexus',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/nexus/err.log',
      out_file: '/var/log/nexus/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

Iniciar:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Paso 4: Configurar Nginx

Crear `/etc/nginx/sites-available/nexus`:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Habilitar:

```bash
sudo ln -s /etc/nginx/sites-available/nexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Paso 5: SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

---

## 🔧 Configuración Post-Deploy

### 1. Verificar Build

```bash
# Logs de PM2
pm2 logs nexus

# Estado
pm2 status

# Restart si es necesario
pm2 restart nexus
```

### 2. Health Checks

Verificar endpoints:

```bash
# Página principal
curl -I https://tudominio.com

# API (si aplica)
curl https://tudominio.com/api/health

# Manifest PWA
curl https://tudominio.com/manifest.json
```

### 3. Optimización

#### Enable Compression

En `next.config.js`:

```javascript
const nextConfig = {
  compress: true,
  // ... otras configs
};

module.exports = nextConfig;
```

#### Image Optimization

Asegurar dominios en `next.config.js`:

```javascript
images: {
  domains: ['tudominio.com', 'cdn.tudominio.com'],
},
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
      
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Build Failures

**Error: "Cannot find module"**
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
```

**Error: "TypeScript compilation failed"**
```bash
# Verificar tipos
npx tsc --noEmit
```

### Runtime Issues

**Error: "window is not defined"**
- Asegurar que el código cliente-only esté en `useEffect` o componentes con `"use client"`

**Error: "localStorage is not defined"**
- Verificar que las funciones de storage manejen SSR:
```typescript
if (typeof window === 'undefined') return defaultValue;
```

### Performance Issues

**LCP (Largest Contentful Paint) alto**
- Usar `next/image` para optimización automática
- Implementar lazy loading
- Preload recursos críticos

**Bundle size grande**
```bash
# Analizar bundle
npm run analyze
```

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# Dashboard
pm2 monit

# Logs
pm2 logs

# Metrics
pm2 show nexus
```

### Vercel Analytics

Habilitar en `vercel.json`:

```json
{
  "analytics": true
}
```

### Custom Monitoring

Agregar a `pages/_app.tsx`:

```typescript
useEffect(() => {
  // Report Web Vitals
  const reportWebVitals = (metric) => {
    console.log(metric);
    // Enviar a analytics service
  };
  
  if ('web-vitals' in window) {
    window.webVitals.getCLS(reportWebVitals);
    window.webVitals.getFID(reportWebVitals);
    window.webVitals.getFCP(reportWebVitals);
    window.webVitals.getLCP(reportWebVitals);
    window.webVitals.getTTFB(reportWebVitals);
  }
}, []);
```

---

## 🔄 Rollback

### Vercel

```bash
# Listar deployments
vercel --version

# Rollback a versión anterior
vercel --rollback
```

### VPS

```bash
# Usar git para rollback
cd /var/www/nexus
git log --oneline -10
git revert HEAD
npm run build
pm2 restart nexus
```

---

## 📞 Support

Si encuentras problemas:

1. Revisar logs: `pm2 logs` o Vercel Dashboard
2. Verificar variables de entorno
3. Probar build local: `npm run build`
4. Crear issue en GitHub con:
   - Descripción del problema
   - Logs de error
   - Entorno (OS, Node version, etc.)

---

## ✅ Deployment Checklist

- [ ] Variables de entorno configuradas
- [ ] Build exitoso (`npm run build`)
- [ ] Tests pasan (`npm run test`)
- [ ] Health checks funcionan
- [ ] SSL configurado (producción)
- [ ] PWA manifest accesible
- [ ] Service Worker registrado
- [ ] Analytics habilitado
- [ ] Monitoreo configurado
- [ ] Documentación actualizada

---

**Happy deploying! 🚀**
