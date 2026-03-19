# 🔐 Seguridad en Lex Corporativa

Este documento explica las medidas de seguridad implementadas en el proyecto para proteger credenciales, datos y rutas administrativas.

---

## 📋 Tabla de contenidos

1. [Credenciales de Supabase](#credenciales-de-supabase)
2. [Row Level Security (RLS)](#row-level-security-rls)
3. [Autenticación y Rutas Protegidas](#autenticación-y-rutas-protegidas)
4. [Sesiones y JWT](#sesiones-y-jwt)
5. [Checklist de Seguridad](#checklist-de-seguridad)
6. [Mejoras Futuras](#mejoras-futuras)

---

## 🔑 Credenciales de Supabase

### ¿Qué se implementó?

Las credenciales de Supabase **NO se guardan en el código** sino en un archivo de entorno protegido:

```
✅ .env.local        → Credenciales reales (NUNCA se sube a GitHub)
✅ .env.example      → Template con placeholders (SÍ se sube, para referencia)
❌ supabaseClient.js → Código limpio (lee variables de entorno)
```

### ¿Cómo funciona?

El archivo `supabaseClient.js` lee las credenciales desde variables de entorno, **NO desde código hardcodeado**:

```javascript
// Lee desde .env (seguro)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

En `.env.local` (ejemplo - reemplazar con datos reales):
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxx
```

### Setup para nuevos desarrolladores

```bash
cp .env.example .env.local
# Editar .env.local con credenciales de tu proyecto
# Nunca hacer git add .env.local
```

### ⚠️ Importante

- `.env.local` está en `.gitignore` - nunca se versiona
- Las credenciales **nunca** deben estar en código fuente
- Si se exponen accidentalmente, rotarlas en Supabase Dashboard inmediatamente

---

## 🛡️ Row Level Security (RLS)

### ¿Qué es?

Row Level Security (RLS) es una política de **Supabase** que controla quién puede ver/editar/borrar datos a nivel de base de datos.

### Tablas Protegidas

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `lex_noticias` | Público | Solo autenticados | Solo autenticados | Solo autenticados |
| `lex_articulos` | Público | Solo autenticados | Solo autenticados | Solo autenticados |
| `lex_categorias` | Público | Solo autenticados | — | — |
| `lex_contactos` | — | — | — | — |

### Cómo verificar RLS

**En Supabase Dashboard:**

1. Ve a: **Authentication → Policies**
2. Busca cada tabla
3. Verifica que tenga políticas creadas

**Políticas aplicadas:**

```sql
-- Lectura: Público y autenticados
SELECT → anon, authenticated

-- Escritura: Solo autenticados
INSERT, UPDATE, DELETE → authenticated
```

### ¿Qué significa "authenticated"?

Significa cualquier usuario que haya iniciado sesión en Supabase Auth.

```javascript
// En tu app:
await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'contraseña'
});
// → Ahora el usuario es "authenticated"
```

---

## 🔓 Autenticación y Rutas Protegidas

### ¿Qué se implementó?

Se creó un componente `ProtectedRoute` (`src/components/ProtectedRoute.jsx`) que valida si el usuario tiene una sesión activa antes de permitir acceso.

### Rutas Protegidas

```
GET /                  → Acceso público ✅
GET /login             → Acceso público ✅
GET /noticias          → Acceso público ✅
GET /archivo           → Acceso público ✅
GET /contacto          → Acceso público ✅

GET /panel-admin       → PROTEGIDA 🔒
GET /admin-upload      → PROTEGIDA 🔒
```

### ¿Cómo funciona?

1. **Sin sesión:** Usuario intenta acceder a `/panel-admin` → Se redirige a `/login`
2. **Con sesión valida:** Usuario accede a `/panel-admin` → Se permite el acceso
3. **Sesión expirada:** Si el JWT expira, el usuario es redirigido a `/login`
4. **Logout:** Al cerrar sesión, se elimina el JWT y se redirige a `/login`

### Implementación

Las rutas protegidas se implementan en `main.jsx`:

```javascript
<Route path="/panel-admin" element={<ProtectedRoute><AdminUpload /></ProtectedRoute>} />
<Route path="/admin-upload" element={<ProtectedRoute><AdminUpload /></ProtectedRoute>} />
```

`ProtectedRoute` verifica la sesión en cada renderización y escucha cambios de autenticación en tiempo real.

---

## 🎫 Sesiones y JWT

### ¿Qué es un JWT?

JWT (JSON Web Token) es un **token seguro** que contiene información del usuario:
- Email
- ID único
- Fecha de expiración
- Firma digital (imposible falsificar)

### Dónde se guarda

Se guarda automáticamente en `localStorage` del navegador cuando inicias sesión.

### Validación

Supabase **automáticamente** valida el JWT:
- Verifica que no esté expirado
- Verifica la firma digital
- Rechaza tokens falsificados

### Sincronización entre pestañas

Si tienes múltiples pestañas abiertas:

```
Pestaña 1: Login ejecutado
  → JWT se guarda en localStorage (compartido entre pestañas)
  → Pestaña 2 y 3 detectan automáticamente ✅

Pestaña 1: Logout ejecutado  
  → JWT se elimina de localStorage
  → Pestaña 2 y 3 se redirigen automáticamente a /login ✅
```

Esto es un comportamiento **seguro y esperado**.

---

## ✅ Checklist de Seguridad

- [x] Credenciales en `.env.local` (no en código)
- [x] `.gitignore` evita que se suban credenciales
- [x] Supabase RLS activado en tablas sensibles
- [x] Rutas `/panel-admin` protegidas con ProtectedRoute
- [x] Sesiones sincronizadas entre pestañas
- [x] Logout funciona correctamente
- [x] JWT se valida automáticamente

**Antes de producción:**
- [ ] Cambiar contraseña del admin
- [ ] Verificar RLS policies en Supabase
- [ ] Habilitar HTTPS en el dominio
- [ ] Configurar variables en el servidor de hosting
- [ ] Hacer backup de base de datos

---

## 🚀 Mejoras Futuras

### 1. Sistema de Roles (Prioridad: Media)

Actualmente cualquier usuario autenticado puede editar. En el futuro:

```sql
-- Crear tabla de roles
CREATE TABLE lex_usuarios (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  rol TEXT ('admin' | 'editor' | 'viewer'),
  created_at TIMESTAMP
);

-- Policy mejorada
UPDATE lex_noticias
ENABLE IF (
  SELECT rol FROM lex_usuarios 
  WHERE email = auth.jwt()->>'email'
) = 'admin'
```

### 2. Rate Limiting (Prioridad: Media)

Limitar intentos de login fallidos:

```javascript
// Máximo 5 intentos en 15 minutos
// Si falla 5 veces, bloquear email por 15 min
```

### 3. Logs de Auditoría (Prioridad: Baja)

Registrar quién editó qué y cuándo:

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  tabla TEXT,
  accion TEXT ('INSERT' | 'UPDATE' | 'DELETE'),
  usuario_email TEXT,
  timestamp TIMESTAMP
);
```

### 4. Two-Factor Authentication (Prioridad: Baja)

Agregar 2FA (SMS, Authenticator app) para admin.

---

## 📞 Soporte

Si encuentras un problema de seguridad:

1. **NO lo publiques públicamente**
2. Contacta a: `contacto@lexcorporativa.com`
3. Describe el problema con detalle
4. Espera respuesta en 24-48 horas

---

## 📚 Referencias

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [JWT.io - Entender JWTs](https://jwt.io/)
- [OWASP Security Best Practices](https://owasp.org/www-project-cheat-sheets/)

---

**Última actualización:** 19 de Marzo de 2026
**Versión:** 1.0
