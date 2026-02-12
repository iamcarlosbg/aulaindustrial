# 📁 Estructura del Proyecto v4

```
v4_aulaindustrial/
│
├── 📄 index.html              # Página de login/registro (PÁGINA PRINCIPAL)
├── 📄 app.html               # Aplicación de ejercicios (requiere login)
│
├── 📁 css/
│   └── 📄 styles.css         # Estilos generales
│
├── 📁 js/
│   ├── 📄 auth.js            # Sistema de autenticación
│   ├── 📄 app.js             # Lógica de la aplicación
│   └── 📄 config.js          # Configuración personalizable
│
├── 📁 data/
│   └── 📄 ejercicios.json    # Base de datos de ejercicios
│
├── 📄 README.md              # Documentación completa
├── 📄 DIAGNOSTICO.md         # Explicación de problemas y soluciones
├── 📄 INICIO_RAPIDO.md       # Guía de inicio rápido
└── 📄 .gitignore             # Archivos a ignorar en Git
```

## 🎯 Archivos Principales

### 1. `index.html` - Punto de Entrada
- Primera página que ve el usuario
- Sistema de login/registro con tabs
- Validación de formularios
- Redirección automática si ya hay sesión

### 2. `app.html` - Aplicación Principal
- Requiere autenticación
- Muestra ejercicios con filtros
- Navegación por tabs (Ejercicios, Progreso, Comparativa, Newsletter)
- Tarjetas de ejercicios con información

### 3. `js/auth.js` - Autenticación
- Funciones de registro y login
- Gestión de sesiones con localStorage
- Seguimiento de progreso por usuario
- Usuario demo precargado

### 4. `js/app.js` - Lógica Principal
- Carga de ejercicios desde JSON
- Sistema de filtros
- Gestión de estadísticas
- Navegación entre tabs

### 5. `data/ejercicios.json` - Base de Datos
- Contiene todos los ejercicios
- Formato JSON estructurado
- Fácil de editar y expandir

## 🚀 Cómo Usar

### Para desarrollo local:
1. Extrae el ZIP
2. Abre una terminal en la carpeta
3. Ejecuta: `python -m http.server 8000`
4. Abre: `http://localhost:8000`

### Para GitHub Pages:
1. Extrae el ZIP
2. Sube TODO el contenido a tu repositorio (sin carpetas adicionales)
3. Activa GitHub Pages en Settings → Pages
4. Espera 2-3 minutos
5. Visita: `https://tu-usuario.github.io/tu-repo/`

## ⚙️ Flujo de la Aplicación

```
Usuario visita sitio
        ↓
   index.html (Login)
        ↓
   ¿Tiene sesión?
    ↙          ↘
  Sí           No
   ↓            ↓
app.html    Mostrar login
   ↓            ↓
Cargar      Validar credenciales
ejercicios       ↓
   ↓         Crear sesión
Mostrar         ↓
filtros     Redirigir a app.html
   ↓
Sistema de tabs
   ↓
Ejercicios / Progreso / Newsletter
```

## 🔧 Puntos Importantes

### Rutas de Archivos
✅ **CORRECTO:**
```javascript
fetch('data/ejercicios.json')      // Ruta relativa
```

❌ **INCORRECTO:**
```javascript
fetch('/data/ejercicios.json')     // Ruta absoluta (no funciona en subcarpetas)
```

### Estructura en GitHub
✅ **CORRECTO:**
```
tu-repo/
├── index.html
├── app.html
├── css/
├── js/
└── data/
```

❌ **INCORRECTO:**
```
tu-repo/
└── v4/
    ├── index.html
    └── ...
```

### localStorage Keys
- `aulaindustrial_users` → Array de usuarios registrados
- `aulaindustrial_current_user` → Usuario con sesión activa
- `newsletter_subscriptions` → Suscripciones al newsletter

## 📝 Personalización Rápida

### Cambiar nombre de la app:
- Busca "Aula Industrial" en `index.html` y `app.html`
- Reemplaza por tu nombre

### Cambiar colores:
- Edita `js/config.js` → sección `theme`
- O busca "667eea" y "764ba2" en los archivos

### Agregar ejercicios:
- Edita `data/ejercicios.json`
- Copia la estructura de un ejercicio existente
- Cambia el ID y el contenido

## 🎓 Próximos Pasos

1. **Prueba local** - Asegúrate de que funciona
2. **Personaliza** - Cambia colores, nombre, ejercicios
3. **Sube a GitHub** - Deploy con GitHub Pages
4. **Comparte** - Da la URL a tus usuarios

## 📚 Documentación

- **Inicio Rápido:** `INICIO_RAPIDO.md`
- **Documentación Completa:** `README.md`
- **Solución de Problemas:** `DIAGNOSTICO.md`

## ✅ Checklist de Despliegue

- [ ] Extraer ZIP
- [ ] Probar localmente
- [ ] Personalizar contenido
- [ ] Crear repositorio en GitHub
- [ ] Subir archivos (en la raíz)
- [ ] Activar GitHub Pages
- [ ] Esperar 2-3 minutos
- [ ] Probar con usuario demo
- [ ] Verificar carga de ejercicios
- [ ] Probar filtros
- [ ] Confirmar que todo funciona

---

**Versión:** 4.0.0 - Completamente funcional
**Fecha:** Febrero 2026
**Estado:** ✅ Listo para producción
