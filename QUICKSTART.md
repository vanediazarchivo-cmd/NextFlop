# 🎬 NextFlop - Streaming Platform (Frontend + Backend Integrado)

## 📌 Resumen Ejecutivo

NextFlop es una **plataforma de streaming tipo Netflix** con arquitectura de microservicios y sin mock data. Todo el contenido viene en tiempo real desde el backend.

### ✨ Características Principales

- ✅ **Frontend Moderno**: Next.js con TypeScript y Tailwind CSS
- ✅ **Arquitectura Microservicios**: 4 servicios NestJS independientes
- ✅ **API Gateway**: Kong para unificar todas las rutas
- ✅ **Base de Datos**: MongoDB para cada servicio
- ✅ **Clean Architecture**: Separation of concerns en todo el proyecto
- ✅ **Zero Mock Data**: 100% datos reales del backend
- ✅ **Autenticación JWT**: Tokens seguros
- ✅ **Sistema de Puntos**: Gana puntos con suscripciones
- ✅ **Pagos**: Integración con Stripe
- ✅ **Todo Dockerizado**: `docker compose up` y listo

## 🚀 Inicio Rápido

### Requisitos
- Docker y Docker Compose
- Node.js 18+ (si deseas ejecutar sin Docker)

### Opción 1: Docker Compose (Recomendado) ⚡

```bash
# 1. Ir a la raíz del proyecto
cd /workspaces/NextFlop

# 2. Levantar todos los servicios
docker compose up --build -d

# 3. Esperar 30-60 segundos a que se levanten todos
# 4. Acceder al sitio
# Frontend: http://localhost:3000
# API: http://localhost:8000
```

### Opción 2: Ejecución Manual

```bash
# Frontend
cd src/frontend && npm install && npm run dev  # localhost:3000

# Auth Service
cd src/microservices/auth-service && npm install && npm run start  # localhost:3001

# Media Service
cd src/microservices/media-service && npm install && npm run start  # localhost:3004

# Subscriptions Service
cd src/microservices/subscriptions-service && npm install && npm run start  # localhost:3002

# Billing Service
cd src/microservices/billing-service && npm install && npm run start  # localhost:3003

# Kong (previamente instalado)
# Requiere configuración especial, mejor usar Docker
```

## 📊 Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│ localhost:3000  │
└────────┬────────┘
         │
    HTTP │
   /api/* │
         │
┌────────▼────────┐
│  API Gateway    │
│  (Kong)         │
│ localhost:8000  │
└────────┬────────┘
         │
    ┌────┼────┬────┬────┐
    │    │    │    │    │
┌───▼─┐  │    │    │    │
│Auth │  │    │    │    │
│ JWT │  │    │    │    │
│3001 │  │    │    │    │
└───┬─┘  │    │    │    │
    │ ┌──▼──┐ │    │    │
    │ │ Sub │ │    │    │
    │ │3002 │ │    │    │
    │ └──┬──┘ │    │    │
    │    │ ┌──▼──┐ │    │
    │    │ │Bill │ │    │
    │    │ │3003 │ │    │
    │    │ └──┬──┘ │    │
    │    │    │┌───▼──┐ │
    │    │    ││Media │ │
    │    │    ││3004  │ │
    │    │    │└──┬───┘ │
    │    │    │   │     │
    │    │    │ ┌─▼──┐  │
    └────┼────┴─┤  DBs ├─┘
         │      └────┘
    ┌────▼────┐
    │ RabbitMQ │
    │(Messaging)
    └──────────┘
```

## 📂 Estructura del Proyecto

```
NextFlop/
├── src/
│   ├── frontend/                    # Next.js App
│   │   ├── app/                    # Páginas (home, movies, profiles, etc.)
│   │   ├── components/             # Componentes React
│   │   ├── services/               # 🆕 Servicios HTTP (auth, media, etc.)
│   │   ├── .env.local              # 🆕 Variables de entorno
│   │   └── package.json
│   │
│   └── microservices/
│       ├── auth-service/           # Usuarios, autenticación, perfiles
│       │   └── .env                # 🆕 Variables de entorno
│       ├── media-service/          # Catálogo de películas
│       │   └── .env                # 🆕 Variables de entorno
│       ├── subscriptions-service/  # Planes y suscripciones
│       │   └── .env                # 🆕 Variables de entorno
│       └── billing-service/        # Pagos y facturación
│           └── .env                # 🆕 Variables de entorno
│
├── docker-compose.yml              # Orquestación de servicios
├── kong.yml                        # Configuración API Gateway
├── INTEGRATION_GUIDE.md            # 🆕 Guía de integración
├── CHECKLIST.md                    # 🆕 Checklist de tareas
└── README.md                       # Este archivo
```

## 🔗 Rutas API Disponibles

### Autenticación
```
POST   /api/auth/register          # Registrar nuevo usuario
POST   /api/auth/login             # Iniciar sesión
GET    /api/auth/me                # Obtener usuario actual
POST   /api/auth/add-points        # Agregar puntos
GET    /api/auth/points            # Obtener saldo de puntos
```

### Perfiles
```
GET    /api/profiles               # Obtener mis perfiles
GET    /api/profiles/:id           # Obtener perfil
POST   /api/profiles               # Crear perfil
PATCH  /api/profiles/:id           # Actualizar perfil
DELETE /api/profiles/:id           # Eliminar perfil
POST   /api/profiles/:id/favorites # Agregar a favoritos
DELETE /api/profiles/:id/favorites/:mediaId
POST   /api/profiles/:id/watch-later # Agregar a ver más tarde
```

### Medios (Películas/Series)
```
GET    /api/media                  # Listar todos
GET    /api/media/recommended      # Recomendados
GET    /api/media/trending         # En tendencia
GET    /api/media/popular          # Populares
GET    /api/media/acclaimed        # Aclamadas
GET    /api/media/new-releases     # Nuevos lanzamientos
GET    /api/media/search           # Búsqueda
GET    /api/media/:id              # Detalles
POST   /api/media/:id/rate         # Calificar
```

### Planes y Suscripciones
```
GET    /api/subscription-plans     # Obtener planes
POST   /api/subscriptions          # Crear suscripción
GET    /api/subscriptions/current  # Suscripción actual
GET    /api/subscriptions/:id      # Suscripción por ID
POST   /api/subscriptions/:id/cancel
```

### Pagos
```
POST   /api/payments/process       # Procesar pago
GET    /api/payments/history       # Historial de pagos
POST   /api/billing/redeem-points  # Canjear puntos
```

## 🧪 Pruebas Rápidas

### Verificar que todo está en línea

```bash
# Kong está respondiendo
curl http://localhost:8000

# Obtener planes de suscripción
curl http://localhost:8000/api/subscription-plans

# Obtener películas
curl http://localhost:8000/api/media | jq

# Registrar usuario de prueba
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!@",
    "fullName":"Test User"
  }'
```

## 📚 Información de Conexión

### Credenciales de Base de Datos
- **Usuario**: admin
- **Contraseña**: password123
- **Autenticación**: admin

### MongoDB URLs
- Auth DB: `mongodb://admin:password123@mongodb-auth:27017/nextflop_auth?authSource=admin`
- Media DB: `mongodb://admin:password123@mongodb-media:27017/nextflop_media?authSource=admin`
- Subscriptions DB: `mongodb://admin:password123@mongodb-subscriptions:27017/nextflop_subscriptions?authSource=admin`
- Billing DB: `mongodb://admin:password123@mongodb-billing:27017/nextflop_billing?authSource=admin`

### RabbitMQ
- **URL**: amqp://admin:password123@rabbitmq:5672
- **Admin Panel**: http://localhost:15672 (admin:password123)

## 🔐 Variables de Entorno

Todos los archivos `.env` ya están creados con valores por defecto:
- `src/frontend/.env.local`
- `src/microservices/auth-service/.env`
- `src/microservices/media-service/.env`
- `src/microservices/subscriptions-service/.env`
- `src/microservices/billing-service/.env`

⚠️ **En producción**: Cambiar JWT_SECRET y credenciales de BD

## 📝 Cambios Implementados en Esta Integración

### Frontend
✅ Creados 5 servicios HTTP reutilizables  
✅ Actualizada página `home` para consumir backend  
✅ Actualizada página `profiles` para datos reales  
✅ Actualizada página `movies` para datos reales  
✅ Actualizado `MovieModal` para tipos reales  
✅ Configurado `.env.local` correctamente  

### Backend
✅ Kong configurado con todas las rutas  
✅ DTOs correctos en todos los servicios  
✅ Variables de entorno configuradas  
✅ docker-compose.yml completo y funcional  

## 🎯 Próximos Pasos

1. **Ejecutar**: `docker compose up --build -d`
2. **Verificar**: Acceder a http://localhost:3000
3. **Completar**: Actualizar resto de páginas siguiendo el patrón
4. **Seed Data**: Cargar datos reales de películas
5. **Pruebas**: Testing en todas las páginas

## 📖 Documentación Adicional

- `INTEGRATION_GUIDE.md` - Guía detallada de integración
- `CHECKLIST.md` - Checklist de tareas completadas y pendientes
- Código comentado en los servicios

## 🆘 Troubleshooting

### Frontend no conecta a Kong
```bash
# Verificar NEXT_PUBLIC_API_URL en .env.local
# Debe ser: http://localhost:8000

# Verificar que Kong esté activo
curl http://localhost:8000
```

### Kong no redirige a microservicios
```bash
# Verificar logs de Kong
docker compose logs kong

# Verificar kong.yml está correctamente montado
docker compose exec kong cat /usr/local/kong/declarative/kong.yml
```

### MongoDB no conecta
```bash
# Verificar credenciales en .env
# Usuario: admin, Contraseña: password123

# Verificar que MongoDB esté corriendo
docker compose ps | grep mongodb
```

### RabbitMQ issues
```bash
# Verificar RabbitMQ está corriendo
docker compose ps | grep rabbitmq

# Acceder a admin panel
# http://localhost:15672
# admin:password123
```

## 👥 Autores

Integración Frontend-Backend: **30 de Noviembre de 2025**

## 📄 Licencia

MIT

---

**🎉 ¡Listo para comenzar!**

```bash
cd /workspaces/NextFlop && docker compose up --build -d
```

Visitahttp://localhost:3000 después de 1-2 minutos ⏰
