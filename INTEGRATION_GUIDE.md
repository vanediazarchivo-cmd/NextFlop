# 🚀 NextFlop - Guía de Integración Frontend-Backend

## Estado Actual de la Integración

### ✅ Completado

1. **Servicios HTTP en Frontend**
   - `auth.service.ts` - Autenticación y usuarios
   - `profiles.service.ts` - Gestión de perfiles
   - `media.service.ts` - Catálogo de películas
   - `subscriptions.service.ts` - Planes y suscripciones
   - `billing.service.ts` - Pagos y facturación

2. **API Gateway (Kong)**
   - Configurado en `kong.yml`
   - Redirige todas las rutas `/api/*` a los microservicios correspondientes
   - CORS habilitado
   - Puerto: 8000

3. **Variables de Entorno**
   - Frontend: `.env.local` con `NEXT_PUBLIC_API_URL=http://localhost:8000`
   - Auth Service: `.env` con MongoDB, JWT, RabbitMQ
   - Media Service: `.env` con MongoDB, JWT
   - Subscriptions Service: `.env` con MongoDB, JWT
   - Billing Service: `.env` con MongoDB, JWT, Stripe

4. **Páginas Actualizadas**
   - `home/page.tsx` - Carga contenido real del backend
   - `profiles/page.tsx` - Carga perfiles reales del backend

### 📋 En Progreso

1. **Páginas que Necesitan Actualización**
   - `register/page.tsx` - Usar `subscriptionsService.getPlans()`
   - `plans/page.tsx` - Hacer server component o client component con hooks
   - `movies/page.tsx` - Usar `mediaService.getMovies()`
   - `shows/page.tsx` - Usar `mediaService.getSeries()`
   - `search/page.tsx` - Usar `mediaService.search()`
   - `favorites/page.tsx` - Usar `profilesService.getFavorites()`
   - `watch-later/page.tsx` - Usar `profilesService.getWatchLater()`
   - `settings/page.tsx` - Usar servicios de usuario
   - `points/page.tsx` - Usar `authService.getPoints()`

2. **Componentes que Necesitan Actualización**
   - Todos los componentes deben importar tipos reales en lugar de tipos mock

### 📊 Estructura de Rutas API

```
Kong (8000)
├── /api/auth/* → auth-service (3000)
│   ├── POST /register
│   ├── POST /login
│   ├── GET /me
│   ├── POST /add-points
│   └── GET /points
├── /api/profiles/* → auth-service (3000)
│   ├── GET / (mis perfiles)
│   ├── GET /:id
│   ├── POST / (crear)
│   ├── PATCH /:id (actualizar)
│   ├── DELETE /:id
│   ├── POST /:id/favorites (agregar a favoritos)
│   ├── DELETE /:id/favorites/:mediaId
│   ├── POST /:id/watch-later (agregar a ver más tarde)
│   ├── DELETE /:id/watch-later/:mediaId
│   └── POST /:id/history (agregar a historial)
├── /api/media/* → media-service (3000)
│   ├── GET / (listar)
│   ├── GET /search
│   ├── GET /recommended
│   ├── GET /trending
│   ├── GET /popular
│   ├── GET /acclaimed
│   ├── GET /new-releases
│   ├── GET /:id (detalles)
│   └── POST /:id/rate
├── /api/subscription-plans/* → subscriptions-service (3000)
│   ├── GET / (listar todos)
│   └── GET /:id
├── /api/subscriptions/* → subscriptions-service (3000)
│   ├── GET / (mis suscripciones)
│   ├── GET /current
│   ├── GET /:id
│   ├── POST / (crear)
│   ├── POST /:id/cancel
│   └── POST /:id/reactivate
├── /api/payments/* → billing-service (3000)
│   ├── GET /history
│   ├── GET /:id
│   ├── GET /status/:status
│   └── POST /process
├── /api/payment-methods/* → billing-service (3000)
│   ├── GET /
│   ├── POST /
│   └── DELETE /:id
└── /api/billing/* → billing-service (3000)
    ├── POST /redeem-points
    └── GET /points-exchange-rate
```

## 🔧 Cómo Ejecutar

### 1. Instalar dependencias

```bash
# Frontend
cd src/frontend && npm install

# Microservicios (en cada carpeta)
cd src/microservices/auth-service && npm install
cd src/microservices/media-service && npm install
cd src/microservices/subscriptions-service && npm install
cd src/microservices/billing-service && npm install
```

### 2. Ejecutar con Docker Compose

```bash
# Desde la raíz del proyecto
docker compose up --build -d

# Esperar a que todos los servicios se levanten (aproximadamente 30-60 segundos)

# Verificar logs
docker compose logs -f
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Kong API Gateway**: http://localhost:8000
- **Kong Admin Panel**: http://localhost:8001
- **RabbitMQ**: http://localhost:15672 (admin:password123)

## 🧪 Verificación de Conectividad

### Probar endpoints de prueba

```bash
# Obtener todos los planes
curl http://localhost:8000/api/subscription-plans

# Obtener medios
curl http://localhost:8000/api/media

# Registrar nuevo usuario
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","fullName":"Test User"}'

# Iniciar sesión
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

## 📝 Próximos Pasos

1. **Actualizar todas las páginas** para consumir servicios reales
2. **Poblar base de datos** con datos de seed (ver `seed/seed-tmdb.ts`)
3. **Implementar manejo de errores** en servicios HTTP
4. **Agregar loading states** en todas las páginas
5. **Implementar persistencia de token** en localStorage
6. **Crear middleware de autenticación** en las rutas protegidas
7. **Implementar gestión de estado global** (Zustand, Redux, etc.)
8. **Pruebas E2E** con Cypress o Playwright

## 🔐 Notas de Seguridad

- JWT_SECRET debe ser cambiado en producción
- STRIPE_SECRET_KEY debe ser protegido
- CORS debe ser restringido en producción (no usar "*")
- Todas las credenciales de BD deben ser cambiadas en producción
- Implementar rate limiting en Kong

## 📂 Estructura de Proyectos

```
NextFlop/
├── src/
│   ├── frontend/               # Next.js con UI
│   │   ├── app/               # Páginas del app
│   │   ├── components/        # Componentes reutilizables
│   │   ├── services/          # Servicios HTTP (NEW)
│   │   └── .env.local         # Variables de entorno (NEW)
│   └── microservices/
│       ├── auth-service/      # Autenticación
│       ├── media-service/     # Catálogo
│       ├── subscriptions-service/  # Planes y suscripciones
│       └── billing-service/   # Pagos
├── docker-compose.yml         # Orquestación de servicios
├── kong.yml                   # Configuración API Gateway
└── README.md
```

## 🐛 Troubleshooting

**Problema**: Kong no conecta con los servicios
- **Solución**: Verificar que los nombres de servicio en Kong coincidan con los en docker-compose

**Problema**: Frontend no puede conectar a Kong
- **Solución**: Verificar `NEXT_PUBLIC_API_URL` en `.env.local`

**Problema**: Errores de CORS
- **Solución**: Verificar configuración de CORS en kong.yml

**Problema**: MongoDB no se conecta
- **Solución**: Verificar formato de `MONGODB_URI` y credenciales en .env

---

**Última actualización**: 30 de noviembre de 2025
