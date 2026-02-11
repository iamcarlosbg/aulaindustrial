# 🔥 AULA INDUSTRIAL - VERSIÓN FIREBASE
## ¡Lista para usar con tu configuración!

## ✅ YA ESTÁ TODO CONFIGURADO

Tu proyecto Firebase ya está integrado:
- ✅ API Key configurada
- ✅ Auth Domain configurado
- ✅ Project ID configurado
- ✅ Archivos listos para copiar

---

## 🚀 INSTALACIÓN RÁPIDA (3 PASOS)

### PASO 1: Activar Authentication en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/project/aula-industrial-50346)
2. Click en **"Authentication"** en el menú lateral
3. Click en **"Comenzar"**
4. Pestaña **"Sign-in method"**

**Activa estos métodos:**

**✅ Google:**
1. Click en "Google"
2. Activar el switch
3. Email de soporte del proyecto: tu email
4. Guardar

**✅ Correo electrónico/contraseña:**
1. Click en "Correo electrónico/contraseña"
2. Activar el primer switch (Email/Password)
3. Guardar

**⭐ Facebook (Opcional):**
1. Necesitas crear una app en [Facebook Developers](https://developers.facebook.com)
2. Sigue la guía en `CONFIGURACION_LOGIN_SOCIAL.md` si quieres activarlo

### PASO 2: Crear base de datos Firestore

1. En Firebase Console → **"Firestore Database"**
2. Click **"Crear base de datos"**
3. Modo: **"Producción"**
4. Ubicación: Elige la más cercana (ejemplo: `europe-west3`)
5. Click **"Habilitar"**

**Configura las reglas de seguridad:**

1. Click en la pestaña **"Reglas"**
2. Pega este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Progreso del usuario
    match /user_progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Intentos de ejercicios
    match /exercise_attempts/{attemptId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Leaderboard público (todos pueden leer)
    match /users/{userId} {
      allow read: if true;
    }
  }
}
```

3. Click **"Publicar"**

### PASO 3: Subir a GitHub Pages (o servidor web)

**Opción A - GitHub Pages:**

1. Crea un repositorio en GitHub
2. Sube todos los archivos de esta carpeta:
   ```
   git init
   git add .
   git commit -m "Aula Industrial con Firebase"
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
3. Ve a Settings → Pages
4. Source: "Deploy from a branch"
5. Branch: "main" / Folder: "/ (root)"
6. Save

Tu sitio estará en: `https://TU-USUARIO.github.io/TU-REPO`

**Opción B - Servidor local para probar:**

```bash
# Con Python
python -m http.server 8000

# Abre en navegador
http://localhost:8000
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
aula-industrial/
├── app.html                    ← Página principal
├── css/
│   └── style.css              ← Estilos
├── js/
│   ├── firebase-config.js     ← TU configuración Firebase ✅
│   ├── firebase-auth.js       ← Servicio de autenticación
│   ├── app-firebase.js        ← Aplicación principal
│   └── loader.js              ← Cargador de ejercicios
├── data/
│   ├── electricidad_basica.json
│   ├── maniobra_potencia.json
│   ├── plc_siemens.json
│   └── diagnostico_industrial.json
└── PARCHE_LOGIN_MODAL.js      ← Código de botones sociales
```

---

## ⚙️ PERSONALIZACIÓN

### Cambiar URLs de Redes Sociales

Edita `app.html` (líneas ~113-143):

```html
<a href="https://facebook.com/TUPAGINA" ...>      ← Tu Facebook
<a href="https://instagram.com/TUPAGINA" ...>     ← Tu Instagram
<a href="https://youtube.com/@TUCANAL" ...>       ← Tu YouTube
<a href="https://twitter.com/TUPAGINA" ...>       ← Tu Twitter
<a href="https://linkedin.com/company/TU..." ...> ← Tu LinkedIn
```

### Cambiar Email de Contacto

Edita `app.html` (línea ~147):

```html
<a href="mailto:info@aulaindustrial.com">TU-EMAIL@example.com</a>
```

---

## 🔧 FUNCIONALIDADES

### ✅ YA FUNCIONAN:

1. **Login con Google** - 1 click
2. **Login con Email/Contraseña** - Registro y login
3. **Progreso guardado en nube** - Firebase Firestore
4. **Ranking global** - Top usuarios
5. **Estadísticas por área** - Comparativa con promedio
6. **Ejercicios fallados** - Lista para repasar
7. **Footer con redes sociales** - 5 redes integradas
8. **Responsive** - Funciona en móvil/tablet/desktop

### ⭐ Para activar Facebook Login:

Si quieres añadir login con Facebook, necesitas:

1. Crear app en [Facebook Developers](https://developers.facebook.com)
2. Copiar App ID y App Secret
3. Añadirlos en Firebase Authentication
4. Copiar la URI de redirección OAuth de Firebase
5. Pegarla en la configuración de Facebook Login

**Guía completa:** Ver `CONFIGURACION_LOGIN_SOCIAL.md`

---

## 🎯 USO DE LA PLATAFORMA

### Como Usuario:

1. **Abre la web** (tu GitHub Pages o localhost)
2. **Click en "INICIAR SESIÓN"**
3. **Elige tu método:**
   - Continuar con Google (1 click)
   - Continuar con Facebook (1 click, si activado)
   - Email y contraseña (registro/login)
4. **Resuelve ejercicios** - Todo se guarda automáticamente
5. **Ve tu perfil** - Estadísticas y ranking

### Filtros Disponibles:

**Por Área:**
- Todos los ejercicios
- Electricidad Básica
- Maniobra y Potencia
- PLC Siemens
- Diagnóstico Industrial

**Por Nivel:**
- Todos
- Básico
- Intermedio
- Avanzado

**Por Estado:** (NUEVO)
- Todos
- No hechos
- Fallados (para repasar)
- Completados

---

## 🐛 PROBLEMAS COMUNES

### "Popup bloqueado" al hacer login con Google/Facebook

**Solución:** Permite popups en tu navegador para este sitio.

### "Missing or insufficient permissions" en Firestore

**Solución:** Revisa que publicaste las reglas de seguridad (Paso 2).

### No se cargan los ejercicios

**Solución:** 
1. Verifica que los archivos JSON estén en la carpeta `data/`
2. Abre la consola del navegador (F12) y busca errores
3. Comprueba que estás usando un servidor web (no file://)

### "Unauthorized domain" en Firebase

**Solución:**
1. Firebase Console → Authentication → Settings
2. "Dominios autorizados" → Agregar dominio
3. Añade: `tu-usuario.github.io` o `localhost`

---

## 📊 DATOS Y PRIVACIDAD

- ✅ **Tus datos están en Firebase** (Google Cloud)
- ✅ **Solo tú puedes ver tu progreso** (reglas de seguridad)
- ✅ **El ranking es anónimo** (solo muestra nombres públicos)
- ✅ **Sin publicidad ni tracking**
- ✅ **Gratis hasta 50,000 usuarios/mes**

---

## 💡 PRÓXIMOS PASOS

1. ✅ **Activa Authentication** (Google + Email) - 2 minutos
2. ✅ **Crea Firestore Database** - 3 minutos
3. ✅ **Sube a GitHub Pages** - 5 minutos
4. ⭐ **Personaliza URLs redes sociales** - 2 minutos
5. ⭐ **Activa Facebook Login** (opcional) - 15 minutos

---

## 📞 SOPORTE

### ¿Necesitas ayuda?

- **Firebase Console:** https://console.firebase.google.com
- **Documentación Firebase:** https://firebase.google.com/docs
- **GitHub Pages:** https://pages.github.com

### Archivos de ayuda incluidos:

- `CONFIGURACION_LOGIN_SOCIAL.md` - Guía completa Firebase
- `PARCHE_LOGIN_MODAL.js` - Código de botones sociales
- Este archivo (README.md)

---

## ✨ ¡LISTO PARA USAR!

**Tu Aula Industrial ya está configurada con:**
- 🔥 Firebase Authentication (Google + Email)
- 💾 Firestore Database
- 📊 Sistema de progreso y ranking
- 🌐 Footer con redes sociales
- 🎯 20 ejercicios industriales reales

**Solo faltan 10 minutos para tenerlo en producción** 🚀

---

**Versión:** Firebase Ready 1.0  
**Última actualización:** Febrero 2024  
**Estado:** ✅ Listo para desplegar
