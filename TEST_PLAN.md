# 🧪 Plan de Pruebas - Página Favoritos

## Preparación

### 1. Backend - Verificar que Kong está ok

```bash
# Probar que Kong responde
curl -v http://localhost:8000/

# Debe devolver algo como: "Could not find requested route"
# Esto significa que Kong está vivo
```

### 2. Backend - Verificar que Auth Service está vivo

```bash
# Probar endpoint de health (sin auth)
curl -v http://localhost:8000/api/auth/health 2>/dev/null | jq .

# O probar login (debería fallar con credenciales inválidas)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  2>/dev/null | jq .
```

### 3. Backend - Verificar rutas de Perfiles

```bash
# Obtener un perfil (necesita JWT válido)
# Primero login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' | jq -r .token)

# Luego obtener perfil
curl -v http://localhost:8000/api/profiles/123 \
  -H "Authorization: Bearer $TOKEN" 2>/dev/null | jq .

# Debe devolver:
# - 200 OK con perfil
# - O 401 Unauthorized si token es inválido
# - O 404 Not Found si perfil no existe
```

### 4. Backend - Verificar que Media Service devuelve películas

```bash
# Obtener películas (sin auth)
curl http://localhost:8000/api/media?limit=5 2>/dev/null | jq '.items[0]'

# Debe devolver estructura:
# {
#   "id": "...",
#   "title": "...",
#   "posterUrl": "...",
#   "rating": 4.5,
#   ...
# }
```

### 5. Backend - Verificar ruteo de favoritos

```bash
# Agregar a favoritos (POST)
curl -X POST http://localhost:8000/api/profiles/PROFILE_ID/list/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mediaId":"MEDIA_ID"}' 2>/dev/null | jq .

# Debe devolver el perfil actualizado con el ID en el array favorites

# Eliminar de favoritos (DELETE)
curl -X DELETE http://localhost:8000/api/profiles/PROFILE_ID/list/favorites/MEDIA_ID \
  -H "Authorization: Bearer $TOKEN" 2>/dev/null | jq .

# Debe devolver el perfil sin ese ID en favoritos
```

## Pruebas del Frontend

### 1. Cargar página sin estar logueado
```
- Navegar a: http://localhost:3000/favorites
- Esperado: Mensaje "No profile selected" en console
- La página mostrará lista vacía (porque localStorage está vacío)
```

### 2. Simular un perfil en localStorage
```javascript
// En console del navegador:
localStorage.setItem('currentProfileId', 'PROFILE_ID_DEL_USUARIO')
location.reload()
```

### 3. Verificar que se cargan favoritos
```
- Si el usuario tiene favoritos en BD: deben aparecer
- Si no tiene: mensaje "No tienes favoritos"
- Check en Network tab: debe ver requests a:
  - GET /api/profiles/{id}
  - GET /api/media/{id} (un request por cada favorito)
```

### 4. Eliminar un favorito
```
- Pasar mouse sobre una película
- Click en corazón
- Confirmar en diálogo
- Esperado: 
  - Request DELETE a /api/profiles/{id}/list/favorites/{mediaId}
  - Película se elimina de la pantalla
  - Popup "Eliminado de Favoritos"
```

## Checklist de Verificación

- [ ] No hay mock data en el código (solo `mockFavorites` fue eliminado)
- [ ] El archivo compila sin errores TypeScript
- [ ] Los servicios usan rutas correctas del backend
- [ ] Backend devuelve estructura correcta (Media con id, title, posterUrl, etc)
- [ ] Frontend carga favoritos reales del backend
- [ ] Eliminar favorito funciona
- [ ] La UI se actualiza correctamente
- [ ] No hay errores en console

## Problemas Esperados y Soluciones

### Error: "No profile selected"
**Causa**: localStorage no tiene currentProfileId
**Solución**: Verificar que el usuario está logueado y navigate a /profiles primero

### Error: 401 Unauthorized
**Causa**: Token expirado o inválido
**Solución**: Login nuevamente

### Error: 404 Not Found en /api/profiles/:id
**Causa**: Profile ID no existe
**Solución**: Crear perfil desde /profiles page

### Error: Get detail returns null
**Causa**: Media ID no existe en BD
**Solución**: Cargar seed data de películas

### Las películas no tienen posterUrl
**Causa**: Campo está vacío en BD
**Solución**: Actualizar películas con imágenes válidas

## URLs para Pruebas Manuales

```
Frontend: http://localhost:3000
Kong Admin: http://localhost:8001
Media: http://localhost:8000/api/media?limit=5
Profiles: http://localhost:8000/api/profiles (requiere JWT)
```

## Resultado Esperado Final

✅ Página favorites.page.tsx sin mock data
✅ Carga datos reales del backend
✅ Muestra películas en grid
✅ Eliminar funcioná
✅ UI responsiva y atractiva
