# ⚡ INICIO RÁPIDO - AULA INDUSTRIAL V3

## 🎯 TU ZIP INCLUYE:

✅ **600 ejercicios** ya listos  
✅ **Tu Firebase** ya configurado (`aula-industrial-50346`)  
✅ **Login con Google** funcional y visible  
✅ **Newsletter** completo (suscribir/desuscribir)  
✅ **Compartir en redes** (LinkedIn, Facebook, Twitter, WhatsApp)  
✅ **Responsive móvil** perfecto  

---

## 🚀 SOLO 3 PASOS (10 minutos)

### 1️⃣ FIREBASE AUTHENTICATION (2 min)

👉 https://console.firebase.google.com/project/aula-industrial-50346/authentication

1. Click "Comenzar"
2. Activa **Google** ✅
3. Activa **Email/Contraseña** ✅
4. Guardar

### 2️⃣ FIRESTORE DATABASE (3 min)

👉 https://console.firebase.google.com/project/aula-industrial-50346/firestore

1. "Crear base de datos"
2. Modo: **Producción**
3. Ubicación: Europa (o cercana)
4. **Copiar reglas de seguridad** (están en README.md)
5. Publicar

### 3️⃣ DESPLEGAR (5 min)

**Opción A - GitHub Pages (recomendado):**
```bash
git init
git add .
git commit -m "Aula Industrial v3"
git push
# Activar Pages en Settings
```

**Opción B - Probar local:**
```bash
python -m http.server 8000
# Abre: http://localhost:8000/index.html
```

---

## ✅ ¡LISTO! YA FUNCIONA

### Prueba:

1. **Login con Google:**
   - Click "INICIAR SESIÓN"
   - "Continuar con Google"
   - ¡Funciona! ✅

2. **Registro con Email:**
   - Pestaña "REGISTRARSE"
   - Email + Contraseña + Nombre
   - ✅ Checkbox newsletter
   - Crear cuenta

3. **Resuelve ejercicios:**
   - Filtra por área, nivel o estado
   - Click en un ejercicio
   - Elige respuesta
   - ¡Se guarda automáticamente!

4. **Compartir progreso:**
   - Ve a tu perfil
   - Sección "Compartir mi progreso"
   - Click en LinkedIn/Facebook/Twitter

---

## 📧 ENVIAR NEWSLETTER

1. Abre consola del navegador (F12)
2. Ejecuta:

```javascript
// Ver suscritos
const emails = await window.firebaseAuthService.getNewsletterEmails();
console.table(emails);

// Copiar emails
const lista = emails.map(e => e.email).join('\n');
navigator.clipboard.writeText(lista);
// ✅ Copiado! Pega en MailChimp
```

---

## 📱 FUNCIONA EN MÓVIL

- ✅ Modal con scroll
- ✅ Texto ancho (no líneas cortas)
- ✅ Botones grandes
- ✅ Todo se ve perfecto

---

## 🔧 PERSONALIZAR

**Redes sociales** → `index.html` líneas 113-143  
**Email contacto** → `index.html` línea 147  
**Nada más!** El resto ya está configurado.

---

## 🐛 SI ALGO NO FUNCIONA

### "Popup bloqueado"
→ Permite popups en tu navegador

### "Missing permissions"
→ Verifica que publicaste las reglas de Firestore

### "No se cargan ejercicios"
→ Usa servidor web (http://localhost, no file://)

### Otros errores
→ Abre consola (F12) y mira el error
→ 99% es Firebase no activado

---

## 📦 ARCHIVOS IMPORTANTES

```
aula-industrial-final/
├── README.md          ← Guía completa
├── index.html           ← Página principal
├── js/
│   ├── firebase-config.js    ← TU Firebase ✅
│   ├── social-share.js       ← Compartir ✅
│   └── (otros archivos ya configurados)
└── data/              ← 600 ejercicios ✅
```

---

## ✨ LO QUE YA ESTÁ HECHO

✅ Firebase configurado con tu proyecto  
✅ 600 ejercicios generados  
✅ Login social integrado  
✅ Newsletter completo  
✅ Compartir en redes  
✅ Responsive móvil  
✅ CSS mejorado  
✅ Validaciones correctas  

**Solo falta:**
1. Activar Firebase (5 min)
2. Desplegar (5 min)
3. ¡Usar! 🎉

---

## 🎯 PRÓXIMO PASO

1. **Extrae el ZIP**
2. **Lee el README.md completo** (5 min)
3. **Sigue los 3 pasos de arriba** (10 min)
4. **¡Disfruta!** 🚀

---

**TODO ESTÁ LISTO. SOLO ACTIVA FIREBASE Y DESPLIEGA.**

Tu plataforma profesional de formación industrial en 10 minutos ⏱️
